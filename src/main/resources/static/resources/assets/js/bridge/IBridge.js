import BridgeSupport from "./bridgeSupport";

/**********************************************************************************************
 * @FileName  : IBridge.js
 * @Date      : 2018. 6. 5. 
 * @작성자      : 신희원
 * @설명       : 브리지 인터페이스
 **********************************************************************************************/
export default class IBridge extends BridgeSupport {
	broadCastCall(type){}
	startWin(url, callback, opt, winOpts){}
	finishWin(forceClose, type, url){}
	closeWin(forceClose, handler){}
	closeWinAll(isAppClose, handler){}
	finishPopup(){}
	finishPop(href){}
	socialWin(title, url, isInside, isHistory, isBackBtn, isPinchZoom){}
	getGeoPosition(){}
	kakaoLink(params){}
	mmsLink(params){}
	getPhoneNum(callBack){}
	savePhoneNum(params, callback){}
	callPhoneNum(params) {}
	getCamera(memNo, uploadType, callBack){}
	setAppNoreadCnt(count){}
	getData(key, callBack){}
	setData(key, value){}
	logout(){}
	browserOpen(url){}
	setAppHost(url){}
	enddingAppLink(packageName){}
	setDeviceToken(){}
	syncCookie(){}
	getDeviceToken(callBack){}
	shareDialog(params, callBack){}
    reloadWebPage(){}
	stateLogin(param){}
	socialLogin(service){}
	startAuthSms(){}
    blockCall(){}
    setContactCount(){}
    appPopChk(params){}
    toastMake(params){}
	setInterestMsg(params){}
    getUserLocation(){}
	setFooterMenu(params){}
}
