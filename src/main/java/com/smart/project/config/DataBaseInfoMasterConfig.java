package com.smart.project.config;

import com.smart.project.annotation.Master;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Slf4j
@Configuration
@ConfigurationProperties("test.datasource.master")
@MapperScan(annotationClass = Master.class, basePackages = "com.smart.project.proc", sqlSessionFactoryRef = "infoMasterSqlSessionFactory")
public class DataBaseInfoMasterConfig extends HikariConfig{

    String mapperLocation = "mapper/*.xml";


    @Bean(name = "masterDataSource", destroyMethod = "close")
    public HikariDataSource masterDataSource() {
        return new HikariDataSource(this);
    }

    @Bean(name = "infoMasterSqlSessionFactory")
    public SqlSessionFactory infoMasterSqlSessionFactory(@Qualifier("masterDataSource") DataSource masterDataSource) throws Exception {
        return new InforexSqlSessionlFactory().getSqlFactory(masterDataSource, mapperLocation);
    }

}