package com.kuss.rewind;

import android.R;
import android.app.Activity;
import android.app.Dialog;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.animation.AlphaAnimation;
import android.view.animation.AnimationSet;
import java.lang.ref.WeakReference;
import java.util.Objects;

public abstract class SplashScreen {

    private static Dialog f4768a;

    private static WeakReference<Activity> f4769b;

    static Dialog a() {
        return f4768a;
    }

    static Dialog b(Dialog dialog) {
        f4768a = dialog;
        return dialog;
    }

    static WeakReference c() {
        return f4769b;
    }

    protected static Activity d() {
        try {
            return f4769b.get();
        } catch (Exception unused) {
            return null;
        }
    }

    public static void e(int i) {
        Activity activityD;
        if (Build.VERSION.SDK_INT < 31 && (activityD = d()) != null) {
            activityD.runOnUiThread(new RewindHelperD(i, activityD));
        }
    }

    static void f(int i, Activity activity) {
        Dialog dialog = f4768a;
        if (dialog == null || !dialog.isShowing()) {
            return;
        }
        AnimationSet animationSet = new AnimationSet(true);
        AlphaAnimation alphaAnimation = new AlphaAnimation(1.0f, 0.0f);
        alphaAnimation.setDuration(i);
        animationSet.addAnimation(alphaAnimation);
        Window window = f4768a.getWindow();
        Objects.requireNonNull(window);
        View childAt = ((ViewGroup) window.getDecorView()).getChildAt(0);
        childAt.startAnimation(animationSet);
        animationSet.setAnimationListener(new SplashAnimationListener(childAt, activity));
    }

    static void g(Activity activity) {
        if (d().isFinishing()) {
            return;
        }
        Dialog dialog = new Dialog(activity, R.style.Theme_Translucent_NoTitleBar_Fullscreen);
        f4768a = dialog;
        Window window = dialog.getWindow();
        Objects.requireNonNull(window);
        window.getDecorView().setSystemUiVisibility(3840);
        f4768a.setContentView(com.kuss.rewind.R.layout.activity_splash);
        f4768a.setCancelable(false);
        if (f4768a.isShowing()) {
            return;
        }
        f4768a.show();
    }

    public static void h(Activity activity) {
        if (Build.VERSION.SDK_INT < 31 && activity != null) {
            f4769b = new WeakReference<>(activity);
            activity.runOnUiThread(new RewindHelperC(activity));
        }
    }
}
