package com.modules.recyclerViewList;

import android.content.Context;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;

class RecyclerViewListHelperH extends ViewGroup {
    private RecyclerViewListHelperF.InnerA k;
    private int l;
    private int m;
    private View.OnLayoutChangeListener n;

    public RecyclerViewListHelperH(Context context, RecyclerViewListHelperF.InnerA innerA) {
        super(context);
        this.n = new RecyclerViewListHelperG(this);
        this.k = innerA;
        this.m = 10;
        this.l = 10;
    }

    public RecyclerViewListHelperF.InnerA a() {
        return this.k;
    }

    @Override
    protected void onLayout(boolean z, int i, int i2, int i3, int i4) {
    }

    @Override
    protected void onMeasure(int i, int i2) {
        if (getChildCount() <= 0) {
            setMeasuredDimension(this.l, this.m);
            return;
        }
        View childAt = getChildAt(0);
        this.l = childAt.getMeasuredWidth();
        int measuredHeight = childAt.getMeasuredHeight();
        this.m = measuredHeight;
        setMeasuredDimension(this.l, measuredHeight);
    }

    @Override
    public boolean onTouchEvent(MotionEvent motionEvent) {
        return true;
    }

    @Override
    public void onViewAdded(View view) {
        super.onViewAdded(view);
        view.addOnLayoutChangeListener(this.n);
    }

    @Override
    public void onViewRemoved(View view) {
        super.onViewRemoved(view);
        view.removeOnLayoutChangeListener(this.n);
    }
}
