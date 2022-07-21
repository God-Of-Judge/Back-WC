package com.smart.project.web.home.act;

import com.smart.project.proc.Test;
import com.smart.project.util.CookieUtil;
import com.smart.project.web.home.biz.MemberService;
import com.smart.project.web.home.vo.MemberVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class LoginAct {
    private final MemberService ms;
    public final Test test;

    @RequestMapping("/loginComplete")
    public String loginComplete(MemberVO vo, HttpServletResponse res) throws IOException {


        MemberVO mvo = test.login(vo);
        if (mvo != null){
            log.error("로그인 성공");
            CookieUtil.createCookie(res, "id", mvo.getMbId());

            if (mvo.getAdmin().equals("1")){
                // Admin이 1인 경우 = 관리자
                // Admin이 0인 경우 = 일반 유저
                return "redirect:admin/admin_main";
            }
            return "redirect:main";
        } else {
            log.error("로그인 실패");
            return "redirect:login";
        }
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response){

        Cookie[] cookies = request.getCookies();
        if (cookies.length > 0) {
            if (cookies[0].getValue().equals("kakao")){
                if(cookies != null){ // 쿠키가 한개라도 있으면 실행

                    for(int i=0; i< cookies.length; i++){
                        cookies[i].setMaxAge(0); // 유효시간을 0으로 설정
                        response.addCookie(cookies[i]); // 응답 헤더에 추가
                    }
                }
                return "redirect:kakaoLogout";
            }

            if(cookies != null){ // 쿠키가 한개라도 있으면 실행

                for(int i=0; i< cookies.length; i++){
                    cookies[i].setMaxAge(0); // 유효시간을 0으로 설정
                    response.addCookie(cookies[i]); // 응답 헤더에 추가
                }
            }
        }
        return "redirect:main";

    }

    @RequestMapping("/kakao")
    public String kakao(){
        return "redirect:https://kauth.kakao.com/oauth/authorize?client_id=d063d1ad6b1c07a4bd10a0c8fa990556&redirect_uri=http://localhost/kakaoLogin&response_type=code";
    }

    @RequestMapping("/kakaoLogin")
    public String kakaoLogin(@RequestParam("code") String code, HttpServletResponse res) throws Exception {
        CookieUtil.createCookie(res, "id", "kakao");
        log.error("token==>{}", code);
        String access_Token = ms.getAccessToken(code);
        log.error("token2==>{}", access_Token);

        HashMap<String, Object> userInfo = ms.getUserInfo(access_Token);
        log.error("###access_Token#### : " + access_Token);
        log.error("###nickname#### : " + userInfo.get("nickname"));
        log.error("###email#### : " + userInfo.get("email"));

        return "redirect:/main";

    }

    @RequestMapping("/kakaoLogout")
    public String kakaoLogout(){

        return "redirect:https://kauth.kakao.com/oauth/logout?client_id=d063d1ad6b1c07a4bd10a0c8fa990556&logout_redirect_uri=http://localhost/main";

    }

}
