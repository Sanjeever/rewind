package com.modules.language;

import android.app.Activity;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;
import android.util.Log;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

public class RNLanguageModule extends ReactContextBaseJavaModule {
    public RNLanguageModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    private String getCountryCode(Locale locale) {
        try {
            String country = locale.getCountry();
            if ("419".equals(country)) {
                return "UN";
            }
            if ("".equals(country)) {
                return null;
            }
            return country;
        } catch (Exception e2) {
            e2.printStackTrace();
            return null;
        }
    }

    private String getCurrentLanguage() {
        Locale locale = getLocale();
        String languageCode = getLanguageCode(locale);
        if ("en".equals(languageCode)) {
            return "en_US";
        }
        return languageCode + '_' + getCountryCode(locale);
    }

    private String getLanguageCode(Locale locale) {
        String language = locale.getLanguage();
        language.hashCode();
        switch (language) {
            case "in":
                return "id";
            case "iw":
                return "he";
            case "ji":
                return "yi";
            default:
                return language;
        }
    }

    private Locale getLocale() {
        Configuration configuration = getReactApplicationContext().getResources().getConfiguration();
        return Build.VERSION.SDK_INT < 24 ? configuration.locale : configuration.getLocales().get(0);
    }

    private String getPrefLanguageCode() {
        try {
            Activity currentActivity = getReactApplicationContext().getCurrentActivity();
            Objects.requireNonNull(currentActivity);
            return currentActivity.getPreferences(0).getString("code", "null");
        } catch (NullPointerException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    private void setPrefLanguageCode(String str) {
        try {
            Activity currentActivity = getReactApplicationContext().getCurrentActivity();
            Objects.requireNonNull(currentActivity);
            SharedPreferences.Editor editorEdit = currentActivity.getPreferences(0).edit();
            editorEdit.putString("code", str);
            editorEdit.apply();
        } catch (NullPointerException e2) {
            e2.printStackTrace();
            Log.d("FALSE", "setPrefLanguageCode: 404");
        }
    }

    @Override
    public Map<String, Object> getConstants() {
        HashMap map = new HashMap();
        String currentLanguage = getCurrentLanguage();
        String prefLanguageCode = getPrefLanguageCode();
        if (!"null".equals(prefLanguageCode)) {
            currentLanguage = prefLanguageCode;
        }
        map.put("language", currentLanguage);
        return map;
    }

    @Override
    public String getName() {
        return "RNLanguage";
    }

    @ReactMethod
    public void setLanguageCode(String str, Promise promise) {
        setPrefLanguageCode(str);
        promise.resolve("200");
    }
}
