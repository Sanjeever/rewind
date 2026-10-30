package com.modules.tabviewpager;

import android.view.View;
import android.view.ViewGroup;
import java.util.ArrayList;
import java.util.List;

class TabviewpagerHelperE extends b.x.a.a {

    private final List<View> f4823c;

    private boolean f4824d;

    final TabviewpagerHelperH f4825e;

    private TabviewpagerHelperE(TabviewpagerHelperH tabviewpagerHelperH) {
        this.f4825e = tabviewpagerHelperH;
        this.f4823c = new ArrayList();
        this.f4824d = false;
    }

    TabviewpagerHelperE(TabviewpagerHelperH tabviewpagerHelperH, TabviewpagerHelperD tabviewpagerHelperD) {
        this(tabviewpagerHelperH);
    }

    @Override
    public void a(ViewGroup viewGroup, int i, Object obj) {
        viewGroup.removeView((View) obj);
    }

    @Override
    public int d() {
        return this.f4823c.size();
    }

    @Override
    public int e(Object obj) {
        if (this.f4824d || !this.f4823c.contains(obj)) {
            return -2;
        }
        return this.f4823c.indexOf(obj);
    }

    @Override
    public CharSequence f(int i) {
        if (TabviewpagerHelperH.T(this.f4825e).length > i) {
            return TabviewpagerHelperH.T(this.f4825e)[i];
        }
        return "Position: " + i;
    }

    @Override
    public Object h(ViewGroup viewGroup, int i) {
        View view = this.f4823c.get(i);
        viewGroup.addView(view, 0, TabviewpagerHelperH.S(this.f4825e));
        return view;
    }

    @Override
    public boolean i(View view, Object obj) {
        return view == obj;
    }

    void t(View view, int i) {
        this.f4823c.add(i, view);
        j();
        this.f4825e.setOffscreenPageLimit(this.f4823c.size());
    }

    View u(int i) {
        return this.f4823c.get(i);
    }

    void v(int i) {
        this.f4823c.remove(i);
        j();
        this.f4825e.setOffscreenPageLimit(this.f4823c.size());
    }

    void w(List<View> list) {
        this.f4823c.clear();
        this.f4823c.addAll(list);
        j();
        this.f4824d = false;
    }
}
