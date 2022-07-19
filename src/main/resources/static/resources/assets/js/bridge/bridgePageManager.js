/**********************************************************************************************
 * @Class 설명 : 페이지 관리자 (스토리지)
 * @작성일   : 2018. 6. 4.
 * @작성자   : 신희원
 * @변경이력  :
 **********************************************************************************************/
export default class BridgePageManager {

	constructor() {
		this.storageName = "page";
		this.savePage();
		this.bindListener();
	}

	/**********************************************************************************************
	 * @Method 설명 : 키 생성
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	createKey() {
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		return possible.charAt(Math.floor(Math.random() * possible.length))
	}

	/**********************************************************************************************
	 * @Method 설명 : 페이지 정보 저장
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	savePage() {
		if(_.isEmpty(window.pageCode)){
			window.pageCode = _.join(_.range(0, 30, 1).map(i => this.createKey()), "");
			let pageArray = this.page;
			if (_.isEmpty(pageArray)) {
				this.page = window.pageCode;
			} else {
				this.page = pageArray + "," + window.pageCode;
			}
			if(bridgeAgent.isIos()){
			    setTimeout(function(){
                    window.bridge.setData("lastFocusWindow", window.pageCode);
                },100)
            }else{
                localStorage.setItem("lastFocusWindow", window.pageCode);
            }
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 페이지 새로고침, 종료, 뒤로가기 들 이벤트 처리 -> 페이지 정보 삭제
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	bindListener() {
		const pointer = this;
		$(window).on("beforeunload", () => {
			pointer.removePage();
		});
	}

	/**********************************************************************************************
	 * @Method 설명 : 페이지 삭제
	 * @작성일   : 2018. 7. 2.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	removePage(){
		try {
			let pages = this.pages;
			_.remove(pages, (el) => {
				return el == pageCode;
			});
			this.pages = pages;
        }catch (e) {
        }
	}

	/**********************************************************************************************
	 * @Method 설명 : 로그 제거
	 * @작성일   : 2018. 7. 2.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	resetHistory(isPage) {
		localStorage.setItem("broadCast", "");
		localStorage.setItem("broadCastType", "");
		localStorage.setItem("broadCastParam", "");
		if(isPage){
			localStorage.setItem("page", window.pageCode);
		}
	}

	/**********************************************************************************************
	 * @Method 설명 : 현재 페이지 키 리턴
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	getKey() {
		return pageCode;
	}

	/**********************************************************************************************
	 * @설명 : 페이지 저장 정보 관리
	 * @작성일   : 2018. 6. 4.
	 * @작성자   : 신희원
	 * @변경이력  :
	 **********************************************************************************************/
	set page(pageCode) {
		localStorage.setItem(this.storageName, pageCode);
	}

	set pages(pages) {
		this.page = pages.join(",");
	}

	get page() {
		return localStorage.getItem(this.storageName);
	}

	get pages() {
		return this.page.split(",");
	}

}