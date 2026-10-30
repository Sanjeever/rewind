package com.modules.audioplayer;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public abstract class PlayerEvents {
    public static void a(Context context, int i) {
        context.sendBroadcast(new Intent("android.media.action.CLOSE_AUDIO_EFFECT_CONTROL_SESSION").putExtra("android.media.extra.AUDIO_SESSION", i).putExtra("android.media.extra.PACKAGE_NAME", context.getPackageName()).putExtra("android.media.extra.CONTENT_TYPE", 0));
    }

    public static void b(Context context, int i) {
        context.sendBroadcast(new Intent("android.media.action.OPEN_AUDIO_EFFECT_CONTROL_SESSION").putExtra("android.media.extra.AUDIO_SESSION", i).putExtra("android.media.extra.PACKAGE_NAME", context.getPackageName()).putExtra("android.media.extra.CONTENT_TYPE", 0));
    }

    public static void c(Activity activity, int i) {
        try {
            Intent intent = new Intent("android.media.action.DISPLAY_AUDIO_EFFECT_CONTROL_PANEL");
            intent.putExtra("android.media.extra.AUDIO_SESSION", i);
            intent.putExtra("android.media.extra.CONTENT_TYPE", 0);
            activity.startActivityForResult(intent, 0);
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    public static void d(ReactContext reactContext, String str, WritableMap writableMap) {
        if (reactContext.hasActiveCatalystInstance()) {
            ((DeviceEventManagerModule.RCTDeviceEventEmitter) reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)).emit(str, writableMap);
        }
    }
}
