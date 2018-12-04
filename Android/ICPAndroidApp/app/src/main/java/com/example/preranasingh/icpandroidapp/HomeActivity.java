package com.example.preranasingh.icpandroidapp;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
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

public class HomeActivity extends AppCompatActivity {

    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    private String token;
    private String remoteIP="http://52.202.147.130:5000";
    private ArrayList<Team> teamList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);


        if(getIntent().getExtras()!= null) {

            token = getIntent().getExtras().getString(LoginActivity.TOKEN_KEY);
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
            mAdapter = new TeamAdapter(teamList, getApplicationContext());
            mRecyclerView.setAdapter(mAdapter);

        }


    }


    private void getTeamAPI(){
        final OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(remoteIP+"/user/getTeam")
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
                  //  Log.d("home", "onResponse: "+str);


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
                                team.setId(String.valueOf(teamElement.get("_id")));
                                team.setName(String.valueOf(teamElement.get("teamName")));
                                team.setNumberOfEval(teamElement.get("numberOfEval").getAsInt());
                                team.setScore(teamElement.get("score").getAsFloat());

                                teamList.add(team);

                            }

                            // notify adapter
                            mAdapter.notifyDataSetChanged();
                            //Log.d("home", "run: "+teamList);




                        }
                    }
                });
            }
        });

    }
}
