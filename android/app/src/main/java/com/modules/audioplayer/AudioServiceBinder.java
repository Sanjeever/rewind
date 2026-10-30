package com.modules.audioplayer;

import android.app.Service;
import android.os.Binder;
import com.facebook.react.bridge.ReactContext;

public class AudioServiceBinder extends Binder {

    private final Service f4801a;

    private AudioPlayer f4802b;

    private MediaSessionManager f4803c;

    AudioServiceBinder(Service service) {
        this.f4801a = service;
    }

    public void a(ReactContext reactContext) {
        this.f4802b = new AudioPlayer(reactContext);
        MediaSessionManager mediaSessionManager = new MediaSessionManager(this.f4801a, this.f4802b, reactContext);
        this.f4803c = mediaSessionManager;
        mediaSessionManager.g();
    }

    public MediaSessionManager b() {
        return this.f4803c;
    }

    public AudioPlayer c() {
        return this.f4802b;
    }
}
