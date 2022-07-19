/**********************************************************************************************
 * @FileName  : customize.js
 * @Date      : 2018-05-10
 * @작성자      : 김성훈
 * @설명       : 기본 기능 커스터마이징 하는 스크립트 => webpack에서 진입점에 넣어두고 레이아웃에서 선언
 **********************************************************************************************/

$(() => {

	//closest and matches polyfill
    const ElementPrototype = window.Element.prototype;
    if (typeof ElementPrototype.matches !== 'function') {
        ElementPrototype.matches = ElementPrototype.msMatchesSelector || ElementPrototype.mozMatchesSelector || ElementPrototype.webkitMatchesSelector || function matches(selector) {
            let element = this;
            const elements = (element.document || element.ownerDocument).querySelectorAll(selector);
            let index = 0;

            while (elements[index] && elements[index] !== element) {
                ++index;
            }

            return Boolean(elements[index]);
        };
    }
    if (typeof ElementPrototype.closest !== 'function') {
        ElementPrototype.closest = function closest(selector) {
            let element = this;

            while (element && element.nodeType === 1) {
                if (element.matches(selector)) {
                    return element;
                }

                element = element.parentNode;
            }

            return null;
        };
    }




	let state = history.state;
	if (state == undefined || state.length == undefined) {
		history.replaceState({length: history.length}, "", location.href);
	}

	const $body = $("body");

	/**********************************************************************************************
	 * @Method 설명 : alert 커스터마이징
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 *              레이어팝업으로 관리 하도록 네이티브함수 오버라이드 (2018.06.07 김성훈)
	 *
	 *              파라미터를 객체형태 또는 String 으로 받도록 변경. (2019.01.25 김성훈)
	 *                1. 객체 : {
	 *                : alert내용, action: 버튼클릭콜백, btnNm: 버튼문자열 }
	 *                2. String : alert내용, 콜백은 없고, 버튼문자열은 "확인"
	 **********************************************************************************************/
	let alertAction;
	const alertCallBack = function (e) {
		window.historyUtil.destroyHistory({layerId: "alertLayer"});
        let timeout = 100;

		if(alertAction === undefined){ return; }

        //IOS APP일때 콜백으로 focus 받을시 씹히는현상이 있어서 추가
        if (bridgeAgent.isIos() && bridgeAgent.isApp() && alertAction.toString().indexOf("focus")){
            alertAction(e);
		} else {
            setTimeout(() => {
                alertAction(e);
            },timeout);
		}

	};
	$body.on("click", "#alertLayer .alertBtn", alertCallBack);
	// $body.on("click", "", alertCallBack);

	// alert 레이어로 커스터마이징
	window.alert = function (param) {
		if($("#alertLayer").length == 0) {
            // 파라미터가 {}인지 여부에 따라 파라미터 세팅.
            param = typeof param !== "object" ? {contents: param} : param;

            // param 분해후 각 변수 초기화
            let {
                title = "알림",
                contents = "",
				contents2 = "",
				subContents = "",
                action = () => {},
                btnNm = "확인",
				_template = require("../template/alert.html")
            } = param;

            contents = contents.toString();

            if (contents.indexOf("Network Error") > -1) { return; }
            if (contents.indexOf("Trial expired") > -1) { return; }		// mobiscroll 때문에 임시 처리 나중에 지울 예정

            // 콜백 지정
            alertAction = action;
            const data = {id: "alertLayer", title, contents, contents2, btnNm, subContents};

            $("body").append(_template(data));

            window.historyUtil.addHistory({
                id: "alertLayer",
                /*bg: "alertBg",*/  //배경을 눌러도 닫혀서 주석처리
                closeCallback:function(){
                    $("#alertLayer").remove();
                }
            });
		}
	};

	/**********************************************************************************************
	 * @Method 설명 : confirm 커스터마이징
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 *              레이어팝업으로 관리 하도록 네이티브함수 오버라이드 (2018.06.07 김성훈)
	 *
	 *              파라미터를 객체형태 또는 String 으로 받도록 변경. (2019.01.25 김성훈)
	 *              파라미터를 3개로 나눠서 콜백 함수는 2,3번쨰 파라미터로 받음 ( 2019.01.28 박준석)
	 *                1. 객체 : {
	 *                			title:       confirm창 제목,
	 *                			contents:    confirm내용,
	 *                			leftBtnNm:   왼쪽 버튼문자열,
	 *                			rightBtnNm:  오른쪽 버튼문자열,
	 *                			closeStatus: ...
	 *                			},
	 *                			leftAction:  왼쪽 버튼클릭콜백,
	 *                			rightAction: 오른쪽 버튼클릭콜백
	 *                2. String : confirm내용, 콜백은 없고, 제목은 "알림", 문자열은 "취소" / "확인"
	 *
	 *                confirm 부분을 총 4개로 분리 (title, contents, subContents, footer)
	 *                기존에 default, 또는 contents 로 들어가고 있던 부분은 title 로 전부 변경함
	 *                기존에 없던 'x' 표시가 생겼으며, 'x' 표시 클릭시 failFunc 실행. (2020-06-22 박제원)
	 *                parma : {
	 *                    title : confirm 창 제목,
	 *                    contents : confirm 내용,
	 *                    subContents : confirm 내용 아래 추가 글,
	 *                    footer : 중간 줄이 생기고 하단 아래에 작은 글
	 *                    ..
	 *                    ..
	 *                }
	 **********************************************************************************************/
	let successFunc, failFunc;
	let confirmCallBack = function (e) {
		const target = $(e.currentTarget);
		window.historyUtil.destroyHistory({layerId: "confirmLayer"});
        let timeout = 100;
        setTimeout(function(){
            let func;
            if(target.data("pos") === "right"){
            	func = successFunc
			}else if(target.data("pos") === "left"){
            	func = failFunc;
			}
            if(func === undefined || typeof func !== "function"){
            	return;
			}
			func();
		},timeout);
	};
	$body.on("click", "#confirmLayer .btnConfirm", confirmCallBack);
	// $body.on("click", "", confirmCallBack);

	// confirm 레이어로 커스터마이징
	// TODO :  2019-03-12(홍광표) backCallback 추가 histoyback 사용시에만 작동하는 콜백 생성.

	window.confirm = function (param, leftAction = ()=>{}, rightAction = ()=>{}, backCallback = ()=>{}) {
        const profileWriteRegExp = /profile\/info\/write/gi;        //프로필 신규등록
        // 파라미터가 {}인지 여부에 따라 파라미터 세팅.
        let $confirmLayer = $("#confirmLayer");
        if ($confirmLayer.length === 0) {
            param = typeof param !== "object" ? {title: param} : param;

            // param 분해 후 각 변수 초기화
            const {
                title = "",
                contents = "",
				subContents = "",
				footer = "",
                leftBtnNm = "취소",
                rightBtnNm = "확인",
				_template = require("../template/confirm.html")
            } = param;

            // 콜백 지정
            successFunc =  rightAction != null ? rightAction : ()=>{};
            failFunc = leftAction != null ? leftAction : ()=>{};

            const data = {
                id: "confirmLayer",
				title: title,
				subContents: subContents,
				footer: footer,
                contents: contents,
                leftBtnNm: leftBtnNm,
                rightBtnNm: rightBtnNm,
            };

            $("body").append(_template(data));
            window.historyUtil.addHistory({
                id: "confirmLayer",
                /*bg: "cofirmBg",*/ // 배경을 눌러도 닫혀서 주석처리
                closeCallback: function () {
                    $("#confirmLayer").remove();
                    if(profileWriteRegExp.test(location.pathname) && window.tmpSubmitWait){
                        window.tmpSubmitWait = false;
                    }
                },
                backCallback: backCallback
            });
        }
    };

	/**********************************************************************************************
	 * @Method 설명  : 로그인여부 판별
	 * @작성일   :  2019-02-08
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	window.loginCheck = () => {
		const gCCV = $.cookie("gCCV");
		return !!gCCV;
	};

	/**********************************************************************************************
	 * @Method 설명  : 로그인 여부 판별 후 소셜 계정이라면 추가 인증 판별 진행
	 * @작성일   :  2019-02-20
	 * @작성자   : 박준석
	 * @변경이력  :
	 **********************************************************************************************/
	window.socialLoginAndCertifyChecker = (callback = ()=>{}) => {
		if(loginCheck()) {
			callback();
		} else {
			confirm({
				title: "로그인 후 이용가능합니다.<br>로그인 (회원가입) 하시겠습니까?",
				rightBtnNm: "로그인(회원가입)"
			}, ()=>{}, ()=>{bridge.startWin("/member/login/index");});
		}
	};


	// 쿠키 제거 함수
	window.deleteCookie = (callback) => {
		// TODO 필요한 경우 여보야에 맞게 작업
		try {
			let option = {path: '/', domain: '.yeoboya.com'};
			$.cookie("setAutoLogin", "", option);
			$.cookie("gCCV", "", option);
			$.cookie("gENC", "", option);
			$.cookie("SIOmode", "0", option);

			$.removeCookie("setAutoLogin", option);
			$.removeCookie("gCCV", option);
			$.removeCookie("gENC", option);
			$.removeCookie("SIOmode", option);
		} catch (e) {
			console.error("cookie delete error ==> ", e);
		}
		if (callback !== undefined) {
			setTimeout(() => callback(), 100);
		}
	};
});

