package com.modules.hidenavbar;

import android.app.Activity;
import android.os.Build;
import android.view.Window;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RNHideNavbarModule extends ReactContextBaseJavaModule {
    public RNHideNavbarModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    private void lambda$transparentStatusBar$0(Activity activity) {
        transparent(activity);
    }

    private void transparent(Activity activity) {
        try {
            int i = Build.VERSION.SDK_INT;
            if (i >= 21) {
                Window window = activity.getWindow();
                window.clearFlags(67108864);
                window.getDecorView().setSystemUiVisibility(1280);
                window.addFlags(Integer.MIN_VALUE);
                window.setStatusBarColor(0);
            } else if (i >= 19) {
                activity.getWindow().addFlags(67108864);
            }
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    public void a(Activity activity) {
        lambda$transparentStatusBar$0(activity);
    }

    @Override
    public String getName() {
        return "RNHideNavbar";
    }

    @ReactMethod
    public void transparentStatusBar() {
        try {
            Activity currentActivity = getCurrentActivity();
            if (currentActivity != null) {
                currentActivity.runOnUiThread(new HidenavbarPackage(this, currentActivity));
            }
        } catch (NullPointerException e2) {
            e2.printStackTrace();
        }
    }
}
