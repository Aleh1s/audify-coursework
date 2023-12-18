package com.aleh1s.backend.util;

public class ArrayUtils {

    public static byte[] readByteRange(byte[] source, long start, long end) {
        byte[] data = new byte[(int) (end - start + 1)];
        System.arraycopy(source, (int) start, data, 0, data.length);
        return data;
    }

}
