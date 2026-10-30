package com.modules.audioplayer;

import d.f.a.b.c5;
import d.f.a.b.l3;

class MediaSessionCallback extends l3 {

    final MediaSessionManager f4812b;
    private final c5 delegate;

    public MediaSessionCallback(MediaSessionManager mediaSessionManager, c5 c5Var) {
        super(c5Var);
        this.f4812b = mediaSessionManager;
        this.delegate = c5Var;
    }

    @Override public long D() { return delegate.D(); }
    @Override public int N() { return delegate.N(); }
    @Override public void R(int start, int end) { delegate.R(start, end); }
    @Override public long X() { return delegate.X(); }
    @Override public void a() { delegate.a(); }
    @Override public void j(float volume) { delegate.j(volume); }
    @Override public void o(long position) { delegate.o(position); }
    @Override public long q() { return delegate.q(); }
    @Override public d.f.a.b.z4 v() { return delegate.v(); }

    @Override
    public void C(boolean z) {
        MediaSessionManager.a(this.f4812b, "stop");
        super.C(true);
    }

    @Override
    public void T() {
        MediaSessionManager.a(this.f4812b, "nextTrack");
    }

    @Override
    public void W() {
        MediaSessionManager.a(this.f4812b, "previousTrack");
    }

    @Override
    public void h() {
        MediaSessionManager.a(this.f4812b, "play");
    }

    @Override
    public void l(boolean z) {
        MediaSessionManager.a(this.f4812b, z ? "play" : "pause");
        super.l(z);
    }

    @Override
    public void pause() {
        MediaSessionManager.a(this.f4812b, "pause");
    }
}
