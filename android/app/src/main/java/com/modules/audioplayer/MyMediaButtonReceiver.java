package com.modules.audioplayer;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class MyMediaButtonReceiver extends androidx.media.k.b {
    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            super.onReceive(context, intent);
        } catch (IllegalStateException e2) {
            Log.d(getClass().getName(), e2.getMessage());
        }
    }
}
