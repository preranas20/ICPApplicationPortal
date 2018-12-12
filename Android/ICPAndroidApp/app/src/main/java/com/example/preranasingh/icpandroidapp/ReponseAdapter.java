package com.example.preranasingh.icpandroidapp;

import android.content.Context;
import android.support.annotation.NonNull;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.util.ArrayList;

class ReponseAdapter extends RecyclerView.Adapter<ReponseAdapter.ReponseViewHolder> {

    ArrayList<Survey> mData;
    private Context context;

    public ReponseAdapter(ArrayList<Survey> mData, Context context) {
        this.mData = mData;
        this.context=context;
    }

    @Override
    public ReponseViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        View itemview= LayoutInflater.from(viewGroup.getContext()).inflate(R.layout.response_item,viewGroup,false);
        //passing the inflated view as a parameter in viewHolder
        // ViewHolder viewHolder = new ViewHolder(view);
        return new ReponseViewHolder(itemview);
    }

    @Override
    public void onBindViewHolder(ReponseAdapter.ReponseViewHolder holder, int position) {
        final Survey survey=mData.get(position);
        holder.textQuestion.setText(survey.questionText);
        holder.textAnswer.setText(String.valueOf(survey.answer));

    }

    @Override
    public int getItemCount() {
        return mData.size();
    }

    public static class ReponseViewHolder extends RecyclerView.ViewHolder {
        TextView textQuestion,textAnswer;
        public ReponseViewHolder(@NonNull View itemView) {
            super(itemView);
            textQuestion=(TextView) itemView.findViewById(R.id.txtQuesn);
            textAnswer = itemView.findViewById(R.id.textAns);
        }
    }
}
