package com.modules.audioplayer;

import d.f.a.b.c5;

public final class AudioplayerHelperH implements Runnable {
    public final PlaybackPreparer k;
    public final c5 l;

    public AudioplayerHelperH(PlaybackPreparer playbackPreparer, c5 c5Var) {
        this.k = playbackPreparer;
        this.l = c5Var;
    }

    @Override
    public final void run() {
        this.k.c(this.l);
    }
}
