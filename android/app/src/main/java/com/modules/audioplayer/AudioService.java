package com.modules.audioplayer;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

public class AudioService extends Service {
    private final AudioServiceBinder k = new AudioServiceBinder(this);

    @Override
    public IBinder onBind(Intent intent) {
        return this.k;
    }

    @Override
    public void onTaskRemoved(Intent intent) {
        super.onTaskRemoved(intent);
        stopForeground(true);
        stopSelf();
    }
}
