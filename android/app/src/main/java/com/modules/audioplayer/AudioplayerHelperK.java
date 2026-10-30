package com.modules.audioplayer;

import com.facebook.react.bridge.Callback;

public final class AudioplayerHelperK implements Runnable {
    public final RNAudioPlayerModule k;
    public final Callback l;

    public AudioplayerHelperK(RNAudioPlayerModule rNAudioPlayerModule, Callback callback) {
        this.k = rNAudioPlayerModule;
        this.l = callback;
    }

    @Override
    public final void run() {
        this.k.a(this.l);
    }
}
