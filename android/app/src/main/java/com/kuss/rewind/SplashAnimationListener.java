package com.kuss.rewind;

import android.app.Activity;
import android.view.View;
import android.view.animation.Animation;

class SplashAnimationListener implements Animation.AnimationListener {

    final View f4766a;

    final Activity f4767b;

    SplashAnimationListener(View view, Activity activity) {
        this.f4766a = view;
        this.f4767b = activity;
    }

    static void a(Activity activity) {
        if (!activity.isFinishing() && !activity.isDestroyed()) {
            SplashScreen.a().dismiss();
            SplashScreen.c().clear();
        }
        SplashScreen.b(null);
    }

    @Override
    public void onAnimationEnd(Animation animation) {
        this.f4766a.post(new RewindHelperB(this.f4767b));
    }

    @Override
    public void onAnimationRepeat(Animation animation) {
    }

    @Override
    public void onAnimationStart(Animation animation) {
    }
}
