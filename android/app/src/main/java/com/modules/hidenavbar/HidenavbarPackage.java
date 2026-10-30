package com.modules.hidenavbar;

import android.app.Activity;

public final class HidenavbarPackage implements Runnable {
    public final RNHideNavbarModule k;
    public final Activity l;

    public HidenavbarPackage(RNHideNavbarModule rNHideNavbarModule, Activity activity) {
        this.k = rNHideNavbarModule;
        this.l = activity;
    }

    @Override
    public final void run() {
        this.k.a(this.l);
    }
}
