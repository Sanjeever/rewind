package com.modules.audioplayer;

public final class AudioplayerHelperB implements Runnable {
    public final AudioPlayer k;

    public AudioplayerHelperB(AudioPlayer audioPlayer) {
        this.k = audioPlayer;
    }

    @Override
    public final void run() {
        this.k.s();
    }
}
