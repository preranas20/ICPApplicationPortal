package com.example.preranasingh.icpandroidapp;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

public class SurveyActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_survey);

        Team team = (Team) getIntent().getSerializableExtra("TEAM_KEY");
        Log.d("survey", "onCreate: "+team.getName()+" "+team.getId());
    }
}
