package com.modules.audioplayer;

import android.content.Context;
import android.media.AudioManager;

public class AudioVolumeManager {

    private final AudioManager f4793a;

    private final int f4794b = 3;

    public AudioVolumeManager(Context context) {
        this.f4793a = (AudioManager) context.getSystemService("audio");
    }

    public int a() {
        return (b() * 100) / c();
    }

    public int b() {
        try {
            return this.f4793a.getStreamVolume(3);
        } catch (NullPointerException e2) {
            e2.printStackTrace();
            return 0;
        }
    }

    public int c() {
        try {
            return this.f4793a.getStreamMaxVolume(3);
        } catch (NullPointerException e2) {
            e2.printStackTrace();
            return 0;
        }
    }

    public void d(int i) {
        this.f4793a.setStreamVolume(3, Math.min(100, Math.max(0, (int) Math.ceil(((double) (i * c())) * 0.01d))), 0);
    }

    public void e() {
        this.f4793a.setStreamVolume(3, b(), 1);
    }
}
