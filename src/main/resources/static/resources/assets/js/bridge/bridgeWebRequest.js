import BridgeSupport from "./bridgeSupport";

/**********************************************************`************************************
 * @FileName  : bridgeWebRequest.js
 * @Date      : 2018. 6. 5. 
 * @작성자      : 신희원
 * @설명       : 
 **********************************************************************************************/

export default class BridgeWebRequest extends BridgeSupport{

	constructor(){
		// console.log("bridge Web Filter constructor");
		super();
    }

	/**********************************************************************************************
	 * @Method 설명 : 전체 탭 혹은 액티비티의 broadCast 실행 type -> 처리 방법
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	broadCastCall(type){
		webBroadCast(type);
	}

    finishPop(href){
		// temp
		if( href == '/' ) {
			self.close();
			return;
		}

		if(href) href = window.location.origin + href;

		if(self.opener) {
			if(href){
				window.opener.location.replace(href);
			}else{
				window.opener.close();
			}
			window.self.close();
		}else{
			if(href){
				window.location.replace(href);
			}else{
				self.close();
			}
		}
    };

	/**********************************************************************************************
	 * @Method 설명 : 새창 열기
	 * @작성일   : 2018. 6. 4. 
	 * @작성자   : 신희원
	 * @변경이력  : openWindowTemp 받아서 처리하게 추가
	 **********************************************************************************************/
	startWin(url, callback, opt, winOpts={width:500, height:710}){
		let windowName = (url.substring(0,url.indexOf("?")) != '')?url.substring(0,url.indexOf("?")):url;
        let winref = "";
        var agent = navigator.userAgent.toLowerCase();

		//크롬이외의 브라우저에서는 탭허용이 되지 않아 열리지 않으므로 변경함.
		let isTab = (url.indexOf('/etc/siteMap') === -1
			&&	url.indexOf('/item/') === -1
			&& url.indexOf('/chargeCash') === -1
			&& url.indexOf('/kmc?type=y') === -1
			&& url.indexOf('/cs/sitePolicy') === -1
			&& url.indexOf('/member/join/') === -1
			&& url.indexOf('/member/social/') === -1
		);
		if((!bridgeAgent.isApp() && bridgeAgent.isMobileWebIPhone() && location.pathname.indexOf("/member/login/") == -1 && isTab)
			|| (navigator.userAgent.indexOf("DaumApps") > -1 && isTab && !(location.pathname === "/" || location.pathname === "/main"))) {
			location.href = url;
		}else if(bridgeAgent.isMobileWebIPhone()){
			//아이폰 사파리일경우 새창관련이슈 분기처리
			this.safariOpen(url, windowName, '')
		} else {
			let winref = window.open(url, windowName , '');
			if(winref.location.href === 'about:blank'){
				winref.location.href = url;
			}
		}

        if(typeof callback === "function") callback();
	};

    /**********************************************************************************************
     * @Method 설명 : 사파리 모바일 웹에서 적용
     * @작성일   : 2021. 05. 26.
     * @작성자   : 박준석
     * @변경이력  :
     **********************************************************************************************/
    safariOpen(url, windowName, etc) {
        if (typeof (window.open) == "function") {
            window.open(url, windowName, etc);
        } else {
            window.location.href = url;
        }
    }

	/**********************************************************************************************
	 * @Method 설명 : 창닫기
	 * @작성일   : 2018. 6. 4. 
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
    finishWin(forceClose, type, url){
    	this.goBackOrFinishWin(() => {
    		window.close();
    		//윈도우 버그로 인해 창이 안닫히는 사람들을 위해 추가
            setTimeout(() => window.close(), 100);
		}, forceClose);
    };

    /**********************************************************************************************
     * @Method 설명 : 창닫기
     * @작성일   : 2019-08-08 
     * @작성자   : 김남현
     * @변경이력  :
     **********************************************************************************************/
	closeWin(forceClose, handler){
		if(bridgeAgent.isMobileWebIPhone()){
			if( window.name !== ""){
				if(history.state.length > 2){
					history.replaceState({length:history.state.length-1},'');
					localStorage.setItem('safariPopUp',false);
					history.back();
				}
				this.finishWin(true);
				return;
			}else{
				let safariHistory = localStorage.getItem('safariHistory');
				safariHistory = safariHistory ? safariHistory.split(",") : new Array();
				safariHistory.pop();
				localStorage.setItem('safariHistory', safariHistory);
			}
		}
		this.goBackOrFinishWin(() => {
			window.close();
            //윈도우 버그로 인해 창이 안닫히는 사람들을 위해 추가
            setTimeout(() => window.close(), 100);
		}, forceClose);
	};

	/**********************************************************************************************
	 * @Method 설명 : 모든 창 닫기
	 * @작성일   : 2019-08-08 
	 * @작성자   : 김남현
	 * @변경이력  :
	 **********************************************************************************************/
	closeWinAll() {
		if(bridgeAgent.isMobileWebIPhone()){
			let safariHistory = localStorage.getItem("safariHistory");
			safariHistory = safariHistory? safariHistory.split(",") : new Array();
			historyUtil.historyGoBack(-safariHistory.length);
			localStorage.setItem("safariHistory", new Array());
		}
		this.broadCastCall("allClose");
		this.finishWin(true);
	}

	/**********************************************************************************************
	 * @Method 설명 : 전체 액티비티 닫기 처리
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	finishPopup() {
		this.broadCastCall("allClose");
		this.finishWin(true);
	}

    /**********************************************************************************************
	 * @Method 설명 :헤더가 있는 네이티브 창을 호출
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	socialWin(title, url, isInside, isHistory, isBackBtn, isPinchZoom){
		this.startWin(url);
	}

	/**********************************************************************************************
	 * @Method 설명 : 카카오 링크 처리
	 * @작성일   : 2018. 6. 6.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	kakaoLink(params){
		Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: params.title,
                description: params.msg,
                imageUrl: params.image,
                link: {
                    mobileWebUrl: params.link,
                    webUrl: params.link
					// 글이나 사진 눌렀을때는 모바일 페이지가 뜨는게 맞다고 함..
                },
				imageWidth: params.imageWidth,
				imageHeight: params.imageHeight
            },
            buttons: [
                {
                    title: params.btnDesc,
                    link: {
                        androidExecParams : params.btnAndroidLink,
                        iosExecParams : params.btnIosLink
                    }
                }
            ]
		});
	}

	browserOpen(url){
		window.open(url);
	}

	/**********************************************************************************************
	 * @Method 설명 : 기본 위치정보 반환
	 * @작성일   : 2018. 6. 11.
	 * @작성자   : 김성훈
	 * @변경이력  : 웹에서는 지오로케이션 사용 가능여부에 따라 GPS정보 획득 하거나 서울시청 좌표를 반환함
	 **********************************************************************************************/
	getGeoPosition(callBack){
		if ("geolocation" in navigator) {
			/* 지오로케이션 사용 가능 = 권한요청후 현재위치 획득 */
			navigator.geolocation.getCurrentPosition((position) => {
				callBack({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			}, () => {
				// 에러 발생 시 서울시청
                callBack({
                    latitude : 37.56682663199103,
                    longitude : 126.978657298739
                });
			});
		} else {
			/* 지오로케이션 사용 불가능 = 서울시청 */
			callBack({
				latitude : 37.56682663199103,
				longitude : 126.978657298739
			});
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 루트 변경 처리
	 * @작성일   : 2018. 6. 19.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setAppHost(url){
		location.href=url;
	}

	/**********************************************************************************************
	 * @Method 설명 : 디바이스 토큰 취득
	 * @작성일   : 2018. 6. 22.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	setDeviceToken(){console.log("웹에서 처리 하지 않음 (디바이스 토큰 갱신 )")}

	shareDialog() {
        confirm({ title: "'공유하기'기능은 어플 설치 후<br>사용 가능합니다.<br>여보야 어플을 설치하시겠습니까?",
            leftBtnNm: "닫기", rightBtnNm: "설치", }, () => {
        }, () => {
        	location.href= bridgeAgent.getStoreUrl();
        });
	}
}