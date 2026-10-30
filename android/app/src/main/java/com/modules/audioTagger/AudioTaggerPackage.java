package com.modules.audioTagger;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;

public final class AudioTaggerPackage implements Runnable {
    public final RNAudioTaggerModule k;
    public final String l;
    public final ReadableMap m;
    public final Promise n;

    public AudioTaggerPackage(RNAudioTaggerModule rNAudioTaggerModule, String str, ReadableMap readableMap, Promise promise) {
        this.k = rNAudioTaggerModule;
        this.l = str;
        this.m = readableMap;
        this.n = promise;
    }

    @Override
    public final void run() {
        this.k.a(this.l, this.m, this.n);
    }
}
