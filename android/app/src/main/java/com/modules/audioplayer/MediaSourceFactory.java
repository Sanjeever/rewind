package com.modules.audioplayer;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import d.f.a.b.f4;
import d.f.a.b.p6.c1;
import d.f.a.b.p6.p0;
import d.f.a.b.s6.m0;
import d.f.a.b.t6.j0;
import d.f.a.b.t6.n1;
import java.io.File;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class MediaSourceFactory {

    private static d.f.a.b.i6.c f4805a;

    private static d.f.a.b.s6.e2.f0 f4806b;

    public static p0 a(Context context, String str) {
        d.f.a.b.s6.a0 a0VarB;
        String strF0 = n1.f0(context, "rewind");
        if (e(d(str))) {
            a0VarB = new m0(context);
        } else {
            d.f.a.b.s6.p0 p0Var = new d.f.a.b.s6.p0();
            p0Var.d(strF0);
            p0Var.c(true);
            a0VarB = b(context, p0Var);
        }
        return new c1(a0VarB, new d.f.a.b.m6.o().d(true).f(8).e(1)).a(f4.c(str));
    }

    private static d.f.a.b.s6.a0 b(Context context, d.f.a.b.s6.a0 a0Var) {
        if (f4805a == null && f4806b == null) {
            f4806b = new d.f.a.b.s6.e2.f0(new File(context.getExternalCacheDir(), "audio-cache"), new d.f.a.b.s6.e2.c0(c(context)), f4805a);
            f4805a = new d.f.a.b.i6.c(context);
        }
        d.f.a.b.s6.e2.k kVar = new d.f.a.b.s6.e2.k();
        kVar.d(f4806b);
        kVar.g(a0Var);
        kVar.f(2);
        kVar.e(new CacheKeyFactory(null));
        return kVar;
    }

    private static long c(Context context) {
        String strD;
        SQLiteDatabase readableDatabase = com.facebook.react.modules.storage.c.g0(context).getReadableDatabase();
        if (readableDatabase == null || (strD = com.facebook.react.modules.storage.a.d(readableDatabase, "maxCacheSize")) == null) {
            return 209715200L;
        }
        try {
            String string = new JSONObject(strD).getString("rawData");
            j0.b("TEST@MediaSourceHelper", string);
            return Long.parseLong(string) * 1048576;
        } catch (JSONException e2) {
            e2.printStackTrace();
            return 209715200L;
        }
    }

    private static Uri d(String str) {
        return Uri.parse(str);
    }

    private static boolean e(Uri uri) {
        if (uri == null) {
            return false;
        }
        String scheme = uri.getScheme();
        String host = uri.getHost();
        return scheme == null || scheme.equals("file") || scheme.equals("android.resource") || scheme.equals("content") || scheme.equals("rawresource") || scheme.equals("res") || host == null || host.equals("localhost") || host.equals("127.0.0.1") || host.equals("[::1]");
    }
}
