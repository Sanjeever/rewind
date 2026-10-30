package com.kuss.rewind

import android.content.ContentUris
import android.content.ContentValues
import android.media.MediaScannerConnection
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.Executors
import java.io.File

class RewindMediaStoreModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    override fun getName() = "RNMediaStore"

    @ReactMethod
    fun getPlayList(promise: Promise) {
        executor.execute {
            try {
                val songs = Arguments.createArray()
                val uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
                val columns = arrayOf("_id", "title", "artist", "album", "album_id", "duration")
                context.contentResolver.query(uri, columns, "is_music != 0", null, "date_added ASC")?.use { cursor ->
                    while (cursor.moveToNext()) {
                        val song = Arguments.createMap()
                        val id = cursor.getLong(0)
                        song.putString("id", id.toString())
                        song.putString("title", cursor.getString(1))
                        song.putString("singer", cursor.getString(2))
                        song.putString("album", cursor.getString(3))
                        song.putString("albumId", cursor.getString(4))
                        song.putDouble("duration", cursor.getLong(5).toDouble())
                        song.putString("path", ContentUris.withAppendedId(uri, id).toString())
                        songs.pushMap(song)
                    }
                }
                val result = Arguments.createMap()
                result.putInt("numbers", songs.size())
                result.putArray("data", songs)
                promise.resolve(result)
            } catch (error: Exception) {
                promise.reject("E_MEDIA_SCAN", "扫描本地音乐失败", error)
            }
        }
    }

    @ReactMethod
    fun getArtWork(albumId: String, promise: Promise) {
        promise.resolve(ContentUris.withAppendedId(android.net.Uri.parse("content://media/external/audio/albumart"), albumId.toLong()).toString())
    }

    @ReactMethod
    fun publish(path: String, name: String, mime: String, provider: String, promise: Promise) {
        executor.execute {
            if (Build.VERSION.SDK_INT >= 29) {
                val resolver = context.contentResolver
                var uri: android.net.Uri? = null
                try {
                    val values = ContentValues().apply {
                        put(MediaStore.Audio.Media.DISPLAY_NAME, name)
                        put(MediaStore.Audio.Media.MIME_TYPE, mime)
                        put(MediaStore.Audio.Media.RELATIVE_PATH, "Music/rewind/$provider")
                        put(MediaStore.Audio.Media.IS_PENDING, 1)
                    }
                    uri = requireNotNull(resolver.insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values))
                    File(path).inputStream().use { input -> requireNotNull(resolver.openOutputStream(uri)).use { output -> input.copyTo(output) } }
                    resolver.update(uri, ContentValues().apply { put(MediaStore.Audio.Media.IS_PENDING, 0) }, null, null)
                    promise.resolve(uri.toString())
                } catch (error: Exception) {
                    uri?.let { resolver.delete(it, null, null) }
                    promise.reject("E_AUDIO_EXPORT", "保存音乐失败", error)
                }
            } else {
                try {
                    val directory = File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC), "rewind/$provider")
                    check(directory.isDirectory || directory.mkdirs()) { "创建音乐目录失败" }
                    val target = File(directory, name)
                    File(path).copyTo(target, overwrite = true)
                    MediaScannerConnection.scanFile(context, arrayOf(target.path), arrayOf(mime)) { _, uri -> promise.resolve(uri.toString()) }
                } catch (error: Exception) { promise.reject("E_AUDIO_EXPORT", "保存音乐失败", error) }
            }
        }
    }

    override fun invalidate() {
        executor.shutdown()
        super.invalidate()
    }
}
