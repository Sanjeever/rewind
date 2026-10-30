package com.modules.audioplayer;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Bitmap;
import d.f.a.b.c5;

class PlaybackNotificationManager extends com.google.android.exoplayer2.ui.t {
    protected PlaybackNotificationManager(Context context, String str, int i, com.google.android.exoplayer2.ui.p pVar, com.google.android.exoplayer2.ui.r rVar, com.google.android.exoplayer2.ui.n nVar, int i2, int i3, int i4, int i5, int i6, int i7, int i8, int i9, String str2) {
        super(context, str, i, pVar, rVar, nVar, i2, i3, i4, i5, i6, i7, i8, i9, str2);
    }

    @Override
    @SuppressLint({"WrongConstant"})
    protected androidx.core.app.s i(c5 c5Var, androidx.core.app.s sVar, boolean z, Bitmap bitmap) {
        if (sVar != null) {
            sVar.r(1);
            sVar.w(1);
        }
        return super.i(c5Var, sVar, z, bitmap);
    }
}
