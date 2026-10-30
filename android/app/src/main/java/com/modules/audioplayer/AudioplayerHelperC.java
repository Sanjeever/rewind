package com.modules.audioplayer;

public final class AudioplayerHelperC implements Runnable {
    public final AudioPlayer k;
    public final String l;

    public AudioplayerHelperC(AudioPlayer audioPlayer, String str) {
        this.k = audioPlayer;
        this.l = str;
    }

    @Override
    public final void run() {
        this.k.q(this.l);
    }
}
