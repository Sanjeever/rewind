package com.modules.tabviewpager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

class TabviewpagerHelperC extends com.facebook.react.uimanager.events.b<TabviewpagerHelperC> {

    private final int f4822f;

    protected TabviewpagerHelperC(int i, int i2) {
        super(i);
        this.f4822f = i2;
    }

    private WritableMap m() {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putInt("position", this.f4822f);
        return writableMapCreateMap;
    }

    @Override
    public void c(RCTEventEmitter rCTEventEmitter) {
        rCTEventEmitter.receiveEvent(i(), f(), m());
    }

    @Override
    public String f() {
        return "topPageSelected";
    }
}
