package com.smart.project.common.vo;

import com.inforex.data.InforexAgentParent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.mobile.device.DevicePlatform;

/**********************************************************************************************
 * @FileName   : InforexAgent.java
 * @Date        : 2019. 07. 29.
 * @작성자      : 박준석
 * @설명        : agent 정보를 App일 경우에만 리졸버에서 셋팅할때 사용한다.
 **********************************************************************************************/
@Data
@EqualsAndHashCode(callSuper=false)
public class InforexAgent extends InforexAgentParent {
	Enum<DevicePlatform> deviceType;
	String 	serviceType;
	String 	deviceId;
	String 	appVersion;
	Integer	iAppVersion;			//appVersion =>1.2.130 --> 20130
	String 	phoneVersion;
	String	appProvider;			//google, onestore, appstore
	Integer appChnl = 0;			// 나중에 추가 될것 같아서 미리 만들어둠 ()
}