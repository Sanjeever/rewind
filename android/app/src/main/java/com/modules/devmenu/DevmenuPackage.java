package com.modules.devmenu;

public final class DevmenuPackage implements Runnable {
    public final DevMenu k;

    public DevmenuPackage(DevMenu devMenu) {
        this.k = devMenu;
    }

    @Override
    public final void run() {
        this.k.a();
    }
}
