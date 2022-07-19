/**********************************************************************************************
 * @FileName  : numberUtil.js
 * @Date      : 2018-05-10
 * @작성자      : 김성훈
 * @설명       : 숫자 관련 유틸
 *               #### 추가하기 전에 lodash에 있는 기능인지 확인 먼저 하고 추가 해주세요 ####
 **********************************************************************************************/

export class NumberUtil {

	/**********************************************************************************************
	 * @Method 설명 : Number에 컴마 추가해서 String 반환
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static addCommaToString(num) {
		if (!isNaN(num)) {
			let retValue = String(num);
			while (retValue.match(/^(-?\d+)(\d{3})/)) {
				retValue = retValue.replace(/^(-?\d+)(\d{3})/, '$1,$2');
			}
			return retValue;
		} else {
			return "";
		}
	};

	/**********************************************************************************************
	 * @Method 설명 : String에 컴마 제거해서 String반환
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static removeCommaToString(num) {
		if (num !== undefined) {
			if (num === "") num = "0";
			return num.replace(/,/g, "");
		} else {
			return "0";
		}
	};

	/**********************************************************************************************
	 * @Method 설명 : String에 컴마 제거해서 Number반환
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static removeCommaToNumber(num) {
		num = parseInt(NumberUtil.removeCommaToString(num));
		if (!num || isNaN(num)) num = 0;
		return num;
	};

	/**********************************************************************************************
	 * @Method 설명 : 만단위 숫자를 받아서 순수 한글로 출력 (컴마있는 숫자도 가능)
	 *                  ex) 12,345 => 일억 이천삼백사십오만
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static numberToPureKorean(val) {
		let hanA = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"];
		let danA = ["", "십", "백", "천"];
		let retValue = "";
		let chk = false;

		if (val !== "" && val != null) {
			val = NumberUtil.removeCommaToNumber(String(val));

			let intVal = parseInt(val, 10);
			val = '' + intVal;
			for (let i = 0; i < val.length; i++) {
				let str = "";
				let han = hanA[val.charAt(val.length - (i + 1))];
				if (han !== "") str = han + danA[i % 4];
				if (i < 4) {
					if (han !== "") chk = true;
				}
				if (i === 4) str += "억 ";
				if (i === 8) str += "조 ";
				if (i === 12) str += "경 ";
				retValue = str + retValue;
			}
			if (chk) {
				retValue = retValue + "만";
			}
		}
		return retValue;
	};

	/**********************************************************************************************
	 * @Method 설명 : 만단위 숫자를 받아서 숫자와 한글 조합으로 출력 (컴마있는 숫자도 가능)
	 *                  ex) 12,345 => 1억2345만
	 * @작성일   : 2018-05-10
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	static numberToMixedKorean(val) {
		let won = NumberUtil.removeCommaToString(String(val)) + '0000'; // DB에서 만 단위로 넘어오므로 0000를 붙임.
		let arrWon = ["원", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정"];
		let retValue = "";
		let pattern = /(-?[0-9]+)([0-9]{4})/;
		while (pattern.test(won)) {
			won = won.replace(pattern, "$1,$2");
		}

		let rtnMoney = won.split(",");
		let len = rtnMoney.length;
		let arrCnt = len - 1;
		let unitVal = 0;
		for (let i = 0; i < len; i++) {
			if (arrWon[arrCnt] === undefined) {
				//console.log("입력값이 너무 큽니다.");
				break;
			}
			unitVal = parseInt(rtnMoney[i]);
			if (unitVal !== 0) {
				retValue += unitVal + arrWon[arrCnt];
			}
			arrCnt--;
		}
		return retValue;
	}

	/**********************************************************************************************
	 * @Method 설명 : 만, 천단위 숫자를 받아서 숫자와 한글 조합으로 출력 (컴마있는 숫자도 가능)
	 *                  ex) 12,345 => 1억 2,345 / 2,345 => 2천 345
	 * @작성일   : 2018-11-06
	 * @작성자   : 노윤성
	 * @변경이력  :
	 **********************************************************************************************/
	static numberToMixedKorean2(val) {
		let won = NumberUtil.removeCommaToString(String(val));

		if (won.length > 4) {
			won += '0000'; // DB에서 만 단위로 넘어오므로 0000를 붙임.
		}

		let arrWon = ["원", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정"];
		let arrWon2 = ["원", "천", "만", "억", "조", "경", "해", "자", "양", "구", "간", "정"];
		let retValue = "";
		let pattern = /(-?[0-9]+)([0-9]{4})/;

		while (pattern.test(won)) {
			won = won.replace(pattern, "$1,$2");
		}

		let rtnMoney = won.split(",");
		let len = rtnMoney.length;
		let arrCnt = len - 1;
		let unitVal = 0;

		if (len == 1) {
			won = NumberUtil.addCommaToString(won);
			rtnMoney = won.split(",");
			len = rtnMoney.length;
			arrCnt = len - 1;
			unitVal = 0;

			for (let i = 0; i < len; i++) {
				if (arrWon2[arrCnt] === undefined) {
					//console.log("입력값이 너무 큽니다.");
					break;
				}
				unitVal = parseInt(rtnMoney[i]);
				if (unitVal !== 0 && i == 0 && len > 1) {
					retValue += unitVal + arrWon2[arrCnt];
				} else if (unitVal !== 0) {
					retValue += " " + NumberUtil.addCommaToString(unitVal);
				}
				arrCnt--;
			}
		} else {
			for (let i = 0; i < len; i++) {
				if (arrWon[arrCnt] === undefined) {
					//console.log("입력값이 너무 큽니다.");
					break;
				}
				unitVal = parseInt(rtnMoney[i]);
				if (unitVal !== 0 && i == 0) {
					retValue += unitVal + arrWon[arrCnt];
				} else if (unitVal !== 0) {
					retValue += " " + NumberUtil.addCommaToString(unitVal);
				}
				arrCnt--;
			}
		}
		return retValue;
	}

	/**********************************************************************************************
	 * @Method 설명 : 소수점 한자리까지 표기하기
	 *                  ex) 123.45 > 123.5, 123 > 123.0
	 * @작성일   : 2018-11-12
	 * @작성자   : 노윤성
	 * @변경이력  :
	 **********************************************************************************************/
	static numberToPositionalNumberFour(val) {

		let numberArray = val.split('.');
		let returnValue = _.toNumber(val);

		if (_.isNumber(_.toNumber(val))) {
			returnValue = _.round(returnValue, 1);
		}

		return returnValue.toFixed(1);
	}

    /**********************************************************************************************
     * @Method 설명 : 숫자 4단위 한글 변환
     * 					ex) 125000 => 12만5000원
	 * 						500000 => 50만원
     * @작성일   : 2019-02-13
     * @작성자   : 조대발
     * @변경이력  :
     **********************************************************************************************/
    static numberToFourUnitConversion(val, lastStr='원'){
    	let won = NumberUtil.addCommaToString(val).replace(/,/g, '');
        let arrWon = [lastStr, '만', '억'];
        let changeWon = "";
        let pattern = /(-?[0-9]+)([0-9]{4})/;

        while(pattern.test(won)) {
            won = won.replace(pattern, '$1,$2');
		}

		let wonArray = won.split(',');

		let arrCnt = wonArray.length-1;

        for(let i = 0; i < wonArray.length; i++) {
        	if(typeof arrWon[arrCnt] === undefined){
				return '값의 수가 너무 큽니다.';
			}
			let tmpwon = 0;
			for (let j = 0; j < wonArray[i]; j++) {
				let num1 = wonArray[i].substring(j, j + 1);
				tmpwon += Number(num1);
			}
			if(tmpwon > 0) {
				changeWon += String(Number(wonArray[i])) + arrWon[arrCnt];
			}
			arrCnt--;
		}
        if(changeWon.substr(changeWon.length - 1) !== lastStr && changeWon.substr(changeWon.length - 1) > 0){
            changeWon += lastStr;
        }
		return changeWon;
    }

    /**********************************************************************************************
     * @Method 설명 : 핸드폰번호 formatter
     * 					type = 0 > 가운데자리 숨겨주기
     * @작성일   : 2020-04-22
     * @작성자   : 조문기
     * @변경이력  :
     **********************************************************************************************/
    static phoneFomatter(num, type){
        let formatNum = '';
        num = num != null ? num.replace(/-/gi, "") : "";
        if(num.length == 11){
            if(type==0){
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
            }else{
                formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            }
        }else if(num.length == 10){
            if(type==0){
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
            }else{
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            }
        }else if(num.length==8){
            formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
        }else{
            if(num.indexOf('02') == 0){
                if(type==0){
                    formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-****-$3');
                }else{
                    formatNum = num.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
                }
            }else{
                if(type==0){
                    formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
                }else{
                    formatNum = num.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
                }
            }
        }
        return formatNum;

	}

}