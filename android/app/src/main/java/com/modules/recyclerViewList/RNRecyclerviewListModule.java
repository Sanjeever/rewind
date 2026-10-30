package com.modules.recyclerViewList;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNRecyclerviewListModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public RNRecyclerviewListModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        this.reactContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return "RNRecyclerviewList";
    }
}
