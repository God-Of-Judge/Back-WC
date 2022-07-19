package com.smart.project.config;

import com.smart.project.filter.CookieAutoLoginFilter;
import com.smart.project.filter.FilterTest;
import com.smart.project.security.InternCookieResolver;
import com.smart.project.security.LoginUserCookieInterceptor;
import org.apache.catalina.Context;
import org.apache.tomcat.util.http.LegacyCookieProcessor;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.mobile.device.DeviceHandlerMethodArgumentResolver;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.servlet.config.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;

@EnableWebMvc
@Configuration
@ComponentScan(basePackages = {"com.smart.project"})
public class MvcConfig implements WebMvcConfigurer {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {"classpath:/static/"};
    private String connectPath = "/image/**";
    private String resourcePath = "file:///C:/tmp/";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
        registry.addResourceHandler(connectPath)
                .addResourceLocations(resourcePath);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.setOrder( Ordered.HIGHEST_PRECEDENCE );
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.indentOutput(true).dateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        converters.add(new MappingJackson2HttpMessageConverter(builder.build()));
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
        argumentResolvers.add( new InternCookieResolver() );
    }

    @Bean
    public DeviceHandlerMethodArgumentResolver deviceHandlerMethodArgumentResolver() {
        return new DeviceHandlerMethodArgumentResolver();
    }

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        // Do any additional configuration here
        return builder.build();
    }

    @Bean
    public FilterRegistrationBean firstFilterRegister() {
        FilterRegistrationBean registrationBean = new FilterRegistrationBean(new FilterTest());
        return registrationBean;
    }

    @Bean
    public MultipartResolver multipartResolver() {
        org.springframework.web.multipart.commons.CommonsMultipartResolver multipartResolver
                = new org.springframework.web.multipart.commons.CommonsMultipartResolver();

        multipartResolver.setMaxUploadSize(10485760); // 1024 * 1024 * 10
        return multipartResolver;
    }

    @Bean
    public CookieAutoLoginFilter cookieFilter() {
        return new CookieAutoLoginFilter();
    }
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(cookieFilter())
                .addPathPatterns("/**")
                .addPathPatterns("/image")
                // excludePathPatterns 묶어서 가독성 신경점..
                .excludePathPatterns(
                        /* 멤버 */
                        "/member/**",
                        "/member/login/**",
                        /* 정적 자원 */
                        "/favicon**",
                        "/resources/**",
                        "/js/*",
                        "/json",
                        /* 공통 */
                        "/error/**",
                        "/common/**",
                        "/api/**"
                );
    }


    // cookie 설정
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> cookieProcessorCustomizer() {
        return new WebServerFactoryCustomizer<TomcatServletWebServerFactory>() {
            @Override
            public void customize(TomcatServletWebServerFactory tomcatServletWebServerFactory) {
                tomcatServletWebServerFactory.addContextCustomizers(new TomcatContextCustomizer() {
                    @Override
                    public void customize(Context context) {
                        context.setCookieProcessor(new LegacyCookieProcessor());
                    }
                });
            }
        };
    }
}
