package com.modules.restart;

import d.e.m.m0;

public final class RestartPackage implements Runnable {
    public final ReactNativeRestart k;
    public final m0 l;

    public RestartPackage(ReactNativeRestart reactNativeRestart, m0 m0Var) {
        this.k = reactNativeRestart;
        this.l = m0Var;
    }

    @Override
    public final void run() {
        this.k.a(this.l);
    }
}
