package com.example.preranasingh.icpandroidapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;

public class TeamResponseActivity extends AppCompatActivity implements View.OnClickListener {
    private ArrayList<Survey> responses;
    private RecyclerView mRecyclerView;
    private RecyclerView.Adapter mAdapter;
    private RecyclerView.LayoutManager mLayoutManager;
    private Team team;
    private Button btnResubmit;
    private TextView teamTitle;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_team_response);

        responses = new ArrayList<Survey>();

        if(getIntent().getExtras()!= null) {

            team = (Team) getIntent().getSerializableExtra("TEAM_KEY");
            responses = (ArrayList<Survey>) getIntent().getExtras().getSerializable("TEAM_RESPONSE");

        }

        teamTitle = findViewById(R.id.team_title);
        teamTitle.setText(team.name);


        if(responses != null) {
            mRecyclerView = (RecyclerView) findViewById(R.id.response_list);

            mRecyclerView.setHasFixedSize(true);
            // use a linear layout manager
            mLayoutManager = new LinearLayoutManager(this);
            mRecyclerView.setLayoutManager(mLayoutManager);
            mAdapter = new ReponseAdapter(responses, getApplicationContext());
            mRecyclerView.setAdapter(mAdapter);

        }

        btnResubmit = findViewById(R.id.btnResubmit);
        btnResubmit.setOnClickListener(this);


    }

    @Override
    public void onClick(View view) {
        Intent intent = new Intent(TeamResponseActivity.this,SurveyActivity.class);
        intent.putExtra("TEAM_KEY", team);
        intent.putExtra("Class", "TeamResponseActivity");
        startActivity(intent);
    }




}
