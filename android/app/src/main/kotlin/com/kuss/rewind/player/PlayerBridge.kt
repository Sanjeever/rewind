package com.kuss.rewind.player

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule

object PlayerBridge {
    var context: ReactApplicationContext? = null
    val controls = mutableMapOf<String, Boolean>()
    var handleAudioFocus = true
    var audioFocusUpdater: ((Boolean) -> Unit)? = null
    var maxCacheBytes = 200L * 1024 * 1024
    var cacheSizeReader: ((Promise) -> Unit)? = null
    var cacheClearer: ((Promise) -> Unit)? = null
    var closeController: (() -> Unit)? = null
    var stopService: (() -> Unit)? = null

    fun playback(playing: Boolean) {
        val react = context ?: return
        if (react.hasActiveReactInstance()) {
            val event = Arguments.createMap().apply { putBoolean("playing", playing) }
            react.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("rewind.playbackState", event)
        }
    }

    fun action(name: String) {
        val enabled = controls[when (name) { "play", "pause" -> "playPause"; else -> name }] ?: true
        val react = context ?: return
        if (enabled && react.hasActiveReactInstance()) {
            val event = Arguments.createMap().apply { putString("name", name) }
            react.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("NOTIFICATION_ACTION_EVENT", event)
        }
    }
}
