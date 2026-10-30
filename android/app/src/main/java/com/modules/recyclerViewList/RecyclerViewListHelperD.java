package com.modules.recyclerViewList;

import android.content.Context;
import android.graphics.PointF;
import android.util.DisplayMetrics;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.y;

class RecyclerViewListHelperD extends y {
    final float q;
    final RecyclerViewListHelperF r;

    RecyclerViewListHelperD(RecyclerViewListHelperF recyclerViewListHelperF, Context context, float f2) {
        super(context);
        this.r = recyclerViewListHelperF;
        this.q = f2;
    }

    @Override
    protected int B() {
        return -1;
    }

    @Override
    public PointF a(int i) {
        return ((LinearLayoutManager) e()).a(i);
    }

    @Override
    protected float v(DisplayMetrics displayMetrics) {
        float f2 = this.q;
        return f2 > 0.0f ? f2 / displayMetrics.densityDpi : super.v(displayMetrics);
    }
}
