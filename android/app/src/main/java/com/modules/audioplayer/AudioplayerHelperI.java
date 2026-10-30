package com.modules.audioplayer;

public final class AudioplayerHelperI implements Runnable {
    public final MediaSessionManager k;

    public AudioplayerHelperI(MediaSessionManager mediaSessionManager) {
        this.k = mediaSessionManager;
    }

    @Override
    public final void run() {
        this.k.p();
    }
}
