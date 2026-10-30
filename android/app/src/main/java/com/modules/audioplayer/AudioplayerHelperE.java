package com.modules.audioplayer;

public final class AudioplayerHelperE implements Runnable {
    public final AudioPlayer k;
    public final float l;

    public AudioplayerHelperE(AudioPlayer audioPlayer, float f2) {
        this.k = audioPlayer;
        this.l = f2;
    }

    @Override
    public final void run() {
        this.k.w(this.l);
    }
}
