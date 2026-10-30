package com.modules.audioplayer;

public final class AudioplayerHelperD implements Runnable {
    public final AudioPlayer k;

    public AudioplayerHelperD(AudioPlayer audioPlayer) {
        this.k = audioPlayer;
    }

    @Override
    public final void run() {
        this.k.y();
    }
}
