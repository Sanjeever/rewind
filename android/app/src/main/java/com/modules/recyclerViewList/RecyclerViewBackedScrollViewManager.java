package com.modules.recyclerViewList;

import android.view.View;
import android.view.ViewGroup;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.m0;
import com.facebook.react.views.scroll.k;
import java.util.Map;

public class RecyclerViewBackedScrollViewManager extends ViewGroupManager<RecyclerViewListHelperF> {
    public static final int COMMAND_NOTIFY_DATASET_CHANGED = 3;
    public static final int COMMAND_NOTIFY_ITEM_RANGE_INSERTED = 1;
    public static final int COMMAND_NOTIFY_ITEM_RANGE_REMOVED = 2;
    public static final int COMMAND_SCROLL_TO_INDEX = 4;
    public static final String REACT_CLASS = "AndroidRecyclerViewBackedScrollView";
    private static final String TAG = "RecyclerViewManager";

    public void addView(RecyclerViewListHelperF recyclerViewListHelperF, View view, int i) {
        d.e.k.a.a.b(view instanceof RecyclerViewListHelperI, "Views attached to RecyclerViewBackedScrollView must be RecyclerViewItemView views.");
        recyclerViewListHelperF.y1((RecyclerViewListHelperI) view, i);
    }

    @Override
    protected RecyclerViewListHelperF createViewInstance(m0 m0Var) {
        return new RecyclerViewListHelperF(m0Var);
    }

    public View getChildAt(RecyclerViewListHelperF recyclerViewListHelperF, int i) {
        return recyclerViewListHelperF.z1(i);
    }

    public int getChildCount(RecyclerViewListHelperF recyclerViewListHelperF) {
        return recyclerViewListHelperF.getChildCountFromAdapter();
    }

    @Override
    public Map<String, Integer> getCommandsMap() {
        return com.facebook.react.common.g.g("notifyItemRangeInserted", 1, "notifyItemRangeRemoved", 2, "notifyDataSetChanged", 3, "scrollToIndex", 4);
    }

    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return com.facebook.react.common.g.a().b(k.valueOf("SCROLL").a(), com.facebook.react.common.g.d("registrationName", "onScroll")).b("topContentSizeChange", com.facebook.react.common.g.d("registrationName", "onContentSizeChange")).b("visibleItemsChange", com.facebook.react.common.g.d("registrationName", "onVisibleItemsChange")).a();
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    public void receiveCommand(RecyclerViewListHelperF recyclerViewListHelperF, int i, ReadableArray readableArray) {
        d.e.k.a.a.c(recyclerViewListHelperF);
        d.e.k.a.a.c(readableArray);
        if (i == 1) {
            int i2 = readableArray.getInt(0);
            int i3 = readableArray.getInt(1);
            RecyclerViewListHelperF.InnerA innerA = (RecyclerViewListHelperF.InnerA) recyclerViewListHelperF.getAdapter();
            innerA.J(innerA.f() + i3);
            innerA.n(i2, i3);
            return;
        }
        if (i == 2) {
            int i4 = readableArray.getInt(0);
            int i5 = readableArray.getInt(1);
            RecyclerViewListHelperF.InnerA innerA2 = (RecyclerViewListHelperF.InnerA) recyclerViewListHelperF.getAdapter();
            innerA2.J(innerA2.f() - i5);
            innerA2.o(i4, i5);
            return;
        }
        if (i == 3) {
            ((RecyclerViewListHelperF.InnerA) recyclerViewListHelperF.getAdapter()).J(readableArray.getInt(0));
            recyclerViewListHelperF.getAdapter().k();
        } else {
            if (i != 4) {
                throw new IllegalArgumentException(String.format("Unsupported command %d received by %s.", Integer.valueOf(i), getClass().getSimpleName()));
            }
            boolean z = readableArray.getBoolean(0);
            int i6 = readableArray.getInt(1);
            float f2 = (float) readableArray.getDouble(2);
            boolean z2 = readableArray.getBoolean(3);
            if (z) {
                recyclerViewListHelperF.C1(i6, f2, z2);
            } else {
                recyclerViewListHelperF.h1(i6);
            }
        }
    }

    public void removeViewAt(RecyclerViewListHelperF recyclerViewListHelperF, int i) {
        recyclerViewListHelperF.B1(i);
    }

    @com.facebook.react.uimanager.c3.a(defaultBoolean = true, name = "isScrollOverMode")
    public void setIsOverScrollMode(RecyclerViewListHelperF recyclerViewListHelperF, boolean z) {
        if (z) {
            return;
        }
        recyclerViewListHelperF.setOverScrollMode(2);
    }

    @com.facebook.react.uimanager.c3.a(defaultBoolean = true, name = "itemAnimatorEnabled")
    public void setItemAnimatorEnabled(RecyclerViewListHelperF recyclerViewListHelperF, boolean z) {
        recyclerViewListHelperF.setItemAnimatorEnabled(z);
    }

    @com.facebook.react.uimanager.c3.a(name = "itemCount")
    public void setItemCount(RecyclerViewListHelperF recyclerViewListHelperF, int i) {
        recyclerViewListHelperF.setItemCount(i);
        recyclerViewListHelperF.getAdapter().k();
    }

    @com.facebook.react.uimanager.c3.a(defaultBoolean = true, name = "showVerticalScrollBar")
    public void showScrollBars(RecyclerViewListHelperF recyclerViewListHelperF, boolean z) {
        recyclerViewListHelperF.setVerticalScrollBarEnabled(z);
    }
}
