package com.smart.project.config;

import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class ErrorConfig {

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> sessionManagerCustomizer() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        return server -> {
            ErrorPage error400 = new ErrorPage(HttpStatus.BAD_REQUEST, "/error/400");
            ErrorPage error500 = new ErrorPage(HttpStatus.INTERNAL_SERVER_ERROR, "/error/500");
            ErrorPage error404 = new ErrorPage(HttpStatus.NOT_FOUND, "/error/404");
            ErrorPage error403 = new ErrorPage(HttpStatus.FORBIDDEN, "/error/403");
            ErrorPage error503 = new ErrorPage(HttpStatus.SERVICE_UNAVAILABLE, "/error/503");
            server.addErrorPages(error400, error500, error404, error403, error503);
        };
    }
}
