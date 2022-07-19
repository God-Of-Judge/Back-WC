import BridgeSupport from "./bridgeSupport";
import QS from "qs";

// 구현할 함수
window.bridgeResponseFunc = {
    // 패킷 디버깅출력.
    debugPacket: (data, callback) => {
        if (typeof console == 'undefined') {
            alert(JSON.stringify(data));
        } else {
            //console.log(data);
        }
    },
    broadCastFunction: (param, callback) => {
        broadCast.run(param.type);
    },
    onTop: (param, callback) => {
        let pActive = false;
        if (!bridgeAgent.isIos()) {
            if (param.active) {
                pActive = true;
            }
        } else {
            pActive = true;
        }

        if (bridgeAgent.isApp() && $.cookie('payOK') === "Y") {
            window.location.reload();
            $.removeCookie('payOK', {path: '/', domain: '.yeoboya.com'});
        }

        //iOS에서는 메세지 푸시가 올때 메세지 패킷 팝업도 같이 떠서 죽이기 위해 아래코드 삽입함.
        //안드로이드에서는 109번에 있는 아래의 코드로 정상작동 함.
        if (bridgeAgent.isIos()) {
            let length = $("#messagePull").length;
            if (length > 0) {
                window.historyUtil.destroyHistory();
            }
        }
    },
    photoScript: (param, callback) => { // 포토 스크립트 이벤트를 브리지 콜백 함수로 전달 처리 함
        if (window.photoUploadCallback !== undefined) {
            if (typeof param.msg == "object") {
                window.photoUploadCallback(param.msg);
            } else {
                let retData = $.parseJSON(param.msg);
                window.photoUploadCallback(retData);
            }
        }
    },

    //SMS메시지 수신
    smsMessage: (param, callback) => {
        /** 데이터 예시
         인증번호 전송시 자동입력
         {"cmd":"smsMessage","code":"9785"}
         **/
            //alert("smsMessage :" + param.cmd + ":code :" + param.code);
        let cmd = param.cmd;
        let data = "";

        if (cmd === "smsMessage") {
            data = param.code;
            $("#authCode").val(data);
        }
    },

    //푸시 메세지 수신
    pushMessage: (param, callback) => {
        let from = "";
        let data = undefined;
        let etc = undefined;

        // 데이터가 유효 한지 체크 한다.
        try {
            from = param.from;
            data = (typeof param.msg === "object") ? param.msg : JSON.parse(param.msg);

        } catch (e) {
            console.log("푸시 수신 데이터 확인 도중 오류 ");
        }

        // 데이터 전송이 가능 한지 검증 및 전송 한다.
        try {
            // from :
            // 1 => 앱 백그라운드 or 완전히 종료일때
            // 0 => 앱 지금 보고 있을때
            let isNotRun = false;
            if (from === 1 || from === "1"
                || from === undefined
            ) isNotRun = true;

        } catch (e) {
            console.log("푸시 메시지 전송 도중 에러 발생  ", e);
        }
    },
    backbutton: (param, callback) => { // 안드로이드 종료 버튼 처리
        let qsData = location.href.substring(location.href.indexOf('?')+1);
        let qsParam = QS.parse(qsData);

        const data = (typeof param === "object") ? param : JSON.parse(param);
        const pathname = location.pathname;
        const isMainPath = (pathname === "/" && !qsParam.ctrl) || pathname === "/startPage"; // 미디어액션 처리시 앱꺼지는 현상으로인한 qsparam 추가
        if (data.isCanGoback && !isMainPath) {
			return callback({"procYn": "n"});
        }else if (!b) {
            callback({"procYn": "y"});
        }
    },
    goTop: (param, callback) => {
        $('html, body').stop().animate({scrollTop: 0}, 100);
    },

    logout: ()=>{
        axios.post("/member/login/logout").then(rtn => {
            if(rtn.data > 0) {
                setTimeout(function () {
                    window.location.reload();
                }, 300);
            }
        });
    }
};

/**********************************************************************************************
 * @FileName  : bridgeResponse.js
 * @Date      : 2018. 6. 2.
 * @작성자      : 김성훈 & 신희원
 * @설명       : 브리지 앱 처리 응답문
 **********************************************************************************************/
export default class BridgeResponse extends BridgeSupport {

    constructor() {
        // console.log("bridge Response constructor");
        super();
    }

    /**********************************************************************************************
     * @Method 설명 : 앱으로부터 이벤트를 전달 받기위해 브리지 처리
     * @작성일   : 2018. 6. 5.
     * @작성자   : 신희원
     * @변경이력  : 안드로이드 웹뷰 브릿지 수정 작업[김남현 : 8월7일]
     **********************************************************************************************/
    onResponseWait(bridge) {
        window.pointer = this;
		this.setupWebViewJavascriptBridge(function (iosBridge) {
			if(bridgeAgent.isApp() && bridgeAgent.isAndroid()){
				iosBridge.init(function(message, responseCallback) {
					let data = {'Javascript Responds': 'Wee!'};
					responseCallback(data);
				});
			}
			iosBridge.registerHandler('$.webScript', (param, responseCallback) => {
                let ret = window.pointer.toJsonObj(param);
				if (ret.cmd !== "") {
                    if(ret.cmd === 'startWin'){
                        window.bridge.startWin(ret.url);
                    }else{
                        window.bridgeResponseFunc[ret.cmd](ret, responseCallback);
                    }
				} else {
				}
			});
		});
    }
}
