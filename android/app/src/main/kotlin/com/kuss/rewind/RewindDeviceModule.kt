package com.kuss.rewind

import android.content.Intent
import android.content.pm.ActivityInfo
import android.os.Handler
import android.os.Looper
import android.view.WindowManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.ReactApplication

class RewindDeviceModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val handler = Handler(Looper.getMainLooper())
    private val timers = mutableMapOf<Int, Runnable>()
    private val preferences = context.getSharedPreferences(MainActivity::class.java.name, 0)
    override fun getName() = "RewindDevice"
    override fun getConstants(): Map<String, Any> {
        val locale = context.resources.configuration.locales[0]
        val current = if (locale.language == "en") "en_US" else "${locale.language}_${locale.country}"
        val stored = preferences.getString("code", null)
        val language = if (stored == null || stored == "null") current else stored
        return mapOf("versionCode" to BuildConfig.VERSION_CODE, "versionName" to BuildConfig.VERSION_NAME,
            "applicationId" to BuildConfig.APPLICATION_ID, "isDebug" to BuildConfig.DEBUG,
            "language" to language)
    }

    @ReactMethod
    fun setLanguageCode(code: String, promise: Promise) {
        if (preferences.edit().putString("code", code).commit()) promise.resolve("200")
        else promise.reject("E_LANGUAGE_WRITE", "语言设置保存失败")
    }

    @ReactMethod
    fun setOrientation(landscape: Boolean) {
        handler.post {
            context.currentActivity?.requestedOrientation = if (landscape) ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE else ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        }
    }

    @ReactMethod
    fun keepScreenOn(enabled: Boolean) {
        handler.post {
            context.currentActivity?.window?.let {
                if (enabled) it.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
                else it.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            }
        }
    }

    @ReactMethod
    fun restart() {
        handler.post {
            val activity = context.currentActivity ?: return@post
            activity.startActivity(Intent.makeRestartActivityTask(activity.componentName))
            Runtime.getRuntime().exit(0)
        }
    }

    @ReactMethod
    fun close() {
        handler.post {
            com.kuss.rewind.player.PlayerBridge.closeController?.invoke()
            com.kuss.rewind.player.PlayerBridge.stopService?.invoke()
            context.stopService(Intent(context, com.kuss.rewind.player.PlaybackService::class.java))
            context.currentActivity?.finishAndRemoveTask()
        }
    }

    @ReactMethod
    fun showDevMenu() {
        handler.post { (context.applicationContext as ReactApplication).reactHost?.devSupportManager?.showDevOptionsDialog() }
    }

    @ReactMethod
    fun setTimeout(id: Double, milliseconds: Double) {
        handler.post {
            val key = id.toInt()
            timers.remove(key)?.let { handler.removeCallbacks(it) }
            val task = Runnable {
                timers.remove(key)
                if (context.hasActiveReactInstance()) context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("backgroundTimer.timeout", key)
            }
            timers[key] = task
            handler.postDelayed(task, milliseconds.toLong())
        }
    }

    @ReactMethod fun clearTimeout(id: Double) {
        handler.post { timers.remove(id.toInt())?.let { handler.removeCallbacks(it) } }
    }

    @ReactMethod fun addListener(name: String) {}
    @ReactMethod fun removeListeners(count: Double) {}

    override fun invalidate() {
        handler.removeCallbacksAndMessages(null)
        timers.clear()
        super.invalidate()
    }
}
