package com.kuss.rewind.player

import android.app.PendingIntent
import android.content.Intent
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.ForwardingPlayer
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.datasource.DataSource
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.datasource.DefaultHttpDataSource
import androidx.media3.datasource.cache.CacheDataSource
import androidx.media3.datasource.cache.LeastRecentlyUsedCacheEvictor
import androidx.media3.datasource.cache.SimpleCache
import androidx.media3.database.StandaloneDatabaseProvider
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.kuss.rewind.MainActivity
import com.kuss.rewind.BuildConfig
import java.io.File
import java.util.concurrent.Executors

@androidx.annotation.OptIn(androidx.media3.common.util.UnstableApi::class)
class PlaybackService : MediaSessionService() {
    private lateinit var session: MediaSession
    private val cacheExecutor = Executors.newSingleThreadExecutor()
    private val cacheDatabase = lazy { StandaloneDatabaseProvider(this) }
    private val audioCache = lazy {
        SimpleCache(File(externalCacheDir, "audio-cache"), LeastRecentlyUsedCacheEvictor(PlayerBridge.maxCacheBytes), cacheDatabase.value)
    }

    override fun onCreate() {
        super.onCreate()
        val upstream = DefaultHttpDataSource.Factory().setUserAgent("rewind/${BuildConfig.VERSION_NAME}").setAllowCrossProtocolRedirects(true)
        val cached = DataSource.Factory {
            CacheDataSource.Factory().setCache(audioCache.value)
                .setCacheKeyFactory { spec -> spec.uri.lastPathSegment ?: spec.uri.toString() }
                .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR)
                .setUpstreamDataSourceFactory(upstream).createDataSource()
        }
        val player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(DefaultMediaSourceFactory(DefaultDataSource.Factory(this, cached)))
            .build().apply {
            setAudioAttributes(AudioAttributes.Builder().setUsage(C.USAGE_MEDIA).setContentType(C.AUDIO_CONTENT_TYPE_MUSIC).build(), PlayerBridge.handleAudioFocus)
            setHandleAudioBecomingNoisy(true)
            setWakeMode(C.WAKE_MODE_LOCAL)
        }
        PlayerBridge.audioFocusUpdater = { enabled -> player.setAudioAttributes(player.audioAttributes, enabled) }
        player.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) { PlayerBridge.playback(isPlaying) }
        })
        PlayerBridge.cacheSizeReader = { promise ->
            cacheExecutor.execute {
                try { promise.resolve(audioCache.value.cacheSpace.toDouble()) }
                catch (error: Exception) { promise.reject("E_AUDIO_CACHE", "读取音频缓存失败", error) }
            }
        }
        PlayerBridge.cacheClearer = { promise ->
            cacheExecutor.execute {
                try {
                    audioCache.value.keys.toList().forEach { key -> audioCache.value.removeResource(key) }
                    promise.resolve(null)
                } catch (error: Exception) { promise.reject("E_AUDIO_CACHE", "清理音频缓存失败", error) }
            }
        }
        val controls = object : ForwardingPlayer(player) {
            override fun getAvailableCommands(): Player.Commands = super.getAvailableCommands().buildUpon()
                .add(Player.COMMAND_SEEK_TO_NEXT).add(Player.COMMAND_SEEK_TO_PREVIOUS)
                .add(Player.COMMAND_SEEK_TO_NEXT_MEDIA_ITEM).add(Player.COMMAND_SEEK_TO_PREVIOUS_MEDIA_ITEM).build()
            override fun isCommandAvailable(command: Int) = availableCommands.contains(command)
            override fun seekToNext() { PlayerBridge.action("nextTrack") }
            override fun seekToNextMediaItem() { PlayerBridge.action("nextTrack") }
            override fun seekToPrevious() { PlayerBridge.action("previousTrack") }
            override fun seekToPreviousMediaItem() { PlayerBridge.action("previousTrack") }
        }
        val activity = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        session = MediaSession.Builder(this, controls).setSessionActivity(activity)
            .setCallback(object : MediaSession.Callback {
                override fun onPlayerInteractionFinished(session: MediaSession, controller: MediaSession.ControllerInfo, commands: Player.Commands) {
                    if (controller.connectionHints.getBoolean("rewindJsController")) return
                    if (commands.contains(Player.COMMAND_STOP)) PlayerBridge.action("stop")
                    else if (commands.contains(Player.COMMAND_PLAY_PAUSE)) PlayerBridge.action(if (player.playWhenReady) "play" else "pause")
                }
            }).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo) = session

    override fun onDestroy() {
        PlayerBridge.audioFocusUpdater = null
        PlayerBridge.cacheClearer = null
        PlayerBridge.cacheSizeReader = null
        session.player.release()
        session.release()
        cacheExecutor.execute {
            if (audioCache.isInitialized()) audioCache.value.release()
            if (cacheDatabase.isInitialized()) cacheDatabase.value.close()
        }
        cacheExecutor.shutdown()
        super.onDestroy()
    }
}
