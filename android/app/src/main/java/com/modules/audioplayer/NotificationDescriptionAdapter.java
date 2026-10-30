package com.modules.audioplayer;

import android.app.PendingIntent;
import android.graphics.Bitmap;
import d.f.a.b.c5;

class NotificationDescriptionAdapter implements com.google.android.exoplayer2.ui.p {

    final MediaSessionManager f4779a;

    private NotificationDescriptionAdapter(MediaSessionManager mediaSessionManager) {
        this.f4779a = mediaSessionManager;
    }

    NotificationDescriptionAdapter(MediaSessionManager mediaSessionManager, AudioplayerHelperX audioplayerHelperX) {
        this(mediaSessionManager);
    }

    @Override
    public Bitmap a(c5 c5Var, com.google.android.exoplayer2.ui.l lVar) {
        return MediaSessionManager.c(this.f4779a);
    }

    @Override
    public PendingIntent b(c5 c5Var) {
        return MediaSessionManager.d(this.f4779a);
    }

    @Override
    public CharSequence c(c5 c5Var) {
        return f(c5Var);
    }

    @Override
    public CharSequence d(c5 c5Var) {
        return com.google.android.exoplayer2.ui.o.a(this, c5Var);
    }

    @Override
    public CharSequence e(c5 c5Var) {
        return g(c5Var);
    }

    public String f(c5 c5Var) {
        return MediaSessionManager.b(this.f4779a).m().f4808b;
    }

    public String g(c5 c5Var) {
        return MediaSessionManager.b(this.f4779a).m().f4807a;
    }
}
