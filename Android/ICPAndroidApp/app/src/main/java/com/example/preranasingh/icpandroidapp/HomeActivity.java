package com.example.preranasingh.icpandroidapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.Toast;

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

public class HomeActivity extends AppCompatActivity implements View.OnClickListener {

    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    private String token;
    private String remoteIP="http://52.202.147.130:5000";
    private ArrayList<Team> teamList;
    private ImageButton imgQRBtn;
    private ImageButton imgLogout;
    ArrayList<Survey> teamResponseList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        //getSupportActionBar().hide();
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        toolbar.setTitle("");
        setSupportActionBar(toolbar);

        imgQRBtn=(ImageButton) findViewById(R.id.imgTeamQR);
        imgQRBtn.setOnClickListener(this);
        imgLogout = findViewById(R.id.imgBtnLogout);
        imgLogout.setOnClickListener(this);


        //setTitle("Score Board");
        if(getIntent().getExtras()!= null) {

            token = getIntent().getExtras().getString(LoginActivity.TOKEN_KEY);
            Log.d("home", "onCreate: "+token);

        }

        if(getIntent().getExtras()!= null) {

            token = getIntent().getExtras().getString(ScanActivity.TOKEN_KEY);
            Log.d("home", "onCreate: "+token);

        }




        teamList = new ArrayList<Team>();

        getTeamAPI();

        if(teamList != null) {
            mRecyclerView = (RecyclerView) findViewById(R.id.my_recycler_view);

            mRecyclerView.setHasFixedSize(true);
            // use a linear layout manager
            mLayoutManager = new LinearLayoutManager(this);
            mRecyclerView.setLayoutManager(mLayoutManager);
            mAdapter = new TeamAdapter(teamList, getApplicationContext(),getToken(),HomeActivity.this);
            mRecyclerView.setAdapter(mAdapter);

        }


    }


    private void getTeamAPI(){
        final OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(remoteIP+"/user/getTeam")
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

                        HomeActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(HomeActivity.this, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str=responseBody.string();
                    Log.d("home", "onResponse: "+str);


                }


                Gson gson = new Gson();
                final TeamResponseApi result=  (TeamResponseApi) gson.fromJson(str, TeamResponseApi.class);

                HomeActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(result.status.equalsIgnoreCase("200")){
                            Toast.makeText(HomeActivity.this,result.message,Toast.LENGTH_SHORT).show();

                          //  Log.d("home", "run: "+result.data);
                            JsonArray jsonArray = result.data;

                            for(int i=0;i< jsonArray.size();i++){
                                JsonObject teamElement =jsonArray.get(i).getAsJsonObject();
                                Team team = new Team();
                                team.setId(teamElement.get("_id").getAsString());
                                team.setName(teamElement.get("teamName").getAsString());
                                team.setNumberOfEval(teamElement.get("numberOfEval").getAsInt());
                                team.setScore(teamElement.get("score").getAsFloat());

                                teamList.add(team);

                            }

                            mAdapter.notifyDataSetChanged();


                        }
                    }
                });
            }
        });

    }


    ArrayList<Survey> getResultsForTeam(String teamId) {
        final OkHttpClient client = new OkHttpClient();

        RequestBody bodyEvaluatorTeam = new FormBody.Builder()
                .add("teamId",teamId)
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

                        HomeActivity.this.runOnUiThread(new Runnable() {
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

                HomeActivity.this.runOnUiThread(new Runnable() {
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




                        }
                    }
                });



            }

        });
        return teamResponseList;

    }

    @Override
    public void onClick(View view) {
        if(view.getId()==R.id.imgTeamQR){
            Log.d("team", "onClick: "+teamResponseList);
            Intent intent = new Intent(HomeActivity.this, TeamScanActivity.class);
            intent.putExtra("TEAMLIST",teamList);
            startActivity(intent);
        }
        if(view.getId()==R.id.imgBtnLogout){
            //logout
            Toast.makeText(getApplicationContext(),"You pressed logout",Toast.LENGTH_SHORT).show();
            //delete token
            deleteToken();
            Intent intent = new Intent(HomeActivity.this, MainActivity.class);
            startActivity(intent);


        }
    }


    public  String getToken(){

        String ret;
        SharedPreferences sharedPref =this.getSharedPreferences(
                "mypref", Context.MODE_PRIVATE);

        ret = sharedPref.getString("token","");

        return ret;
    }


    public void deleteToken(){
        SharedPreferences sharedPref =this.getSharedPreferences(
                "mypref", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();
        editor.clear();
        editor.apply();

    }

}
