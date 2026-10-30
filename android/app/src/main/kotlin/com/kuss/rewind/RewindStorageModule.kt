package com.kuss.rewind

import android.database.sqlite.SQLiteDatabase
import android.system.Os
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.Executors

class RewindStorageModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    override fun getName() = "RewindStorage"

    override fun getConstants(): Map<String, Any> = mapOf(
        "externalFilesDir" to requireNotNull(context.getExternalFilesDir(null)).absolutePath,
        "externalCacheDir" to requireNotNull(context.externalCacheDir).absolutePath,
    )

    @ReactMethod
    fun readLegacy(promise: Promise) {
        executor.execute {
            try {
                val values = Arguments.createMap()
                val file = context.getDatabasePath("RKStorage")
                if (file.exists()) {
                    SQLiteDatabase.openDatabase(file.path, null, SQLiteDatabase.OPEN_READONLY).use { db ->
                        db.rawQuery("SELECT key, value FROM catalystLocalStorage", null).use { cursor ->
                            while (cursor.moveToNext()) {
                                check(!cursor.isNull(0) && !cursor.isNull(1)) { "旧数据库包含无效键值" }
                                values.putString(cursor.getString(0), cursor.getString(1))
                            }
                        }
                    }
                }
                promise.resolve(values)
            } catch (error: Exception) {
                promise.reject("E_STORAGE_MIGRATION", "读取旧数据失败", error)
            }
        }
    }

    override fun invalidate() {
        executor.shutdown()
        super.invalidate()
    }

    @ReactMethod
    fun commitPlaylist(promise: Promise) {
        executor.execute {
            try {
                val file = java.io.File(context.getExternalFilesDir(null), "playlist/playlist.json")
                Os.rename(file.path + ".writing", file.path)
                promise.resolve(null)
            } catch (error: Exception) {
                promise.reject("E_PLAYLIST_WRITE", "保存歌单失败", error)
            }
        }
    }
}
