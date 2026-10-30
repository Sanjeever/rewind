package com.modules.devmenu;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import d.e.m.o0;

public class DevMenu extends ReactContextBaseJavaModule {
    private final o0 mReactNativeHost;

    public DevMenu(ReactApplicationContext reactApplicationContext, o0 o0Var) {
        super(reactApplicationContext);
        this.mReactNativeHost = o0Var;
    }

    private void lambda$show$0() {
        o0 o0Var = this.mReactNativeHost;
        if (o0Var != null) {
            o0Var.h().W();
        }
    }

    public void a() {
        lambda$show$0();
    }

    @Override
    public String getName() {
        return "DevMenu";
    }

    @ReactMethod
    public void show() {
        UiThreadUtil.runOnUiThread(new DevmenuPackage(this));
    }
}
