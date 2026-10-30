package com.modules.recyclerViewList;

import android.view.View;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.m0;

public class RecyclerViewItemViewManager extends ViewGroupManager<RecyclerViewListHelperI> {
    private static String REACT_CLASS = "RecyclerViewItemView";

    @Override
    protected RecyclerViewListHelperI createViewInstance(m0 m0Var) {
        return new RecyclerViewListHelperI(m0Var);
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @com.facebook.react.uimanager.c3.a(name = "itemIndex")
    public void setItemIndex(RecyclerViewListHelperI recyclerViewListHelperI, int i) {
        recyclerViewListHelperI.setItemIndex(i);
    }
}
