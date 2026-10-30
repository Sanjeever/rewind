package com.modules.recyclerViewList;

class RecyclerViewListHelperB implements Runnable {
    final RecyclerViewListHelperF k;

    RecyclerViewListHelperB(RecyclerViewListHelperF recyclerViewListHelperF) {
        this.k = recyclerViewListHelperF;
    }

    @Override
    public void run() {
        RecyclerViewListHelperF.x1(this.k, false);
        RecyclerViewListHelperF recyclerViewListHelperF = this.k;
        recyclerViewListHelperF.layout(recyclerViewListHelperF.getLeft(), this.k.getTop(), this.k.getRight(), this.k.getBottom());
    }
}
