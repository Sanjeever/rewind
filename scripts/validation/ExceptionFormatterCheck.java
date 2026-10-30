import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;

public class ExceptionFormatterCheck {
    public static void main(String[] args) {
        Map<String, Object> values = new HashMap<>();
        values.put("methodName", "render");
        ReadableMap frame = (ReadableMap) Proxy.newProxyInstance(ReadableMap.class.getClassLoader(), new Class<?>[]{ReadableMap.class}, (proxy, method, arguments) -> {
            String key = (String) arguments[0];
            switch (method.getName()) {
                case "hasKey": return values.containsKey(key);
                case "isNull": return values.get(key) == null;
                case "getString": return (String) values.get(key);
                case "getInt": return ((Number) values.get(key)).intValue();
                case "getType": return values.get(key) instanceof Number ? ReadableType.Number : ReadableType.String;
                default: throw new UnsupportedOperationException(method.getName());
            }
        });
        ReadableArray stack = (ReadableArray) Proxy.newProxyInstance(ReadableArray.class.getClassLoader(), new Class<?>[]{ReadableArray.class}, (proxy, method, arguments) -> {
            if (method.getName().equals("size")) return 1;
            if (method.getName().equals("getMap")) return frame;
            throw new UnsupportedOperationException(method.getName());
        });
        check(stack, "message, stack:\nrender@?\n");
        values.put("lineNumber", null);
        check(stack, "message, stack:\nrender@?\n");
        values.put("lineNumber", 12);
        values.put("column", 3);
        check(stack, "message, stack:\nrender@12:3\n");
        System.out.println("通过：缺失与空行号保留未知标记，正常行列号保持原样");
    }

    private static void check(ReadableArray stack, String expected) {
        String actual = d.e.m.z0.a.a("message", stack);
        if (!expected.equals(actual)) throw new AssertionError(actual);
    }
}
