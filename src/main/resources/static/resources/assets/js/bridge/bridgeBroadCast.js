import BridgeBroadCastHandler from "./bridgeBroadCastHandler";

"use strict";

/**********************************************************************************************
 * @FileName  : bridgeBroadCast.js
 * @Date      : 2018. 6. 4.
 * @작성자      : 신희원
 * @설명       : 브로드 캐스트 이벤트 저장 및 기본 이벤트 처리
 **********************************************************************************************/
class BridgeBroadCast {

	constructor() {
		this.broadCastArray = {};
	}

	run(type, param) {
		try{
			setTimeout( () => {
                let broadCastArrayElement = this.broadCastArray[type];
                //타입체크 추가 / 홍광표
                if(typeof broadCastArrayElement == "function"){
                    broadCastArrayElement(param);
				}
			}, 400);
		}catch(e){
			console.error("broadCastRun error ==> ", e);
		}

	}

	add(type, callBack) {
		this.broadCastArray[type] = callBack;
	}

	addArray(type, callBack) {
		for (let i = 0; i < type.length; i++) {
			let item = type[i];
			this.broadCastArray[item] = callBack;
		}
	}

	bindHandler() {
		this.handler = new BridgeBroadCastHandler();
		this.handler.bindListeners();
	}

	getHandler() {
		return this.handler;
	}

	clean() { // 자주 실행 되는 구문에서 처리
		let broadCastType = localStorage.getItem("broadCastType");
		if (bridgeAgent.isApp() && broadCastType !== "login") {
            broadCast.getHandler().resetHistory(false);
        }
	}

}

window.broadCast = new BridgeBroadCast();
broadCast.bindHandler();

/**********************************************************************************************
 * @Method 설명 : 공통 리턴 type 지정
 * @작성일   : 2018. 6. 4.
 * @작성자   : 신희원
 * @변경이력  : finishReo 추가
 **********************************************************************************************/

// 기본으로 창을 닫는 명령어 등록
broadCast.addArray(["allClose", "allForceClose"], () => {
	bridge.finishWin(true);
});

// 기본으로 새로고침하는 명령어 등록
broadCast.addArray([
	"login", "join", "profileLogout", "normalProfileUpdate", "socialProfileUpdate"
	, "logout", "allReload"
	], () => {
	setTimeout( () => {
        broadCast.clean();
        location.reload();
	}, 10);
});

// 기본으로 새로고침하는 명령어 등록
broadCast.add([
    "autoPopOpen"
], (data) => {
	console.log("aaa");
});

// 기본으로 아무것도 하지 않는 명령어들 등록
broadCast.addArray(
	[
		"locSearchOK",				//메인 필터에서 지역검색
		"profileInsAfter",			//프로필 저장 후 이동할 때 메인화면 갱신 or 내 프로필 보러가기
		"certOk",					//본인인증 완료 후 인증 완료 사진 Url갱신
	],
	() => {}
);
