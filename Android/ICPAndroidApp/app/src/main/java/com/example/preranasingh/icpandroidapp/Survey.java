package com.example.preranasingh.icpandroidapp;

import java.io.Serializable;

public class Survey implements Serializable {

    String questionText,questionId,teamId;
    int surveyId,orderId,answer;

    public Survey(String questionId, String questionText, int surveyId, int orderId, String teamId, int answer) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.surveyId = surveyId;
        this.orderId = orderId;
        this.teamId = teamId;
        this.answer = answer;
    }

    public Survey(){}

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public String getTeamId() {
        return teamId;
    }

    public void setTeamId(String teamId) {
        this.teamId = teamId;
    }

    public int getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(int surveyId) {
        this.surveyId = surveyId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getAnswer() {
        return answer;
    }

    public void setAnswer(int answer) {
        this.answer = answer;
    }

    public String toString(){
        return "qId:"+questionId+" qtext:"+questionText+" surveyId:"+surveyId+" orderId:"+orderId+" teamId:"+teamId+" answer:"+answer;
    }
}
