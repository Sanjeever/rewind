package com.modules.audioplayer;

import android.support.v4.media.MediaMetadataCompat;
import d.f.a.b.c5;

public final class AudioplayerHelperG implements d.f.a.b.l6.a.i {

    public static final AudioplayerHelperG f4788a = new AudioplayerHelperG();

    private AudioplayerHelperG() {
    }

    @Override
    public final MediaMetadataCompat a(c5 c5Var) {
        MediaSessionManager.n(c5Var);
        return null;
    }

    @Override
    public boolean b(MediaMetadataCompat mediaMetadataCompat, MediaMetadataCompat mediaMetadataCompat2) {
        return d.f.a.b.l6.a.h.a(this, mediaMetadataCompat, mediaMetadataCompat2);
    }
}
