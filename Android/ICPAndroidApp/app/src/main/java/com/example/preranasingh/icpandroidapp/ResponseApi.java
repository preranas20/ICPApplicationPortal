package com.example.preranasingh.icpandroidapp;

import com.google.gson.JsonObject;

import java.io.Serializable;

public class ResponseApi implements Serializable {


    public String token;
    public String status;
    public String message;
    public JsonObject data;
    public String  title;
    public String body;
}
