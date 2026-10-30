package com.modules.recyclerViewList;

import android.view.View;

class RecyclerViewListHelperG implements View.OnLayoutChangeListener {
    final RecyclerViewListHelperH k;

    RecyclerViewListHelperG(RecyclerViewListHelperH recyclerViewListHelperH) {
        this.k = recyclerViewListHelperH;
    }

    @Override
    public void onLayoutChange(View view, int i, int i2, int i3, int i4, int i5, int i6, int i7, int i8) {
        if (i8 - i6 == i4 - i2 || this.k.getParent() == null) {
            return;
        }
        this.k.requestLayout();
        ((View) this.k.getParent()).requestLayout();
    }
}
