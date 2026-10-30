package com.modules.crypto;

import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Random;
import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class RNCrypto extends ReactContextBaseJavaModule {
    private static final String BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final String ivParameter = "0102030405060708";
    private static final String modulus = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7";
    private static final String nonce = "0CoJUm6Qyw8W8jud";
    private static final String pubKey = "010001";
    private static final String tencentAPISecretKey = "REMOVED_TENCENT_CREDENTIAL";
    private Thread mThread;

    class InnerA extends Thread {
        final String k;
        final Promise l;

        InnerA(String str, Promise promise) {
            this.k = str;
            this.l = promise;
        }

        @Override
        public void run() {
            if (this.k == null) {
                return;
            }
            WritableMap writableMapCreateMap = Arguments.createMap();
            String strAccess$000 = RNCrypto.access$000(RNCrypto.this);
            RNCrypto rNCrypto = RNCrypto.this;
            String strAccess$100 = RNCrypto.access$100(rNCrypto, RNCrypto.access$100(rNCrypto, this.k, RNCrypto.nonce), strAccess$000);
            String strAccess$200 = RNCrypto.access$200(RNCrypto.this, strAccess$000);
            if (strAccess$100 != null) {
                writableMapCreateMap.putString("params", strAccess$100);
                writableMapCreateMap.putString("encSecKey", strAccess$200);
            }
            this.l.resolve(writableMapCreateMap);
            RNCrypto.access$302(RNCrypto.this, null);
        }
    }

    class InnerB extends Thread {
        final String k;
        final Promise l;

        InnerB(String str, Promise promise) {
            this.k = str;
            this.l = promise;
        }

        @Override
        public void run() {
            if (this.k == null) {
                return;
            }
            WritableMap writableMapCreateMap = Arguments.createMap();
            String strAccess$400 = RNCrypto.access$400(RNCrypto.this, this.k);
            if (strAccess$400 != null) {
                writableMapCreateMap.putString("signature", strAccess$400);
            }
            this.l.resolve(writableMapCreateMap);
            RNCrypto.access$302(RNCrypto.this, null);
        }
    }

    public RNCrypto(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    static String access$000(RNCrypto rNCrypto) {
        return rNCrypto.getSecKey();
    }

    static String access$100(RNCrypto rNCrypto, String str, String str2) {
        return rNCrypto.aesCBC(str, str2);
    }

    static String access$200(RNCrypto rNCrypto, String str) {
        return rNCrypto.rsaEncrypt(str);
    }

    static Thread access$302(RNCrypto rNCrypto, Thread thread) {
        rNCrypto.mThread = thread;
        return thread;
    }

    static String access$400(RNCrypto rNCrypto, String str) {
        return rNCrypto.hmacSHA1(str);
    }

    private String aesCBC(String str, String str2) {
        try {
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(1, new SecretKeySpec(str2.getBytes(), "AES"), new IvParameterSpec(ivParameter.getBytes()));
            return toBase64(cipher.doFinal(str.getBytes()));
        } catch (Exception e2) {
            e2.printStackTrace();
            return null;
        }
    }

    private String getSecKey() {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 16; i++) {
            sb.append(BASE62.charAt(random.nextInt(62)));
        }
        return sb.toString();
    }

    private String hmacSHA1(String str) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(tencentAPISecretKey.getBytes(), "HmacSHA1");
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(secretKeySpec);
            return toBase64(mac.doFinal(str.getBytes()));
        } catch (InvalidKeyException | NoSuchAlgorithmException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    private String reverse(String str) {
        return new StringBuilder(str).reverse().toString();
    }

    private String rsaEncrypt(String str) {
        return zfill(new BigInteger(toHex(reverse(str).getBytes()), 16).modPow(new BigInteger(pubKey, 16), new BigInteger(modulus, 16)).toString(16));
    }

    private static String toBase64(byte[] bArr) {
        return Base64.encodeToString(bArr, 2);
    }

    private static String toHex(byte[] bArr) {
        StringBuilder sb = new StringBuilder();
        for (byte b2 : bArr) {
            sb.append(String.format("%x", Byte.valueOf(b2)));
        }
        return sb.toString();
    }

    private String zfill(String str) {
        try {
            StringBuilder sb = new StringBuilder(str);
            while (sb.length() < 256) {
                sb.append("0");
                sb.append(sb.toString());
            }
            return sb.toString();
        } catch (NullPointerException e2) {
            e2.printStackTrace();
            return "";
        }
    }

    @Override
    public String getName() {
        return "RNCrypto";
    }

    @ReactMethod
    public void tencentSignature(String str, Promise promise) {
        InnerB innerB = new InnerB(str, promise);
        this.mThread = innerB;
        innerB.start();
    }

    @ReactMethod
    public void weapi(String str, Promise promise) {
        InnerA innerA = new InnerA(str, promise);
        this.mThread = innerA;
        innerA.start();
    }
}
