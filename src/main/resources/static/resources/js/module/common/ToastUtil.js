/**********************************************************************************************
 * @FileName  : ToastUtil.js
 * @Date      : 2018-05-31
 * @작성자      : 김성훈
 * @설명       : 토스트 메시지
 **********************************************************************************************/
"use strict";

export class Toast {

    /**********************************************************************************************
     * @Method 설명 : 토스트 메시지 띄우기
     * @작성일   : 2018-05-31 
     * @작성자   : 김성훈
     * @변경이력  :
     *              토스트 여러개 막 띄웠을때 정상작동하도록 uid부여해서 제어
     *              강알찬 : lifeSec추가 > 토스트fadeOut으로 사라지지 않고 일반 팝업처럼 순간 사라지는 기능을 기획에서 요청해서 추가함
     *              강알찬 : css추가 > 토스트 위치 크기 등등을 기획에서 유동적으로 요청하여서 추가함
     *                       msgCss추가 > 문구 위치 크기 등등을 기획에서 유동적으로 요청하여서 추가함
     **********************************************************************************************/
    static makeText(message, {position = this.POSITION.CENTER, duration = this.DURATION.MIDDLE, callback = ()=>{}, isLeft = false, lifeSec = 0, cssClass = "", css = "", msgCss = ""} = {}) {
        $('.toast_box').remove();   // 토스트 메세지 겹침 현상 제거(일단 간단히 함, 문제 있으면 말씀해주세요 - 조대발)
        const seed = new Date();
        const uid = "uid_" + seed.getSeconds() + seed.getMilliseconds();
        const toastHTML =
        `<div class="toast_box ${cssClass} ${position}" id="${uid}" style="${css}">
            <p style="${isLeft ? 'text-align:left;' : ''}; ${msgCss}">${message}</p>
        </div>`;

        const $popToast = $("#popToast");

        let $body = $("body");
        $body.append(toastHTML);
        if (lifeSec > 0){
            setTimeout(function () {
                $("#"+uid).remove();
                callback();
            }, lifeSec);
        } else {
            if ($("#" + uid).hasClass("toast_box_ani")) {
	              setTimeout(function () {
		                $("#" + uid).addClass("toast_box_ani-out");
		                setTimeout(function () {
			                  $("#" + uid).remove();
		                }, 500);
		                callback();
	              }, duration);
            } else {
	              setTimeout(function () {
		                $("#" + uid).fadeOut("400", function () {
			                  $("#" + uid).remove();
			                  callback();
		                });
	              }, duration);
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : 푸쉬알림 토스트 메시지 띄우기
     * @작성일   : 2018-05-31
     * @작성자   : 김성훈
     * @변경이력  : 토스트 여러개 막 띄웠을때 정상작동하도록 uid부여해서 제어
     *               type : 1,3 - 기본 toast / 2 - 버튼있는 toast UI
     **********************************************************************************************/
    static makeNotiText({data, position = this.POSITION.CENTER, duration = this.DURATION.LONG, confirmCallback = ()=>{}, type = 1}) {
        if($("#popToast").html() === ""){
            const seed = new Date();
            const uid = "uid_" + seed.getSeconds() + seed.getMilliseconds();
            const toastUI = require("../template/toastNotiUI.html");
            const toast = toastUI({uid: uid, type : type, data: data});
            let $body = $("body");
            $body.append(toast);
            setTimeout(function(){
                $("#"+uid).fadeOut("400", function () {
                    $("#"+uid).remove();
                });
            }, duration);

            if(type === 1 || type === 3){
                $("body").on("click", "#toastCont", (e) => {
                    confirmCallback();
                });
            }else if(type === 2){
                $("body").on("click", ".btn_ok", (e) => {
                    confirmCallback();
                });
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : 내 나이에 맞게보기 관련 토스트
     * @작성일   : 2020-03-03
     * @작성자   : 조문기
     * @변경이력  :
     **********************************************************************************************/
    static makeMyAgeNoti(message, {outerClassName="ageset_toast", duration = this.DURATION.MIDDLE, callback = ()=>{}} = {}) {
        $(`.${outerClassName}`).remove();   // 토스트 메세지 겹침 현상 제거(일단 간단히 함, 문제 있으면 말씀해주세요 - 조대발)
        const seed = new Date();
        const uid = "uid_" + seed.getSeconds() + seed.getMilliseconds();
        const toastHTML =
            `<div class="${outerClassName}" id="${uid}">
                <div class="toast_txt bounceInUp">${message}</div>
            </div>`

        let $body = $("body");
        $body.append(toastHTML);
        setTimeout(function () {
            $("#" + uid).fadeOut("400", function () {
                $("#" + uid).remove();
                callback();
            });
        }, duration);
    }

    /**********************************************************************************************
     * @Method 설명 : 자동위로올리기 알림 전용팝업 (#4202관련 토스트작업)
     * @작성일   : 2020-04-16
     * @작성자   : 조문기
     * @변경이력  :
     **********************************************************************************************/
    static makeAutoUpToast(memNick, autoCnt) {
        $('.up_toast_layout').remove();
        const seed = new Date();
        const uid = "uid_" + seed.getSeconds() + seed.getMilliseconds();
        const toastHTML =
            `<div class="up_toast_layout">
                <div class="up_toast_box">
                    <div class="toast_box_text">
                        <span class="toast_nik">${memNick}님!</span>
                        <span class="toast_anno"><span>${autoCnt}번째</span>자동올리기가 되었습니다.</span>
                    </div>
                </div>    
            </div>`;

        let $body = $("body");
        $body.append(toastHTML);
    }

    static get POSITION () {
        return {
            TOP: "top_toast",
            CENTER: "center_toast",
            BOTTOM: "bottom_toast",
            BOTTOMFLEX: "bottom_flex",
        }
    }

    static get DURATION () {
        return {
            SHORT: 1000,
            MIDDLE: 2000,
            LONG: 3000,
            FOUR: 4000,
            LATE: 5000,
            TOOLONG: 6000,
            SEVEN: 7000,
            EIGHT: 8000
        }
    }
}