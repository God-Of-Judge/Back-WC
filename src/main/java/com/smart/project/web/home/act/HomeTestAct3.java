package com.smart.project.web.home.act;

import com.smart.project.component.CommonCodeComponent;
import com.smart.project.component.data.CodeObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@Controller
@RequiredArgsConstructor
public class HomeTestAct3 {


    private final CommonCodeComponent commonCodeComponent;

    /* 공통 영역*/
    @RequestMapping("/head")
    public String head(){
        return "fragment/head";
    }

    @RequestMapping("/admin_head")
    public String adminHead(){
        return "fragment/admin_head";
    }


    @RequestMapping("/login")
    public void login(){
    }


    /*========================================================================================*/

    /* 참고페이지*/
    @RequestMapping("/index")
    public void index() {
    }

    @RequestMapping("/buttons")
    public void buttons(){
    }

    @RequestMapping("/shop_checkout")
    public void shop_checkout(){

    }

    @RequestMapping("/layout-sidenav-light2")
    public void layoutSidenavLight2(){

    }
    @RequestMapping("/admin/layout-static2")
    public void layoutStatic2(){

    }

    @RequestMapping("/register2")
    public void register2(){

    }

    @RequestMapping("/icons")
    public void icons(){
    }



    /*========================================================================================*/

    /* 사용자 페이지 */
    @RequestMapping("/main")
    public void main(){

    }

    @RequestMapping("/service")
    public void service(){

    }

    // 동영상 업로드
    @RequestMapping("/upload")
    public void upload(){

    }

    // 분석결과 페이지
    @RequestMapping("/result")
    public void result(){

    }

    // 회원정보수정
    @RequestMapping("/join_edit")
    public void join_edit(){

    }

    // 회원가입
    @RequestMapping("/join")
    public void join(){

    }

    // 커뮤니티
    @RequestMapping("/community")
    public void community(){

    }

    // 커뮤니티 글보기
    @RequestMapping("/write_view")
    public void write_view(){

    }

    // 마이게시판
    @RequestMapping("/myList")
    public void myList(){
    }

    // 글쓰기
    @RequestMapping("/write")
    public void write(){

    }

    @PostMapping("/test4")
    @ResponseBody
    public Map<String, Object> test1(@RequestBody Map param) {
        Map<String, Object> result = new HashMap<>();
        String keyData = String.valueOf(param.get("key"));
        log.error("key===>{}", keyData);
        String temp = "i,b,k,g,f,h,e,z,j,p,o,n,l,d,c,a,m,q";
        if (keyData.equals("all")) {
            keyData = temp;
            log.error("keyAll==>{}", keyData);
        }

        String[] key = keyData.split(",");

        List<String> keyList = new ArrayList<>();
        if (StringUtils.isNotEmpty(keyData)) {
            keyList = Arrays.asList(keyData.split(","));
        }
//        log.error(key+"");
        log.error(keyList + "");

        List<CodeObject.Code> data = commonCodeComponent.getCodeList("wishLoc");

        if (data != null) {
            for (CodeObject.Code codeData : data) {
                String keyArr = keyList.stream().filter(a -> a.equals(codeData.getCode())).findAny().orElse(null);
                if (StringUtils.isNotEmpty(keyArr)) {
//                    log.error("keyArr===>{}", keyArr);
                    codeData.setChecked(true);
                } else {
                    codeData.setChecked(false);
                }
//                for(int i = 0; i < key.length; i++){
//                    if(codeData.getCode().equals(key[i])){
//                        log.error("key===>{}", key[i]);
//                    }
//                }
            }
//            log.error("{}", data);
        }
        result.put("data", data);


        return result;
    }


    /*========================================================================================*/

    /* 관리자 페이지*/

    // 메인
    @RequestMapping("admin/admin_main")
    public String adminMain(){
        return "admin/admin_main";
    }

    // 회원관리
    @RequestMapping("admin/member_tables")
    public String member_tables(){
        return "admin/member_tables";
    }

    // 동영상관리
    @RequestMapping("admin/video_tables")
    public String video_tables(){
        return "admin/video_tables";
    }



    @RequestMapping("portfolio_single_featured_slider2")
    public String portfolio(){
        return "portfolio_single_featured_slider2";
    }




}
