package com.kuss.rewind;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.t;
import com.jakewharton.processphoenix.ProcessPhoenix;
import com.modules.shutdown.RNShutdownModule;
import java.util.Objects;
import com.kuss.rewind.R;

public class ErrorActivity extends t {
    private void L(Intent intent, View view) {
        ProcessPhoenix.a(getApplicationContext(), intent);
    }

    public void M(Intent intent, View view) {
        L(intent, view);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        RNShutdownModule.staticFire(this);
    }

    @Override
    protected void onCreate(Bundle bundle) {
        String str;
        super.onCreate(bundle);
        try {
            String stringExtra = getIntent().getStringExtra("stack_trace_string");
            Objects.requireNonNull(stringExtra);
            str = stringExtra;
        } catch (Exception e2) {
            Log.e("RN_ERROR_HANDLER", String.format("Was not able to get StackTrace: %s", e2.getMessage()));
            str = "404 Not Found";
        }
        setContentView(R.layout.activity_error);
        Button button = (Button) findViewById(R.id.eh_restart_button);
        TextView textView = (TextView) findViewById(R.id.eh_stack_trace_text_view);
        textView.setText(str);
        if ("404 Not Found".equals(str)) {
            textView.setGravity(17);
            textView.setTextSize(20.0f);
        }
        Intent launchIntentForPackage = getApplicationContext().getPackageManager().getLaunchIntentForPackage(getApplicationContext().getPackageName());
        if (launchIntentForPackage != null) {
            launchIntentForPackage.setFlags(67174400);
            button.setOnClickListener(new RewindPackage(this, launchIntentForPackage));
        }
    }
}
