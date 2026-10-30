package com.modules.recyclerViewList;

import android.content.Context;
import android.view.ViewGroup;

public class RecyclerViewListHelperI extends ViewGroup {
    private int k;
    private boolean l;

    public RecyclerViewListHelperI(Context context) {
        super(context);
    }

    public int getItemIndex() {
        return this.k;
    }

    @Override
    protected void onLayout(boolean z, int i, int i2, int i3, int i4) {
    }

    public void setItemIndex(int i) {
        if (!this.l || this.k == i) {
            this.k = i;
        } else {
            this.k = i;
            if (getParent() != null) {
                ((RecyclerViewListHelperH) getParent()).a().l(this.k);
                ((RecyclerViewListHelperH) getParent()).a().l(i);
            }
        }
        this.l = true;
    }
}
