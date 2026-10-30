package com.modules.audioplayer;

import com.facebook.react.bridge.UiThreadUtil;
import java.util.TimerTask;

class FadeInTask extends TimerTask {
    final AudioPlayer k;

    FadeInTask(AudioPlayer audioPlayer) {
        this.k = audioPlayer;
    }

    private void a() {
        if (AudioPlayer.e(this.k) != null) {
            AudioPlayer.e(this.k).pause();
        }
    }

    public void b() {
        a();
    }

    @Override
    public void run() {
        AudioPlayer.d(this.k);
        if (AudioPlayer.b(this.k) <= 0.0f) {
            AudioPlayer.c(this.k);
            UiThreadUtil.runOnUiThread(new AudioplayerPackage(this));
        }
    }
}
