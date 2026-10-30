package com.modules.audioplayer;

import android.content.Context;
import android.util.Log;
import com.facebook.react.bridge.UiThreadUtil;
import d.f.a.b.c5;
import d.f.a.b.n2;
import d.f.a.b.o2;
import java.util.Timer;
import me.zhanghai.android.materialprogressbar.BuildConfig;

public class AudioPlayer {

    private o2 f4797c;

    private Timer f4800f;
    private c5.a g;
    private final Context h;
    private TrackInfo i;

    private final int f4795a = 100;

    private final float f4796b = 0.15f;

    private float f4798d = 0.0f;

    private float f4799e = 0.0f;

    public AudioPlayer(Context context) {
        this.h = context;
        o2 o2VarA = new n2(context).a();
        this.f4797c = o2VarA;
        o2VarA.Y(new d.f.a.b.h6.y().f(1).c(2).a(), false);
        this.f4797c.c(2);
        PlayerEvents.b(context, this.f4797c.getAudioSessionId());
    }

    private void G() {
        if (this.f4797c == null) {
            return;
        }
        g();
        this.f4800f = new Timer(true);
        FadeOutTask fadeOutTask = new FadeOutTask(this);
        Timer timer = this.f4800f;
        if (timer != null) {
            timer.schedule(fadeOutTask, 100L, 100L);
        }
    }

    private void H() {
        if (this.f4797c == null) {
            return;
        }
        g();
        this.f4800f = new Timer(true);
        FadeInTask fadeInTask = new FadeInTask(this);
        Timer timer = this.f4800f;
        if (timer != null) {
            timer.schedule(fadeInTask, 100L, 100L);
        }
    }

    static void a(AudioPlayer audioPlayer) {
        audioPlayer.h();
    }

    static float b(AudioPlayer audioPlayer) {
        return audioPlayer.f4798d;
    }

    static void c(AudioPlayer audioPlayer) {
        audioPlayer.g();
    }

    static void d(AudioPlayer audioPlayer) {
        audioPlayer.i();
    }

    static o2 e(AudioPlayer audioPlayer) {
        return audioPlayer.f4797c;
    }

    private void g() {
        try {
            Timer timer = this.f4800f;
            if (timer != null) {
                timer.cancel();
                this.f4800f.purge();
                this.f4800f = null;
            }
            this.f4799e = 0.0f;
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    private void h() {
        float f2 = this.f4799e + 0.15f;
        this.f4799e = f2;
        float fA = d.f.a.d.v.a.a(this.f4798d, 1.0f, f2);
        this.f4798d = fA;
        E(fA);
    }

    private void i() {
        float f2 = this.f4799e + 0.15f;
        this.f4799e = f2;
        float fA = d.f.a.d.v.a.a(this.f4798d, 0.0f, f2);
        this.f4798d = fA;
        E(fA);
    }

    private void p(String str) {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            o2Var.l(true);
            this.f4797c.b(MediaSourceFactory.a(this.h, str));
            this.f4797c.f();
        }
    }

    private void r() {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            PlayerEvents.a(this.h, o2Var.getAudioSessionId());
            this.f4797c.a();
            this.f4797c = null;
        }
    }

    private void t(int i) {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            o2Var.o(i);
        }
    }

    private void v(float f2) {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            o2Var.j(f2);
        }
    }

    private void x() {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            o2Var.h();
        }
    }

    public void A(String str) {
        if (str == null) {
            Log.e("AudioPlayer", "没有可用资源");
        } else {
            UiThreadUtil.runOnUiThread(new AudioplayerHelperC(this, str));
        }
    }

    public void B() {
        Log.d("AudioPlayer", BuildConfig.BUILD_TYPE);
        UiThreadUtil.runOnUiThread(new AudioplayerHelperB(this));
    }

    public void C(int i, boolean z) {
        this.f4798d = 0.0f;
        if (z) {
            G();
        }
        UiThreadUtil.runOnUiThread(new AudioplayerHelperF(this, i));
    }

    public void D(TrackInfo trackInfo) {
        this.i = trackInfo;
    }

    public void E(float f2) {
        UiThreadUtil.runOnUiThread(new AudioplayerHelperE(this, f2));
    }

    public void F() {
        UiThreadUtil.runOnUiThread(new AudioplayerHelperD(this));
        G();
    }

    public void f(c5.a aVar) {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            c5.a aVar2 = this.g;
            if (aVar2 != null) {
                o2Var.G(aVar2);
            }
            this.f4797c.s(aVar);
            this.g = aVar;
        }
    }

    public int j() {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            return o2Var.getAudioSessionId();
        }
        return -1;
    }

    public long k() {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            return o2Var.getCurrentPosition();
        }
        return -1L;
    }

    public long l() {
        o2 o2Var = this.f4797c;
        if (o2Var != null) {
            return o2Var.getDuration();
        }
        return -1L;
    }

    public TrackInfo m() {
        return this.i;
    }

    public o2 n() {
        return this.f4797c;
    }

    public boolean o() {
        o2 o2Var = this.f4797c;
        return o2Var != null && o2Var.isPlaying();
    }

    public void q(String str) {
        p(str);
    }

    public void s() {
        r();
    }

    public void u(int i) {
        t(i);
    }

    public void w(float f2) {
        v(f2);
    }

    public void y() {
        x();
    }

    public void z() {
        H();
    }
}
