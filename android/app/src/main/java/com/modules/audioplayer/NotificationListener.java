package com.modules.audioplayer;

import android.app.Notification;
import android.os.Build;
import d.f.a.b.t6.j0;

class NotificationListener implements com.google.android.exoplayer2.ui.r {

    final MediaSessionManager f4781a;

    NotificationListener(MediaSessionManager mediaSessionManager) {
        this.f4781a = mediaSessionManager;
    }

    @Override
    public void a(int i, boolean z) {
        MediaSessionManager.e(this.f4781a).stopSelf();
    }

    @Override
    public void b(int i, Notification notification, boolean z) {
        try {
            if (!z) {
                MediaSessionManager.e(this.f4781a).stopForeground(false);
            } else if (Build.VERSION.SDK_INT >= 29) {
                MediaSessionManager.e(this.f4781a).startForeground(i, notification, 2);
            } else {
                MediaSessionManager.e(this.f4781a).startForeground(i, notification);
            }
        } catch (Exception e2) {
            j0.b("TEST", "startForeground error");
            e2.printStackTrace();
        }
    }
}
