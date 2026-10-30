package com.modules.splash;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kuss.rewind.SplashScreen;

public class RNSplashScreenModule extends ReactContextBaseJavaModule {
    public RNSplashScreenModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public String getName() {
        return "RNSplashScreen";
    }

    @ReactMethod
    public void hide(int i) {
        SplashScreen.e(i);
    }

    @ReactMethod
    public void show() {
        SplashScreen.h(getCurrentActivity());
    }
}
