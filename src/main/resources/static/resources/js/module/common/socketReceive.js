/**
 * 세션클라이언트에서 세션패킷이 수신되었을 경우 처리하기 위한 js
 *
 *      {
 *        command : '~~~', // 패킷명
 *        toNo: 'n', // 수신자 회원번호
 *        data: {  // 그외 수신 데이터
 *          ~: ~
 *        }
 *      }
 *
 * 위 데이터가 함수에 전달되면서 패킷 처리 시작
 */

window.sessionPacketRouter = (packet) => {

    let packetRouter = {};

    let allowPacket = [
        'userLogout',                                   // 아이디 강퇴
        'userStop',                                     // 아이디정지
        'sleepAccount',                                 // 계정 휴면 설정
        'memAutoUp',                                     // 자동위로올리기 되면 팝업 및 토스트띄우는 작업
        'requestDelayPacket'
    ];

    const pcNotAllowPacket = [
        'memAutoUp',                                    // 자동위로올리기 되면 팝업 및 토스트띄우는 작업
        'requestDelayPacket'
    ];

	if((!bridgeAgent.isApp() && pcNotAllowPacket.indexOf(packet.command) === -1) || (bridgeAgent.isApp() && allowPacket.indexOf(packet.command) !== -1)){
        setTimeout(() => {
            if (typeof packetRouter[packet.command] === 'function') {
                packetRouter[packet.command](packet.data);
            } else {
                if (typeof console !== 'undefined') {
                    console.log('unknown packet: ', packet);
                }
            }
        }, 0);
    }

    // 아이디정지
    packetRouter.userStop = (data) => {
        getLastFocusStatus((isMsgShow)=> {
            if (isMsgShow) {

            }
        });
    };

    // 아이디경고
    packetRouter.userWarn = (data) => {
        getLastFocusStatus((isMsgShow)=> {
            if (isMsgShow) {
            }
        });
    };


	// 호출시에 모든 페이지 리로드
	packetRouter.payReload = (data) =>{
		if(data.sid === $.cookie("YSESSIONID")) {
			location.reload();
		}
	};

    // 휴면 회원 값 입력으로 인한 모든 데이터 로그아웃
    packetRouter.sleepAccount = () => {
        if(bridgeAgent.isApp()) {
            bridge.stateLogin(0);
        }

        if (location.href.indexOf("/member/data/") === -1) {
            window.deleteCookie();
            setTimeout(function () {
                let state = history.state;
                if(state === null || state === undefined
                    || !state.length || state.length === 1
                    || location.pathname === "/" || location.pathname === "/main"){
                    location.reload();
                }else{
                    webBroadCast("reload");
                }
            }, 50);
        }
    };

    //관리자 강제탈퇴시 강제 로그아웃
    packetRouter.userLogout = async () => {
        if (bridgeAgent.isApp()) {
            bridge.stateLogin(0);
            await bridge.closeWinAll(true);
        } else {
            await bridge.finishWin(true);
        }
        window.deleteCookie();

        setTimeout(function () {
            alert({
                contents: "관리자에 의해 탈퇴처리 되었습니다.", action: function () {
                    if (bridgeAgent.isApp()) {
                        location.reload();
                    } else {
                        let state = history.state;
                        if (state === null || state === undefined
                            || !state.length || state.length === 1
                            || location.pathname === "/" || location.pathname === "/main") {
                            location.reload();
                        } else {
                            webBroadCast("reload");
                        }
                    }
                }
            });
        }, 100);
    };

    /**********************************************************************************************
    * @Method 설명 : lastFocusPage Boolean return
    * @작성일   : 2019-07-30
    * @작성자   : 홍광표
    * @변경이력  :
     *  2020/04/13 : 일감 4202 [여보야]자동위로올리기 이용 알림표시추가
     *      특이케이스 추가(memAutoUp,requestDelayPacket 둘다 메시지가와서 메시지창이 떠있을때도 토스트로 떠야한다)
    **********************************************************************************************/
    function getLastFocusStatus(callback){
        let item1 = localStorage.getItem("msgView");
        if(bridgeAgent.isIos()){
            bridge.getData("lastFocusWindow", function(ret){
                if(packet.command === "memAutoUp" || packet.command === "requestDelayPacket"){
                    callback(window.pageCode === ret.value);
                }else{
                    callback(window.pageCode === ret.value && !item1);
                }
            });
        }else{
            let item = localStorage.getItem("lastFocusWindow");
            if(packet.command === "memAutoUp" || packet.command === "requestDelayPacket"){
                callback(window.pageCode === item);
            }else{
                callback(window.pageCode === item && !item1);
            }
        }
    }
};


window.onVisibilityChange = (callback) => {
    let visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards:
    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function() {(document.hidden ? unfocused : focused)()});
    }
    if ('mozHidden' in document) {
        document.addEventListener('mozvisibilitychange',
            function() {(document.mozHidden ? unfocused : focused)()});
    }
    if ('webkitHidden' in document) {
        document.addEventListener('webkitvisibilitychange',
            function() {(document.webkitHidden ? unfocused : focused)()});
    }
    if ('msHidden' in document) {
        document.addEventListener('msvisibilitychange',
            function() {(document.msHidden ? unfocused : focused)()});
    }
    // IE 9 and lower:
    if ('onfocusin' in document) {
        document.onfocusin = focused;
        document.onfocusout = unfocused;
    }
    // All others:
    window.onpageshow = window.onfocus = focused;
    window.onpagehide = window.onblur = unfocused;
};

// TODO : lastFocusWindow 마지막 포커스 윈도우 pageCode 확인용 코드 셋팅
window.visibilityDefaultCallback = (visible) => {
    //console.log('the page is now', visible ? 'focused' : 'unfocused');
    if (visible) {
        if (bridgeAgent.isIos()) {
            setTimeout(() => {
                localStorage.setItem("lastFocusWindow", window.pageCode);
                localStorage.removeItem("msgView");
                bridge.setData("lastFocusWindow", window.pageCode);
            },100)
        } else {
            localStorage.setItem("lastFocusWindow", window.pageCode);
            localStorage.removeItem("msgView");
        }
    }
};
onVisibilityChange(window.visibilityDefaultCallback);

