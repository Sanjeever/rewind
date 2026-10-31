package com.kuss.rewind

import android.util.Base64
import com.facebook.react.bridge.*
import java.math.BigInteger
import java.security.SecureRandom
import java.security.MessageDigest
import java.util.concurrent.Executors
import javax.crypto.Cipher
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.SecretKeySpec

class RewindCryptoModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private val executor = Executors.newSingleThreadExecutor()
    override fun getName() = "RNCrypto"

    @ReactMethod
    fun weapi(data: String, promise: Promise) {
        executor.execute {
            try {
                val alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                val random = SecureRandom()
                val secret = (1..16).map { alphabet[random.nextInt(alphabet.length)] }.joinToString("")
                val encrypted = aes(aes(data, "0CoJUm6Qyw8W8jud"), secret)
                val modulus = BigInteger("00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7", 16)
                val key = BigInteger(1, secret.reversed().toByteArray(Charsets.UTF_8)).modPow(BigInteger("010001", 16), modulus).toString(16).padStart(256, '0')
                promise.resolve(Arguments.createMap().apply { putString("params", encrypted); putString("encSecKey", key) })
            } catch (error: Exception) { promise.reject("E_WEAPI", "请求加密失败", error) }
        }
    }

    private fun aes(data: String, key: String): String {
        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, SecretKeySpec(key.toByteArray(Charsets.UTF_8), "AES"), IvParameterSpec("0102030405060708".toByteArray(Charsets.UTF_8)))
        return Base64.encodeToString(cipher.doFinal(data.toByteArray(Charsets.UTF_8)), Base64.NO_WRAP)
    }

    @ReactMethod
    fun eapi(path: String, data: String, promise: Promise) {
        executor.execute {
            try {
                val digest = MessageDigest.getInstance("MD5").digest("nobody${path}use${data}md5forencrypt".toByteArray(Charsets.UTF_8))
                    .joinToString("") { "%02x".format(it.toInt() and 0xff) }
                val plaintext = "$path-36cd479b6b5-$data-36cd479b6b5-$digest"
                val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
                cipher.init(Cipher.ENCRYPT_MODE, SecretKeySpec("e82ckenh8dichen8".toByteArray(Charsets.UTF_8), "AES"))
                promise.resolve(cipher.doFinal(plaintext.toByteArray(Charsets.UTF_8)).joinToString("") { "%02X".format(it.toInt() and 0xff) })
            } catch (error: Exception) { promise.reject("E_EAPI", "音源请求加密失败", error) }
        }
    }

    @ReactMethod
    fun decodeBase64(values: ReadableArray, promise: Promise) {
        try {
            val decoded = (0 until values.size()).map { String(Base64.decode(values.getString(it)!!, Base64.DEFAULT), Charsets.UTF_8) }
            promise.resolve(Arguments.fromList(decoded))
        } catch (error: Exception) { promise.reject("E_BASE64", "歌词编码无效", error) }
    }

    override fun invalidate() { executor.shutdown(); super.invalidate() }
}
