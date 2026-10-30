package com.modules.tabviewpager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

class TabviewpagerHelperB extends com.facebook.react.uimanager.events.b<TabviewpagerHelperB> {

    private final String f4821f;

    protected TabviewpagerHelperB(int i, String str) {
        super(i);
        this.f4821f = str;
    }

    private WritableMap m() {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putString("pageScrollState", this.f4821f);
        return writableMapCreateMap;
    }

    @Override
    public void c(RCTEventEmitter rCTEventEmitter) {
        rCTEventEmitter.receiveEvent(i(), f(), m());
    }

    @Override
    public String f() {
        return "topPageScrollStateChanged";
    }
}
