package com.kuss.rewind;

import android.app.Activity;

public final class RewindHelperB implements Runnable {
    public final Activity k;

    public RewindHelperB(Activity activity) {
        this.k = activity;
    }

    @Override
    public final void run() {
        SplashAnimationListener.a(this.k);
    }
}
