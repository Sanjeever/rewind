package com.modules.tabviewpager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

class TabviewpagerPackage extends com.facebook.react.uimanager.events.b<TabviewpagerPackage> {

    private final int f4820f;
    private final float g;

    protected TabviewpagerPackage(int i, int i2, float f2) {
        super(i);
        this.f4820f = i2;
        this.g = (Float.isInfinite(f2) || Float.isNaN(f2)) ? 0.0f : f2;
    }

    private WritableMap m() {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putInt("position", this.f4820f);
        writableMapCreateMap.putDouble("offset", this.g);
        return writableMapCreateMap;
    }

    @Override
    public void c(RCTEventEmitter rCTEventEmitter) {
        rCTEventEmitter.receiveEvent(i(), f(), m());
    }

    @Override
    public String f() {
        return "topPageScroll";
    }
}
