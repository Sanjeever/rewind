package com.modules.audioplayer;

import java.util.TimerTask;

class FadeOutTask extends TimerTask {
    final AudioPlayer k;

    FadeOutTask(AudioPlayer audioPlayer) {
        this.k = audioPlayer;
    }

    @Override
    public void run() {
        AudioPlayer.a(this.k);
        if (AudioPlayer.b(this.k) >= 1.0f) {
            AudioPlayer.c(this.k);
        }
    }
}
