package com.kuss.rewind.player

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.media.audiofx.AudioEffect
import android.net.Uri
import android.os.Handler
import android.os.Bundle
import android.os.Looper
import androidx.core.content.ContextCompat
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.facebook.react.bridge.*
import java.io.File

@androidx.annotation.OptIn(androidx.media3.common.util.UnstableApi::class)
class AudioPlayerModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val main = Handler(Looper.getMainLooper())
    private val future = MediaController.Builder(context, SessionToken(context, ComponentName(context, PlaybackService::class.java)))
        .setApplicationLooper(Looper.getMainLooper())
        .setConnectionHints(Bundle().apply { putBoolean("rewindJsController", true) }).buildAsync()
    private val volume = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var prepareListener: Player.Listener? = null
    private var completionListener: Player.Listener? = null
    override fun getName() = "RNAudioPlayer"

    init { PlayerBridge.context = context }

    private fun player(block: (MediaController) -> Unit) {
        future.addListener({ block(future.get()) }, ContextCompat.getMainExecutor(context))
    }

    @ReactMethod
    fun prepare(source: String, callback: Callback) {
        player { controller ->
            prepareListener?.let { controller.removeListener(it) }
            completionListener?.let { controller.removeListener(it) }
            controller.pause()
            val listener = object : Player.Listener {
                override fun onPlaybackStateChanged(state: Int) {
                    if (state == Player.STATE_READY) {
                        controller.removeListener(this)
                        prepareListener = null
                        callback.invoke(null, Arguments.createMap().apply { putDouble("duration", controller.duration.coerceAtLeast(0).toDouble() / 1000) })
                    }
                }
                override fun onPlayerError(error: PlaybackException) {
                    controller.removeListener(this)
                    prepareListener = null
                    callback.invoke(Arguments.createMap().apply { putInt("type", error.errorCode); putString("message", error.message) }, null)
                }
            }
            prepareListener = listener
            controller.addListener(listener)
            val uri = if (source.startsWith("/")) Uri.fromFile(File(source)) else Uri.parse(source)
            controller.setMediaItem(MediaItem.fromUri(uri))
            controller.prepare()
        }
    }

    @ReactMethod
    fun play(callback: Callback) {
        player { controller ->
            completionListener?.let { controller.removeListener(it) }
            val listener = object : Player.Listener {
                override fun onPlaybackStateChanged(state: Int) {
                    if (state == Player.STATE_ENDED) {
                        controller.removeListener(this)
                        completionListener = null
                        callback.invoke(true)
                    }
                }
                override fun onPlayerError(error: PlaybackException) {
                    controller.removeListener(this)
                    completionListener = null
                    callback.invoke(false)
                }
            }
            completionListener = listener
            controller.addListener(listener)
            controller.play()
        }
    }

    @ReactMethod fun pause(callback: Callback) { player { it.pause(); callback.invoke() } }
    @ReactMethod fun release() { player { it.pause(); it.clearMediaItems() } }
    @ReactMethod fun getCurrentTime(callback: Callback) { player { callback.invoke(it.currentPosition.toDouble() / 1000, it.isPlaying) } }
    @ReactMethod fun setCurrentTime(seconds: Double, play: Boolean) { player { it.seekTo((seconds * 1000).toLong()); if (play) it.play() } }
    @ReactMethod fun setVolume(left: Double, right: Double) { player { it.volume = left.toFloat() } }

    @ReactMethod
    fun setNowPlaying(info: ReadableMap) {
        player { controller ->
            val current = controller.currentMediaItem ?: return@player
            val metadata = MediaMetadata.Builder()
            if (info.hasKey("title")) metadata.setTitle(info.getString("title"))
            if (info.hasKey("artist")) metadata.setArtist(info.getString("artist"))
            if (info.hasKey("album")) metadata.setAlbumTitle(info.getString("album"))
            if (info.hasKey("artwork") && !info.isNull("artwork")) metadata.setArtworkUri(Uri.parse(info.getString("artwork")))
            controller.replaceMediaItem(controller.currentMediaItemIndex, current.buildUpon().setMediaMetadata(metadata.build()).build())
        }
    }

    @ReactMethod fun updatePlayback(info: ReadableMap) { setNowPlaying(info) }
    @ReactMethod fun enableControl(name: String, enabled: Boolean) { main.post { PlayerBridge.controls[name] = enabled } }
    @ReactMethod fun getSystemVolume(callback: Callback) { callback.invoke(null, Arguments.createMap().apply { putDouble("volume", volume.getStreamVolume(AudioManager.STREAM_MUSIC).toDouble()) }) }
    @ReactMethod fun setSystemVolume(value: Double) { volume.setStreamVolume(AudioManager.STREAM_MUSIC, value.toInt(), 0) }
    @ReactMethod fun showSystemStreamVolumeUI() { volume.adjustStreamVolume(AudioManager.STREAM_MUSIC, AudioManager.ADJUST_SAME, AudioManager.FLAG_SHOW_UI) }

    @ReactMethod
    fun openEqualizer(promise: Promise) {
        player { controller ->
            try {
                val intent = Intent(AudioEffect.ACTION_DISPLAY_AUDIO_EFFECT_CONTROL_PANEL)
                    .putExtra(AudioEffect.EXTRA_PACKAGE_NAME, context.packageName)
                    .putExtra(AudioEffect.EXTRA_CONTENT_TYPE, AudioEffect.CONTENT_TYPE_MUSIC)
                    .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                if (intent.resolveActivity(context.packageManager) == null) promise.reject("E_EQUALIZER_UNAVAILABLE", "设备未提供均衡器")
                else { context.startActivity(intent); promise.resolve(null) }
            } catch (error: Exception) { promise.reject("E_EQUALIZER", error) }
        }
    }

    override fun invalidate() {
        PlayerBridge.context = null
        main.post { MediaController.releaseFuture(future) }
        super.invalidate()
    }
}
