/**********************************************************************************************
 * @FileName  : elementUtil.js
 * @Date      : 2019-01-25 
 * @작성자      : 김성훈
 * @설명       : HTML element 유틸
 **********************************************************************************************/

import {FormatUtil} from "./formatUtil";
import {Toast} from "./ToastUtil";

export class ElementUtil {

	constructor() {}

	static makeItJqueryObject($el) {
		if(!$el.jquery) {
			$el = $($el);
		}
		return $el;
	}

	/**********************************************************************************************
	 * @Method 설명 : 해당 엘리먼트에 글자 수 최대길이 제한 걸기
	 * @작성일   : 2019-01-25 
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static maxLength($el, max) {
		$el = this.makeItJqueryObject($el);
		const val = $el.val();
		if(val.length > max) {
			Toast.makeText(`최대 ${max}자 까지 입력 가능합니다.`);
			$el.val(val.substr(0, max));
		}
	}
	
	/**********************************************************************************************
	 * @Method 설명 : 지정한 타입의 문자만 입력가능하도록 제한 걸기
	 * @작성일   : 2019-01-25 
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static setType($el, type) {
		$el = this.makeItJqueryObject($el);
		const val = $el.val();
		$el.val(val.replace(type, ""));
	}

	/**********************************************************************************************
	 * @Method 설명 : 숫자만 입력가능하고 입력된 숫자를 연락처 형태로 "-" 로 붙여줌
	 * @작성일   : 2019-01-25
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static makePhoneNumber($el) {
		$el = this.makeItJqueryObject($el);
		const val = $el.val();
		let result = val.replace(/-/gi, "");
		if(result.length > 8) {
			result = FormatUtil.phone(result);
		}
		$el.val(result);
	}

}





/** 문자 타입 상수 */
export const types = {
	KOREAN: /[^ㄱ-힣ㅏ-ㅣ\u119E\u11A2]/gi,		// 천지인 키보드 대응.
	ENGLISH: /[^a-zA-Z]/gi,
	KOREAN_ENGLISH: /[^ㄱ-힣ㅏ-ㅣ\u119E\u11A2a-zA-Z]/gi,	// 천지인 키보드 대응.
	COMPANY_NAME: /[^ㄱ-힣ㅏ-ㅣ\u119E\u11A2a-zA-Z() &]/gi,	// 사명에 대해 한글,영어, (, ) 및 공백 입력 가능 하도록.
	NUMBER: /[^0-9]/gi,
	PHONE: /[^0-9\-]/gi
};