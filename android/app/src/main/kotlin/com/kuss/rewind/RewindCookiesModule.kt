package com.kuss.rewind

import android.webkit.CookieManager
import com.facebook.react.bridge.*

class RewindCookiesModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "RewindCookies"

    @ReactMethod
    fun get(url: String, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val result = Arguments.createMap()
            CookieManager.getInstance().getCookie(url)?.split(';')?.forEach { entry ->
                val separator = entry.indexOf('=')
                if (separator > 0) {
                    val name = entry.substring(0, separator).trim()
                    result.putMap(name, Arguments.createMap().apply { putString("name", name); putString("value", entry.substring(separator + 1)) })
                }
            }
            promise.resolve(result)
        }
    }

    @ReactMethod
    fun set(url: String, cookie: ReadableMap, promise: Promise) {
        val header = StringBuilder().append(cookie.getString("name")).append('=').append(cookie.getString("value"))
        for (attribute in listOf("domain", "path", "expires")) {
            if (cookie.hasKey(attribute)) header.append("; ").append(attribute).append('=').append(cookie.getString(attribute))
        }
        if (cookie.hasKey("secure") && cookie.getBoolean("secure")) header.append("; Secure")
        UiThreadUtil.runOnUiThread {
            val manager = CookieManager.getInstance()
            manager.setCookie(url, header.toString()) { success ->
                manager.flush()
                if (success) promise.resolve(true) else promise.reject("E_COOKIE_WRITE", "登录 Cookie 保存失败")
            }
        }
    }

    @ReactMethod
    fun setFromResponse(url: String, header: String, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val cookies = header.split(';').filter { it.contains('=') }
            val manager = CookieManager.getInstance()
            var remaining = cookies.size
            var failed = false
            if (remaining == 0) { promise.reject("E_COOKIE_EMPTY", "登录 Cookie 为空"); return@runOnUiThread }
            for (cookie in cookies) manager.setCookie(url, cookie.trim()) { success ->
                failed = failed || !success
                remaining--
                if (remaining == 0) {
                    manager.flush()
                    if (failed) promise.reject("E_COOKIE_WRITE", "登录 Cookie 保存失败") else promise.resolve(true)
                }
            }
        }
    }
}
