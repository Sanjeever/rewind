package com.modules.audioplayer;

public final class AudioplayerHelperF implements Runnable {
    public final AudioPlayer k;
    public final int l;

    public AudioplayerHelperF(AudioPlayer audioPlayer, int i) {
        this.k = audioPlayer;
        this.l = i;
    }

    @Override
    public final void run() {
        this.k.u(this.l);
    }
}
