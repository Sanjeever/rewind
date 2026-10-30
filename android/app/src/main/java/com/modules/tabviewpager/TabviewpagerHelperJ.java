package com.modules.tabviewpager;

import android.content.Context;
import android.view.View;
import android.widget.LinearLayout;
import b.f.p.j1;
import com.facebook.react.bridge.ReactContext;
import d.f.a.d.b0.p;

public class TabviewpagerHelperJ extends LinearLayout {
    private TabviewpagerHelperH k;
    private p l;

    public TabviewpagerHelperJ(Context context) {
        super(context);
        this.k = null;
        this.l = null;
    }

    public void a(View view, int i) {
        this.k.X(view, i);
    }

    public View b(int i) {
        return this.k.Y(i);
    }

    public void c() {
    }

    public void d(int i) {
        this.k.Z(i);
    }

    public void e(int i, boolean z) {
        this.k.a0(i, z);
    }

    public int getViewCountInAdapter() {
        return this.k.getViewCountInAdapter();
    }

    public void setPageMargin(int i) {
        this.k.setPageMargin(i);
    }

    public void setScrollEnabled(boolean z) {
        this.k.setScrollEnabled(z);
    }

    public void setTabBackgroundColor(int i) {
        this.l.setBackgroundColor(i);
    }

    public void setTabElevation(float f2) {
        j1.y0(this.l, f2);
    }

    public void setTabGravity(String str) {
        p pVar;
        int i;
        if ("center".equalsIgnoreCase(str)) {
            pVar = this.l;
            i = 1;
        } else {
            pVar = this.l;
            i = 0;
        }
        pVar.setTabMode(i);
    }

    public void setTabIndicatorColor(int i) {
        this.l.setSelectedTabIndicatorColor(i);
    }

    public void setTabIndicatorHeight(float f2) {
        this.l.setSelectedTabIndicatorHeight((int) f2);
    }

    public void setTabMode(String str) {
        p pVar;
        int i;
        if ("scrollable".equalsIgnoreCase(str)) {
            pVar = this.l;
            i = 0;
        } else {
            pVar = this.l;
            i = 1;
        }
        pVar.setTabMode(i);
    }

    public void setTabNames(String[] strArr) {
        this.k.setPageNames(strArr);
    }

    public void setTabSelectedTextColor(int i) {
        this.l.H(this.l.getTabTextColors().getColorForState(LinearLayout.EMPTY_STATE_SET, i), i);
    }

    public void setTabTextColor(int i) {
        this.l.H(i, this.l.getTabTextColors().getColorForState(LinearLayout.SELECTED_STATE_SET, i));
    }

    void setup(ReactContext reactContext) {
        setOrientation(1);
        TabviewpagerHelperH tabviewpagerHelperH = new TabviewpagerHelperH(reactContext);
        this.k = tabviewpagerHelperH;
        tabviewpagerHelperH.setParentIdCallback(new TabviewpagerHelperI(this));
        p pVar = new p(reactContext);
        this.l = pVar;
        pVar.setTabMode(0);
        LinearLayout.LayoutParams layoutParams = new LinearLayout.LayoutParams(-1, -1, 1.0f);
        addView(this.l, new LinearLayout.LayoutParams(-1, -2));
        addView(this.k, layoutParams);
        this.l.setupWithViewPager(this.k);
    }
}
