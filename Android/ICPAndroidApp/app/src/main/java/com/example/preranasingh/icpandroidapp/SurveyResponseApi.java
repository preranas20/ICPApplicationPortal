package com.example.preranasingh.icpandroidapp;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.util.ArrayList;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class SurveyResponseApi {

    static public String remoteIP ="http://52.202.147.130:5000";
    static public Activity activity;
    final String TAG="test";
    //private final Context context;
    private String token;
    ArrayList<Survey> teamResponseList;



    public SurveyResponseApi(String token, Activity context) {
        if (this.token == null)
            this.token = token;

        this.activity = context;
    }


    public void getResultsForTeam(final Team team) {
        Log.d("teamdata", "getResultsForTeam: ");
        final OkHttpClient client = new OkHttpClient();

        RequestBody bodyEvaluatorTeam = new FormBody.Builder()
                .add("teamId",team.id)
                .build();


        Request request = new Request.Builder()
                .url(remoteIP+"/user/getResultForEvalTeam")
                .header("Content-Type","application/json")
                .header("Authorization", "Bearer "+token)
                .post(bodyEvaluatorTeam)
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

                        activity.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                //Toast.makeText(activity, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str = responseBody.string();
                    Log.d("teamdata", "onResponse: "+str);

                }

                Gson gson = new Gson();
                final TeamResponseApi result = (TeamResponseApi) gson.fromJson(str, TeamResponseApi.class);

               activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if (result.status.equalsIgnoreCase("200")) {
                          //  Toast.makeText(activity, result.message, Toast.LENGTH_SHORT).show();
                            teamResponseList = new ArrayList<Survey>();
                            Log.d("teamdata", "run: "+result.data);
                            JsonArray jsonArray = result.data;

                            for (int i = 0; i < jsonArray.size(); i++) {
                                JsonObject questionsElement = jsonArray.get(i).getAsJsonObject();
                                Survey survey = new Survey();
                                survey.setSurveyId(questionsElement.get("surveyId").getAsInt());
                                survey.setQuestionId(questionsElement.get("qId").getAsString());
                                survey.setQuestionText(questionsElement.get("text").getAsString());
                                survey.setAnswer(questionsElement.get("answer").getAsInt());
                                survey.setTeamId(questionsElement.get("teamId").getAsString());
                                teamResponseList.add(survey);

                                Log.d("teamdata", "run: " + survey);

                            }

                            if(teamResponseList.isEmpty()) {
                                Intent intent = new Intent(activity, SurveyActivity.class);
                                intent.putExtra("TEAM_KEY", team);
                                intent.putExtra("Class", "SurveyResponseApi");
                                activity.startActivity(intent);
                            }else{
                                Intent intent1 = new Intent(activity,TeamResponseActivity.class);
                                intent1.putExtra("TEAM_KEY", team);
                                intent1.putExtra("TEAM_RESPONSE",teamResponseList);
                                activity.startActivity(intent1);
                            }

                           //return teamResponseList;


                        }
                    }
                });



            }

        });
       // return teamResponseList;

    }




}
