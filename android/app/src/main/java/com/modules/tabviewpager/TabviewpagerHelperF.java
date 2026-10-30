package com.modules.tabviewpager;

class TabviewpagerHelperF implements b.x.a.k {

    final TabviewpagerHelperH f4826a;

    private TabviewpagerHelperF(TabviewpagerHelperH tabviewpagerHelperH) {
        this.f4826a = tabviewpagerHelperH;
    }

    TabviewpagerHelperF(TabviewpagerHelperH tabviewpagerHelperH, TabviewpagerHelperD tabviewpagerHelperD) {
        this(tabviewpagerHelperH);
    }

    @Override
    public void a(int i, float f2, int i2) {
        TabviewpagerHelperH.V(this.f4826a).s(new TabviewpagerPackage(TabviewpagerHelperH.U(this.f4826a).a(), i, f2));
    }

    @Override
    public void b(int i) {
        String str;
        if (i == 0) {
            str = "idle";
        } else if (i == 1) {
            str = "dragging";
        } else {
            if (i != 2) {
                throw new IllegalStateException("Unsupported pageScrollState");
            }
            str = "settling";
        }
        TabviewpagerHelperH.V(this.f4826a).s(new TabviewpagerHelperB(TabviewpagerHelperH.U(this.f4826a).a(), str));
    }

    @Override
    public void c(int i) {
        if (TabviewpagerHelperH.W(this.f4826a)) {
            return;
        }
        TabviewpagerHelperH.V(this.f4826a).s(new TabviewpagerHelperC(TabviewpagerHelperH.U(this.f4826a).a(), i));
    }
}
