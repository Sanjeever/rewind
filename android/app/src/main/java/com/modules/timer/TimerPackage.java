package com.modules.timer;

public final class TimerPackage implements Runnable {
    public final BackgroundTimerModule k;
    public final int l;

    public TimerPackage(BackgroundTimerModule backgroundTimerModule, int i) {
        this.k = backgroundTimerModule;
        this.l = i;
    }

    @Override
    public final void run() {
        this.k.a(this.l);
    }
}
