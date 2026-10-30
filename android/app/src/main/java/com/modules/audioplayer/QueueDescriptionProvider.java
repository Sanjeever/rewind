package com.modules.audioplayer;

import android.support.v4.media.MediaMetadataCompat;
import d.f.a.b.c5;

class QueueDescriptionProvider implements d.f.a.b.l6.a.i {

    final MediaSessionManager f4780a;

    private QueueDescriptionProvider(MediaSessionManager mediaSessionManager) {
        this.f4780a = mediaSessionManager;
    }

    QueueDescriptionProvider(MediaSessionManager mediaSessionManager, AudioplayerHelperX audioplayerHelperX) {
        this(mediaSessionManager);
    }

    @Override
    public MediaMetadataCompat a(c5 c5Var) {
        return MediaSessionManager.f(this.f4780a);
    }

    @Override
    public boolean b(MediaMetadataCompat mediaMetadataCompat, MediaMetadataCompat mediaMetadataCompat2) {
        return d.f.a.b.l6.a.h.a(this, mediaMetadataCompat, mediaMetadataCompat2);
    }
}
