import pageManager from "./bridgePageManager"
"use strict";

/**********************************************************************************************
 * @FileName  : bridgeBroadCastHandler.js
 * @Date      : 2018. 6. 4.
 * @작성자      : 신희원 & 김성훈
 * @설명       :
 **********************************************************************************************/
export default class BridgeBroadCastHandler extends pageManager{

	constructor(){
		super();
		this.op = {
			type : "broadCastType",
			param : "broadCastParam",
			target : "broadCast",
		};
	}

	/**********************************************************************************************
	 * @Method 설명 : 이벤트를 조진다.
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	fire(type, target, param){
		// console.log("fire", target);
		this.type = type;
		this.target = target;
		this.param = param;
		if(!bridgeAgent.isApp()){
			$(window).trigger("storage");
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 리스너 등록
	 * @작성일   : 2018. 6. 5.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	bindListeners(){
		let pointer = this;

		// 브로드캐스트 이벤트 호출
		window.webBroadCast = (type, param) => {
			let pages = pointer.pages;
			_.remove(pages, (el) => {
				return el === pointer.getKey();
			});
			pointer.fire(type, pages.join(","), param);
		};

        var agent = navigator.userAgent.toLowerCase();
        if ( (navigator.appName == "Microsoft Internet Explorer" || agent.search( "trident" ) > -1) && agent.search( "edge/" ) == -1 ) {
            // 브로드 캐스트 스토리지 변경 이벤트 처리
            $(window).off("storage").on("storage", (event) =>{
                let target = pointer.target;
                if(! _.isEmpty(target)){
                    let targets = target.split(",");
                    _.remove(targets, (el) => {
                        if (el === pointer.getKey()) {
                            if ( ! _.isEmpty(pointer.type)) {
                                //console.log("이벤트 실행 : " + pointer.type);
								// console.log("브로드캐스트 실행", pointer.param);
                                broadCast.run(pointer.type, pointer.param);
                            }
                            return true;
                        }
                        return false;
                    });

                    let target1 = targets.join(",");
                    if (target1 != target){
                        this.target = target1;
										}
                } else {
                    //this.empty();
                }
            });
        }else{
            // 브로드 캐스트 스토리지 변경 이벤트 처리
            $(window).off("storage").on("storage", (event) =>{
                let target = pointer.target;
                if(! _.isEmpty(target)){
                    let targets = target.split(",");
                    _.remove(targets, (el) => {
                        if (el === pointer.getKey()) {
                            if ( ! _.isEmpty(pointer.type)) {
                                //console.log("이벤트 실행 : " + pointer.type);
                                broadCast.run(pointer.type, pointer.param);
                            }
                            return true;
                        }
                        return false;
                    });
                    this.target = targets.join(",");
                } else {
                	//if(pointer.type !== ""){
									//this.empty();
									//}
                }
            });
		}

	}

	/**********************************************************************************************
	 * @Method 설명 : 이벤트 종료 후 실행 이벤트 정보 제거
	 * @작성일   : 2018. 6. 5.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	empty(){
		this.type = "";
		this.param = "";
	}

	/**********************************************************************************************
	 * @Method 설명 : 브로드캐스트 호출 정보 관리
	 * @작성일   : 2018. 6. 5.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	get target(){
		return localStorage.getItem(this.op.target);
	}

	get type(){
		return localStorage.getItem(this.op.type);
	}

	get param(){
		return localStorage.getItem(this.op.param);
	}

	set target(target){
		localStorage.setItem(this.op.target, target);
	}

	set type(type){
		localStorage.setItem(this.op.type, type);
	}

	set param(param){
		return localStorage.setItem(this.op.param, param);
	}
}






