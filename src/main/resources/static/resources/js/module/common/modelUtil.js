/**********************************************************************************************
 * @FileName  : ModelUtil.js
 * @Date      : 2019-07-23
 * @작성자      : 홍광표
 * @설명       : 모델 유틸
 **********************************************************************************************/
"use strict";

import Model from "./model";
import { h, init } from "snabbdom";
import toVNode from "snabbdom/es/tovnode";
import props from "snabbdom/es/modules/props";
import dataset from 'snabbdom/es/modules/dataset'
import attributes from 'snabbdom/es/modules/attributes'
import eventlisteners from 'snabbdom/es/modules/eventlisteners'
const patch = init([
    require('snabbdom/modules/class').default,
    props,
    dataset,
    attributes,
    eventlisteners,
]);

export class ModelUtil {
    /**********************************************************************************************
    * @Method 설명 : snabbdom를 사용하여 set 호출시 render 자동 호출하는 함수
     *              snabbdom(변경 부분 DOM만 변경하게 할수 있는 가상 DOM 라이브러리)
    * @작성일   : 2019-07-29
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    static setModel({
        modelId                  // 데이터 및 객체가 들어갈 위치
        ,model                  // JSON 데이터
        ,render                 // render callback function
        ,startCallback =()=>{}  //param modelData
    }){
        if(modelId && model && render){
            window.requestRender.set(modelId, 0);

            // 모델내 데이터 변경시 실행할 콜백 (화면 렌더링이 다 끝난 후에 실행됨.)
            if (!model.callback && typeof model.callback !== "function") { model.callback = ()=>{} }

            //callback 생성
            let callback = function(modelId, render, startCallback=()=>{}){
                let requestRenderStatus = window.requestRender.get(modelId);
                if (requestRenderStatus ) {
                    cancelAnimationFrame(requestRenderStatus);
                }
                window.requestRender.set(modelId, requestAnimationFrame(function(){
                    let modelObj = window.modelObj.get(modelId);
                    let vnodeRender = window.vnode.get(modelId);
                    let renderHtml = render(modelObj);
                    const newVNode = ModelUtil.parseHtml(renderHtml);
                    if (!vnodeRender) {
                        vnodeRender = toVNode(document.getElementById(modelId));
                    }

                    let value ;
                    try{
                        if(vnodeRender != "ModelError"){
                            value = patch(vnodeRender, newVNode);
                        }else{
                            throw "ModelError";
                        }
                    }catch (e) {
                        value = "ModelError";
                        let innerData = "";
                        let parseHTML = $.parseHTML(renderHtml.trim());
                        let $1 = $("#" + modelId);
                        if(parseHTML.length > 0){
                            innerData = parseHTML[0].innerHTML;
                            $1.html(innerData);
                        }else{
                            $1.empty();
                        }
                    }
                    window.vnode.set(modelId,  value);
                    window.requestRender.set(modelId, 0);
                    startCallback();

                    // 모델내 데이터 변경시 실행할 콜백 (화면 렌더링이 다 끝난 후에 실행됨.)
                    if (!model.callback && typeof model.callback !== "function") { model.callback = ()=>{} }
                    model.callback();
                    model.callback = ()=>{}
                }));
            }.bind(this, modelId, render); // 해당 함수에 파라메터 전달 bind

            //proxy를 사용한 get set model 생성
            let modelData = new Model( model ,callback);
            callback(startCallback.bind(startCallback.this,modelData)); //setting 후 콜백 호출
            window.modelObj.set(modelId, modelData); //window Object에 저장
            return modelData;
        }
    }

    /**********************************************************************************************
    * @Method 설명 : html parse to snabbdom
    * @작성일   : 2019-07-29
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    static parseHtml(html){
        let parseHTML;
        if(typeof html === "string"){
            parseHTML = $.parseHTML(html.trim());
        }else{
            parseHTML = html;
        }
        return ModelUtil.setParseHTag(parseHTML);
    }

    static setParseHTag(parseHTML, i = 0) {
        let parseHTMLElement = parseHTML[i];

        // <!-- --> 이렇게 생긴 주석 노드는 제외함. (#comment)
        if(parseHTMLElement.nodeName === '#comment') return;

        let children = parseHTMLElement.childNodes;
        let childrenArray = [];
        let length2 = children.length;
        let tagName = parseHTMLElement.tagName.toLowerCase();
        let attributes = parseHTMLElement.attributes;

        let data = {};
        let props = {};
        let attr = {};
        let dataSet = {};
        let on = {};

        try {
            if (length2 > 0) {
                let j = 0;
                for (; j < length2; j++) {
                    let child = children[j];
                    if (child.nodeName === "#text") {
                        childrenArray.push(child.nodeValue.trim());
                    } else {
                        let parseHtag = this.setParseHTag(children, j);
                        if (!parseHtag) continue;   // #comment 주석인 경우는 건너뜀
                        childrenArray.push(parseHtag);
                    }
                }
            }

            let length1 = attributes.length;
            let j = 0;
            for (; j < length1; j++) {
                let attribute = attributes[j];
                let name = attribute.name;
                let value = attribute.value;
                if (name.indexOf("data-") > -1) {
                    let replace =
                        name.replace("data-", "")   // data- 제거
                            .replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); // 케밥케이스를 카멜케이스로 변경
                    dataSet[replace] = value;
                }else if (name.indexOf("on") === 0 && name.indexOf("error") == -1) {
                    on[name.replace("on", "").toLowerCase()] = value;
                } else if (name === "class") {
                    props["className"] = value;
                } else {
                    props[name] = value;
                    data[name] = value;
                    if(name != "" && name.charAt(0) != "-" && value != null && typeof value != "undefined" && value != ""){
                        attr[name] = value;
                    }
                }
            }
            //className 초기화 하지 않고 갱신햇을때
            //class가 초기화 되지않고 그대로 남아있는 현상이 있어 추가
            if(typeof props["className"] === "undefined"){
                props["className"] = "";
            }
            if(typeof props["checked"] === "undefined"){
                props["checked"] = false;
            }
            data["props"] = props;
            data["attrs"] = attr;
            data["dataset"] = dataSet;
            data["on"] = on;
        }catch (e) {
            console.error("modeUtil exception", e);
        }
        return h(tagName, data, childrenArray );
    }
}
