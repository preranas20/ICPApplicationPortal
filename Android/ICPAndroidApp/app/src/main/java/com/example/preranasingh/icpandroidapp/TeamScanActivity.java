package com.example.preranasingh.icpandroidapp;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.widget.Toast;

import com.google.zxing.Result;

import me.dm7.barcodescanner.zxing.ZXingScannerView;

import static android.Manifest.permission_group.CAMERA;

public class TeamScanActivity extends AppCompatActivity implements ZXingScannerView.ResultHandler {

    private static final int REQUEST_CAMERA = 1;
    private ZXingScannerView mScannerView;
    private String remoteIP="http://52.202.147.130:5000";
    static final String TEAM_ID ="TEAMID";
    private String token;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_team_scan);

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

        ActivityCompat.requestPermissions(TeamScanActivity.this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA);
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
        new android.support.v7.app.AlertDialog.Builder(TeamScanActivity.this)
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
        String id = result.getText();
        Intent intent = new Intent(TeamScanActivity.this,SurveyActivity.class);
        intent.putExtra(TEAM_ID, id);
        intent.putExtra("Class","TeamScanActivity");
        startActivity(intent);

    }



}
