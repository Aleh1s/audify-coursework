package com.aleh1s.backend.audio;

import lombok.Getter;
import lombok.Setter;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static java.util.Objects.nonNull;

@Getter
@Setter
public class AudioRange {

    private static final Pattern RANGE_PATTERN = Pattern.compile("^bytes=(\\d+)-(\\d+)?/?(\\d+)?$");

    private long start;
    private Long end;
    private Long length;

    private AudioRange(long start, Long end, Long length) {
        this.start = start;
        this.end = end;
        this.length = length;
    }

    public static AudioRange parse(String range) {
        if (range != null) {
            Matcher matcher = RANGE_PATTERN.matcher(range);

            if (matcher.find()) {
                String startStr = matcher.group(1);
                String endStr = matcher.group(2);
                String lengthStr = matcher.group(3);

                return new AudioRange(
                        nonNull(startStr) ? Long.parseLong(startStr) : 0,
                        nonNull(endStr) ? Long.parseLong(endStr) : null,
                        nonNull(lengthStr) ? Long.parseLong(lengthStr) : null
                );
            }
        }

        return null;
    }
}
