package com.modules.devmenu;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import d.e.m.o0;
import d.e.m.p0;
import java.util.Collections;
import java.util.List;

public class DevmenuHelperB implements p0 {

    private final o0 f4815a;

    public DevmenuHelperB(o0 o0Var) {
        this.f4815a = o0Var;
    }

    @Override
    public List<NativeModule> c(ReactApplicationContext reactApplicationContext) {
        return Collections.singletonList(new DevMenu(reactApplicationContext, this.f4815a));
    }

    @Override
    public List<ViewManager> d(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
