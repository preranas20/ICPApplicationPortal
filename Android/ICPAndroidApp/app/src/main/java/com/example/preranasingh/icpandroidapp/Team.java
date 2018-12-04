package com.example.preranasingh.icpandroidapp;

import java.io.Serializable;

public class Team implements Serializable{
    String id,name;
    int  numberOfEval;
    float score;

    public Team(String id, String name, int numberOfEval, float score) {
        this.id = id;
        this.name = name;
        this.numberOfEval = numberOfEval;
        this.score = score;
    }


    public Team(){}


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getNumberOfEval() {
        return numberOfEval;
    }

    public void setNumberOfEval(int numberOfEval) {
        this.numberOfEval = numberOfEval;
    }

    public float getScore() {
        return score;
    }

    public void setScore(float score) {
        this.score = score;
    }
}
