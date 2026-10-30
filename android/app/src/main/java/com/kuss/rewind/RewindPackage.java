package com.kuss.rewind;

import android.content.Intent;
import android.view.View;

public final class RewindPackage implements View.OnClickListener {
    public final ErrorActivity k;
    public final Intent l;

    public RewindPackage(ErrorActivity errorActivity, Intent intent) {
        this.k = errorActivity;
        this.l = intent;
    }

    @Override
    public final void onClick(View view) {
        this.k.M(this.l, view);
    }
}
