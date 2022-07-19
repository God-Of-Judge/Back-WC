import BridgeSupport from "./bridgeSupport";

/**********************************************************************************************
 * @FileName  : bridgeRequest.js
 * @Date      : 2018. 6. 1.
 * @작성자      : 신희원
 * @설명       : 브리지 앱 처리 요청문
 **********************************************************************************************/
export default class BridgeRequest extends BridgeSupport {

	constructor (){
		super();
	}

	/**********************************************************************************************
	 * @Method 설명 : 브리지 정보 취득
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setBridge(bridge){
		if(bridge !== undefined){
			this.bridge = bridge;
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 브리지 통신 처리 및 콜백 처리
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	call(obj, callBack) {
		window.webViewRequestTarget = this;
		this.setupWebViewJavascriptBridge( (iosBridge) => {
			iosBridge.callHandler('callFromWeb', obj, (ret) => {
				if(callBack !== undefined){
					callBack( window.webViewRequestTarget.toJsonObj(ret) );
				}
			});
		})
	}

    callFile(obj, callBack) {
        window.webViewRequestTarget = this;
        this.setupWebViewJavascriptBridge( (iosBridge) => {
            iosBridge.callHandler('fileChooserFromWeb', obj, (ret) => {
                if(callBack !== undefined){
                    callBack( window.webViewRequestTarget.toJsonObj(ret) );
                }
            });
        })
    }
    /**********************************************************************************************
     * @Method 설명 : 브리지 통신 처리 및 콜백 처리이나 위의 call이 여보야에선 되지 않아서 변조한다.
     * @작성일   : 2019. 09. 03.
     * @작성자   : 박준석
     * @변경이력  :
     **********************************************************************************************/
    parseCall(obj, callBack) {
        window.webViewRequestTarget = this;
        this.setupWebViewJavascriptBridge( (iosBridge) => {
            iosBridge.callHandler('callFromWeb', obj, (ret) => {
                if(callBack !== undefined){
                    callBack(JSON.parse(ret));
                }
            });
        })
    }

	/**********************************************************************************************
	 * @Method 설명 : 브릿지 최초 한번 실행
	 * @작성일   : 2019-08-07
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	bridgeInit(){
		window.webViewRequestTarget = this;
		this.setupWebViewJavascriptBridge( (iosBridge) => {});
	}

	/**********************************************************************************************
	 * @Method 설명 : 전체 액티비티에게 브로드 캐스트 호출 ( X )
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	broadCastCall(type){
		webBroadCast(type);
	}

    /**********************************************************************************************
     * @Method 설명 : 액티비티 열기
     * @작성일   : 2018. 6. 2.
     * @작성자   : 신희원
     * @변경이력  :
	 * 캡쳐(capture)방지 들어있음
     **********************************************************************************************/
    startWin(url, callback, opt="",setSplashYn="", menuType='hidden'){
        let domain = window.location.origin;
		//app에서 특정 화면에 대한 중복 창열림을 방지하기 위해 윈도이름을 같이 넘겨주도록 수정.
		let windowName = (url.substring(0,url.indexOf("?")) != '')?url.substring(0,url.indexOf("?")):url;
        let targetUrl = "";
		let targetName = "";
		let payDomainChk = false;
        let certChk = false;

		targetUrl = domain + url;

        let data = {
            cmd : "startWin",
            url : Base64.encode(targetUrl),
			option: opt,
			menuType : menuType
        };

		if(certChk){
			data.name = "authPop";
			data.option = "result";
		}
		// 안드로이드 캡쳐방지
		if(url.indexOf('photoview') > -1 || url.indexOf('videoPlayer') > -1 || url.indexOf('ymtiList') > -1){
			data.name = 'photoview';
		}

		if(payDomainChk || targetName == "googleLogin"){
			data.name = targetName;
		}

        this.call(data);
        if(typeof callback === "function") callback();
    }

	/**********************************************************************************************
	 * @Method 설명 : 액티비티 닫기
	 * 			type(0/1/2) : 메인창 ==> 0: 이면 그냥 종료, 1: 리플레쉬, 2:어플종료
	 * 			url(base64) : 메인창 ==> 주소가 있으면 이 주소로 이동
	 * @작성일   : 2019. 8. 8.
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	finishWin(forceClose, type, url){
		this.call({
			cmd : "finishWin",
			type : type === undefined ? 0 : type,
			url : url === undefined ? "" : Base64.encode(url)
		});
	}

	/**********************************************************************************************
	 * @Method 설명 : 현재창을 닫는다.(창을 닫고 최상위 웹뷰한테 호출할 브릿지 헨들러)
	 * @작성일   : 2019-08-08
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	closeWin(forceClose, handler){
		broadCast.getHandler().removePage();
		const _this = this;
		const handlerData = handler ? handler : { cmd : "", msg : ""};
		this.goBackOrFinishWin(function () {
			_this.call({
				cmd : "closeWin",
				handlerData : handlerData
			});
			if(!bridgeAgent.isAndroid()){
				setTimeout(()=>{
					location.href = 'about:blank';
				},100)
			}
		}, forceClose);
	}

	/**********************************************************************************************
	 * @Method 설명 : 모든 팝업창을 닫는다.(메인바닥창 제외하고), 창을 닫고 바닥웹뷰한테 호출할 브릿지 헨들러
	 * @작성일   : 2019-08-08
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	closeWinAll(isAppClose, handler){
		broadCast.getHandler().removePage();
		const handlerData = handler ? handler : { cmd : "", msg : ""};
		let data = {
			cmd: "closeWinAll",
			handlerData: handlerData
		};
		this.call(data);
		if(!bridgeAgent.isAndroid()){
			setTimeout(()=>{
				location.href = 'about:blank';
			},100)
		}
	}

    /**********************************************************************************************
     * @Method 설명 : 여보야 전체 액티비티 닫기
     * @작성일   : 2019-08-05
     * @작성자   : 김남현
     * @변경이력  :
     **********************************************************************************************/
	finishPopup(script,param){
		broadCast.getHandler().removePage();
		let data = {
			cmd : "finishPopup",
			scriptName : script === undefined ? null : script,
			params : param === undefined ? null : param
		};

		this.call(data);
	}

    /**********************************************************************************************
     * @Method 설명 : 여보야 모든창 닫고 url보내기
     * @작성일   : 2019-10-22
     * @작성자   : 조문기
     * @변경이력  :
     **********************************************************************************************/
	finishPop(href){
        if(href) href = window.location.origin + href;
        let data = {
        	cmd : "finishPopup",
            url : Base64.encode(href)
		}
        this.call(data);
	}

    /**********************************************************************************************
	 * @Method 설명 : 헤더를 네이티브로 관리하는 액티비티 호출
	 * @작성일   : 2018. 6. 2.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	socialWin(title, url, isInside, isHistory, isBackBtn, isPinchZoom){
		let nativeUrl = url;

		if(isInside){
			let domain = window.location.origin;
			nativeUrl = domain + url ;
		}

		let data = {
			cmd : "socialWin",
			title : title,
            url : nativeUrl,
            isPinchZoom: !!isPinchZoom,
			backBtn : 0 // 뒤로가기 버튼 제거 값
		};

		if(isHistory === true){
			data.history = true;
		}

		if(isBackBtn === true){
            data.backBtn = 1;
		}
		this.call(data);
	}

	/**********************************************************************************************
	 * @Method 설명 : 위치정보 취득
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	getGeoPosition(callBack, alertDeniedYn='y'){
		this.call({
			cmd : "getGeoPosition",alertYn:'y',alertDeniedYn:alertDeniedYn
		}, callBack);
	}

	/**********************************************************************************************
	 * @Method 설명 : 카카오 링크 처리
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  : 초대하기용 dynamicLink param추가
	 **********************************************************************************************/
    kakaoLink(params, callBack){
        let data = {
            cmd : "kakaoLink",
            btnDesc: params.btnDesc,                //버튼에 들어갈 설명 setBtnHandlerYn === "n" 일때 사용함
            setBtnHandlerYn : params.setBtnHandlerYn||"n", //버튼이벤트와 이미지클릭 이벤트가 다른지 여부
            msg : {
                title: params.title,				// 항시필요
                text: params.msg,					// 항시필요
                link: params.link,                 //setBtnHandlerYn === "n" 일때 사용함
                dynamicLink: params.dynamicLink,	// 인앱브라우저에서 사용할 링크
            },
            image : {
                width: params.imageWidth,
                height: params.imageHeight,
                path: params.image
            },
            btn:{									// 이부분은 setBtnHandlerYn === "y"일때만 작성 이 외에는 위쪽 전부 필수 작성
                title: params.btnDesc,              //버튼에 들어갈 설명 setBtnHandlerYn === "y" 일때 사용함
                dynamicLink: params.btnDynamicLink,   //버튼에 들어갈 링크 setBtnHandlerYn === "y" 일때 사용함
                execHandler: params.execHandler?JSON.stringify(params.execHandler):""    //버튼에 들어갈 핸들러 setBtnHandlerYn === "y" 일때 사용함
            },
            execHandler:params.execHandler?JSON.stringify(params.execHandler):""
        }

        this.call(data, callBack);
	}

    /**********************************************************************************************
     * @Method 설명 : 상단노티
     * @작성일   : 2018. 6. 6.
     * @작성자   : 신희원
     * @변경이력  :
     **********************************************************************************************/
    showNoti(parmas){
        parmas.cmd = "showNoti";
        this.call(parmas);
    }

	/**********************************************************************************************
	 * @Method 설명 : 연락처 취득
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	getPhoneNum( callBack){
		this.call({ cmd : "getPhoneNum"}, callBack);
	}

    /**********************************************************************************************
	 * @Method 설명 : 앱 배지 카운트 수 변경
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setAppNoreadCnt(count){
		let data = {
			cmd : "setAppNoreadCnt",
			noreadCnt : count,
			delay : 0,
		};
		this.call(data);
	}

	/**********************************************************************************************
	 * @Method 설명 : 값 취득
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	getData(key, callBack){
		this.call({cmd : "getData", key : key }, callBack);
	}

	/**********************************************************************************************
	 * @Method 설명 : 값 저장
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setData(key, value){
		this.call({cmd : "setData", key : key, value : value });
	}

	/**********************************************************************************************
	 * @Method 설명 : 로그아웃 시 쿠키삭제
	 * @작성일   : 2018. 7. 19.
	 * @작성자   : 한민구
	 * @변경이력  :
	 **********************************************************************************************/
	logout(){
		let data = {
			cmd : "logout",
		};
		this.call(data);
	}

	/**********************************************************************************************
	 * @Method 설명 : 브라우저 열기
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	browserOpen(url){
		this.call({ cmd : "browserOpen", url : Base64.encode(url)});
	}

	/**********************************************************************************************
	 * @Method 설명 : 루트 변경
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setAppHost(url){
		this.call({ cmd : "setAppHost", host : url });
	}

	/**********************************************************************************************
	 * @Method 설명 :디바이스 키 갱신
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setDeviceToken(){
		this.call({ cmd : "setDeviceToken" });
	}

	/**********************************************************************************************
	 * @Method 설명 : 디바이스 토큰 취득
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	getDeviceToken(callBack){
		this.call({ cmd : "getDeviceToken" }, callBack);
	}

    /**********************************************************************************************
     * @Method 설명 : Web에서 변동된 쿠키를 App에서 동기화 한다 (변경, 변조된 쿠키 정보를 재 갱신하여 일치화 시킴)
     * @작성일   : 2019. 11. 27.
     * @작성자   : 박준석
     * @변경이력  :
     **********************************************************************************************/
	syncCookie() {
        this.call({ cmd : "syncCookie" });
	}

    /**********************************************************************************************
     * @Method 설명 : 공유하기 링크 처리
     * @작성일   : 2018. 6. 6.
     * @작성자   : 신희원
     * @변경이력  :
     **********************************************************************************************/
    shareDialog(params, callBack){
        let data = {
            cmd : "shareDialog",
			title : params.title,
            msg : params.msg,
            link : params.link,
            imgUrl : params.imageUrl
        };
        this.call(data, callBack);
    }

    /**********************************************************************************************
     * @Method 설명 : 로그인 셋팅
     * @작성일   : 2019-08-07
     * @작성자   : 김남현
     * @변경이력  :
     **********************************************************************************************/
    stateLogin(param){		//1 : login, 0 : logout
		this.call({cmd:'stateLogin', result : param});
	}

    setSplash(callback){
        let data = {
            'cmd': 'setSplash',
            'useYn': 'y'
        }
        this.call(data,callback);
    }

    // 어플에 하단바를 보이고 안 보이게 요청하는 작업
    setFooterVisibleYn(params){
        let data = {
            'cmd': 'setFooterVisibleYn',
            'value': params.value
        }

        this.call(data);
    }

    getUserLocation(callback) {
    	let data = {
    		cmd : "getUserLocation"
		}

        this.call(data, callback);
	}

	getFooterMenu(callback){
		let data = {
			'cmd': 'getFooterMenu'
		}
		this.call(data, callback);
	}

	setFooterMenu(menuType){
		menuType = 'hidden'
		bridge.getFooterMenu((data)=>{
			if(menuType === data.menuType){
				return;
			}
			let setData = {
				'cmd': 'setFooterMenu',
				'menuType': menuType  // : "weddingMain", "meetingMain", "home", "hidden"
			}
			this.call(setData);
		})
	}

}
