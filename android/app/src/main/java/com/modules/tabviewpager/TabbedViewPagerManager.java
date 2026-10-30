package com.modules.tabviewpager;

import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.m0;
import com.facebook.react.uimanager.v;
import java.util.Map;

public class TabbedViewPagerManager extends ViewGroupManager<TabviewpagerHelperJ> {
    public static final int COMMAND_SET_PAGE = 1;
    public static final int COMMAND_SET_PAGE_WITHOUT_ANIMATION = 2;
    protected static final String REACT_CLASS = "TabbedViewPager";

    public void addView(TabviewpagerHelperJ tabviewpagerHelperJ, View view, int i) {
        tabviewpagerHelperJ.a(view, i);
    }

    @Override
    protected TabviewpagerHelperJ createViewInstance(m0 m0Var) {
        TabviewpagerHelperJ tabviewpagerHelperJ = new TabviewpagerHelperJ(m0Var);
        tabviewpagerHelperJ.setup(m0Var);
        return tabviewpagerHelperJ;
    }

    public View getChildAt(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        return tabviewpagerHelperJ.b(i);
    }

    public int getChildCount(TabviewpagerHelperJ tabviewpagerHelperJ) {
        return tabviewpagerHelperJ.getViewCountInAdapter();
    }

    @Override
    public Map<String, Integer> getCommandsMap() {
        return com.facebook.react.common.g.e("setPage", 1, "setPageWithoutAnimation", 2);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return com.facebook.react.common.g.f("topPageScroll", com.facebook.react.common.g.d("registrationName", "onPageScroll"), "topPageScrollStateChanged", com.facebook.react.common.g.d("registrationName", "onPageScrollStateChanged"), "topPageSelected", com.facebook.react.common.g.d("registrationName", "onPageSelected"));
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public boolean needsCustomLayoutForChildren() {
        return true;
    }

    public void onDropViewInstance(TabviewpagerHelperJ tabviewpagerHelperJ) {
        super.onDropViewInstance(tabviewpagerHelperJ);
        tabviewpagerHelperJ.c();
    }

    public void receiveCommand(TabviewpagerHelperJ tabviewpagerHelperJ, int i, ReadableArray readableArray) {
        d.e.k.a.a.c(tabviewpagerHelperJ);
        d.e.k.a.a.c(readableArray);
        if (i == 1) {
            tabviewpagerHelperJ.e(readableArray.getInt(0), true);
        } else {
            if (i != 2) {
                throw new IllegalArgumentException(String.format("Unsupported command %d received by %s.", Integer.valueOf(i), getClass().getSimpleName()));
            }
            tabviewpagerHelperJ.e(readableArray.getInt(0), false);
        }
    }

    public void removeViewAt(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        tabviewpagerHelperJ.d(i);
    }

    @com.facebook.react.uimanager.c3.a(defaultFloat = 0.0f, name = "pageMargin")
    public void setPageMargin(TabviewpagerHelperJ tabviewpagerHelperJ, float f2) {
        tabviewpagerHelperJ.setPageMargin((int) v.c(f2));
    }

    @com.facebook.react.uimanager.c3.a(defaultBoolean = true, name = "scrollEnabled")
    public void setScrollEnabled(TabviewpagerHelperJ tabviewpagerHelperJ, boolean z) {
        tabviewpagerHelperJ.setScrollEnabled(z);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabBackground")
    public void setTabBackground(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        tabviewpagerHelperJ.setTabBackgroundColor(i);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabElevation")
    public void setTabElevation(TabviewpagerHelperJ tabviewpagerHelperJ, float f2) {
        tabviewpagerHelperJ.setTabElevation(v.c(f2));
    }

    @com.facebook.react.uimanager.c3.a(name = "tabGravity")
    public void setTabGravity(TabviewpagerHelperJ tabviewpagerHelperJ, String str) {
        tabviewpagerHelperJ.setTabGravity(str);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabIndicatorColor")
    public void setTabIndicatorColor(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        tabviewpagerHelperJ.setTabIndicatorColor(i);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabIndicatorHeight")
    public void setTabIndicatorHeight(TabviewpagerHelperJ tabviewpagerHelperJ, float f2) {
        tabviewpagerHelperJ.setTabIndicatorHeight(v.c(f2));
    }

    @com.facebook.react.uimanager.c3.a(name = "tabNames")
    public void setTabNames(TabviewpagerHelperJ tabviewpagerHelperJ, ReadableArray readableArray) {
        String[] strArr = new String[readableArray.size()];
        for (int i = 0; i < readableArray.size(); i++) {
            strArr[i] = readableArray.getString(i);
        }
        tabviewpagerHelperJ.setTabNames(strArr);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabMode")
    public void setTabProperties(TabviewpagerHelperJ tabviewpagerHelperJ, String str) {
        tabviewpagerHelperJ.setTabMode(str);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabSelectedTextColor")
    public void setTabSelectedTextColor(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        tabviewpagerHelperJ.setTabSelectedTextColor(i);
    }

    @com.facebook.react.uimanager.c3.a(name = "tabTextColor")
    public void setTabTextColor(TabviewpagerHelperJ tabviewpagerHelperJ, int i) {
        tabviewpagerHelperJ.setTabTextColor(i);
    }
}
