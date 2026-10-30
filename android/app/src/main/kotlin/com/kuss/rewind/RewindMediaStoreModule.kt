package com.kuss.rewind

import android.content.ContentUris
import android.content.ContentValues
import android.app.Activity
import android.app.RecoverableSecurityException
import android.content.Intent
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
import com.facebook.react.bridge.BaseActivityEventListener

class RewindMediaStoreModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    private var deletion: Promise? = null
    private var deletionUri: android.net.Uri? = null
    private val listener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode != 7041) return
            val pending = deletion ?: return
            deletion = null
            val uri = deletionUri
            deletionUri = null
            if (resultCode != Activity.RESULT_OK) { pending.resolve(false); return }
            if (Build.VERSION.SDK_INT == 29 && uri != null) deleteUri(uri, pending)
            else pending.resolve(true)
        }
    }
    init { context.addActivityEventListener(listener) }
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
    fun publish(path: String, name: String, mime: String, subdirectory: String, promise: Promise) {
        executor.execute {
            val image = mime.startsWith("image/")
            val directoryName = if (image) Environment.DIRECTORY_PICTURES else Environment.DIRECTORY_MUSIC
            if (Build.VERSION.SDK_INT >= 29) {
                val resolver = context.contentResolver
                var uri: android.net.Uri? = null
                try {
                    val values = ContentValues().apply {
                        put(MediaStore.MediaColumns.DISPLAY_NAME, name)
                        put(MediaStore.MediaColumns.MIME_TYPE, mime)
                        put(MediaStore.MediaColumns.RELATIVE_PATH, "$directoryName/rewind/$subdirectory")
                        put(MediaStore.MediaColumns.IS_PENDING, 1)
                    }
                    val collection = if (image) MediaStore.Images.Media.EXTERNAL_CONTENT_URI else MediaStore.Audio.Media.EXTERNAL_CONTENT_URI
                    uri = requireNotNull(resolver.insert(collection, values))
                    val source = if (path.startsWith("content://")) requireNotNull(resolver.openInputStream(android.net.Uri.parse(path))) else File(path.removePrefix("file://")).inputStream()
                    source.use { input -> requireNotNull(resolver.openOutputStream(uri)).use { output -> input.copyTo(output) } }
                    resolver.update(uri, ContentValues().apply { put(MediaStore.MediaColumns.IS_PENDING, 0) }, null, null)
                    promise.resolve(uri.toString())
                } catch (error: Exception) {
                    uri?.let { resolver.delete(it, null, null) }
                    promise.reject("E_AUDIO_EXPORT", "保存音乐失败", error)
                }
            } else {
                try {
                    val directory = File(Environment.getExternalStoragePublicDirectory(directoryName), "rewind/$subdirectory")
                    check(directory.isDirectory || directory.mkdirs()) { "创建音乐目录失败" }
                    val target = File(directory, name)
                    val temporary = File(directory, ".${name}.writing")
                    val input = if (path.startsWith("content://")) requireNotNull(context.contentResolver.openInputStream(android.net.Uri.parse(path))) else File(path.removePrefix("file://")).inputStream()
                    input.use { source -> temporary.outputStream().use { output -> source.copyTo(output) } }
                    android.system.Os.rename(temporary.path, target.path)
                    MediaScannerConnection.scanFile(context, arrayOf(target.path), arrayOf(mime)) { _, uri ->
                        if (uri == null) promise.reject("E_MEDIA_INDEX", "媒体索引失败") else promise.resolve(uri.toString())
                    }
                } catch (error: Exception) { promise.reject("E_AUDIO_EXPORT", "保存音乐失败", error) }
            }
        }
    }

    @ReactMethod
    fun deleteAudio(id: String, promise: Promise) {
        deleteUri(ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id.toLong()), promise)
    }

    private fun deleteUri(uri: android.net.Uri, promise: Promise) {
        executor.execute {
            try {
                promise.resolve(context.contentResolver.delete(uri, null, null) > 0)
            } catch (error: SecurityException) {
                com.facebook.react.bridge.UiThreadUtil.runOnUiThread {
                    try {
                        if (deletion != null) { promise.reject("E_MEDIA_DELETE_BUSY", "另一个删除操作仍在等待确认"); return@runOnUiThread }
                        val activity = requireNotNull(context.currentActivity) { "当前页面不可用" }
                        val intent = if (Build.VERSION.SDK_INT >= 30) MediaStore.createDeleteRequest(context.contentResolver, listOf(uri)).intentSender
                            else if (Build.VERSION.SDK_INT == 29 && error is RecoverableSecurityException) error.userAction.actionIntent.intentSender
                            else throw error
                        deletion = promise
                        deletionUri = uri
                        activity.startIntentSenderForResult(intent, 7041, null, 0, 0, 0)
                    } catch (failure: Exception) {
                        deletion = null
                        deletionUri = null
                        promise.reject("E_MEDIA_DELETE", "删除音乐失败", failure)
                    }
                }
            } catch (error: Exception) { promise.reject("E_MEDIA_DELETE", "删除音乐失败", error) }
        }
    }

    override fun invalidate() {
        context.removeActivityEventListener(listener)
        executor.shutdown()
        super.invalidate()
    }
}
