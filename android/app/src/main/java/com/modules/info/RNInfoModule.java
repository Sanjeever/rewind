package com.modules.info;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.kuss.rewind.BuildConfig;
import java.util.HashMap;
import java.util.Map;

public class RNInfoModule extends ReactContextBaseJavaModule {
    public RNInfoModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    @Override
    public Map<String, Object> getConstants() {
        HashMap map = new HashMap();
        Boolean bool = Boolean.FALSE;
        map.put("versionCode", BuildConfig.VERSION_CODE);
        map.put("versionName", BuildConfig.VERSION_NAME);
        map.put("applicationId", BuildConfig.APPLICATION_ID);
        map.put("isDebug", bool);
        return map;
    }

    @Override
    public String getName() {
        return "RNInfo";
    }
}
