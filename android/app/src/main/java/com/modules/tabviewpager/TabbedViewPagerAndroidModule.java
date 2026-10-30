package com.modules.tabviewpager;

import android.widget.Toast;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class TabbedViewPagerAndroidModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public TabbedViewPagerAndroidModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.reactContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return "TabbedViewPagerAndroid";
    }

    @ReactMethod
    public void sayHello() {
        Toast.makeText(this.reactContext, "Hey there", 0).show();
    }
}
