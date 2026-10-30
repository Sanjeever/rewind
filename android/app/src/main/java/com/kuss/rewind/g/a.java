package com.kuss.rewind.g;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import d.e.e.g;
import d.e.g.a.a.c;
import d.e.j.f.l;
import d.e.j.k.b;
import d.e.j.o.e;

public abstract class a {
    public static Bitmap a(String str) {
        if (str == null) {
            return null;
        }
        byte[] bArrDecode = Base64.decode(str, 0);
        return BitmapFactory.decodeByteArray(bArrDecode, 0, bArrDecode.length);
    }

    public static Bitmap b(String str) {
        g<d.e.d.h.d<b>> gVarD;
        if (str == null) {
            return null;
        }
        l lVarA = c.a();
        e eVarA = d.e.j.o.g.s(Uri.parse(str)).a();
        if (lVarA.n(eVarA)) {
            Log.d("TEST", "in memory cache");
            gVarD = lVarA.h(eVarA, null);
        } else if (lVarA.q(eVarA)) {
            Log.d("TEST", "in disk cache");
            gVarD = lVarA.e(eVarA, null, d.e.j.o.d.valueOf("DISK_CACHE"));
        } else {
            Log.d("TEST", "in newly");
            gVarD = lVarA.d(eVarA, null);
        }
        try {
            d.e.d.h.d dVar = (d.e.d.h.d) d.e.e.l.c(gVarD);
            if (dVar != null) {
                try {
                    b bVar = (b) dVar.j0();
                    if (bVar instanceof d.e.j.k.a) {
                        Bitmap bitmapR = ((d.e.j.k.a) bVar).R();
                        if (!bitmapR.isRecycled()) {
                            dVar.close();
                            gVarD.close();
                            return bitmapR;
                        }
                    }
                } catch (Throwable th) {
                    try {
                        dVar.close();
                    } catch (Throwable th2) {
                        th.addSuppressed(th2);
                    }
                    throw th;
                }
            }
            if (dVar != null) {
                dVar.close();
            }
        } catch (Throwable th3) {
            try {
                th3.printStackTrace();
            } finally {
                gVarD.close();
            }
        }
        return null;
    }
}
