package com.smart.project.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class LoginUserCookieInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        try {

            Map<String, String> currentCookie = getCurrentCookie(request);

            if(currentCookie != null) {
                if(currentCookie.get("EMP_NO") != null && !currentCookie.get("EMP_NO").equals("")) {
                    return true;
                } else {
                    String protocol = request.isSecure() ? "https://" : "http://";
                    response.sendRedirect(protocol + request.getServerName() + "/member/login");
                }
            } else {
                String protocol = request.isSecure() ? "https://" : "http://";
                response.sendRedirect(protocol + request.getServerName() + "/member/login");
            }
        } catch (Exception e) {
            try {
                String protocol = request.isSecure() ? "https://" : "http://";
                response.sendRedirect(protocol + request.getServerName() + "/member/login");
            } catch(Exception ee) {
                return false;
            }

            return false;
        }

        return false;
    }

    /**********************************************************************************************
     * @Method 설명 : 현재 내가 보유하고 있는 쿠키중에 필요한 쿠키를 가져온다.
     * @작성일      : 2021-09-02
     * @작성자      :
     * @변경이력    :
     **********************************************************************************************/
    private Map<String, String> getCurrentCookie(HttpServletRequest request) throws Exception{
        Map<String, String> resultMap = new HashMap<String, String>();
        List<String> cookieKeylist = new ArrayList<>();
        cookieKeylist.add("USER_ID");
        cookieKeylist.add("NAME");
        cookieKeylist.add("EMP_NO");
        try {
            Cookie[] cookies = request.getCookies();
            for (int i = 0; i < cookies.length; i++) {
                for(String sCookieKey : cookieKeylist){
                    if (cookies[i].getName().equals(sCookieKey)) {
                        if (!cookies[i].getValue().equals("")) {
                            resultMap.put(sCookieKey, cookies[i].getValue());
                        }
                    }
                }
            }
        }catch(Exception e){
            log.error("{}", e);
        }finally {
            return resultMap;
        }
    }
}
