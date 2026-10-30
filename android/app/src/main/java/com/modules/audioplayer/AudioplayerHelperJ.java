package com.modules.audioplayer;

public final class AudioplayerHelperJ implements Runnable {
    public final MediaSessionManager k;
    public final boolean l;
    public final String m;

    public AudioplayerHelperJ(MediaSessionManager mediaSessionManager, boolean z, String str) {
        this.k = mediaSessionManager;
        this.l = z;
        this.m = str;
    }

    @Override
    public final void run() {
        this.k.r(this.l, this.m);
    }
}
