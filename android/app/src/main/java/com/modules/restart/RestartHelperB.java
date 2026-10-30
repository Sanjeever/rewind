package com.modules.restart;

import android.app.Activity;

public final class RestartHelperB implements Runnable {
    public final Activity k;

    public RestartHelperB(Activity activity) {
        this.k = activity;
    }

    @Override
    public final void run() {
        this.k.recreate();
    }
}
