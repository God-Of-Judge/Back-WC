package com.smart.project.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.juli.logging.Log;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
public class CookieUtil {
    private static final String CONTEXT_DOMAIN = "localhost";
    private static final int CONTEXT_AGE = 60 * 60 * 24; // 하루

    public static void createCookie(HttpServletResponse res, String name, String value){
        Cookie c = new Cookie(name, value);
        c.setComment(name);
        c.setPath("/");
        c.setDomain(CONTEXT_DOMAIN);
        c.setMaxAge(CONTEXT_AGE);
        res.addCookie(c);
    }

    public static void deleteCookie(HttpServletRequest req, HttpServletResponse res, String name){
        try {
            Cookie cookie = new Cookie(name, null);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            cookie.setValue("");
            cookie.setComment("");
            cookie.setDomain(CONTEXT_DOMAIN);
            res.addCookie(cookie);
        } catch (Exception e) {
            log.error("Exception : {}", e);
        }
    }
}

