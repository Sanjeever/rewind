package com.modules.audioTagger;

import android.content.Context;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.ParcelFileDescriptor;
import android.provider.MediaStore;
import android.util.Log;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.audio.generic.Utils;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.images.AndroidArtwork;

public class RNAudioTaggerModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RNAudioTagger";

    public RNAudioTaggerModule(ReactApplicationContext reactApplicationContext) {
        super(reactApplicationContext);
    }

    private static byte[] bitmapToBytes(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        try {
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
        } catch (Exception e2) {
            e2.printStackTrace();
        }
        return byteArrayOutputStream.toByteArray();
    }

    private void commitTag(String str, ReadableMap readableMap, Promise promise) {
        WritableMap writableMapCreateMap = Arguments.createMap();
        try {
            try {
                String string = readableMap.getString("title");
                String string2 = readableMap.getString("album");
                String string3 = readableMap.getString("artist");
                String string4 = readableMap.getString("image");
                if ((string == null) | (string2 == null) | (string3 == null)) {
                    promise.reject("1", "title or album or artist is undefined");
                }
                AudioFile audioFile = AudioFileIO.read(new File(str));
                Tag tagOrCreateAndSetDefault = audioFile.getTagOrCreateAndSetDefault();
                tagOrCreateAndSetDefault.setField(FieldKey.TITLE, string);
                tagOrCreateAndSetDefault.setField(FieldKey.ALBUM, string2);
                tagOrCreateAndSetDefault.setField(FieldKey.ARTIST, string3);
                if (string4 != null) {
                    Bitmap bitmapB = com.kuss.rewind.g.a.b(string4);
                    AndroidArtwork androidArtwork = new AndroidArtwork();
                    androidArtwork.setBinaryData(bitmapToBytes(bitmapB));
                    tagOrCreateAndSetDefault.addField(androidArtwork);
                }
                commitTag(audioFile);
            } finally {
                writableMapCreateMap.putInt("code", 200);
                promise.resolve(writableMapCreateMap);
            }
        } catch (IOException | NullPointerException | UnsupportedOperationException | CannotReadException | CannotWriteException | InvalidAudioFrameException | ReadOnlyFileException | TagException e2) {
            e2.printStackTrace();
            promise.reject("404", "occur error");
        }
    }

    private void commitTag(AudioFile audioFile) throws CannotWriteException {
        ReactApplicationContext reactApplicationContext = getReactApplicationContext();
        if (Build.VERSION.SDK_INT < 29) {
            audioFile.commit();
            return;
        }
        try {
            File file = audioFile.getFile();
            File fileCreateTempFile = File.createTempFile("audio-temp", '.' + Utils.getExtension(file));
            Utils.copy(file, fileCreateTempFile);
            fileCreateTempFile.deleteOnExit();
            audioFile.setFile(fileCreateTempFile);
            audioFile.commit();
            ParcelFileDescriptor parcelFileDescriptorOpenFileDescriptor = reactApplicationContext.getContentResolver().openFileDescriptor(getContentUri(reactApplicationContext, file), "rw");
            if (parcelFileDescriptorOpenFileDescriptor == null) {
                Log.d(TAG, "pfd is null");
                return;
            }
            byte[] byteArray = toByteArray(new FileInputStream(fileCreateTempFile));
            FileOutputStream fileOutputStream = new FileOutputStream(parcelFileDescriptorOpenFileDescriptor.getFileDescriptor());
            fileOutputStream.write(byteArray);
            fileOutputStream.close();
            if (!fileCreateTempFile.delete()) {
                Log.d(TAG, "temp cannot be deleted");
            }
            MediaScannerConnection.scanFile(reactApplicationContext, new String[]{file.getAbsolutePath()}, new String[]{"audio/mpeg"}, null);
        } catch (Exception e2) {
            e2.printStackTrace();
        }
    }

    public static Uri getContentUri(Context context, File file) {
        Cursor cursorQuery = context.getContentResolver().query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, new String[]{"_id"}, "_data=? ", new String[]{file.getAbsolutePath()}, null);
        int columnIndex = cursorQuery.getColumnIndex("_id");
        if (!cursorQuery.moveToFirst()) {
            return null;
        }
        String string = cursorQuery.getString(columnIndex);
        cursorQuery.close();
        return Uri.withAppendedPath(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, string);
    }

    private void lambda$commit$0(String str, ReadableMap readableMap, Promise promise) {
        commitTag(str, readableMap, promise);
    }

    private static byte[] toByteArray(InputStream inputStream) throws IOException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        byte[] bArr = new byte[4096];
        while (true) {
            int i = inputStream.read(bArr);
            if (i == -1) {
                inputStream.close();
                return byteArrayOutputStream.toByteArray();
            }
            byteArrayOutputStream.write(bArr, 0, i);
        }
    }

    public void a(String str, ReadableMap readableMap, Promise promise) {
        lambda$commit$0(str, readableMap, promise);
    }

    @ReactMethod
    public void commit(String str, ReadableMap readableMap, Promise promise) {
        new Thread(new AudioTaggerPackage(this, str, readableMap, promise)).start();
    }

    @Override
    public String getName() {
        return TAG;
    }
}
