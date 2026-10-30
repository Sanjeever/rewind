package com.kuss.rewind

import com.facebook.react.bridge.*
import org.jaudiotagger.audio.AudioFileIO
import org.jaudiotagger.tag.FieldKey
import org.jaudiotagger.tag.TagOptionSingleton
import org.jaudiotagger.tag.images.ArtworkFactory
import java.io.File
import java.net.URL
import java.util.concurrent.Executors

class RewindAudioTaggerModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    override fun getName() = "RNAudioTagger"

    @ReactMethod
    fun commit(path: String, metadata: ReadableMap, promise: Promise) {
        executor.execute {
            var cover: File? = null
            try {
                TagOptionSingleton.getInstance().isAndroid = true
                val audio = AudioFileIO.read(File(path))
                val tag = audio.tagOrCreateAndSetDefault
                for ((name, field) in mapOf("title" to FieldKey.TITLE, "artist" to FieldKey.ARTIST, "album" to FieldKey.ALBUM)) {
                    if (metadata.hasKey(name) && !metadata.isNull(name)) tag.setField(field, metadata.getString(name))
                }
                if (metadata.hasKey("image") && !metadata.isNull("image")) {
                    val temporary = File.createTempFile("rewind-cover", ".jpg", reactApplicationContext.cacheDir)
                    cover = temporary
                    val connection = URL(metadata.getString("image")).openConnection().apply { connectTimeout = 15000; readTimeout = 15000 }
                    connection.getInputStream().use { input -> temporary.outputStream().use { output -> input.copyTo(output) } }
                    tag.setField(ArtworkFactory.createArtworkFromFile(temporary))
                }
                audio.commit()
                promise.resolve(Arguments.createMap().apply { putInt("code", 200) })
            } catch (error: Exception) { promise.reject("E_AUDIO_TAG", "写入音频标签失败", error) }
            finally { cover?.delete() }
        }
    }

    override fun invalidate() { executor.shutdown(); super.invalidate() }
}
