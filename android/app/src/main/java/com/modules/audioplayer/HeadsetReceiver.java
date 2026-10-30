package com.modules.audioplayer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import com.brentvatne.react.ReactVideoViewManager;

public class HeadsetReceiver extends BroadcastReceiver {

    private b.p.a.d f4804a;

    private void a() {
        if (this.f4804a == null) {
            return;
        }
        Intent intent = new Intent(RNAudioPlayerModule.EVENT_NAME);
        intent.putExtra(ReactVideoViewManager.PROP_SRC_TYPE, "HeadSetReceiver");
        this.f4804a.d(intent);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        this.f4804a = b.p.a.d.b(context);
        String action = intent.getAction();
        if (!"android.media.AUDIO_BECOMING_NOISY".equals(action)) {
            if ("android.intent.action.HEADSET_PLUG".equals(action)) {
                if (isInitialStickyBroadcast() || !intent.hasExtra("state")) {
                    return;
                }
            } else if (!"android.bluetooth.headset.profile.action.CONNECTION_STATE_CHANGED".equals(action)) {
                return;
            }
        }
        a();
    }
}
