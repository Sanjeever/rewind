package com.modules.timer;

public final class TimerHelperB implements Runnable {
    public final BackgroundTimerModule k;
    public final long l;

    public TimerHelperB(BackgroundTimerModule backgroundTimerModule, long j) {
        this.k = backgroundTimerModule;
        this.l = j;
    }

    @Override
    public final void run() {
        this.k.b(this.l);
    }
}
