package io.github.openrewind

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import io.github.openrewind.player.AudioPlayerModule

class RewindPackage : ReactPackage {
    override fun createNativeModules(context: ReactApplicationContext): List<NativeModule> =
        listOf(RewindStorageModule(context), RewindDeviceModule(context), RewindMediaStoreModule(context), RewindDialogsModule(context), RewindCryptoModule(context), RewindAudioTaggerModule(context), RewindCookiesModule(context), RewindSegmentationModule(context), AudioPlayerModule(context))

    override fun createViewManagers(context: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()
}
