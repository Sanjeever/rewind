package com.modules.wakelock;

import android.app.Activity;

public final class WakelockPackage implements Runnable {
    public final RNWakeLockModule.InnerB k;
    public final Activity l;

    public WakelockPackage(RNWakeLockModule.InnerB innerB, Activity activity) {
        this.k = innerB;
        this.l = activity;
    }

    @Override
    public final void run() {
        RNWakeLockModule.lambda$bindScreenOnFlag$0(this.k, this.l);
    }
}
