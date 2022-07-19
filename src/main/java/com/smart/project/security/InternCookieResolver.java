package com.smart.project.security;

import com.smart.project.common.vo.InternCookie;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import javax.servlet.http.HttpServletRequest;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Optional;

/**********************************************************************************************
 * @Method 설명 : 쿠키 리졸버 처리
 * @작성일 : 2021-09-03
 * @작성자 :
 * @변경이력 :
 **********************************************************************************************/ 
@Slf4j
public class InternCookieResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.getParameterType().equals(InternCookie.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        InternCookie internCookie = new InternCookie();

        Optional.ofNullable( ((HttpServletRequest) webRequest.getNativeRequest()).getCookies() )
                .ifPresent( cookies -> {
                    Arrays.stream( cookies )
                        .forEach( c-> {
                            switch ( c.getName() ){
                                case "USER_ID":
                                    internCookie.setUserId(c.getValue());
                                    break;
                                case "NAME":
                                    try {
                                        internCookie.setName(new String(URLDecoder.decode(new String(c.getValue().getBytes()), "EUC-KR")));
                                    }catch (Exception e){
                                        log.debug("[ERROR] Cookie Set NAME",e);
                                    }
                                    break;
                                case "EMP_NO":
                                    try{
                                        Arrays.stream(URLDecoder.decode(c.getValue(), "UTF-8").split("\\|"))
                                                .forEach((v) -> {
                                                    String _array[] = v.split("=");
                                                    if (_array.length == 2) {
                                                        String _key = _array[0];
                                                        String _value = _array[1];

                                                        if (_key.equals("emp_no") && StringUtils.isNumeric(_value)){
                                                            internCookie.setEmpNo(Integer.parseInt(_value));
                                                        }
                                                    }
                                                });
                                    }catch (Exception e){
                                        log.error("{}", e);
                                    }
                                    break;
                            }
                        });
                });
        return internCookie;
    }
}
