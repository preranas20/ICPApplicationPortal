package com.example.preranasingh.icpandroidapp;

import android.app.Activity;
import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

public class TeamAdapter extends RecyclerView.Adapter<TeamAdapter.TeamViewHolder>{
    ArrayList<Team> mData;
    private Context context;
    private String token;
    private Activity activity;

    public TeamAdapter(ArrayList<Team> mData, Context context, String token,Activity activity) {
        this.mData = mData;
        this.context=context;
        this.token = token;
        this.activity = activity;
    }

    @Override
    public TeamViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        //inflating the recycler view structure
        View itemview= LayoutInflater.from(parent.getContext()).inflate(R.layout.team,parent,false);
        //passing the inflated view as a parameter in viewHolder
        // ViewHolder viewHolder = new ViewHolder(view);
        return new TeamViewHolder(itemview);
    }


    @Override
    public void onBindViewHolder(TeamViewHolder holder, int position) {
        final Team team=mData.get(position);

        holder.txtTeamName.setText(team.name);
        holder.txtScore.setText(String.valueOf(team.score));
        holder.txtTeamName.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //token = response.getToken();//
               // activity = (Activity) context;
                SurveyResponseApi response = new SurveyResponseApi(token,activity);

              //  ArrayList<Survey>responseList = new ArrayList<Survey>();
                response.getResultsForTeam(team);
             //   Log.d("teamdata", "onClick: "+responseList);

            }
        });

    }


    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class TeamViewHolder extends RecyclerView.ViewHolder{
        TextView txtTeamName,txtScore;
        public TeamViewHolder(View itemView) {
            super(itemView);
            txtTeamName= (TextView) itemView.findViewById(R.id.textTeamName);
            txtScore= (TextView) itemView.findViewById(R.id.textTeamScore);



        }
    }


}
