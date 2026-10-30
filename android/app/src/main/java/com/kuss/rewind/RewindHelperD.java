package com.kuss.rewind;

import android.app.Activity;

public final class RewindHelperD implements Runnable {
    public final int k;
    public final Activity l;

    public RewindHelperD(int i, Activity activity) {
        this.k = i;
        this.l = activity;
    }

    @Override
    public final void run() {
        SplashScreen.f(this.k, this.l);
    }
}
