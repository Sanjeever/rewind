package com.modules.mediastore;

import android.content.ContentUris;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.util.Base64;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.jaudiotagger.tag.mp4.atom.Mp4DataBox;

public class RNMediaStoreModule extends ReactContextBaseJavaModule {
    static final boolean $assertionsDisabled = false;
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
            String strAccess$000 = RNMediaStoreModule.access$000(RNMediaStoreModule.this, this.k);
            if (strAccess$000 != null) {
                this.l.resolve(strAccess$000);
            } else {
                this.l.reject("error", "not album");
            }
            RNMediaStoreModule.access$102(RNMediaStoreModule.this, null);
        }
    }

    class InnerB extends Thread {
        final Promise k;

        InnerB(Promise promise) {
            this.k = promise;
        }

        @Override
        public void run() {
            RNMediaStoreModule.access$200(RNMediaStoreModule.this, this.k);
            RNMediaStoreModule.access$102(RNMediaStoreModule.this, null);
        }
    }

    public RNMediaStoreModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    static String access$000(RNMediaStoreModule rNMediaStoreModule, String str) {
        return rNMediaStoreModule.getArtWorkJAVA(str);
    }

    static Thread access$102(RNMediaStoreModule rNMediaStoreModule, Thread thread) {
        rNMediaStoreModule.mThread = thread;
        return thread;
    }

    static void access$200(RNMediaStoreModule rNMediaStoreModule, Promise promise) {
        rNMediaStoreModule.playList(promise);
    }

    private String getArtWorkJAVA(String str) {
        try {
            ParcelFileDescriptor parcelFileDescriptorOpenFileDescriptor = getReactApplicationContext().getContentResolver().openFileDescriptor(ContentUris.withAppendedId(Uri.parse("content://media/external/audio/albumart"), Long.parseLong(str)), "r");
            if (parcelFileDescriptorOpenFileDescriptor != null) {
                return toBase64(BitmapFactory.decodeFileDescriptor(parcelFileDescriptorOpenFileDescriptor.getFileDescriptor()));
            }
            return null;
        } catch (IOException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    private void playList(Promise promise) {
        WritableMap writableMapCreateMap = Arguments.createMap();
        WritableArray writableArrayCreateArray = Arguments.createArray();
        try {
            try {
                Cursor cursorQuery = getReactApplicationContext().getContentResolver().query(Build.VERSION.SDK_INT >= 29 ? MediaStore.Audio.Media.getContentUri("external_primary") : MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{"_id", "title", "artist", "album", "duration", "album_id", "_data"}, null, null, "date_modified");
                try {
                    int columnIndexOrThrow = cursorQuery.getColumnIndexOrThrow("_id");
                    int columnIndexOrThrow2 = cursorQuery.getColumnIndexOrThrow("title");
                    int columnIndexOrThrow3 = cursorQuery.getColumnIndexOrThrow("artist");
                    int columnIndexOrThrow4 = cursorQuery.getColumnIndexOrThrow("album");
                    int columnIndexOrThrow5 = cursorQuery.getColumnIndexOrThrow("duration");
                    int columnIndexOrThrow6 = cursorQuery.getColumnIndexOrThrow("album_id");
                    int columnIndexOrThrow7 = cursorQuery.getColumnIndexOrThrow("_data");
                    while (cursorQuery.moveToNext()) {
                        String string = cursorQuery.getString(columnIndexOrThrow);
                        String string2 = cursorQuery.getString(columnIndexOrThrow2);
                        int i = columnIndexOrThrow;
                        String string3 = cursorQuery.getString(columnIndexOrThrow3);
                        int i2 = columnIndexOrThrow2;
                        String string4 = cursorQuery.getString(columnIndexOrThrow4);
                        int i3 = columnIndexOrThrow3;
                        String string5 = cursorQuery.getString(columnIndexOrThrow6);
                        int i4 = columnIndexOrThrow4;
                        String string6 = cursorQuery.getString(columnIndexOrThrow7);
                        int i5 = columnIndexOrThrow6;
                        int i6 = cursorQuery.getInt(columnIndexOrThrow5);
                        int i7 = columnIndexOrThrow5;
                        WritableMap writableMapCreateMap2 = Arguments.createMap();
                        writableMapCreateMap2.putString("id", string);
                        writableMapCreateMap2.putString("title", string2);
                        writableMapCreateMap2.putString("singer", string3);
                        writableMapCreateMap2.putString("album", string4);
                        writableMapCreateMap2.putString("albumId", string5);
                        writableMapCreateMap2.putString("path", string6);
                        writableMapCreateMap2.putInt("duration", i6);
                        writableArrayCreateArray.pushMap(writableMapCreateMap2);
                        columnIndexOrThrow = i;
                        columnIndexOrThrow2 = i2;
                        columnIndexOrThrow3 = i3;
                        columnIndexOrThrow4 = i4;
                        columnIndexOrThrow6 = i5;
                        columnIndexOrThrow5 = i7;
                        columnIndexOrThrow7 = columnIndexOrThrow7;
                    }
                    writableMapCreateMap.putArray(Mp4DataBox.IDENTIFIER, writableArrayCreateArray);
                    writableMapCreateMap.putInt("numbers", writableArrayCreateArray.size());
                    cursorQuery.close();
                    promise.resolve(writableMapCreateMap);
                } catch (Throwable th) {
                    if (cursorQuery == null) {
                        throw th;
                    }
                    try {
                        cursorQuery.close();
                        throw th;
                    } catch (Throwable th2) {
                        th.addSuppressed(th2);
                        throw th;
                    }
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        } catch (Throwable th3) {
            promise.resolve(writableMapCreateMap);
            throw th3;
        }
    }

    private String toBase64(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        return Base64.encodeToString(byteArrayOutputStream.toByteArray(), 0);
    }

    @ReactMethod
    public void getArtWork(String str, Promise promise) {
        InnerA innerA = new InnerA(str, promise);
        this.mThread = innerA;
        innerA.start();
    }

    @Override
    public String getName() {
        return "RNMediaStore";
    }

    @ReactMethod
    public void getPlayList(Promise promise) {
        InnerB innerB = new InnerB(promise);
        this.mThread = innerB;
        innerB.start();
    }
}
