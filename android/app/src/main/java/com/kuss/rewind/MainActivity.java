package com.kuss.rewind;

import android.app.Activity;
import android.app.Application;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import b.f.n.i;
import com.modules.shutdown.RNShutdownModule;
import d.e.m.u;

public class MainActivity extends u {

    class InnerA implements Application.ActivityLifecycleCallbacks {
        InnerA() {
        }

        @Override
        public void onActivityCreated(Activity activity, Bundle bundle) {
        }

        @Override
        public void onActivityDestroyed(Activity activity) {
            if (activity.getClass() == MainActivity.class) {
                Log.d("REWIND", "shutdown");
                RNShutdownModule.staticFire(activity);
            }
        }

        @Override
        public void onActivityPaused(Activity activity) {
        }

        @Override
        public void onActivityResumed(Activity activity) {
        }

        @Override
        public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
        }

        @Override
        public void onActivityStarted(Activity activity) {
        }

        @Override
        public void onActivityStopped(Activity activity) {
        }
    }

    @Override
    public void a() {
        moveTaskToBack(true);
    }

    @Override
    protected String d() {
        return "rewind";
    }

    @Override
    protected void onCreate(Bundle bundle) {
        i.c(this);
        int i = Build.VERSION.SDK_INT;
        boolean z = i >= 31;
        super.onCreate(null);
        if (!z) {
            SplashScreen.h(this);
        }
        if (i >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
        }
        getApplication().registerActivityLifecycleCallbacks(new InnerA());
    }
}
