package com.modules.audioplayer;

public final class AudioplayerHelperL implements Runnable {
    public final RNAudioPlayerModule k;

    public AudioplayerHelperL(RNAudioPlayerModule rNAudioPlayerModule) {
        this.k = rNAudioPlayerModule;
    }

    @Override
    public final void run() {
        this.k.b();
    }
}
