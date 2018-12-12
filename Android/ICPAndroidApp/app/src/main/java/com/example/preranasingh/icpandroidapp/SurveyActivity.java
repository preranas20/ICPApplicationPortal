package com.example.preranasingh.icpandroidapp;

import android.app.FragmentManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class SurveyActivity extends AppCompatActivity implements QuestionFragment.OnFragmentInteractionListener {

    private String remoteIP="http://52.202.147.130:5000";
    private String teamId;
    private ArrayList<Survey> surveyList;

    int idx=0;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey);


        if(getIntent().getExtras()!= null) {

            String className = getIntent().getStringExtra("Class");
            if(className.equals("SurveyResponseApi") || className.equals("TeamResponseActivity")){
                Team team = (Team) getIntent().getSerializableExtra("TEAM_KEY");
                Log.d("survey", "onCreate: " + team.getName() + " " + team.getId());
                teamId = team.getId();
                Log.d("survey", "onCreate: " + teamId);
            }
            if(className.equals("TeamScanActivity")){
                teamId=getIntent().getExtras().getString("TEAMID");
            }
        }


            //create new survey
            getQuestionsApi();

            getFragmentManager().beginTransaction()
                    .add(R.id.container,new QuestionFragment(),"tag_questionFragment")
                    .commit();



    }



    private void getQuestionsApi() {
        final OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(remoteIP + "/user/getAllQuestions")
                .header("Authorization", "Bearer "+getToken())
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
                           // Toast.makeText(SurveyActivity.this, result.message, Toast.LENGTH_SHORT).show();
                            surveyList= new ArrayList<Survey>();
                            //  Log.d("home", "run: "+result.data);
                            JsonArray jsonArray = result.data;

                            for (int i = 0; i < jsonArray.size(); i++) {
                                JsonObject questionsElement = jsonArray.get(i).getAsJsonObject();
                                Survey survey = new Survey();
                                survey.setSurveyId(questionsElement.get("surveyId").getAsInt());
                                survey.setQuestionId(questionsElement.get("qId").getAsString());
                                survey.setOrderId(questionsElement.get("orderId").getAsInt());
                                survey.setQuestionText(questionsElement.get("qText").getAsString());
                                survey.setTeamId(teamId);
                                surveyList.add(survey);

                                Log.d("survey", "run: " + survey);

                            }

                            QuestionFragment fStart = (QuestionFragment) getFragmentManager().findFragmentByTag("tag_questionFragment");
                            fStart.initalizeQuestion(surveyList.get(idx));


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
        if(idx<surveyList.size()-2) {

            Log.d("survey", "saveAnswer: " + idx);
            surveyList.get(idx).answer = result;
            Log.d("survey", "object: " + surveyList.get(idx).toString());
            idx++;
            QuestionFragment fragment1 = (QuestionFragment) getFragmentManager().findFragmentByTag("tag_questionFragment");
            fragment1.initalizeQuestion(surveyList.get(idx));
        }
        else if(idx==surveyList.size()-2){
            Log.d("survey", "saveAnswer: " + idx);
            surveyList.get(idx).answer = result;
            Log.d("survey", "object: " + surveyList.get(idx).toString());
            idx++;
            QuestionFragment fragment2 = (QuestionFragment) getFragmentManager().findFragmentByTag("tag_questionFragment");

            fragment2.initalizeQuestion(surveyList.get(idx));
            fragment2.changeButton();
        }
        else if(idx==surveyList.size()-1){
            Log.d("survey", "saveAnswer: " + idx);
            surveyList.get(idx).answer = result;
            Log.d("survey", "object: " + surveyList.get(idx).toString());
            //intent
        }

    }

    @Override
    public void saveSurvey() {

        JSONArray jsonData=new JSONArray();

        for(int i=0;i<surveyList.size();i++)
        {

            JSONObject jsonObject= new JSONObject();
            try {
                jsonObject.put("teamId", teamId);
                jsonObject.put("qId",surveyList.get(i).questionId);
                jsonObject.put("text",surveyList.get(i).questionText);
                jsonObject.put("surveyId",surveyList.get(i).surveyId);
                jsonObject.put("answer",surveyList.get(i).answer);
                jsonData.put(jsonObject);
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }

        String token = getToken();
        Log.d("data", "saveSurvey: "+token);

        final OkHttpClient client = new OkHttpClient();

        Log.d("data", "saveSurvey: "+jsonData);
        String key="data";
        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        RequestBody formBody = RequestBody.create(JSON, "{\"data\":"+jsonData+"}");

        Log.d("data", "saveSurvey: "+formBody.toString());


      final Request request = new Request.Builder()
                .url(remoteIP+"/user/saveSurvey")
                .header("Content-Type","application/json")
                .header("Authorization", "Bearer "+token)
                .post(formBody)
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
                      Log.d("data", "onResponse: "+str);


                    Gson gson = new Gson();
                    final ResponseApi result=  (ResponseApi) gson.fromJson(str, ResponseApi.class);
                    SurveyActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if(result.status.equalsIgnoreCase("200")){
                                Toast.makeText(SurveyActivity.this,result.message,Toast.LENGTH_SHORT).show();
                                Log.d("data", "onResponse: before calling clearFragments");
                                clearAllFragments();

                            }
                            else{
                                Toast.makeText(SurveyActivity.this,result.message,Toast.LENGTH_SHORT).show();
                            }
                        }
                    });

                    }


                }

            });
        }



    public  String getToken(){

        String ret;
        SharedPreferences sharedPref =this.getSharedPreferences(
                "mypref", Context.MODE_PRIVATE);

        ret = sharedPref.getString("token","");

        return ret;
    }

    public void clearAllFragments() {

        try {

            this.getSupportFragmentManager().popBackStack(null, FragmentManager.POP_BACK_STACK_INCLUSIVE);
            Log.d("data", "clearAllFragments: after calling clearFragments ");
            surveyList = null;

            Intent intent = new Intent(SurveyActivity.this,HomeActivity.class);
            startActivity(intent);
        } catch (Exception e) {

            e.printStackTrace();
        }
    }

}
