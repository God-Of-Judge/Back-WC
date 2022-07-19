/**********************************************************************************************
 * @FileName  : bridgeSupport.js
 * @Date      : 2018. 6. 2.
 * @작성자      : 김성훈 & 신희원
 * @설명       :
 **********************************************************************************************/

export default class BridgeSupport{

    /**********************************************************************************************
     * @Method 설명 : json 객체로 만들어서 리턴
     * @작성일   : 2018-05-17 
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    toJsonObj (_data){
        return (typeof _data === "object") ? _data : JSON.parse(_data);
    };

    /**********************************************************************************************
     * @Method 설명 : 앱, 웹 모두 사용할 뒤로갈수있으면 뒤로가고. 아니면 종료하는 함수 ( 파라미터로 들어오는게 실제 종료 함수 )
     * @작성일   : 2018-06-20
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    goBackOrFinishWin(finishWinFunc, forceClose) {
		// 로그인 성공 창에서는 그냥 닫혀야 함
		if(forceClose) {
			finishWinFunc();
			return;
		}

		let useFallback = true;
		window.addEventListener("beforeunload", function () {
			useFallback = false;
		});

		let length = window.layerPopupIdStack.length;
		if(length > 0) {
			if(!bridgeAgent.isAndroid()){
				window.historyUtil.destroyHistory();
			}else{
				if(window.historyStatusAndroid){
					clearTimeout(window.historyStatusAndroid);
					window.historyStatusAndroid = null;
				}else{
					window.historyStatusAndroid = setTimeout(function(){
						window.historyStatusAndroid = null;
						window.historyUtil.destroyHistory();
					},500);
				}
			}
		} else {
			let state = history.state;
			if(state === null || state === undefined
				|| !state.length || state.length === 1
				|| location.pathname === "/" || location.pathname === "/main"){
				finishWinFunc();
			}else{
				if(!bridgeAgent.isAndroid()) {
					window.history.back();
				}else{
					if(window.historyStatusAndroid){
						clearTimeout(window.historyStatusAndroid);
						window.historyStatusAndroid = null;
					}else{
						window.historyStatusAndroid = setTimeout(function(){
							window.historyStatusAndroid = null;
							window.history.back();
						},500);
					}
				}
			}
		}
    }

	/**********************************************************************************************
	 * @Method 설명 : 브리지 반환
	 * @작성일   : 2018. 7. 3.
	 * @작성자   : 신희원
	 * @변경이력  : [김남현]8월7일 : 안드로이드 웹뷰 브릿지 관련 수정
	 **********************************************************************************************/
	setupWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) {
			return callback(window.WebViewJavascriptBridge);
		}

		if(bridgeAgent.isApp() && !bridgeAgent.isAndroid()){
			if (window.WVJBCallbacks) {  window.WVJBCallbacks.push(callback); }
			else { window.WVJBCallbacks = [callback] }

			var WVJBIframe = document.createElement('iframe');
			WVJBIframe.style.display = 'none';
			WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
			//WVJBIframe.src = 'https://__bridge_loaded__';
			document.documentElement.appendChild(WVJBIframe);
			setTimeout(function() { document.documentElement.removeChild(WVJBIframe); console.log('WVJBIframe 붙였다 지웠음', window.WebViewJavascriptBridge); }, 0);
		}else{
			document.addEventListener('WebViewJavascriptBridgeReady', function() {
				callback(window.WebViewJavascriptBridge)
			},false);
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 브리지 요청문 실행
	 * @작성일   : 2018. 7. 3.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	responseRun(param){
		try {
			//console.log("responseRun ===> param");
			let ret = this.toJsonObj(param);
			if(ret.cmd !== ""){
				window.bridgeResponseFunc[ret.cmd](ret);
			}
		} catch (e) {
			if (typeof console != 'undefined') {
				console.error(e);
			}
		}
	}
}