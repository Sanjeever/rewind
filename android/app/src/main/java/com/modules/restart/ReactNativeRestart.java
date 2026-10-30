package com.modules.restart;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import d.e.m.m0;
import d.e.m.y;

public class ReactNativeRestart extends ReactContextBaseJavaModule {
    private static RestartHelperC mReactInstanceHolder;
    private LifecycleEventListener mLifecycleEventListener;

    public ReactNativeRestart(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.mLifecycleEventListener = null;
    }

    private void clearLifecycleEventListener() {
        if (this.mLifecycleEventListener != null) {
            getReactApplicationContext().removeLifecycleEventListener(this.mLifecycleEventListener);
            this.mLifecycleEventListener = null;
        }
    }

    static m0 getReactInstanceManager() {
        RestartHelperC restartHelperC = mReactInstanceHolder;
        if (restartHelperC == null) {
            return null;
        }
        return restartHelperC.a();
    }

    private void lambda$loadBundle$0(m0 m0Var) {
        try {
            m0Var.Q();
        } catch (Exception unused) {
            loadBundleLegacy();
        }
    }

    private void loadBundle() {
        clearLifecycleEventListener();
        try {
            m0 m0VarResolveInstanceManager = resolveInstanceManager();
            if (m0VarResolveInstanceManager == null) {
                return;
            }
            new Handler(Looper.getMainLooper()).post(new RestartPackage(this, m0VarResolveInstanceManager));
        } catch (Exception unused) {
            loadBundleLegacy();
        }
    }

    private void loadBundleLegacy() {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return;
        }
        currentActivity.runOnUiThread(new RestartHelperB(currentActivity));
    }

    private m0 resolveInstanceManager() {
        m0 reactInstanceManager = getReactInstanceManager();
        if (reactInstanceManager != null) {
            return reactInstanceManager;
        }
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            return null;
        }
        return ((y) currentActivity.getApplication()).a().h();
    }

    public void a(m0 m0Var) {
        lambda$loadBundle$0(m0Var);
    }

    @Override
    public String getName() {
        return "RNRestart";
    }

    @ReactMethod
    public void restart() {
        loadBundle();
    }
}
