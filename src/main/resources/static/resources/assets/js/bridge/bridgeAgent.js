"use strict";

/**********************************************************************************************
 * @FileName  : bridgeAgent.js
 * @Date      : 2019. 7. 18.
 * @작성자      : 김남현
 * @설명       :
 **********************************************************************************************/
export default class BridgeAgent{
	
	constructor(){
		if(this.isApp()){
			this.agent = navigator.userAgent;
			this.dataArray = this.agent.substring(this.agent.lastIndexOf("YEOBOYA")).split("|");
			if(this.dataArray.length >= 6){
				this.yeoboya = {
					serviceType : this.dataArray[1],
					deviceId : this.dataArray[2],
					appVersion : this.dataArray[4],
					phoneVersion : this.dataArray[5],
					appProvider : this.dataArray[1] === 'a' ? this.dataArray[6] : 'appstore'
				}
			}
		}
	}

	// s => 앱, w => pc, x => 모바일 웹
	getMedia(){
		if(this.isApp()){
			return "s";
		}else if(this.isMobileWeb() && this.isMobileDevice()){
			return "x";
		}else{
			let filter = "win16|win32|win64|mac|macintel";
			let type = "w";
			if (navigator.platform ) {
				if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
					type = "x";
				} else {
					type = "w";
				}
			}
			return type;
		}
	}

	getAppAgent(){
		return this.yeoboya;
	}

	//ios mobile web 조건추가
	isMobileWeb(){
		return !_.isEmpty(navigator.userAgent.match(/(Android)/gi)) || !_.isEmpty(navigator.userAgent.match(/(iPhone)/gi));
	}

    isMobileWebIPhone(){
        if(this.getDevice() === "NONE"){
        	//iPhone 웹브라우저.
            return !_.isEmpty(navigator.userAgent.match(/(iPhone)/gi));
        }
		return false;
    }

	isApp(){
		return !_.isEmpty(navigator.userAgent.match(/(YEOBOYA)/gi));
	}

	/** 모바일 웹에서는 제대로 동작하지 않고 NONE을 리턴 함
     * 모바일 웹에서 아이폰 과 안드로이드 체크하려면 isMobileDevice() 사용
     * 참고바람..
     * */
	getDevice(){
		if(this.isApp()){
			let device = this.getAppAgent().serviceType;
			if(device === 'a'){
				return "ANDROID";
			}else if(device === 'b'){
				return "IOS";
			}
		}
		return "NONE";
	}

	isIos(){
		if(this.getDevice() === 'IOS'){
			return true;
		}else{
			return false;
		}
	}

	isIE() {
		const agent = navigator.userAgent.toLowerCase();
		return (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)
	}

	/**********************************************************************************************
	 * @Method 설명 : Domain URL www여부 확인
	 * @작성일   : 2019-08-19 
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	isWWW(){
		if (window.location.hostname.split('.')[0].includes('www') == true) {
			return true;
		}
		return false;
	}

	/**********************************************************************************************
	 * @Method 설명 : IOS 구버전 앱/신규 앱 체크
	 * @작성일   : 2019-03-12 
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	isWebViewBridgeCompatible() {
        return this.isIos();
	}

	isAndroid(){
		if(this.getDevice() === 'ANDROID'){
			return true;
		}else{
			return false;
		}
	}

	getStoreUrl() {
        var tmpUser=navigator.userAgent;
        if(tmpUser.indexOf("iPhone")>0||tmpUser.indexOf("iPod")>0||tmpUser.indexOf("iPad")>0){
            return "https://itunes.apple.com/kr/app/yeoboya-gyeolhon-jaehon-sing/id1142474282?mt=8";
        } else if(tmpUser.indexOf("Android")>0) {
            return "market://details?id=com.yeoboya.com.yeoboya";
        } else {
            return "https://play.google.com/store/apps/details?id=com.yeoboya.com.yeoboya";
        }
	}

	/**********************************************************************************************
	 * @Method 설명 : App 버전 정보
	 * @작성일   : 2019-07-08
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	getAppVersion(_type = 'StoreVersion') {
		if(this.isApp()) {
			let versionString = this.yeoboya.appVersion;
			const versionArr = versionString.split(".");
			let versionNumber = -1;
			if(versionArr.length === 3){
				switch (_type){
					case "StoreVersion":
						let sNum = Number(versionArr[0]);
						if(!isNaN(sNum)){
							versionNumber = sNum;
						}
						break;
					case "ProductVersion":
						let pNum = Number(versionArr[1]);
						if(!isNaN(pNum)){
							versionNumber = pNum;
						}
						break;
					case "VersionVersion":
						let vNum = Number(versionArr[2]);
						if(!isNaN(vNum)){
							versionNumber = vNum;
						}
						break;
				}
			}
			return versionNumber;
		} else {
			return -1;
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 채널 정보 획득
	 * @작성일   : 2019-10-10 
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	getAppChnl(){
		if(this.isApp()){
			return this.getAppAgent().appProvider === 'onestore' ? 502 : 501;
		}else{
			return 0;
		}
	}

	get iosStore () {
		return "https://itunes.apple.com/kr/app/yeoboya-gyeolhon-jaehon-sing/id1142474282?mt=8";
	}

	get androidStore () {
		return "https://play.google.com/store/apps/details?id=com.yeoboya.com.yeoboya&hl=ko";
	}

	get oneStore (){
		return "https://onesto.re/0000735193";                                     //원스토어 주소 변경
		// return "https://onestore.co.kr/userpoc/apps/view?pid=0000735193"; 			 //기존 주소
	}

    isMobileDevice() {
        let userAgent = navigator.userAgent;
        let device;
        if (userAgent.match(/iPhone|iPad|iPod/))
            device = "IOS";
        else
            device = "ANDROID";
        return device;
    }
}

window.bridgeAgent = new BridgeAgent();
