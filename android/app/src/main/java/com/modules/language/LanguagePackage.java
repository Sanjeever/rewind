package com.modules.language;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import d.e.m.p0;
import java.util.Collections;
import java.util.List;

public class LanguagePackage implements p0 {
    @Override
    public List<NativeModule> c(ReactApplicationContext reactApplicationContext) {
        return Collections.singletonList(new RNLanguageModule(reactApplicationContext));
    }

    @Override
    public List<ViewManager> d(ReactApplicationContext reactApplicationContext) {
        return Collections.emptyList();
    }
}
