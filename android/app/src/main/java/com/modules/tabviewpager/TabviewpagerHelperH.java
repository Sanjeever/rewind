package com.modules.tabviewpager;

import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import b.x.a.q;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import java.util.List;

public class TabviewpagerHelperH extends q {
    private String[] v0;
    private TabviewpagerHelperG w0;
    private final com.facebook.react.uimanager.events.h x0;
    private boolean y0;
    private boolean z0;

    public TabviewpagerHelperH(ReactContext reactContext) {
        super(reactContext);
        this.z0 = true;
        this.x0 = ((UIManagerModule) reactContext.getNativeModule(UIManagerModule.class)).getEventDispatcher();
        this.y0 = false;
        setOnPageChangeListener(new TabviewpagerHelperF(this, null));
        setAdapter(new TabviewpagerHelperE(this, null));
    }

    static ViewGroup.LayoutParams S(TabviewpagerHelperH tabviewpagerHelperH) {
        return tabviewpagerHelperH.generateDefaultLayoutParams();
    }

    static String[] T(TabviewpagerHelperH tabviewpagerHelperH) {
        return tabviewpagerHelperH.v0;
    }

    static TabviewpagerHelperG U(TabviewpagerHelperH tabviewpagerHelperH) {
        return tabviewpagerHelperH.w0;
    }

    static com.facebook.react.uimanager.events.h V(TabviewpagerHelperH tabviewpagerHelperH) {
        return tabviewpagerHelperH.x0;
    }

    static boolean W(TabviewpagerHelperH tabviewpagerHelperH) {
        return tabviewpagerHelperH.y0;
    }

    void X(View view, int i) {
        getAdapter().t(view, i);
    }

    View Y(int i) {
        return getAdapter().u(i);
    }

    void Z(int i) {
        getAdapter().v(i);
    }

    public void a0(int i, boolean z) {
        this.y0 = true;
        N(i, z);
        this.y0 = false;
    }

    @Override
    public TabviewpagerHelperE getAdapter() {
        return (TabviewpagerHelperE) super.getAdapter();
    }

    int getViewCountInAdapter() {
        return getAdapter().d();
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent motionEvent) {
        if (!this.z0 || !super.onInterceptTouchEvent(motionEvent)) {
            return false;
        }
        com.facebook.react.uimanager.events.j.a(this, motionEvent);
        return true;
    }

    @Override
    public boolean onTouchEvent(MotionEvent motionEvent) {
        if (this.z0) {
            return super.onTouchEvent(motionEvent);
        }
        return false;
    }

    public void setPageNames(String[] strArr) {
        this.v0 = strArr;
    }

    public void setParentIdCallback(TabviewpagerHelperG tabviewpagerHelperG) {
        this.w0 = tabviewpagerHelperG;
    }

    public void setScrollEnabled(boolean z) {
        this.z0 = z;
    }

    public void setViews(List<View> list) {
        getAdapter().w(list);
    }
}
