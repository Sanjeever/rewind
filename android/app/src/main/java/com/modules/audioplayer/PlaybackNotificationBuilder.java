package com.modules.audioplayer;

import android.content.Context;
import d.f.a.b.t6.a1;

class PlaybackNotificationBuilder extends com.google.android.exoplayer2.ui.m {
    public PlaybackNotificationBuilder(Context context, int i, String str) {
        super(context, i, str);
    }

    @Override
    public com.google.android.exoplayer2.ui.t a() {
        int i = this.g;
        if (i != 0) {
            a1.a(this.a, this.c, i, this.h, this.i);
        }
        return new PlaybackNotificationManager(this.a, this.c, this.b, this.f, this.d, this.e, this.j, this.l, this.m, this.n, this.k, this.o, this.p, this.q, this.r);
    }
}
