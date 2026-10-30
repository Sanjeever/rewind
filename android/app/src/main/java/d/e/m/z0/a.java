package d.e.m.z0;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class a {
    private static final Pattern FILE_PATTERN = Pattern.compile("(?:^|[/\\\\])(\\d+\\.js)$");

    public static String a(String message, ReadableArray stack) {
        StringBuilder result = new StringBuilder(message).append(", stack:\n");
        for (int index = 0; index < stack.size(); index++) {
            ReadableMap frame = stack.getMap(index);
            result.append(frame.getString("methodName")).append("@").append(b(frame));
            if (frame.hasKey("lineNumber") && !frame.isNull("lineNumber") && frame.getType("lineNumber") == ReadableType.Number) {
                result.append(frame.getInt("lineNumber"));
            } else {
                result.append("?");
            }
            if (frame.hasKey("column") && !frame.isNull("column") && frame.getType("column") == ReadableType.Number) {
                result.append(":").append(frame.getInt("column"));
            }
            result.append("\n");
        }
        return result.toString();
    }

    private static String b(ReadableMap frame) {
        if (!frame.hasKey("file") || frame.isNull("file") || frame.getType("file") != ReadableType.String) {
            return "";
        }
        Matcher matcher = FILE_PATTERN.matcher(frame.getString("file"));
        return matcher.find() ? matcher.group(1) + ":" : "";
    }
}
