package com.modules.audioplayer;

import android.annotation.TargetApi;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.AudioFocusRequest;
import android.media.AudioManager;
import android.os.Build;
import com.brentvatne.react.ReactVideoViewManager;

public class AudioFocusManager implements AudioManager.OnAudioFocusChangeListener {

    private final AudioManager f4789a;

    b.p.a.d f4790b;

    @TargetApi(26)
    private boolean f4791c = false;

    private AudioFocusRequest f4792d = null;

    public AudioFocusManager(Context context) {
        this.f4789a = (AudioManager) context.getSystemService("audio");
        this.f4790b = b.p.a.d.b(context);
    }

    public void a() {
        int iAbandonAudioFocusRequest;
        if (this.f4791c) {
            AudioManager audioManager = this.f4789a;
            if (audioManager == null) {
                iAbandonAudioFocusRequest = 0;
            } else {
                iAbandonAudioFocusRequest = Build.VERSION.SDK_INT >= 26 ? audioManager.abandonAudioFocusRequest(this.f4792d) : audioManager.abandonAudioFocus(this);
            }
            this.f4791c = iAbandonAudioFocusRequest != 1;
        }
    }

    public void b() {
        int iRequestAudioFocus;
        if (this.f4791c) {
            return;
        }
        AudioManager audioManager = this.f4789a;
        if (audioManager == null) {
            iRequestAudioFocus = 0;
        } else if (Build.VERSION.SDK_INT >= 26) {
            AudioFocusRequest audioFocusRequestBuild = new AudioFocusRequest.Builder(1).setOnAudioFocusChangeListener(this).setAudioAttributes(new AudioAttributes.Builder().setUsage(1).setContentType(2).build()).build();
            this.f4792d = audioFocusRequestBuild;
            iRequestAudioFocus = this.f4789a.requestAudioFocus(audioFocusRequestBuild);
        } else {
            iRequestAudioFocus = audioManager.requestAudioFocus(this, 3, 1);
        }
        this.f4791c = iRequestAudioFocus == 1;
    }

    @Override
    public void onAudioFocusChange(int i) {
        String str;
        Intent intent = new Intent(RNAudioPlayerModule.EVENT_NAME);
        if (i == -3) {
            str = "AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK";
        } else {
            if (i != -2) {
                if (i == -1) {
                    intent.putExtra(ReactVideoViewManager.PROP_SRC_TYPE, "AUDIOFOCUS_LOSS");
                    a();
                } else if (i == 1) {
                    str = "AUDIOFOCUS_GAIN";
                }
                this.f4790b.d(intent);
            }
            str = "AUDIOFOCUS_LOSS_TRANSIENT";
        }
        intent.putExtra(ReactVideoViewManager.PROP_SRC_TYPE, str);
        this.f4790b.d(intent);
    }
}
