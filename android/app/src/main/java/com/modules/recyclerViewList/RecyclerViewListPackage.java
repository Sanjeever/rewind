package com.modules.recyclerViewList;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import d.e.m.p0;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class RecyclerViewListPackage implements p0 {
    @Override
    public List<NativeModule> c(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> d(ReactApplicationContext reactApplicationContext) {
        return Arrays.asList(new RecyclerViewBackedScrollViewManager(), new RecyclerViewItemViewManager());
    }
}
