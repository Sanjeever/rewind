package com.kuss.rewind.player

import android.app.PendingIntent
import android.content.Intent
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.ForwardingPlayer
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.kuss.rewind.MainActivity

@androidx.annotation.OptIn(androidx.media3.common.util.UnstableApi::class)
class PlaybackService : MediaSessionService() {
    private lateinit var session: MediaSession

    override fun onCreate() {
        super.onCreate()
        val player = ExoPlayer.Builder(this).build().apply {
            setAudioAttributes(AudioAttributes.Builder().setUsage(C.USAGE_MEDIA).setContentType(C.AUDIO_CONTENT_TYPE_MUSIC).build(), true)
            setHandleAudioBecomingNoisy(true)
            setWakeMode(C.WAKE_MODE_LOCAL)
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
            override fun play() {
                val changed = !playWhenReady
                super.play()
                if (changed) PlayerBridge.action("play")
            }
            override fun pause() {
                val changed = playWhenReady
                super.pause()
                if (changed) PlayerBridge.action("pause")
            }
            override fun stop() {
                super.stop()
                PlayerBridge.action("stop")
            }
        }
        player.addListener(object : Player.Listener {
            override fun onPlayWhenReadyChanged(playWhenReady: Boolean, reason: Int) {
                if (reason == Player.PLAY_WHEN_READY_CHANGE_REASON_AUDIO_FOCUS_LOSS || reason == Player.PLAY_WHEN_READY_CHANGE_REASON_AUDIO_BECOMING_NOISY) {
                    PlayerBridge.action(if (playWhenReady) "play" else "pause")
                }
            }
        })
        val activity = PendingIntent.getActivity(this, 0, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        session = MediaSession.Builder(this, controls).setSessionActivity(activity).build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo) = session

    override fun onDestroy() {
        session.player.release()
        session.release()
        super.onDestroy()
    }
}
