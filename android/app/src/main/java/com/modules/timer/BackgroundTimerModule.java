package com.modules.timer;

import android.os.Handler;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class BackgroundTimerModule extends ReactContextBaseJavaModule {
    private Handler handler;
    private final ReactContext reactContext;
    private Runnable runnable;

    public BackgroundTimerModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.reactContext = reactApplicationContext;
    }

    private void lambda$setTimeout$1(int i) {
        if (getReactApplicationContext().hasActiveCatalystInstance()) {
            ((DeviceEventManagerModule.RCTDeviceEventEmitter) getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)).emit("backgroundTimer.timeout", Integer.valueOf(i));
        }
    }

    private void lambda$start$0(long j) {
        sendEvent(this.reactContext);
        this.handler.postDelayed(this.runnable, j);
    }

    private void sendEvent(ReactContext reactContext) {
        ((DeviceEventManagerModule.RCTDeviceEventEmitter) reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)).emit("backgroundTimer", null);
    }

    public void a(int i) {
        lambda$setTimeout$1(i);
    }

    public void b(long j) {
        lambda$start$0(j);
    }

    @Override
    public String getName() {
        return "RNBackgroundTimer";
    }

    @ReactMethod
    public void setTimeout(int i, double d2) {
        new Handler().postDelayed(new TimerPackage(this, i), (long) d2);
    }

    @ReactMethod
    public void start(long j) {
        Handler handler = new Handler();
        this.handler = handler;
        TimerHelperB timerHelperB = new TimerHelperB(this, j);
        this.runnable = timerHelperB;
        handler.post(timerHelperB);
    }

    @ReactMethod
    public void stop() {
        Handler handler = this.handler;
        if (handler != null) {
            handler.removeCallbacks(this.runnable);
        }
    }
}
