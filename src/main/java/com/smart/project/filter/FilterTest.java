package com.smart.project.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.servlet.*;
import java.io.IOException;

@Slf4j
public class FilterTest implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        log.info("FirstFilter가 생성 됩니다.");
        log.error("testset");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        log.info("==========First 필터 시작!==========");
        filterChain.doFilter(servletRequest, servletResponse);
        log.info("==========First 필터 종료!==========");
    }

    @Override
    public void destroy() {
        log.info("FirstFilter가 사라집니다.");
    }
}