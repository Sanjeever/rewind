package com.modules.audioplayer;

public final class AudioplayerPackage implements Runnable {
    public final FadeInTask k;

    public AudioplayerPackage(FadeInTask fadeInTask) {
        this.k = fadeInTask;
    }

    @Override
    public final void run() {
        this.k.b();
    }
}
