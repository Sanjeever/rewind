package com.modules.audioplayer;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.util.Log;
import com.brentvatne.react.ReactVideoViewManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import d.f.a.b.a5;
import d.f.a.b.b5;
import d.f.a.b.b6;
import d.f.a.b.c5;
import d.f.a.b.d5;
import d.f.a.b.d6;
import d.f.a.b.f4;
import d.f.a.b.i4;
import d.f.a.b.j2;
import d.f.a.b.p6.t1;
import d.f.a.b.r6.l0;
import d.f.a.b.u4;
import d.f.a.b.w4;
import d.f.a.b.z4;
import java.util.List;

public class RNAudioPlayerModule extends ReactContextBaseJavaModule {
    public static String EVENT_NAME = "AUDIO_FOCUS";
    private static final Object NULL = null;
    private final AudioFocusManager audioFocusManager;
    private final AudioVolumeManager audioMngHelper;
    private AudioServiceBinder audioServiceBinder;
    private final ReactContext context;
    private HeadsetReceiver mHeadSetReceiver;
    private final ServiceConnection serviceConnection;

    class InnerA implements ServiceConnection {
        InnerA() {
        }

        @Override
        public void onServiceConnected(ComponentName componentName, IBinder iBinder) {
            Log.i("ServiceConnnection", "Service connection audio service binder");
            RNAudioPlayerModule.access$002(RNAudioPlayerModule.this, (AudioServiceBinder) iBinder);
            RNAudioPlayerModule.access$000(RNAudioPlayerModule.this).a(RNAudioPlayerModule.access$100(RNAudioPlayerModule.this));
            Log.i("ServiceConnnection", "Service connection audio service binder complete");
        }

        @Override
        public void onServiceDisconnected(ComponentName componentName) {
            Log.i("ServiceConnnection", "Service disconnected");
        }
    }

    class InnerB implements c5.a {
        final AudioPlayer k;
        final Callback l;

        InnerB(AudioPlayer audioPlayer, Callback callback) {
            this.k = audioPlayer;
            this.l = callback;
        }

        @Override
        public void A(int i) {
            b5.p(this, i);
        }

        @Override
        public void B(boolean z, int i) {
            b5.s(this, z, i);
        }

        @Override
        public void C(boolean z) {
            b5.i(this, z);
        }

        @Override
        public void D(int i) {
            b5.t(this, i);
        }

        @Override
        public void E(d.f.a.b.h6.z zVar) {
            b5.a(this, zVar);
        }

        @Override
        public void H(d6 d6Var) {
            b5.D(this, d6Var);
        }

        @Override
        public void J(boolean z) {
            b5.g(this, z);
        }

        @Override
        public void K() {
            b5.v(this);
        }

        @Override
        public void L() {
            b5.x(this);
        }

        @Override
        public void M(f4 f4Var, int i) {
            b5.j(this, f4Var, i);
        }

        @Override
        public void O(u4 u4Var) {
            WritableMap writableMapCreateMap = Arguments.createMap();
            try {
                com.google.firebase.crashlytics.i.a().c(u4Var);
                PlayerEvents.a(RNAudioPlayerModule.access$100(RNAudioPlayerModule.this), this.k.j());
                writableMapCreateMap.putInt(ReactVideoViewManager.PROP_SRC_TYPE, u4Var.l);
                this.l.invoke(writableMapCreateMap, RNAudioPlayerModule.access$200());
            } catch (RuntimeException e2) {
                Log.e("RNSoundModule", "Exception", e2);
            }
        }

        @Override
        public void P(z4 z4Var) {
            b5.b(this, z4Var);
        }

        @Override
        public void R(b6 b6Var, int i) {
            b5.B(this, b6Var, i);
        }

        @Override
        public void S(float f2) {
            b5.F(this, f2);
        }

        @Override
        public void V(int i) {
            if (i == 3) {
                WritableMap writableMapCreateMap = Arguments.createMap();
                writableMapCreateMap.putDouble("duration", this.k.l() * 0.001d);
                try {
                    this.l.invoke(RNAudioPlayerModule.access$200(), writableMapCreateMap);
                } catch (RuntimeException e2) {
                    Log.e("RNSoundModule", "Exception", e2);
                } catch (Exception e3) {
                    e3.printStackTrace();
                }
            }
        }

        @Override
        public void W(boolean z, int i) {
            b5.m(this, z, i);
        }

        @Override
        public void Z(t1 t1Var, l0 l0Var) {
            b5.C(this, t1Var, l0Var);
        }

        @Override
        public void a0(j2 j2Var) {
            b5.d(this, j2Var);
        }

        @Override
        public void b(boolean z) {
            b5.z(this, z);
        }

        @Override
        public void c0(i4 i4Var) {
            b5.k(this, i4Var);
        }

        @Override
        public void d0(boolean z) {
            b5.y(this, z);
        }

        @Override
        public void e0(int i, int i2) {
            b5.A(this, i, i2);
        }

        @Override
        public void h0(c5 c5Var, a5 a5Var) {
            b5.f(this, c5Var, a5Var);
        }

        @Override
        public void i0(u4 u4Var) {
            b5.r(this, u4Var);
        }

        @Override
        public void j(int i) {
            b5.w(this, i);
        }

        @Override
        public void k(List list) {
            b5.c(list);
        }

        @Override
        public void m0(int i, boolean z) {
            b5.e(this, i, z);
        }

        @Override
        public void o0(boolean z) {
            b5.h(this, z);
        }

        @Override
        public void q(d.f.a.b.u6.l0 l0Var) {
            b5.E(this, l0Var);
        }

        @Override
        public void u(w4 w4Var) {
            b5.n(this, w4Var);
        }

        @Override
        public void v(d.f.a.b.o6.d dVar) {
            b5.l(this, dVar);
        }

        @Override
        public void z(d5 d5Var, d5 d5Var2, int i) {
            b5.u(this, d5Var, d5Var2, i);
        }
    }

    class InnerC implements c5.a {
        final Callback k;

        InnerC(Callback callback) {
            this.k = callback;
        }

        @Override
        public void A(int i) {
            b5.p(this, i);
        }

        @Override
        public void B(boolean z, int i) {
            b5.s(this, z, i);
        }

        @Override
        public void C(boolean z) {
            b5.i(this, z);
        }

        @Override
        public void D(int i) {
            b5.t(this, i);
        }

        @Override
        public void E(d.f.a.b.h6.z zVar) {
            b5.a(this, zVar);
        }

        @Override
        public void H(d6 d6Var) {
            b5.D(this, d6Var);
        }

        @Override
        public void J(boolean z) {
            b5.g(this, z);
        }

        @Override
        public void K() {
            b5.v(this);
        }

        @Override
        public void L() {
            b5.x(this);
        }

        @Override
        public void M(f4 f4Var, int i) {
            b5.j(this, f4Var, i);
        }

        @Override
        public void O(u4 u4Var) {
            b5.q(this, u4Var);
        }

        @Override
        public void P(z4 z4Var) {
            b5.b(this, z4Var);
        }

        @Override
        public void R(b6 b6Var, int i) {
            b5.B(this, b6Var, i);
        }

        @Override
        public void S(float f2) {
            b5.F(this, f2);
        }

        @Override
        public void V(int i) {
            if (i == 4) {
                try {
                    this.k.invoke(Boolean.TRUE);
                } catch (Exception e2) {
                    e2.printStackTrace();
                    this.k.invoke(Boolean.FALSE);
                }
            }
        }

        @Override
        public void W(boolean z, int i) {
            b5.m(this, z, i);
        }

        @Override
        public void Z(t1 t1Var, l0 l0Var) {
            b5.C(this, t1Var, l0Var);
        }

        @Override
        public void a0(j2 j2Var) {
            b5.d(this, j2Var);
        }

        @Override
        public void b(boolean z) {
            b5.z(this, z);
        }

        @Override
        public void c0(i4 i4Var) {
            b5.k(this, i4Var);
        }

        @Override
        public void d0(boolean z) {
            b5.y(this, z);
        }

        @Override
        public void e0(int i, int i2) {
            b5.A(this, i, i2);
        }

        @Override
        public void h0(c5 c5Var, a5 a5Var) {
            b5.f(this, c5Var, a5Var);
        }

        @Override
        public void i0(u4 u4Var) {
            b5.r(this, u4Var);
        }

        @Override
        public void j(int i) {
            b5.w(this, i);
        }

        @Override
        public void k(List list) {
            b5.c(list);
        }

        @Override
        public void m0(int i, boolean z) {
            b5.e(this, i, z);
        }

        @Override
        public void o0(boolean z) {
            b5.h(this, z);
        }

        @Override
        public void q(d.f.a.b.u6.l0 l0Var) {
            b5.E(this, l0Var);
        }

        @Override
        public void u(w4 w4Var) {
            b5.n(this, w4Var);
        }

        @Override
        public void v(d.f.a.b.o6.d dVar) {
            b5.l(this, dVar);
        }

        @Override
        public void z(d5 d5Var, d5 d5Var2, int i) {
            b5.u(this, d5Var, d5Var2, i);
        }
    }

    public class InnerD extends BroadcastReceiver {
        public InnerD() {
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            String stringExtra = intent.getStringExtra(ReactVideoViewManager.PROP_SRC_TYPE);
            WritableMap writableMapCreateMap = Arguments.createMap();
            if ("HeadSetReceiver".equals(stringExtra)) {
                RNAudioPlayerModule.access$000(RNAudioPlayerModule.this).c().z();
            }
            writableMapCreateMap.putString(ReactVideoViewManager.PROP_SRC_TYPE, stringExtra);
            PlayerEvents.d(RNAudioPlayerModule.access$300(RNAudioPlayerModule.this), RNAudioPlayerModule.EVENT_NAME, writableMapCreateMap);
        }
    }

    public RNAudioPlayerModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.audioServiceBinder = null;
        this.serviceConnection = new InnerA();
        this.context = reactApplicationContext;
        bindService();
        b.p.a.d.b(reactApplicationContext).c(new InnerD(), new IntentFilter(EVENT_NAME));
        this.audioMngHelper = new AudioVolumeManager(reactApplicationContext);
        this.audioFocusManager = new AudioFocusManager(reactApplicationContext);
        registerHeadSet(reactApplicationContext);
    }

    static AudioServiceBinder access$000(RNAudioPlayerModule rNAudioPlayerModule) {
        return rNAudioPlayerModule.audioServiceBinder;
    }

    static AudioServiceBinder access$002(RNAudioPlayerModule rNAudioPlayerModule, AudioServiceBinder audioServiceBinder) {
        rNAudioPlayerModule.audioServiceBinder = audioServiceBinder;
        return audioServiceBinder;
    }

    static ReactContext access$100(RNAudioPlayerModule rNAudioPlayerModule) {
        return rNAudioPlayerModule.context;
    }

    static Object access$200() {
        return NULL;
    }

    static ReactApplicationContext access$300(RNAudioPlayerModule rNAudioPlayerModule) {
        return rNAudioPlayerModule.getReactApplicationContext();
    }

    private void bindService() {
        if (this.audioServiceBinder == null) {
            this.context.bindService(new Intent(this.context, (Class<?>) AudioService.class), this.serviceConnection, 1);
        }
    }

    private void free() {
        AudioFocusManager audioFocusManager = this.audioFocusManager;
        if (audioFocusManager != null) {
            audioFocusManager.a();
        }
        HeadsetReceiver headsetReceiver = this.mHeadSetReceiver;
        if (headsetReceiver != null) {
            try {
                this.context.unregisterReceiver(headsetReceiver);
                this.mHeadSetReceiver = null;
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
    }

    private void lambda$getCurrentTime$0(Callback callback) {
        callback.invoke(Double.valueOf(this.audioServiceBinder.c().k() * 0.001d), Boolean.valueOf(this.audioServiceBinder.c().o()));
    }

    private void lambda$openEqualizer$1() {
        PlayerEvents.c(getCurrentActivity(), this.audioServiceBinder.c().j());
    }

    private void registerHeadSet(Context context) {
        this.mHeadSetReceiver = new HeadsetReceiver();
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("android.media.AUDIO_BECOMING_NOISY");
        intentFilter.addAction("android.intent.action.HEADSET_PLUG");
        intentFilter.addAction("android.bluetooth.headset.profile.action.CONNECTION_STATE_CHANGED");
        context.registerReceiver(this.mHeadSetReceiver, intentFilter);
    }

    private void unBoundService() {
        if (this.audioServiceBinder != null) {
            this.context.unbindService(this.serviceConnection);
        }
    }

    public void a(Callback callback) {
        lambda$getCurrentTime$0(callback);
    }

    public void b() {
        lambda$openEqualizer$1();
    }

    @ReactMethod
    public void enableControl(String str, boolean z) {
        com.google.android.exoplayer2.ui.t tVarM = this.audioServiceBinder.b().m();
        str.hashCode();
        switch (str) {
            case "playPause":
                tVarM.x(z);
                break;
            case "previousTrack":
                tVarM.y(z);
                break;
            case "seek":
                if (!z) {
                    this.audioServiceBinder.b().h();
                    break;
                }
                break;
            case "stop":
                tVarM.B(z);
                break;
            case "nextTrack":
                tVarM.v(z);
                break;
        }
    }

    @ReactMethod
    public void getCurrentTime(Callback callback) {
        if (this.audioServiceBinder.c() != null) {
            UiThreadUtil.runOnUiThread(new AudioplayerHelperK(this, callback));
        }
    }

    @Override
    public String getName() {
        return "RNAudioPlayer";
    }

    @ReactMethod
    public void getSystemVolume(Callback callback) {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putDouble(ReactVideoViewManager.PROP_VOLUME, this.audioMngHelper.a());
        try {
            callback.invoke(NULL, writableMapCreateMap);
        } catch (RuntimeException e2) {
            Log.e("RNSoundModule", "Exception", e2);
        } catch (Exception e3) {
            e3.printStackTrace();
        }
    }

    @Override
    public void initialize() {
        bindService();
    }

    @Override
    public void onCatalystInstanceDestroy() {
        if (this.audioServiceBinder.c() != null) {
            free();
            this.audioServiceBinder.c().B();
            unBoundService();
        }
    }

    @ReactMethod
    public void openEqualizer() {
        UiThreadUtil.runOnUiThread(new AudioplayerHelperL(this));
    }

    @ReactMethod
    public void pause(Callback callback) {
        this.audioServiceBinder.c().z();
        callback.invoke(new Object[0]);
    }

    @ReactMethod
    public void play(Callback callback) {
        AudioFocusManager audioFocusManager = this.audioFocusManager;
        if (audioFocusManager != null) {
            audioFocusManager.b();
        }
        this.audioServiceBinder.c().f(new InnerC(callback));
        this.audioServiceBinder.c().F();
    }

    @ReactMethod
    public void prepare(String str, Callback callback) {
        this.audioServiceBinder.b().t(Boolean.FALSE);
        AudioPlayer audioPlayerC = this.audioServiceBinder.c();
        audioPlayerC.A(str);
        audioPlayerC.f(new InnerB(audioPlayerC, callback));
    }

    @ReactMethod
    public void release() {
        free();
        this.audioServiceBinder.c().B();
    }

    @ReactMethod
    public void setCurrentTime(Float f2, boolean z) {
        this.audioServiceBinder.c().C(Math.round(f2.floatValue() * 1000.0f), z);
    }

    @ReactMethod
    public void setNowPlaying(ReadableMap readableMap) {
        this.audioServiceBinder.c().D(new TrackInfo(readableMap.hasKey("title") ? readableMap.getString("title") : null, readableMap.hasKey("artist") ? readableMap.getString("artist") : null, readableMap.hasKey("album") ? readableMap.getString("album") : null, readableMap.hasKey("artwork") ? readableMap.getString("artwork") : null, readableMap.hasKey("base64") && readableMap.getBoolean("base64")));
    }

    @ReactMethod
    public void setSystemVolume(int i) {
        this.audioMngHelper.d(i);
    }

    @ReactMethod
    public void setVolume(Float f2, Float f3) {
        this.audioServiceBinder.c().E(f2.floatValue());
    }

    @ReactMethod
    public void showSystemStreamVolumeUI() {
        this.audioMngHelper.e();
    }

    @ReactMethod
    public void updatePlayback(ReadableMap readableMap) {
        try {
            this.audioServiceBinder.b().t(Boolean.FALSE);
            setNowPlaying(readableMap);
            this.audioServiceBinder.b().m().o();
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }
}
