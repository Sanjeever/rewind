package com.kuss.rewind

import com.facebook.react.bridge.*
import com.hankcs.hanlp.dictionary.stopword.CoreStopWordDictionary
import com.hankcs.hanlp.seg.Other.DoubleArrayTrieSegment
import java.util.concurrent.Executors

class RewindSegmentationModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    private val segmenter by lazy { DoubleArrayTrieSegment().enablePartOfSpeechTagging(true) }

    override fun getName() = "RewindSegmentation"

    @ReactMethod
    fun segment(texts: ReadableArray, promise: Promise) {
        val comments = (0 until texts.size()).map { texts.getString(it)!! }
        executor.execute {
            try {
                val words = linkedSetOf<String>()
                for (comment in comments) {
                    for (term in segmenter.seg(comment)) {
                        val word = term.word
                        if (word.any { it.isLetterOrDigit() } && !CoreStopWordDictionary.contains(word)) words.add(word)
                    }
                }
                promise.resolve(Arguments.fromList(words.toList()))
            } catch (error: Exception) { promise.reject("E_SEGMENTATION", "评论分词失败", error) }
        }
    }

    override fun invalidate() { executor.shutdownNow(); super.invalidate() }
}
