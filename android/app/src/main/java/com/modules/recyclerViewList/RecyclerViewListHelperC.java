package com.modules.recyclerViewList;

import android.content.Context;
import android.graphics.PointF;
import android.util.DisplayMetrics;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.y;

class RecyclerViewListHelperC extends y {
    final float q;
    final RecyclerViewListHelperF r;

    RecyclerViewListHelperC(RecyclerViewListHelperF recyclerViewListHelperF, Context context, float f2) {
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
    public int s(int i, int i2, int i3, int i4, int i5) {
        return (i3 + ((i4 - i3) / 2)) - (i + (i2 - i));
    }

    @Override
    protected float v(DisplayMetrics displayMetrics) {
        float f2 = this.q;
        return f2 > 0.0f ? f2 / displayMetrics.densityDpi : super.v(displayMetrics);
    }
}
