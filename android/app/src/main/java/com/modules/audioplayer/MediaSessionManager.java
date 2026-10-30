package com.modules.audioplayer;

import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import d.f.a.b.c5;
import com.kuss.rewind.R;
import org.jaudiotagger.tag.mp4.atom.Mp4NameBox;

public class MediaSessionManager {

    public static String f4782a = "rewind_channel";

    public static int f4783b = 1984;

    private final Service f4784c;

    private final AudioPlayer f4785d;

    private final ReactContext f4786e;

    private Thread f4787f;
    private Bitmap g;
    private boolean h = false;
    private com.google.android.exoplayer2.ui.t i;
    private d.f.a.b.l6.a.n j;

    MediaSessionManager(Service service, AudioPlayer audioPlayer, ReactContext reactContext) {
        this.f4785d = audioPlayer;
        this.f4784c = service;
        this.f4786e = reactContext;
    }

    static void a(MediaSessionManager mediaSessionManager, String str) {
        mediaSessionManager.i(str);
    }

    static AudioPlayer b(MediaSessionManager mediaSessionManager) {
        return mediaSessionManager.f4785d;
    }

    static Bitmap c(MediaSessionManager mediaSessionManager) {
        return mediaSessionManager.g;
    }

    static PendingIntent d(MediaSessionManager mediaSessionManager) {
        return mediaSessionManager.k();
    }

    static Service e(MediaSessionManager mediaSessionManager) {
        return mediaSessionManager.f4784c;
    }

    static MediaMetadataCompat f(MediaSessionManager mediaSessionManager) {
        return mediaSessionManager.l();
    }

    private void i(String str) {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putString(Mp4NameBox.IDENTIFIER, str);
        PlayerEvents.d(this.f4786e, "NOTIFICATION_ACTION_EVENT", writableMapCreateMap);
    }

    private Bitmap j() {
        if (!this.h) {
            TrackInfo trackInfoM = this.f4785d.m();
            String str = trackInfoM.f4810d;
            boolean z = trackInfoM.f4811e;
            if (str != null) {
                s(str, z);
            }
        }
        Bitmap bitmap = this.g;
        if (bitmap != null && bitmap.isRecycled()) {
            this.g = null;
        }
        return this.g;
    }

    private PendingIntent k() {
        Intent launchIntentForPackage = this.f4786e.getPackageManager().getLaunchIntentForPackage(this.f4786e.getPackageName());
        return Build.VERSION.SDK_INT >= 31 ? PendingIntent.getActivity(this.f4786e, 0, launchIntentForPackage, 33554432) : PendingIntent.getActivity(this.f4786e, 0, launchIntentForPackage, 0);
    }

    private MediaMetadataCompat l() {
        TrackInfo trackInfoM = this.f4785d.m();
        if (trackInfoM == null) {
            return null;
        }
        MediaMetadataCompat.b bVar = new MediaMetadataCompat.b();
        bVar.f("android.media.metadata.TITLE", trackInfoM.f4807a);
        bVar.f("android.media.metadata.ARTIST", trackInfoM.f4808b);
        bVar.f("android.media.metadata.ALBUM", trackInfoM.f4809c);
        bVar.c("android.media.metadata.DURATION", this.f4785d.l() == -9223372036854775807L ? -1L : this.f4785d.l());
        Bitmap bitmapJ = j();
        bVar.e("android.media.metadata.ART_URI", trackInfoM.f4810d);
        bVar.b("android.media.metadata.ART", bitmapJ);
        return bVar.a();
    }

    static MediaMetadataCompat n(c5 c5Var) {
        return null;
    }

    private void o() {
        this.j.E();
        this.h = true;
    }

    private void q(boolean z, String str) {
        Bitmap bitmapA = z ? com.kuss.rewind.g.a.a(str) : com.kuss.rewind.g.a.b(str);
        if (bitmapA != null) {
            this.g = bitmapA;
            this.i.o();
            UiThreadUtil.runOnUiThread(new AudioplayerHelperI(this));
        }
    }

    private void s(String str, boolean z) {
        Thread thread = this.f4787f;
        if (thread != null && thread.isAlive()) {
            this.f4787f.interrupt();
            this.g = null;
        }
        Thread thread2 = new Thread(new AudioplayerHelperJ(this, z, str));
        this.f4787f = thread2;
        thread2.start();
    }

    void g() {
        com.google.android.exoplayer2.ui.t tVar = this.i;
        if (tVar != null) {
            tVar.t(null);
        }
        com.google.android.exoplayer2.ui.t tVarA = new PlaybackNotificationBuilder(this.f4784c, f4783b, f4782a).c(R.string.channelName).b(R.string.channelDesc).e(new NotificationDescriptionAdapter(this, null)).f(new NotificationListener(this)).j(R.drawable.ic_rewind_small).i(R.drawable.previous).k(R.drawable.stop).g(R.drawable.pause).h(R.drawable.play).d(R.drawable.next).a();
        this.i = tVarA;
        tVarA.u(0);
        this.i.A(false);
        this.i.w(true);
        this.i.z(true);
        MediaSessionCompat mediaSessionCompat = new MediaSessionCompat(this.f4786e, "RewindPlayer");
        mediaSessionCompat.e(true);
        this.i.s(mediaSessionCompat.c());
        d.f.a.b.l6.a.n nVar = new d.f.a.b.l6.a.n(mediaSessionCompat);
        this.j = nVar;
        nVar.J(new QueueDescriptionProvider(this, null));
        this.j.I(new PlaybackPreparer(this, null));
        MediaSessionCallback mediaSessionCallback = new MediaSessionCallback(this, this.f4785d.n());
        this.j.K(mediaSessionCallback);
        this.i.t(mediaSessionCallback);
    }

    public void h() {
        d.f.a.b.l6.a.n nVar = this.j;
        if (nVar != null) {
            nVar.J(AudioplayerHelperG.f4788a);
        }
    }

    public com.google.android.exoplayer2.ui.t m() {
        return this.i;
    }

    public void p() {
        o();
    }

    public void r(boolean z, String str) {
        q(z, str);
    }

    public void t(Boolean bool) {
        Thread thread = this.f4787f;
        if (thread != null && thread.isAlive()) {
            this.f4787f.interrupt();
        }
        this.h = bool.booleanValue();
    }
}
