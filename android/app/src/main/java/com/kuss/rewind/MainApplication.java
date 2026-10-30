package com.kuss.rewind;

import android.app.Application;
import android.webkit.WebView;
import b.q.i;
import com.RNFetchBlob.j;
import com.bolan9999.t;
import com.facebook.soloader.SoLoader;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerModule;
import com.modules.audioTagger.AudioTaggerHelperB;
import com.modules.audioplayer.C0013g0;
import com.modules.crypto.CryptoPackage;
import com.modules.devmenu.DevmenuHelperB;
import com.modules.extradimensions.ExtradimensionsPackage;
import com.modules.hidenavbar.HidenavbarHelperB;
import com.modules.info.InfoPackage;
import com.modules.intentVideo.IntentVideoPackage;
import com.modules.language.LanguagePackage;
import com.modules.mediastore.MediastorePackage;
import com.modules.orientation.OrientationPackage;
import com.modules.recyclerViewList.RecyclerViewListPackage;
import com.modules.restart.RestartHelperD;
import com.modules.shutdown.ShutdownPackage;
import com.modules.splash.SplashPackage;
import com.modules.tabviewpager.TabviewpagerHelperK;
import com.modules.timer.TimerHelperC;
import com.modules.toast.ToastPackage;
import com.modules.wakelock.WakelockHelperB;
import d.e.m.o0;
import d.e.m.p0;
import d.e.m.x0.x;
import d.e.m.y;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends i implements y {
    private final o0 k = new InnerA(this);

    class InnerA extends o0 {
        InnerA(Application application) {
            super(application);
        }

        @Override
        protected String e() {
            return "index";
        }

        @Override
        protected List<p0> g() {
            return Arrays.asList(new x(), new dog.craftz.sqlite_2.a(), new com.reactnativecommunity.slider.e(), new com.brentvatne.react.a(), new d.a.a.b(), new ShutdownPackage(), new SplashPackage(), new com.reactnativecommunity.cookies.a(), new com.BV.LinearGradient.a(), new com.masteratul.exceptionhandler.d(), new com.airbnb.android.react.lottie.c(), new com.reactnative.ivpusic.imagepicker.e(), new t(), new j(), new TabviewpagerHelperK(), new RestartHelperD(), new RecyclerViewListPackage(), new C0013g0(), new ExtradimensionsPackage(), new TimerHelperC(), new OrientationPackage(), new com.oblador.vectoricons.a(), new MediastorePackage(), new WakelockHelperB(), new CryptoPackage(), new HidenavbarHelperB(), new IntentVideoPackage(), new AudioTaggerHelperB(), new LanguagePackage(), new DevmenuHelperB(this), new InfoPackage(), new org.reactnative.fadingedge.b(), new ToastPackage());
        }

        @Override
        public boolean k() {
            return false;
        }
    }

    @Override
    public o0 a() {
        return this.k;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.f(this, false);
        ReactNativeExceptionHandlerModule.replaceErrorScreenActivityClass(ErrorActivity.class);
        WebView.setWebContentsDebuggingEnabled(true);
    }
}
