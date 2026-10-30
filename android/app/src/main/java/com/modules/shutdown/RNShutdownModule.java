package com.modules.shutdown;

import android.app.Activity;
import android.os.Build;
import android.os.Process;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNShutdownModule extends ReactContextBaseJavaModule {
    public RNShutdownModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    public static void staticFire(Activity activity) {
        if (activity != null) {
            try {
                if (Build.VERSION.SDK_INT < 21) {
                    activity.finishAffinity();
                } else {
                    activity.finishAndRemoveTask();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
                return;
            }
        }
        Process.killProcess(Process.myPid());
    }

    @ReactMethod
    public void fire() {
        staticFire(getCurrentActivity());
    }

    @Override
    public String getName() {
        return "RNShutdown";
    }
}
