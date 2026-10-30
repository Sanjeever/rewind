package com.modules.audioplayer;

import android.content.Intent;
import android.os.Handler;
import android.view.KeyEvent;
import d.f.a.b.c5;

class PlaybackPreparer implements d.f.a.b.l6.a.g {

    private int f4813a;

    final MediaSessionManager f4814b;

    private PlaybackPreparer(MediaSessionManager mediaSessionManager) {
        this.f4814b = mediaSessionManager;
    }

    PlaybackPreparer(MediaSessionManager mediaSessionManager, AudioplayerHelperX audioplayerHelperX) {
        this(mediaSessionManager);
    }

    private void b(c5 c5Var) {
        int i = this.f4813a;
        if (i == 1) {
            c5Var.l(!c5Var.isPlaying());
        } else if (i == 2) {
            MediaSessionManager.a(this.f4814b, "nextTrack");
        } else if (i == 3) {
            MediaSessionManager.a(this.f4814b, "previousTrack");
        }
        this.f4813a = 0;
    }

    @Override
    public boolean a(c5 c5Var, Intent intent) {
        if (!"android.intent.action.MEDIA_BUTTON".equals(intent.getAction())) {
            return false;
        }
        KeyEvent keyEvent = (KeyEvent) intent.getParcelableExtra("android.intent.extra.KEY_EVENT");
        if (keyEvent.getAction() == 0) {
            int keyCode = keyEvent.getKeyCode();
            if (keyCode == 79) {
                Handler handler = new Handler();
                int i = this.f4813a;
                if (i == 0) {
                    this.f4813a = i + 1;
                    handler.postDelayed(new AudioplayerHelperH(this, c5Var), 500L);
                } else if (i == 1) {
                    this.f4813a = i + 1;
                } else if (i == 2) {
                    this.f4813a = 0;
                    MediaSessionManager.a(this.f4814b, "previousTrack");
                }
                return true;
            }
            if (keyCode == 87) {
                MediaSessionManager.a(this.f4814b, "nextTrack");
            } else if (keyCode == 88) {
                MediaSessionManager.a(this.f4814b, "previousTrack");
            } else if (keyCode == 126) {
                c5Var.l(true);
            } else if (keyCode == 127) {
                c5Var.l(false);
            }
        }
        return false;
    }

    public void c(c5 c5Var) {
        b(c5Var);
    }
}
