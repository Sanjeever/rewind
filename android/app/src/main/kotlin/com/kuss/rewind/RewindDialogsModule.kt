package com.kuss.rewind

import android.app.AlertDialog
import android.text.InputType
import android.widget.EditText
import com.facebook.react.bridge.*
import java.util.concurrent.atomic.AtomicBoolean

class RewindDialogsModule(private val context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    override fun getName() = "RewindDialogs"

    @ReactMethod
    fun prompt(title: String, message: String?, options: ReadableMap, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val activity = context.currentActivity
            if (activity == null) { promise.reject("E_DIALOG_ACTIVITY", "当前页面不可用"); return@runOnUiThread }
            val completed = AtomicBoolean()
            val input = EditText(activity)
            input.setText(if (options.hasKey("defaultValue")) options.getString("defaultValue") else "")
            input.inputType = if (options.hasKey("keyboardType") && options.getString("keyboardType") == "decimal-pad") InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL else InputType.TYPE_CLASS_TEXT
            val builder = AlertDialog.Builder(activity).setTitle(title).setMessage(message).setView(input)
                .setPositiveButton("确认") { _, _ ->
                    if (completed.compareAndSet(false, true)) promise.resolve(Arguments.createMap().apply { putString("action", "positive"); putString("text", input.text.toString()) })
                }
                .setNegativeButton("取消") { _, _ ->
                    if (completed.compareAndSet(false, true)) promise.resolve(Arguments.createMap().apply { putString("action", "negative") })
                }
                .setOnCancelListener {
                    if (completed.compareAndSet(false, true)) promise.resolve(Arguments.createMap().apply { putString("action", "negative") })
                }
            builder.show()
        }
    }

    @ReactMethod
    fun showPicker(title: String, message: String?, options: ReadableMap, promise: Promise) {
        UiThreadUtil.runOnUiThread {
            val activity = context.currentActivity
            if (activity == null) { promise.reject("E_DIALOG_ACTIVITY", "当前页面不可用"); return@runOnUiThread }
            val items = requireNotNull(options.getArray("items"))
            val labels = Array(items.size()) { index -> requireNotNull(items.getMap(index)).getString("label") ?: "" }
            val completed = AtomicBoolean()
            AlertDialog.Builder(activity).setTitle(title).setItems(labels) { _, index ->
                if (completed.compareAndSet(false, true)) promise.resolve(Arguments.createMap().apply {
                    putString("action", "positive"); putMap("selectedItem", Arguments.makeNativeMap(items.getMap(index)!!.toHashMap()))
                })
            }.setOnCancelListener {
                if (completed.compareAndSet(false, true)) promise.resolve(Arguments.createMap().apply { putString("action", "negative") })
            }.show()
        }
    }
}
