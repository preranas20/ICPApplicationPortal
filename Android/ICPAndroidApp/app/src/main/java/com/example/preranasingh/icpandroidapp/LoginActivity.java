package com.example.preranasingh.icpandroidapp;

import android.app.ActionBar;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {

    private TextView txtEmail;
    private TextView txtPassword;
    private Button  btnLogin;
    private String email;
    private String pass;
    private String remoteIP="http://52.202.147.130:5000";
    private String token;
    static final String TOKEN_KEY ="TOKEN" ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        setTitle("ICP Showcase");
        txtEmail = (TextView) findViewById(R.id.editEmail);
        txtPassword = (TextView) findViewById(R.id.editPassword);
        btnLogin = (Button) findViewById(R.id.btnEmailLogin);
        btnLogin.setOnClickListener(this);


    }

    @Override
    public void onClick(View view) {
        if(view.getId()==R.id.btnEmailLogin){
            email=txtEmail.getText().toString();
            pass=txtPassword.getText().toString();

            if(email.isEmpty())
            {
                txtEmail.setError("Field cannot be empty");
            }
            else if(pass.isEmpty()){
                txtPassword.setError("Field cannot be empty");
            }else{
                loginApi(email,pass);
            }
        }
    }

    private void loginApi(String email, String password) {

        final OkHttpClient client = new OkHttpClient();

       MediaType JSON = MediaType.parse("application/json; charset=utf-8");
       RequestBody formBody = RequestBody.create(JSON, "{\"email\":\""+email+"\",\"password\":\""+password+"\",\"isPortal\":false}");
       Log.d("login", "loginApi: "+formBody.toString());
       /* RequestBody formBody = new FormBody.Builder()
                .add("email",email)
                .add("password",password)
               // .add("isPortal",false)
                .build();*/

        Request request = new Request.Builder()
                .url(remoteIP+"/user/login")
                .header("Content-Type","application/json")
                .post(formBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d("login", "onFailure: login");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d("login", "onResponse: "+response.body().toString());
                String str;
                try (final ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {

                        LoginActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(LoginActivity.this,"Login unsuccessful" , Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str=responseBody.string();
                    Log.d("login", "onResponse: "+str);
                    //Toast.makeText(LoginActivity.this,str, Toast.LENGTH_SHORT).show();

                }

                Gson gson = new Gson();
                final ResponseApi result=  (ResponseApi) gson.fromJson(str, ResponseApi.class);

                LoginActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(result.status.equalsIgnoreCase("200")){
                            Toast.makeText(LoginActivity.this,result.message,Toast.LENGTH_SHORT).show();

                            token = result.data.get("token").getAsString();
                            Log.d("login", "run: "+token);

                            SharedPreferences sharedPref =  getApplicationContext().getSharedPreferences(
                                    "mypref", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putString("token", token);
                            editor.apply();

                            Intent intent = new Intent(LoginActivity.this, HomeActivity.class);
                            intent.putExtra(TOKEN_KEY, token);
                            startActivity(intent);

                        }
                        else{
                            Toast.makeText(LoginActivity.this,result.message,Toast.LENGTH_SHORT).show();
                        }
                    }
                });








        }
    });
}

    public void setTitle(String title){
        getSupportActionBar().setHomeButtonEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        TextView textView = new TextView(this);
        textView.setText("ICP Showcase");
        textView.setTextSize(20);
        textView.setTypeface(null, Typeface.BOLD);
        textView.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.FILL_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
        textView.setGravity(Gravity.CENTER);
        textView.setTextColor(getResources().getColor(R.color.black));
        getSupportActionBar().setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
        getSupportActionBar().setCustomView(textView);
    }


}
