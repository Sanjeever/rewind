package com.kuss.rewind;

import android.app.Activity;

public final class RewindHelperC implements Runnable {
    public final Activity k;

    public RewindHelperC(Activity activity) {
        this.k = activity;
    }

    @Override
    public final void run() {
        SplashScreen.g(this.k);
    }
}
