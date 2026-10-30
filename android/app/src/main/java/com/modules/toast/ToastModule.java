package com.modules.toast;

import android.annotation.SuppressLint;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.kuss.rewind.R;

public class ToastModule extends ReactContextBaseJavaModule {
    private final View layout;
    private final TextView text;
    private Toast toast;

    @SuppressLint({"InflateParams"})
    public ToastModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
        View viewInflate = LayoutInflater.from(getReactApplicationContext()).inflate(R.layout.layout_toast, (ViewGroup) null);
        this.layout = viewInflate;
        this.text = (TextView) viewInflate.findViewById(R.id.text);
    }

    @Override
    public String getName() {
        return "Toast";
    }

    @ReactMethod
    public void show(String str, int i) {
        Toast toast = this.toast;
        if (toast != null) {
            toast.cancel();
            this.toast = null;
        }
        this.toast = new Toast(getReactApplicationContext());
        this.text.setText(str);
        this.toast.setDuration(i);
        this.toast.setView(this.layout);
        this.toast.setGravity(81, 0, 256);
        this.toast.show();
    }
}
