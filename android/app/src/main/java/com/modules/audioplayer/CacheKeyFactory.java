package com.modules.audioplayer;

import android.net.Uri;

class CacheKeyFactory implements d.f.a.b.s6.e2.q {
    private CacheKeyFactory() {
    }

    CacheKeyFactory(AudioplayerHelperT audioplayerHelperT) {
        this();
    }

    @Override
    public String a(d.f.a.b.s6.h0 h0Var) {
        Uri uri = h0Var.a;
        String lastPathSegment = uri.getLastPathSegment();
        return lastPathSegment == null ? uri.toString() : lastPathSegment;
    }
}
