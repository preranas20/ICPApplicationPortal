package com.example.preranasingh.icpandroidapp;

import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class SurveyActivity extends AppCompatActivity implements QuestionFragment.OnFragmentInteractionListener {

    private String remoteIP="http://52.202.147.130:5000";
    private String teamId;
    private ArrayList<Survey> surveyList;
    static int idx = 0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey);


        if(getIntent().getExtras()!= null) {
            Team team = (Team) getIntent().getSerializableExtra("TEAM_KEY");
            Log.d("survey", "onCreate: " + team.getName() + " " + team.getId());
            teamId = team.getId();
        }

        if(getIntent().getExtras()!= null){
            teamId=getIntent().getExtras().getString("TEAMID");
        }



        getQuestionsApi();

        getFragmentManager().beginTransaction()
                .add(R.id.container,new QuestionFragment(),"tag_questionFragment")
                .commit();



    }

    private void getQuestionsApi() {
        final OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(remoteIP + "/user/getAllQuestions")
                .build();
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                //  Log.d("home", "onFailure: getTeam");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {

                String str;
                try (final ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {

                        SurveyActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(SurveyActivity.this, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str = responseBody.string();
                    //  Log.d("home", "onResponse: "+str);


                }

                Gson gson = new Gson();
                final TeamResponseApi result = (TeamResponseApi) gson.fromJson(str, TeamResponseApi.class);

                SurveyActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (result.status.equalsIgnoreCase("200")) {
                            Toast.makeText(SurveyActivity.this, result.message, Toast.LENGTH_SHORT).show();
                            surveyList= new ArrayList<Survey>();
                            //  Log.d("home", "run: "+result.data);
                            JsonArray jsonArray = result.data;

                            for (int i = 0; i < jsonArray.size(); i++) {
                                JsonObject questionsElement = jsonArray.get(i).getAsJsonObject();
                                Survey survey = new Survey();
                                survey.setSurveyId(questionsElement.get("surveyId").getAsInt());
                                survey.setQuestionId(String.valueOf(questionsElement.get("qId")));
                                survey.setOrderId(questionsElement.get("orderId").getAsInt());
                                survey.setQuestionText(String.valueOf(questionsElement.get("qText")));
                                survey.setTeamId(teamId);
                                surveyList.add(survey);

                                Log.d("survey", "run: " + survey);

                            }
                            QuestionFragment fStart = (QuestionFragment) getFragmentManager().findFragmentByTag("tag_questionFragment");
                            fStart.initalizeQuestion(surveyList.get(idx),surveyList.size());


                        }
                    }
                });

            }
        });
    }

    @Override
    public void onFragmentInteraction(Uri uri) {

    }

    @Override
    public void saveAnswer(int result) {
        if(idx<surveyList.size()-1) {

            Log.d("survey", "saveAnswer: " + idx);
            surveyList.get(idx).answer = result;
            Log.d("survey", "object: " + surveyList.get(idx).toString());
            idx++;
            QuestionFragment fragment = (QuestionFragment) getFragmentManager().findFragmentByTag("tag_questionFragment");
            fragment.initalizeQuestion(surveyList.get(idx),surveyList.size());
        }
        if(idx==surveyList.size()-1){
            Log.d("survey", "saveAnswer: " + idx);
            surveyList.get(idx).answer = result;
            Log.d("survey", "object: " + surveyList.get(idx).toString());
            //intent
        }

    }

    @Override
    public void saveSurvey() {
        final OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(remoteIP + "/user/getAllQuestions")
                .build();
        Call call = client.newCall(request);
        call.enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                //  Log.d("home", "onFailure: getTeam");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {

                String str;
                try (final ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {

                        SurveyActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(SurveyActivity.this, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str = responseBody.string();
                    //  Log.d("home", "onResponse: "+str);


                }

    }
}
