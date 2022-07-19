package com.smart.project.util;

import com.inforex.util.ClientUtilParent;
import com.smart.project.common.vo.InforexAgent;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.mobile.device.Device;
import org.springframework.mobile.device.DevicePlatform;
import org.springframework.mobile.device.LiteDeviceResolver;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**********************************************************************************************
 * @Method 설명 : 클라이언트 정보 취득
 * @작성일   : 2018. 5. 17.
 * @작성자   : 신희원
 * @변경이력  :
 **********************************************************************************************/
@Slf4j
public class ClientUtil extends ClientUtilParent {

	/* 부동산에서만 필요한 유틸메소드가 있다면 여기 작성, 공통인 경우는 라이브러리에 추가 */

	/**********************************************************************************************
	 * @Method 설명 : 접속자 서브 도메인 취득
	 * @작성일   : 2018. 5. 17.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getServerAlias(HttpServletRequest request){
		String subDomain = request.getServerName().split("\\.")[0];
		if(subDomain.equals("yeoboya")) {
			return "";
		}
		return subDomain;
	}

	/**********************************************************************************************
	 * @Method 설명 : 접속자 현재 도메인 명 취득
	 * @작성일   : 2018. 5. 17.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getServerDomainName(HttpServletRequest request){
		return  getServerAlias(request) + ".yeoboya.com";
	}

	/**********************************************************************************************
	 * @Method 설명 : Device 정보 반환 s:앱 x:모바일 w:pc로 접속함 (무조건 pc화면으로 보여줘야함)
	 * @작성일	   : 2019. 2. 26.
	 * @작성자	   : 박준석
	 * @변경이력	 :
	 * - 2019.04.23 : 미디어 빈값방지용. 정상적인 경우는 아니지만 미디어가 빈값이면 안된다기에 설정함. (김상훈)
	 * - 2021.08.11 : www가 있을땐 url 정보로 구분 했지만 이제 필요없어서 기존 룰대로 변경
	 **********************************************************************************************/
	public static String getMedia(HttpServletRequest request){
		Device device = new LiteDeviceResolver().resolveDevice(request);
		if(getAgent(request).contains("YEOBOYA")) {
			return "s";
		} else if (device.isMobile() || device.isTablet()){
			return "x";
		} else if(device.isNormal()){
			return "w";
		} else { //
			return "s";
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : Device 정보 반환 s:앱 x:모바일 w:pc로 접속함 (무조건 pc화면으로 보여줘야함)
	 * @작성일	   : 2019. 12. 10.
	 * @작성자	   : 조문기
	 * @변경이력	 :
	 * - 2019.04.23 : CookieAutoLoginFilter에서 redirect Url 시킬 경우에는 이 방법을 써야하기 때문에 추가
	 **********************************************************************************************/
	public static String getMedia2(HttpServletRequest request){
		Device device = new LiteDeviceResolver().resolveDevice(request);
		if(getAgent(request).contains("YEOBOYA")) {
			return "s";
		} else if (device.isMobile() || device.isTablet()){
			return "x";
		} else if(device.isNormal()){
			return "w";
		} else { //
			return "s";
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 접속 URL에 따른 접속 타입을 구분을 한다.
	 * @작성일	   : 2019. 10. 28.
	 * @작성자	   : 박준석
	 * @변경이력	 :
	 **********************************************************************************************/
	public static String getUrlConnectType(HttpServletRequest request){
		if(getServerAlias(request).contains("www")) {
			return "w";
		} else {
			return "m";
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 모바일 사용 여부 반환 true => 앱(s) 혹은 모바일웹(x), false => PC웹(w)
	 * @작성일   : 2018. 7. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	public static boolean isMobile(HttpServletRequest request){
		String media = getMedia(request);
		return !media.equals("w");
	}

	/**********************************************************************************************
	 * @Method 설명 : PC 여부를 도메인만 보고 판단
	 * @작성일   : 2019-10-28
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static boolean isWWW(HttpServletRequest request){

		if(getServerAlias(request).contains("www")) {
			return true;
		} else {
			return false;
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 모바일 디바이스 타입 취득
	 * @작성일   : 2018. 7. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getMobileDevice(HttpServletRequest request){
		String media = getMedia(request);
		if(media.equals("x") || media.equals("s")){
			Device device = new LiteDeviceResolver().resolveDevice(request);
			if(device.isMobile() || device.isTablet()){
				if(device.getDevicePlatform().equals(DevicePlatform.ANDROID)){
					return "android";
				}else if(device.getDevicePlatform().equals(DevicePlatform.IOS)){
					return "ios";
				}else{
					return "unknown";
				}
			}
		}
		return "unknown";
	}

	/**********************************************************************************************
	 * @Method 설명 : 세션아이디 가져오기
	 * @작성일   : 2018-08-30
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getSessKey(HttpServletRequest request){
		UUID uuid = UUID.randomUUID();
		String sessionID = uuid.toString().replace("-", "");
		try {
			Cookie[] cookie = request.getCookies();
			if(cookie != null) {
				for (Cookie c : cookie) {
					if (c.getName().equals("JSESSIONID")) {
						sessionID = c.getValue();
						break;
					}
				}
			}
		} catch (Exception ignored) {}

		return sessionID;
	}
	/**********************************************************************************************
	 * @Method 설명 : 특정 쿠기 가져오기
	 * @작성일   : 2019-11-19
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getCookieVal(HttpServletRequest request, String CookieKey){
		String cookieVal = "";
		try {
			Cookie[] cookie = request.getCookies();
			if(cookie != null) {
				for (Cookie c : cookie) {
					if (c.getName().equals(CookieKey)) {
						cookieVal = c.getValue();
						break;
					}
				}
			}
		} catch (Exception ignored) {}

		return cookieVal;
	}

	/**********************************************************************************************
	 * @Method 설명 : App Agent 취득
	 * @작성일   : 2018. 5. 29. -> 2019.12.05
	 * @작성자   : 신희원 -> 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static InforexAgent getAppAgent(HttpServletRequest request){
		String userAgent = request.getHeader("User-Agent");
		if(userAgent != null){
			if( userAgent.contains("YEOBOYA") ) {
				String sAgentInfo = userAgent.substring( userAgent.indexOf("YEOBOYA") );
				if(sAgentInfo.lastIndexOf("YEOBOYA") > 0){
					sAgentInfo = sAgentInfo.substring(sAgentInfo.lastIndexOf("YEOBOYA"));
				}
				String[] data = sAgentInfo.split("\\|");
				return Optional.ofNullable(data).filter(a -> a.length >= 6).map(item -> {
					InforexAgent inforexAgent = new InforexAgent();
					inforexAgent.setDeviceType((new LiteDeviceResolver().resolveDevice(request).getDevicePlatform()));
					inforexAgent.setServiceType(item[1]);

					if(String.valueOf(inforexAgent.getDeviceType()).equals("UNKNOWN")) {
						inforexAgent.setDeviceType( item[1].equals("a") ? DevicePlatform.ANDROID : DevicePlatform.IOS );
					}

					inforexAgent.setDeviceId(item[2]);
					inforexAgent.setAppVersion(item[4]);
					inforexAgent.setPhoneVersion(item[5]);
					inforexAgent.setAppProvider(item[1].equals("a") ? item[6] : "appstore");
					inforexAgent.setIAppVersion(getAppVersionNumber(inforexAgent));		//예 : 1.5.130 ==> 130 넘겨줌.
					return inforexAgent;
			   }).orElse(null);
			}
		}
		return null;
	}

	/**********************************************************************************************
	 * @Method 설명 : agent 중복 데이터 예외처리
	 * @작성일   : 2020-05-18
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static String getMemAgent(HttpServletRequest request){
		String userAgent = request.getHeader("User-Agent");
		if(userAgent != null) {
			if (userAgent.contains("YEOBOYA")) {
				String sAgentInfo = userAgent.substring(userAgent.indexOf("YEOBOYA"));
				if (sAgentInfo.lastIndexOf("YEOBOYA") > 0) {
					userAgent = userAgent.substring(0, userAgent.indexOf("YEOBOYA")) + sAgentInfo.substring(sAgentInfo.lastIndexOf("YEOBOYA"));
				}
			}
		}else{
			userAgent = "";
		}
		return userAgent;
	}

	/**********************************************************************************************
	 * @Method 설명 : 어플 채널 코드 리턴
	 * @작성일   : 2019-07-12
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static int getAppChannerCode(InforexAgent agent){
		int result = 501;
		if (agent != null) {
			result = getAppChannelCode(agent.getAppVersion(), "\\.");
		}
		return result;
	}

	/**********************************************************************************************
	 * @Method 설명 : 채널 코드
	 * @작성일   : 2019-07-15
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static int getAppChannelCode (String appVersion, String pattern) {
		int iRet = 501;
		if (StringUtils.isNotEmpty(appVersion)) {
            List<String> appVersionList = Arrays.asList(appVersion.split(pattern));
            if(appVersionList != null && appVersionList.size() == 3){
                String sCode = appVersionList.get(0);	//스토어 구분 코드
                switch (sCode){
                    case "1":		//PlayStore
                        iRet = 501;
                        break;
                    case "2":		//OneStore
                        iRet = 502;
                        break;
                    case "6":		//appStore
                        iRet = 501;
                        break;
                }
            }
        }
		return iRet;
	}

	/**********************************************************************************************
	 * @Method 설명 : App 버전 정로를 Integer로 넘겨 줌.
	 * @작성일   : 2019-08-19
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static int getAppVersionNumber(InforexAgent agent){
		int result = 0;
		if (agent != null) {
			result = getAppNumber(agent.getAppVersion(), "\\.");
		}
		return result;
	}

	/**********************************************************************************************
	 * @Method 설명 : 버전넘버
	 * @작성일   : 2019-08-19
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	public static int getAppNumber (String appVersion, String pattern) {
		int iRet = 0;
		List<String> appVersionList = Arrays.asList(appVersion.split(pattern));
		if(appVersionList != null && appVersionList.size() == 3){
			iRet = Integer.parseInt(appVersionList.get(1))*10000 + Integer.parseInt(appVersionList.get(2));
		}
		return iRet;
	}

	/**********************************************************************************************
	 * @Method 설명 : 버전넘버
	 * @작성일   : 2020-06-04
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static int getAppleAppNumber (String appVersion, String pattern) {
		int iRet = 0;
		List<String> appVersionList = Arrays.asList(appVersion.split(pattern));
		if(appVersionList != null && appVersionList.size() == 3){
			iRet = (Integer.parseInt(appVersionList.get(0)) * 10000) + (Integer.parseInt(appVersionList.get(1)) * 1000) + Integer.parseInt(appVersionList.get(2));
		}
		return iRet;
	}

    // 2019.12.09 Raccoon : ClientUtilParent에 있는 항목을 오버 라이드 하였다.
	public static boolean isCompany(HttpServletRequest request) {
		String clientIp = getClientIP(request);
		// 세정아울렛 사무실
		String sStartIpAddress = "61.80.148.1";
		String sEndIpAddress = "61.80.148.255";

		return (ipToLong(sStartIpAddress) <= ipToLong(clientIp) && ipToLong(clientIp) <= ipToLong(sEndIpAddress)) ||
				clientIp.equals("59.13.127.250") || clientIp.equals("59.13.127.251") || clientIp.equals("127.0.0.1");
	}

	private static long ipToLong(String ipAddress) {
		long result = 0L;
		String[] ipAddressInArray = ipAddress.split("\\.");

		for(int i = 3; i >= 0; --i) {
			long ip = Long.parseLong(ipAddressInArray[3 - i]);
			result |= ip << i * 8;
		}

		return result;
	}



	/**********************************************************************************************
	 * @Method 설명 : google 로그인 AppVersion Checker
	 * @작성일   : 2020-04-06
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static boolean getGoogleChecker(HttpServletRequest req, InforexAgent agent){
		boolean flag = false;
		if (agent != null) {
			if(getMobileDevice(req).equals("android") && getMedia(req).equals("s")) {
				int checker = getAppNumber(agent.getAppVersion(), "\\.");
				if(getAppChannerCode(agent) == 501) {
					// 구글 플레이 스토어
					if(checker > 50157) {
						flag = true;
					}
				} else if(getAppChannerCode(agent) == 502) {
					// 원 스토어
					if(checker > 50158) {
						flag = true;
					}
				}
			}
		} else if(getMedia(req).equals("x")) {
			if(getMobileDevice(req).equals("android")) {
				flag = true;
			}
		} else {
			if(getBrowser(req).equals("CHROME")) {
				flag = true;
			}
		}

		return flag;
	}

	/**********************************************************************************************
	 * @Method 설명 : google 로그인 AppVersion Checker
	 * @작성일   : 2020-04-06
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static boolean getAppleChecker(HttpServletRequest req, InforexAgent agent){
		boolean flag = false;
		if (agent != null) {
			if(getMobileDevice(req).equals("ios") && getMedia(req).equals("s")) {
				int checker = getAppleAppNumber(agent.getAppVersion(), "\\.");
				if(getAppChannerCode(agent) == 501) {
					// 앱 스토어 ==> 6.6.25 = 66025
					if(checker >= 66025) {
						flag = true;
					}
				}
			}
		} else if(getMedia(req).equals("x")) {
			if(getMobileDevice(req).equals("ios")) {
				flag = true;
			}
		} else {
			if(getBrowser(req).equals("SAFARI")) {
				flag = true;
			}
		}

		return flag;
	}

	public static String getBrowser(HttpServletRequest request) {
		String userAgent  = request.getHeader("User-Agent");
		String browser = "";
		if(userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) { //IE
			if(userAgent.indexOf("Trident/7") > -1) {
				browser = "IE11";
			}else if(userAgent.indexOf("Trident/6") > -1) {
				browser = "IE10";
			}else if(userAgent.indexOf("Trident/5") > -1) {
				browser = "IE9";
			}else if(userAgent.indexOf("Trident/4") > -1) {
				browser = "IE8";
			}else if(userAgent.indexOf("edge") > -1) {
				browser = "IE Edge";
			}
		}else if(userAgent.indexOf("Whale") > -1){ //네이버 WHALE
			browser = "WHALE";
			//browser = "WHALE " + userAgent.split("Whale/")[1].toString().split(" ")[0].toString();
		}else if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1){ //오페라
			if(userAgent.indexOf("Opera") > -1) {
				browser = "OPERA";
				//browser = "OPERA " + userAgent.split("Opera/")[1].toString().split(" ")[0].toString();
			}else if(userAgent.indexOf("OPR") > -1) {
				browser = "OPERA";
				//browser = "OPERA " + userAgent.split("OPR/")[1].toString().split(" ")[0].toString();
			}
		}else if(userAgent.indexOf("Firefox") > -1){ //파이어폭스
			browser = "FIREFOX";
			//browser = "FIREFOX " + userAgent.split("Firefox/")[1].toString().split(" ")[0].toString();
		}else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1 ){ //사파리
			browser = "SAFARI";
			//browser = "SAFARI " + userAgent.split("Safari/")[1].toString().split(" ")[0].toString();
		}else if(userAgent.indexOf("Chrome") > -1){ //크롬
			browser = "CHROME";
			//browser = "CHROME " + userAgent.split("Chrome/")[1].toString().split(" ")[0].toString();
		}
		return browser;
	}


	/**********************************************************************************************
	 * @Method 설명 : 메인으로 넘기는 리다이렉트 전용
	 * @작성일   : 2020-04-06
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static String AbsoluteRedirect(HttpServletRequest req, String SERVER_ACTIVE){
		String rtnUrl = "/";
		if(ClientUtil.getMedia(req).equals("w") || ClientUtil.getMedia2(req).equals("w") || ClientUtil.isWWW(req)) {
			if(SERVER_ACTIVE.equals("real")) {
				rtnUrl = "https://m.yeoboya.com/";
			} else if(SERVER_ACTIVE.equals("test")) {
				rtnUrl = "https://devm2.yeoboya.com/";
			} else {
				String target = req.getRequestURL().toString();
				String convert = target.substring(target.indexOf("-"), target.indexOf("."));

				rtnUrl = "https://devm" + convert + ".yeoboya.com/";
			}
		}

		return rtnUrl;
	}

	/**********************************************************************************************
	 * @Method 설명 : 메인으로 넘기는 리다이렉트 전용
	 * @작성일   : 2020-04-06
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static String AbsoluteRedirectStartPage(HttpServletRequest req, String SERVER_ACTIVE){
		String rtnUrl = "/";
		if(ClientUtil.getMedia(req).equals("w") || ClientUtil.getMedia2(req).equals("w") || ClientUtil.isWWW(req)) {
			if(SERVER_ACTIVE.equals("real")) {
				rtnUrl = "https://m.yeoboya.com/startPage";
			} else if(SERVER_ACTIVE.equals("test")) {
				rtnUrl = "https://devm2.yeoboya.com/startPage";
			} else {
				String target = req.getRequestURL().toString();
				String convert = target.substring(target.indexOf("-"), target.indexOf("."));

				rtnUrl = "https://devm" + convert + ".yeoboya.com/startPage";
			}
		}

		return rtnUrl;
	}

	/**********************************************************************************************
	 * @Method 설명 : google 로그인 AppVersion Checker
	 * @작성일   : 2020-04-06
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	public static boolean getMsgMaxLengthChecker(HttpServletRequest req, InforexAgent agent){
		boolean flag = false;
		if (agent != null) {
			if(String.valueOf(agent.getDeviceType()).equals("ANDROID") && getMedia(req).equals("s")) {
				int checker = getAppNumber(agent.getAppVersion(), "\\.");
				if(getAppChannerCode(agent) == 501) {
					// 구글 플레이 스토어
					if(checker > 50236) {
						flag = true;
					}
				} else if(getAppChannerCode(agent) == 502) {
					// 원 스토어
					if(checker > 50236) {
						flag = true;
					}
				}
			} else if(getMobileDevice(req).equals("ios") && getMedia(req).equals("s")) {
				int checker = getAppleAppNumber(agent.getAppVersion(), "\\.");
				if(getAppChannerCode(agent) == 501) {
					// 앱 스토어 ==> 6.6.25 = 66025
					if(checker >= 66065) {
						flag = true;
					}
				}
			}
		}

		return flag;
	}

	/**********************************************************************************************
	 * @Method 설명 : 현재 내가 보유하고 있는 쿠키중에 필요한 쿠키를 가져온다.
	 * @작성일      : 2021-09-02
	 * @작성자      :
	 * @변경이력    :
	 **********************************************************************************************/
	public static Map<String, String> getCurrentCookie(HttpServletRequest request) throws Exception{
		Map<String, String> resultMap = new HashMap<String, String>();
		List<String> cookieKeylist = new ArrayList<>();
		cookieKeylist.add("id");
//		cookieKeylist.add("USER_ID");
//		cookieKeylist.add("NAME");
//		cookieKeylist.add("EMP_NO");
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
