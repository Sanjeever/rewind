package com.modules.recyclerViewList;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class RecyclerViewListHelperJ extends com.facebook.react.uimanager.events.b<RecyclerViewListHelperJ> {

    private final int f4819f;
    private final int g;

    public RecyclerViewListHelperJ(int i, long j, int i2, int i3) {
        super(i);
        this.f4819f = i2;
        this.g = i3;
    }

    @Override
    public void c(RCTEventEmitter rCTEventEmitter) {
        WritableMap writableMapCreateMap = Arguments.createMap();
        writableMapCreateMap.putInt("firstIndex", this.f4819f);
        writableMapCreateMap.putInt("lastIndex", this.g);
        rCTEventEmitter.receiveEvent(i(), "visibleItemsChange", writableMapCreateMap);
    }

    @Override
    public String f() {
        return "visibleItemsChange";
    }
}
