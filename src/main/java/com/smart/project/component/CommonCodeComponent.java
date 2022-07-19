package com.smart.project.component;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**********************************************************************************************
 * @FileName  : CommonCodeComponent.java
 * @Date      :  2019-01-28
 * @작성자      : 김성훈
 * @설명       : commonCode.json 관련 컴포넌트
 **********************************************************************************************/
@Slf4j
@Component
public class CommonCodeComponent extends CodeComponent {

	@Override
	String jsonPath() {
		return "classpath:json/commonCode.json";
	}

}
