/**********************************************************************************************
 * @FileName  : cookieUtil.js
 * @Date      : 2018-05-14
 * @작성자     : 김성훈
 * @설명	   : 쿠키값 얻어오는 클래스 (gCCV)
 **********************************************************************************************/

require("jquery.cookie");

export class CookieUtil {
	/**********************************************************************************************
	 * @Method 설명 : gCCV를 Object로 만들어서 반환함 (gCCV가 없을 경우 빈 객체 반환)
	 * @작성일   : 2018-05-14 
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static gCCV () {
		return window.gccv();
	}

	static SIOmode () {
		return window.siomode();
	}

    static saveLoginId () {
        return window.saveloginid();
    }
}

window.gccv = () => {
	let gCCV = $.cookie("gCCV");

	if(!gCCV) return {};
	let gCCVItemArray = gCCV.split("|"),
		keyArray = [],
		valArray = [];

	gCCVItemArray.forEach(item => {
		let split = item.split("=");
		keyArray.push(split[0]);
		valArray.push(split[1]);
	});

	return _.zipObject(keyArray, valArray);
};

window.siomode = () => {
	return $.cookie("SIOmode");
};
// 2018.03.02 Raccoon : 기획 반영
window.saveloginid = () => {
    return $.cookie("saveLoginId");
};