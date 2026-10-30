package com.modules.extradimensions;

import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

public class ExtraDimensionsModule extends ReactContextBaseJavaModule {
    public ExtraDimensionsModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    private float getRealHeight(DisplayMetrics displayMetrics) {
        return displayMetrics.heightPixels / displayMetrics.density;
    }

    private float getSoftMenuBarHeight() {
        ReactApplicationContext reactApplicationContext = getReactApplicationContext();
        DisplayMetrics displayMetrics = reactApplicationContext.getResources().getDisplayMetrics();
        try {
            Display.class.getMethod("getRealMetrics", DisplayMetrics.class).invoke(((WindowManager) getReactApplicationContext().getSystemService("window")).getDefaultDisplay(), displayMetrics);
        } catch (IllegalAccessException | NoSuchMethodException | InvocationTargetException e2) {
            e2.printStackTrace();
        }
        float realHeight = getRealHeight(displayMetrics);
        DisplayMetrics displayMetrics2 = reactApplicationContext.getResources().getDisplayMetrics();
        ((WindowManager) reactApplicationContext.getSystemService("window")).getDefaultDisplay().getMetrics(displayMetrics);
        return Math.max(0.0f, realHeight - (displayMetrics2.heightPixels / displayMetrics.density));
    }

    @Override
    public Map<String, Object> getConstants() {
        HashMap map = new HashMap();
        map.put("SOFT_MENU_BAR_HEIGHT", Float.valueOf(getSoftMenuBarHeight()));
        return map;
    }

    @Override
    public String getName() {
        return "ExtraDimensions";
    }
}
