package com.modules.recyclerViewList;

import android.content.Context;
import android.view.ContextThemeWrapper;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.n;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.views.scroll.k;
import java.util.ArrayList;
import java.util.List;
import com.kuss.rewind.R;

public class RecyclerViewListHelperF extends RecyclerView {
    private boolean V0;
    private int W0;
    private int X0;
    private boolean Y0;

    static class InnerA extends RecyclerView.h<RecyclerViewListHelperE> {

        private final RecyclerViewListHelperF f4817e;

        private final List<RecyclerViewListHelperI> f4816d = new ArrayList();

        private int f4818f = 0;

        public InnerA(RecyclerViewListHelperF recyclerViewListHelperF) {
            this.f4817e = recyclerViewListHelperF;
        }

        public void B(RecyclerViewListHelperI recyclerViewListHelperI, int i) {
            this.f4816d.add(i, recyclerViewListHelperI);
            l(recyclerViewListHelperI.getItemIndex());
        }

        public View C(int i) {
            return this.f4816d.get(i);
        }

        public RecyclerViewListHelperI D(int i) {
            for (int i2 = 0; i2 < this.f4816d.size(); i2++) {
                if (this.f4816d.get(i2).getItemIndex() == i) {
                    return this.f4816d.get(i2);
                }
            }
            return null;
        }

        public int E() {
            return this.f4816d.size();
        }

        public void F(RecyclerViewListHelperE recyclerViewListHelperE, int i) {
            RecyclerViewListHelperH recyclerViewListHelperH = (RecyclerViewListHelperH) recyclerViewListHelperE.l;
            RecyclerViewListHelperI recyclerViewListHelperID = D(i);
            if (recyclerViewListHelperID == null || recyclerViewListHelperID.getParent() == recyclerViewListHelperH) {
                return;
            }
            if (recyclerViewListHelperID.getParent() != null) {
                ((ViewGroup) recyclerViewListHelperID.getParent()).removeView(recyclerViewListHelperID);
            }
            recyclerViewListHelperH.addView(recyclerViewListHelperID, 0);
        }

        public RecyclerViewListHelperE G(ViewGroup viewGroup, int i) {
            return new RecyclerViewListHelperE(new RecyclerViewListHelperH(viewGroup.getContext(), this));
        }

        public void H(RecyclerViewListHelperE recyclerViewListHelperE) {
            super.x(recyclerViewListHelperE);
            ((RecyclerViewListHelperH) recyclerViewListHelperE.l).removeAllViews();
        }

        public void I(int i) {
            if (this.f4816d.get(i) != null) {
                this.f4816d.remove(i);
            }
        }

        public void J(int i) {
            this.f4818f = i;
        }

        @Override
        public int f() {
            return this.f4818f;
        }

        @Override
        public void q(RecyclerViewListHelperE e0Var, int i) {
            F(e0Var, i);
        }

        @Override
        public RecyclerViewListHelperE s(ViewGroup viewGroup, int i) {
            return G(viewGroup, i);
        }

        @Override
        public void x(RecyclerViewListHelperE e0Var) {
            H(e0Var);
        }
    }

    public RecyclerViewListHelperF(Context context) {
        super(new ContextThemeWrapper(context, R.style.ScrollbarRecyclerView));
        this.Y0 = false;
        setHasFixedSize(true);
        ((n) getItemAnimator()).Q(false);
        setLayoutManager(new LinearLayoutManager(context));
        setAdapter(new InnerA(this));
    }

    private RecyclerView.a0 A1(float f2, boolean z) {
        return z ? new RecyclerViewListHelperC(this, getContext(), f2) : new RecyclerViewListHelperD(this, getContext(), f2);
    }

    private ReactContext getReactContext() {
        return (ReactContext) ((ContextThemeWrapper) getContext()).getBaseContext();
    }

    static boolean x1(RecyclerViewListHelperF recyclerViewListHelperF, boolean z) {
        recyclerViewListHelperF.Y0 = z;
        return z;
    }

    void B1(int i) {
        ((InnerA) getAdapter()).I(i);
    }

    public void C1(int i, float f2, boolean z) {
        RecyclerView.a0 a0VarA1 = A1(f2, z);
        a0VarA1.p(i);
        getLayoutManager().J1(a0VarA1);
    }

    int getChildCountFromAdapter() {
        return ((InnerA) getAdapter()).E();
    }

    int getItemCount() {
        return getAdapter().f();
    }

    @Override
    public boolean onInterceptTouchEvent(MotionEvent motionEvent) {
        if (!super.onInterceptTouchEvent(motionEvent)) {
            return false;
        }
        com.facebook.react.uimanager.events.j.a(this, motionEvent);
        this.V0 = true;
        ((UIManagerModule) getReactContext().getNativeModule(UIManagerModule.class)).getEventDispatcher().s(com.facebook.react.views.scroll.j.n(getId(), com.facebook.react.views.scroll.k.valueOf("BEGIN_DRAG"), 0, computeVerticalScrollOffset(), 0.0f, 0.0f, getWidth(), computeVerticalScrollRange(), getWidth(), getHeight()));
        return true;
    }

    @Override
    protected void onScrollChanged(int i, int i2, int i3, int i4) {
        super.onScrollChanged(i, i2, i3, i4);
        ((UIManagerModule) getReactContext().getNativeModule(UIManagerModule.class)).getEventDispatcher().s(com.facebook.react.views.scroll.j.n(getId(), com.facebook.react.views.scroll.k.valueOf("SCROLL"), 0, computeVerticalScrollOffset(), 0.0f, 0.0f, getWidth(), computeVerticalScrollRange(), getWidth(), getHeight()));
        int iY1 = ((LinearLayoutManager) getLayoutManager()).Y1();
        int iA2 = ((LinearLayoutManager) getLayoutManager()).a2();
        if (iY1 == this.W0 && iA2 == this.X0) {
            return;
        }
        ((UIManagerModule) getReactContext().getNativeModule(UIManagerModule.class)).getEventDispatcher().s(new RecyclerViewListHelperJ(getId(), com.facebook.react.common.j.b(), iY1, iA2));
        this.W0 = iY1;
        this.X0 = iA2;
    }

    @Override
    public boolean onTouchEvent(MotionEvent motionEvent) {
        if ((motionEvent.getAction() & 255) == 1 && this.V0) {
            this.V0 = false;
            ((UIManagerModule) getReactContext().getNativeModule(UIManagerModule.class)).getEventDispatcher().s(com.facebook.react.views.scroll.j.n(getId(), com.facebook.react.views.scroll.k.valueOf("END_DRAG"), 0, computeVerticalScrollOffset(), 0.0f, 0.0f, getWidth(), computeVerticalScrollRange(), getWidth(), getHeight()));
        }
        return super.onTouchEvent(motionEvent);
    }

    @Override
    public void p1(int i) {
        C1(i, 0.0f, true);
    }

    @Override
    public void requestLayout() {
        super.requestLayout();
        if (this.Y0) {
            return;
        }
        this.Y0 = true;
        post(new RecyclerViewListHelperB(this));
    }

    public void setItemAnimatorEnabled(boolean z) {
        n nVar;
        if (z) {
            nVar = new n();
            nVar.Q(false);
        } else {
            nVar = null;
        }
        setItemAnimator(nVar);
    }

    void setItemCount(int i) {
        ((InnerA) getAdapter()).J(i);
    }

    void y1(RecyclerViewListHelperI recyclerViewListHelperI, int i) {
        ((InnerA) getAdapter()).B(recyclerViewListHelperI, i);
    }

    View z1(int i) {
        return ((InnerA) getAdapter()).C(i);
    }
}
