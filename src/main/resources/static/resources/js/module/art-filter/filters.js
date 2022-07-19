/**********************************************************************************************
 * @FileName  : filters.js
 * @Date      : 2018-05-10
 * @작성자      : 김성훈
 * @설명       : art-template에서 사용할 공통 필터들
 **********************************************************************************************/

import {NumberUtil} from "@/module/common/numberUtil";
import {FormatUtil} from "@/module/common/formatUtil";
import WeddingCommon from "@/portal/wedding/weddingCommon";

export class Filters {

    constructor() {
        this.runtime = require('art-template/lib/runtime');

        /**********************************************************************************************
         * @Method 설명 : 시간 포멧 변경 관련 필터
         * @작성일   : 2018-05-21
         * @작성자   : 오성민
         * @변경이력  :
         **********************************************************************************************/
        this.runtime.dateFormat = function(date, format){
            moment.locale('kr', {
                weekdays: ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],
                weekdaysShort: ["일","월","화","수","목","금","토"]
                ,meridiem: function (hours, minutes, isLower) {
                    return hours < 12 ? '오전' : '오후';
                }
            });
            return moment(date).format(format)
        }

        this.runtime.default = function (data, param) {
            return data || param;
        }

    }

    /**********************************************************************************************
     * @Method 설명 : Number에 컴마 추가해서 String 반환하는 필터 추가
     * @작성일   : 2018-05-10
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callAddCommaToString() {
        this.runtime.addCommaToString = NumberUtil.addCommaToString;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : String에 컴마 제거해서 String반환하는 필터 추가
     * @작성일   : 2018-05-10
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callRemoveCommaToString() {
        this.runtime.removeCommaToString = NumberUtil.removeCommaToString;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : String에 컴마 제거해서 Number반환하는 필터 추가
     * @작성일   : 2018-05-10
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callRemoveCommaToNumber() {
        this.runtime.removeCommaToNumber = NumberUtil.removeCommaToNumber;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 숫자를 받아서 한글로 변경 (컴마있는 숫자도 가능) 하는 필터 추가
     * @작성일   : 2018-05-10
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callNumberToPureKorean() {
        this.runtime.numberToPureKorean = NumberUtil.numberToPureKorean;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 만단위 숫자를 받아서 숫자와 한글 조합으로 출력 (컴마있는 숫자도 가능) 하는 필터 추가
     * @작성일   : 2018-05-10
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callNumberToMixedKorean() {
        this.runtime.numberToMixedKorean = NumberUtil.numberToMixedKorean;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 만, 천단위 숫자를 받아서 숫자와 한글 조합으로 출력 (컴마있는 숫자도 가능)
     *                  ex) 12,345 => 1억 2,345 / 2,345 => 2천 345
     * @작성일   : 2018-11-06
     * @작성자   : 노윤성
     * @변경이력  :
     **********************************************************************************************/
    callNumberToMixedKorean2() {
        this.runtime.numberToMixedKorean2 = NumberUtil.numberToMixedKorean2;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 숫자(소수점자리 포함)해서 4자리로 맞추기 (만 이상일 경우는 소수점 무조건 반올림 정수만 표기)
     *                  ex) 123.45 > 123.5, 1234.56 > 1235, 12345.67 > 12346
     * @작성일   : 2018-11-12
     * @작성자   : 노윤성
     * @변경이력  :
     **********************************************************************************************/
    callNumberToPositionalNumberFour() {
        this.runtime.numberToPositionalNumberFour = NumberUtil.numberToPositionalNumberFour;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 숫자를 받아서 전화번호 형태로 "-"를 넣어줌 (앞3글자 + 뒷4글자 + 나머지 중간글자)
     * @작성일   : 2018-07-17
     * @작성자   : 김성훈
     * @변경이력  :
     **********************************************************************************************/
    callFormatPhone () {
        this.runtime.formatPhone = FormatUtil.phone;
        return this;
    }


    /**********************************************************************************************
     * @Method 설명 : 체크박스 문자열 포함여부 checked
     * @작성일   : 2019-02-11
     * @작성자   : 유채화
     * @변경이력  :
     **********************************************************************************************/
    checkboxContains(){
        this.runtime.checkboxContains =  function(array,data){
            if(array && data){
                if(array.indexOf(data) != -1){
                    return "checked";
                }
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : 셀렉트박스 문자열 포함 selected
     * @작성일   : 2019-02-11
     * @작성자   : 유채화
     * @변경이력  :
     **********************************************************************************************/
     selectContains(){
         this.runtime.selectContains = function (array,key,data) {
             if(key == 'jWorkTimeStart' || key == 'jWorkTimeEnd'){
                 data = data.replace("ych","");
             }
             if(array && data){
                 if(array.indexOf(data) != -1){
                     return "selected";
                 }
             }
         }
    }

    /**********************************************************************************************
     * @Method 설명 : 문자열 포함 show hidden 처리
     * @작성일   : 2019-02-11
     * @작성자   : 유채화
     * @변경이력  :
     **********************************************************************************************/
    viewContains(){
        this.runtime.viewContains = function (array,data) {
            if(array && data){
                if(array.indexOf(data) != -1){
                    return "style=display:block";
                }else{
                    return "style=display:none";
                }
            }else{
                return "style=display:none";
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : AM/PM 들어가는 Date 포멧 오전/오후로 변경
     *                  ex) 2018.10.12 AM 10:12 => 2018.10.12 오전 10:12
     * @작성일   : 2019-02-19
     * @작성자   : 차성훈
     * @변경이력  :
     **********************************************************************************************/
    changeTimetoKor(){
        this.runtime.changeTimetoKor = function (data) {
            if(!data) return data;
            return data.replace(/am|AM/gi, "오전").replace(/pm|PM/gi, "오후");
        }
    }

    /**********************************************************************************************
     * @Method 설명 : 숫자 4단위 한글 변환
     * 					ex) 125000 => 12만5000원
     * 						500000 => 50만원
     * @작성일   : 2019-02-13
     * @작성자   : 조대발
     * @변경이력  :
     **********************************************************************************************/
    callNumberToFourUnitConversion(){
        this.runtime.numberToFourUnitConversion = NumberUtil.numberToFourUnitConversion;
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 콤마 기준으로 자르기
     * @작성일   : 2019-02-19
     * @작성자   : 유채화
     * @변경이력  :
     **********************************************************************************************/
    callCommaSplit(){
        this.runtime.commaSplitSlect = function (data,age1,age2) {
            let arr = data.split(",");
            if(arr[0] == age1 && arr[1] == age2){
                return "selected";
            }
        };
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 특정 문자열 replace
     * @작성일   : 2019-02-20
     * @작성자   : 유채화
     * @변경이력  :
     **********************************************************************************************/
    callReplaceString(){
        this.runtime.ReplaceString = function (data,param) {
            return data.replace(param,"");
        };
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 인재리스트에서 이름 가림처리
     * @작성일   : 2019-03-06
     * @작성자   : 김남현
     * @변경이력  :
     **********************************************************************************************/
	callRemakeName(){
		this.runtime.RemakeName = function (data) {
			return data.substring(0, 1) + '○○';
		};
		return this;
	}

	/**********************************************************************************************
	 * @Method 설명  : 페블펑션 linefeed랑 같음
	 * @작성일   :  2019-09-02
	 * @작성자   : 김성훈
	 * @변경이력  :
	 **********************************************************************************************/
	callLineFeed() {
	    this.runtime.lineFeed = function (data, allowDuplicate = false) {
	        if(!data) return;

	        let result = "";
	        if (!allowDuplicate) {
                result = data.replace(/\n{2,}gi/, '\n\n');
            }
            result = result.replace(/\n/gi, '<br/>');
	        return result;
        }
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : wedding prdctType code를 한글로 변환
     * @작성일   : 2021-03-10
     * @작성자   : 박제원
     * @변경이력  :
     **********************************************************************************************/
    prdctTypeKorByCode(){
        this.runtime.prdctTypeKorByCode = function (data) {
            return WeddingCommon.getPrdctTypeKorByCode(data);
        }
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : 소수점 한자리까지만 반올림해서 표시 (ex => 2.13 -> 2.1)
     * @작성일   : 2021-03-16
     * @작성자   : 박제원
     * @변경이력  :
     **********************************************************************************************/
    numberPointToFixedOne(){
        this.runtime.numberPointToFixedOne = function (data) {
            if($.isNumeric(data)){
                return parseFloat(data).toFixed(1);
            }else{
                return data;
            }
        }
        return this;
    }

    /**********************************************************************************************
     * @Method 설명 : String trim
     * @작성일   : 2021-05-26
     * @작성자   : 박제원
     * @변경이력  :
     **********************************************************************************************/
    removeNewLine(){
        this.runtime.removeNewLine = function (data) {
            return data.replace(/<br>/ig, "\n");
        }
    }

}
