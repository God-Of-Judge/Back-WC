/**********************************************************************************************
 * @FileName  : model.js
 * @Date      : 2019-07-23
 * @작성자      : 홍광표
 * @설명       : proxy Object 생성 클레스
 **********************************************************************************************/
"use strict";

const ProxyPolyfill = require('proxy')();
export default class Model {
    constructor(o, callback) {
        return ProxyPolyfill(o, {
            get(target, property) {
                return target[property];
            },
            set(target, property, value) {
                const oldValue = target[property];
                target[property] = value;
                if(typeof oldValue === "object"){
                     let objectStatus = Model.getObjectStatus(oldValue, value, callback);
                     if(objectStatus){
                         return objectStatus;
                     }
                }
                // Notify model changes if value is changed.
                if (value !== oldValue && callback) {
                    callback();
                }
                // Return true if successful. In strict mode, returning false will throw a TypeError exception.
                return true;
            }
        });
    }


    /**********************************************************************************************
    * @Method 설명 : Object Array 일 경우 내용 변경 확인 로직
    * @작성일   : 2019-07-30
    * @작성자   : 홍광표
    * @변경이력  :
    **********************************************************************************************/
    static getObjectStatus(oldValue, value, callback) {
        let length = oldValue.length;
        let length2 = value.length;
        if (length !== length2) {
            callback();
            return true;
        }else{
            $.each(oldValue, function(key, value){
                try {
                    let valueElement = value[key];
                    if (valueElement !== value) {
                        callback();
                        return true;
                    }
                } catch (e) { /* 암것도안함. 에러아님 */ }
            });
        }
        for (let i = 0; i < length; i++) {
            try {
                let oldValueElement = oldValue[i];
                let oldValueElement2 = value[i];
                if (oldValueElement !== oldValueElement2) {
                    callback();
                    return true;
                }else if(typeof oldValueElement === "object"){
                    let objectStatus1 = Model.getObjectStatus(oldValueElement, oldValueElement2, callback);
                    if(objectStatus1){
                        return objectStatus1;
                    }
                }
            } catch (e) { /* 암것도안함. 에러아님 */ }
        }

        return false;
    }
}