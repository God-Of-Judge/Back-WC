package com.smart.project.security;

import com.smart.project.common.vo.InternCookie;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Service
public class StudyCookieService {
	private static final String CONTEXT_DOMAIN = ".yeoboya.com";
	private static final int CONTEXT_AGE = 60 * 60 * 24 * 30; // 한달 간 인증
	private static final String COOKIE_PATH = "/";

	private static final String [] COOKIE_NAMES = { "gCCV"};

	/**********************************************************************************************
	 * @Method 설명 : 특정 쿠키 삭제
	 * @작성일 : 2021-10-26
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	public static void deleteCookie(HttpServletRequest req, HttpServletResponse res, String name){
		try {
			Cookie cookie = new Cookie(name, null);
			cookie.setMaxAge(0);
			cookie.setPath(COOKIE_PATH);
			cookie.setValue("");
			cookie.setComment("");
			cookie.setDomain(CONTEXT_DOMAIN);
			res.addCookie(cookie);
		} catch (Exception e) {
			log.error("Exception : {}", e);
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 모든 쿠키 삭제
	 * @작성일 : 2021-10-26
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	public static void deleteCookies(HttpServletRequest req, HttpServletResponse res){
		try {
			Cookie[] cookies = req.getCookies();
			if(cookies != null){
				for (int i = 0; i < cookies.length; i++) {
					for(String name : COOKIE_NAMES){
						if (cookies[i].getName().equals( name )){
							cookies[i].setMaxAge(0);
							cookies[i].setPath(COOKIE_PATH);
							cookies[i].setValue("");
							cookies[i].setComment("");
							cookies[i].setDomain(CONTEXT_DOMAIN);
							res.addCookie(cookies[i]);
						}
					}
				}
			}
		} catch (Exception e) {
			log.error("Exception : {}", e);
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 쿠키 생성 처리
	 * @작성일 : 2021-10-26
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	public static void createCookie(HttpServletResponse res, String name, String value, int maxAge){
		Cookie c = new Cookie(name, value);
		c.setComment(name);
		c.setPath("/");
		c.setDomain(CONTEXT_DOMAIN);
		c.setMaxAge(maxAge);
		res.addCookie(c);
	}

	/**********************************************************************************************
	 * @Method 설명 : 쿠키 생성(만료시간 추가)
	 * @작성일 : 2021-10-26
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	public static void createCookie(HttpServletResponse res, String name, String value){
		Cookie c = new Cookie(name, value);
		c.setComment(name);
		c.setPath("/");
		c.setDomain(CONTEXT_DOMAIN);
		c.setMaxAge(CONTEXT_AGE);
		res.addCookie(c);
	}

	/**********************************************************************************************
	 * @Method 설명 : 쿠키 데이터 셋팅
	 * @작성일 : 2021-11-09
	 * @작성자 : 김남현
	 * @변경이력 :
	 **********************************************************************************************/
	public static void setCookieData(String data, InternCookie internCookie){
		String _array [] = data.split("=");
		String _key = _array[0], _value = "";
		if ( _array.length > 1 ) _value = _array[1];
		if (_key.equals("EMPNO")) internCookie.setEmpNo(Integer.parseInt(_value));
	}
}
