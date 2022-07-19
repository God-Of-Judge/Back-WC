/**********************************************************************************************
 * @FileName  : historyUtil.js
 * @Date      : 2019-07-23
 * @작성자      : 홍광표
 * @설명       : 히스토리 관리 유틸
 **********************************************************************************************/
"use strict";
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

export class HistoryUtil {
    constructor() {
        this.queue = new Queue();
        //modelUtil에 사용되는 변수들---------start
        window.requestRender = new Map();
        window.modelObj = new Map();
        window.vnode = new Map();
        //modelUtil에 사용되는 변수들---------END
        window.layerCloseCallback = new Map();
        window.backCallbackMap = new Map();
        window.layerPopupInfo = new Map();
        window.offTarget = new Map();
        window.layerPopupIdStack = [];
        window.intentClose = false;
        if(window.history.state == null){
            window.history.replaceState({
                length: window.history.length,
                closeSet: false
            }, "modal", location.href);
        }
        this.init();
    }

    init () {
        window.onpopstate = function() {
            if(window.layerPopupIdStack.length > 0){
                if(window.historyStatusAndroid) {
                    clearTimeout(window.historyStatusAndroid);
                    window.historyStatusAndroid = null;
                }
                clearTimeout(this.resetHistoryCloseSet);
                setTimeout(function(){
                    let state = window.history.state;
                    if(state !== null){
                        if(state.closeSet) {
                            state.closeSet=false;
                            window.history.replaceState(state, "modal");
                        }else{
                            this.destroyHistory({status : true});
                            window.historyStatusAndroid = 0;
                            state.closeSet=false;
                            if(state.closeLayerFlag){
                                state.closeLayerFlag=false;
                            }
                            window.history.replaceState(state, "modal");
                        }
                    }
                }.bind(this),100);
            }else{
                if(window.history.state == null){
                    window.history.replaceState({
                        length: window.history.length,
                        closeSet: false
                    }, "modal", location.href);
                }
                window.history.state.closeSet=false;
                window.history.replaceState(window.history.state, "modal");
            }
        }.bind(this)
    }

    /**********************************************************************************************
    * @Method 설명 : 히스토리 추가
    * @작성일   : 2019-07-29
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    addHistory({
        id                         //대상 아이디
        ,bg                        //대상 백그라운드 ID
        ,startCallback = () => {}  //시작 콜백
        ,closeCallback = () => {}  //종료 콜백
        ,backCallback = () => {}   //back 버튼 콜백
    }){
        window.layerPopupIdStack.push({id:id , bg:bg});
        window.layerCloseCallback.set(id, closeCallback);
        window.backCallbackMap.set(id, backCallback);

        $("#" + id).show();
        if(bg){
            let value = $("#" + bg);
            value.show();
            value.click(function(e){
                let targetId = e.target.id;
                if(targetId === bg){
                    e.preventDefault();
                    e.stopPropagation();
                    window.historyUtil.destroyHistory({layerId : id});
                }
            });
            window.offTarget.set(bg, value);
        }

        if(bridgeAgent.isApp() || bridgeAgent.isMobileWeb() || location.href.indexOf("/member/join/insertV") > -1) {
            if(location.pathname === "/" || location.pathname.indexOf("/startPage") > -1 ){
                bridge.setFooterMenu("hidden");
            }
            window.history.pushState({
                length: window.history.length,
                hash: id, closeSet: false
            }, "modal", window.location.href);
        }
        startCallback();
    }

    /**********************************************************************************************
     * @Method 설명 : 전체 히스토리 초기화 / 히스토리 추가
     * @작성일   : 2019-07-29
     * @작성자   : 홍광표
     * @변경이력  :
     **********************************************************************************************/
    allDestroyAndAdd(param = {
         id                         //대상 아이디
        ,bg                        //대상 백그라운드 ID
        ,startCallback : () => {}  //시작 콜백
        ,closeCallback : () => {}  //종료 콜백
        ,backCallback : () => {}   //back 버튼 콜백
    }){
        window.historyUtil.allDestroyHistory(function(){
            window.historyUtil.addHistory(param);
        });
    }

    /**********************************************************************************************
    * @Method 설명 : 전체 히스토리 초기화
    * @작성일   : 2019-07-29
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    allDestroyHistory(callBack = ()=>{}, closeStatus = true){
        if(closeStatus){
            if(location.pathname === "/" || location.pathname.indexOf("/startPage") > -1 ){
                bridge.setFooterMenu(location.pathname === '/' ? "meetingMain" : 'home');
            }
            let length = window.layerPopupIdStack.length;
            if(length > 0){
                for(let i = 0 ; i < length; i++){
                    this.queue.enqueue(this.destroyHistoryCallback);
                }
                this.queue.enqueue(callBack);
                this.queue.enqueue(function(){
                    let goBackCnt = -1 * (length);
                    if(goBackCnt && (bridgeAgent.isApp() || bridgeAgent.isMobileWeb())){
                        historyUtil.historyGoBack(goBackCnt);
                    }
                });
                let dequeue = undefined;
                while (typeof (dequeue = this.queue.dequeue()) !==  "undefined"){
                    dequeue();
                }
            }else{
                callBack();
            }
        }else{
            callBack();
        }
    }

    /**********************************************************************************************
    * @Method 설명 : 단일 히스토리 제거
    * @작성일   : 2019-07-29
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    destroyHistory(historyParam={status : false}){
        if(window.layerPopupIdStack.length > 0){
            if(window.layerPopupIdStack.length === 1){
                if(location.pathname === "/" || location.pathname.indexOf("/startPage") > -1) {
                    bridge.setFooterMenu(location.pathname === '/startPage' ? "home" : 'meetingMain');
                }
            }
            let number = window.layerPopupIdStack.length - 1;
            let layerPopupIdStackElement = window.layerPopupIdStack[number];
            let id = layerPopupIdStackElement.id;
            if(historyParam.layerId && historyParam.layerId !== id){
                let length = window.layerPopupIdStack.length;
                let i = length - 1;
                let status = -1;
                for( ; i >= 0; i--){
                    let layerPopupIdStackElement1 = window.layerPopupIdStack[i];
                    if(layerPopupIdStackElement1.id === historyParam.layerId){
                        status = i;
                        break;
                    }
                }
                if(status > -1){
                    window.layerPopupIdStack.move(i, length - 1);
                }else{
                    return false;
                }
            }
            //TODO : 콟백 실행 후 이동이 필요 할 경우 콜백 위치 변경
			if(bridgeAgent.isApp() || bridgeAgent.isMobileWeb()){
				if(!historyParam.status){
					historyUtil.historyGoBack();
				}
			}
            historyUtil.destroyHistoryCallback(historyParam);
        }

    }

    destroyHistoryCallback(historyParam={status : false}){
        let number = window.layerPopupIdStack.length - 1;
        let layerPopupIdStackElement = window.layerPopupIdStack[number];
        let id = layerPopupIdStackElement.id;
        let bg = layerPopupIdStackElement.bg;
        if (bg) {
            $("#" + bg).hide();
            let offTarget = window.offTarget.get(bg);
            if (offTarget) {
                offTarget.off("click");
                window.offTarget.delete(bg);
            }
        }

        let layerPopupInfo = window.layerPopupInfo.get(id);
        if (layerPopupInfo) {
            layerPopupInfo(id);
            window.layerPopupInfo.delete(id);
        }

        let layerCloseCallback = window.layerCloseCallback.get(id);

        if (layerCloseCallback) {
            layerCloseCallback();
            window.layerCloseCallback.delete(id);
        }

        let backCallback = window.backCallbackMap.get(id);
        if (backCallback) {
            if (historyParam.status) {
                backCallback();
            }
            window.backCallbackMap.delete(id);
        }
        window.layerPopupIdStack.splice(number);
    }

    historyGoBack(goBackCnt = -1) {
        window.history.go(goBackCnt);
        clearTimeout(this.resetHistoryCloseSet);
        setTimeout(function () {
            window.history.state.closeSet = true;
            window.history.replaceState(window.history.state, "modal");
            this.resetHistoryCloseSet = setTimeout(function () {
                window.history.state.closeSet = false;
                window.history.replaceState(window.history.state, "modal");
            }, goBackCnt < -1 ? 150 : 100);
        }.bind(this),  goBackCnt < -1 ? 0 : 50);
    }
}
class Queue {
    constructor() {
        this._arr = [];
    }
    enqueue(item) {
        this._arr.push(item);
    }
    dequeue() {
        return this._arr.shift();
    }
}
window.historyUtil = new HistoryUtil();