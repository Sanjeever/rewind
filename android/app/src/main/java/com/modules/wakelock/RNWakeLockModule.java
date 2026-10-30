package com.modules.wakelock;

import android.app.Activity;
import android.os.PowerManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNWakeLockModule extends ReactContextBaseJavaModule {
    private final PowerManager mPowerManager;
    private PowerManager.WakeLock mWakeLock;

    static class InnerA {

        static final int[] f4828a;

        static {
            int[] iArr = new int[InnerB.values().length];
            f4828a = iArr;
            try {
                iArr[InnerB.ADD.ordinal()] = 1;
            } catch (NoSuchFieldError unused) {
            }
            try {
                f4828a[InnerB.CLEAR.ordinal()] = 2;
            } catch (NoSuchFieldError unused2) {
            }
        }
    }

    enum InnerB {
        ADD,
        CLEAR
    }

    public RNWakeLockModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.mPowerManager = (PowerManager) reactApplicationContext.getSystemService("power");
    }

    private void bindScreenOnFlag(InnerB innerB) {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                currentActivity.runOnUiThread(new WakelockPackage(innerB, currentActivity));
            }
        } catch (NullPointerException e2) {
            e2.printStackTrace();
        }
    }

    static void lambda$bindScreenOnFlag$0(InnerB innerB, Activity activity) {
        int i = InnerA.f4828a[innerB.ordinal()];
        if (i == 1) {
            activity.getWindow().addFlags(128);
        } else {
            if (i != 2) {
                return;
            }
            activity.getWindow().clearFlags(128);
        }
    }

    @ReactMethod
    public void activate() {
        if (this.mWakeLock == null) {
            this.mWakeLock = this.mPowerManager.newWakeLock(26, "rewind:wakelock");
        }
        if (this.mWakeLock.isHeld()) {
            return;
        }
        this.mWakeLock.acquire(3000L);
        bindScreenOnFlag(InnerB.ADD);
    }

    @ReactMethod
    public void deactivate() {
        PowerManager.WakeLock wakeLock = this.mWakeLock;
        if (wakeLock == null || !wakeLock.isHeld()) {
            return;
        }
        this.mWakeLock.release();
        this.mWakeLock = null;
        bindScreenOnFlag(InnerB.CLEAR);
    }

    @Override
    public String getName() {
        return "RNWakeLock";
    }
}
