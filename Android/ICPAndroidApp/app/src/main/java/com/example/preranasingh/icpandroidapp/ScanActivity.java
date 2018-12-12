package com.example.preranasingh.icpandroidapp;

import android.Manifest;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.google.gson.Gson;
import com.google.zxing.Result;

import java.io.IOException;

import me.dm7.barcodescanner.zxing.ZXingScannerView;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.ResponseBody;

import static android.Manifest.permission_group.CAMERA;

public class ScanActivity extends AppCompatActivity implements ZXingScannerView.ResultHandler{

    private static final int REQUEST_CAMERA = 1;
    private ZXingScannerView mScannerView;
    private String remoteIP="http://52.202.147.130:5000";
    static final String TOKEN_KEY ="TOKEN";
    private String token;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mScannerView = new ZXingScannerView(this);
        setContentView(mScannerView);
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            if (checkPermission()) { //check if permission is granted
                Toast.makeText(getApplicationContext(), "Permission already granted", Toast.LENGTH_LONG).show();
                Log.d("test", "have permission");
            } else {
                Log.d("test", "onrequest permission");

                requestPermission();
            }
        }
    }

    private boolean checkPermission() { //permission is granted or not

        return ( ContextCompat.checkSelfPermission(getApplicationContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED);
    }

    private void requestPermission() {
        Log.d("test", "asking for  permission");

        ActivityCompat.requestPermissions(ScanActivity.this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA);
    }
@Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case REQUEST_CAMERA:
                Log.d("scan", String.valueOf(grantResults[0]));
                if (grantResults.length > 0) {
                    Log.d("scan", String.valueOf(grantResults[0]));
                    boolean cameraAccepted = grantResults[0] == PackageManager.PERMISSION_GRANTED;
                    if (cameraAccepted){
                        Toast.makeText(getApplicationContext(), "Permission Granted, Now you can access camera", Toast.LENGTH_LONG).show();
                    }else {
                        Log.d("scan", String.valueOf(cameraAccepted));
                        Toast.makeText(getApplicationContext(), "Permission Denied, You cannot access and camera", Toast.LENGTH_LONG).show();
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            if (shouldShowRequestPermissionRationale(CAMERA)) {
                                showMessageOKCancel("You need to allow access to both the permissions",
                                        new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int which) {
                                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                                                    requestPermissions(new String[]{CAMERA},
                                                            REQUEST_CAMERA);
                                                }
                                            }
                                        });
                                return;
                            }
                        }
                    }
                }
                break;
        }
    }

    private void showMessageOKCancel(String message, DialogInterface.OnClickListener okListener) {
        new android.support.v7.app.AlertDialog.Builder(ScanActivity.this)
                .setMessage(message)
                .setPositiveButton("OK", okListener)
                .setNegativeButton("Cancel", null)
                .create()
                .show();
    }



    @Override
    public void onResume() {
        super.onResume();

        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            if (checkPermission()) {
                if (mScannerView == null) {
                    mScannerView = new ZXingScannerView(this);
                    setContentView(mScannerView);
                }
                mScannerView.setResultHandler(this); // Register ourselves as a handler for scan results.
                mScannerView.startCamera();  // Start camera on resume
            }else {
                requestPermission();
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mScannerView.stopCamera();
    }

    @Override
    public void onPause() {
        super.onPause();
        mScannerView.stopCamera();           // Stop camera on pause
    }



    @Override
    public void handleResult(Result result) {
        // Do something with the result here
        final String txtresult = result.getText();
        Log.d("QR", result.getText());
        Log.d("QR", result.getBarcodeFormat().toString());
        String key = result.getText();
        loginQRApi(key);


    }

    private void loginQRApi(String key) {
        final OkHttpClient client = new OkHttpClient();
        RequestBody formBody = new FormBody.Builder()
                .add("key",key)
                .build();

        Request request = new Request.Builder()
                .url(remoteIP+"/user/loginQRCode")
                .header("Content-Type","application/json")
                .post(formBody)
                .build();

        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.d("loginscan", "onFailure: login");
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                Log.d("login", "onResponse: "+response.body().toString());
                String str;
                try (final ResponseBody responseBody = response.body()) {
                    if (!response.isSuccessful()) {

                        ScanActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                Toast.makeText(ScanActivity.this, responseBody.toString(), Toast.LENGTH_SHORT).show();
                            }
                        });
                    }

                    Headers responseHeaders = response.headers();
                    for (int i = 0, size = responseHeaders.size(); i < size; i++) {
                        System.out.println(responseHeaders.name(i) + ": " + responseHeaders.value(i));
                    }

                    str=responseBody.string();
                    Log.d("login", "onResponse: "+str);


                }

                Gson gson = new Gson();
                final ResponseApi result=  (ResponseApi) gson.fromJson(str, ResponseApi.class);

                ScanActivity.this.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(result.status.equalsIgnoreCase("200")){
                            Toast.makeText(ScanActivity.this,result.message,Toast.LENGTH_SHORT).show();

                            token = String.valueOf(result.data.get("token").getAsString());
                            Log.d("login", "run: "+token);

                            SharedPreferences sharedPref =  getApplicationContext().getSharedPreferences(
                                    "mypref", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putString("token", token);
                            editor.apply();

                            Intent intent = new Intent(ScanActivity.this, HomeActivity.class);
                            intent.putExtra(TOKEN_KEY, token);
                            startActivity(intent);

                        }
                    }
                });


            }
        });
    }
}
