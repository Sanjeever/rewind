package com.kuss.rewind.player

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

object PlayerBridge {
    var context: ReactApplicationContext? = null
    val controls = mutableMapOf<String, Boolean>()

    fun action(name: String) {
        val enabled = controls[when (name) { "play", "pause" -> "playPause"; else -> name }] ?: true
        val react = context ?: return
        if (enabled && react.hasActiveReactInstance()) {
            val event = Arguments.createMap().apply { putString("name", name) }
            react.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("NOTIFICATION_ACTION_EVENT", event)
        }
    }
}
