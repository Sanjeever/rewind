package com.modules.intentVideo;

import android.content.Intent;
import android.net.Uri;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNIntentVideoModule extends ReactContextBaseJavaModule {
    public RNIntentVideoModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "RNIntentVideo";
    }

    @ReactMethod
    public void playVideo(String str) {
        Uri uri = Uri.parse(str);
        Intent intent = new Intent("android.intent.action.VIEW");
        intent.setFlags(268435456);
        intent.setDataAndType(uri, "video/*");
        try {
            getReactApplicationContext().startActivity(intent);
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }
}
