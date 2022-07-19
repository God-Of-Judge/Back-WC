package com.smart.project.web.error;

/**********************************************************************************************
 * @FileName  : ErrorRedirectAction
 * @Date      : 2019-08-05
 * @작성자      : 김남현
 * @설명       : 에러페이지 이동
 **********************************************************************************************/

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Controller
public class ErrorRedirectAction implements ErrorController {

    @RequestMapping(value = "/error")
    public String handleNoHandlerFoundException(HttpServletResponse response, HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(response.getStatus());
        log.error("status==>{}",status);
        if (status == HttpStatus.NOT_FOUND) {
            return redirectionView(request, "404");
        } else if (status == HttpStatus.UNAUTHORIZED) {
            return redirectionView(request, "401");
        } else if (status.is5xxServerError()) {
            return redirectionView(request, "500");
        } else {
            return redirectionView(request, "error");
        }
    }

    @RequestMapping("/error/404")
    public String error404 (HttpServletRequest request) {
        return redirectionView(request,"404");
//		return "error/404";
    }

    @RequestMapping("/error/500")
    public String error500 (HttpServletRequest request) {
        return redirectionView(request,"500");
//		return "error/500";
    }

    @RequestMapping("/error/error")
    public String error(HttpServletRequest request) {
        return redirectionView(request,"error");
//		return "error/error";
    }

    @RequestMapping("/error/401")
    public String error401(HttpServletRequest request) {
        return redirectionView(request, "401");
//		return "error/401";
    }

    public String redirectionView(HttpServletRequest request,String errorStatus) {
        String errorUri = (String) request.getAttribute("javax.servlet.error.request_uri");
        if (errorUri != null) {
            if(errorUri.startsWith("/nb")){
                return "noblesse/error/404";
            }else if(errorUri.startsWith("/community")){
                return "community/error/404";
            }
        }
        return "error/" + errorStatus;
    }

    @Override
    public String getErrorPath() {
        return null;
    }
}

