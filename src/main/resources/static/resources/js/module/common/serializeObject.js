"use strict";
/**********************************************************************************************
 * @FileName  : serializeObject.js
 * @Date      : 2018-06-06
 * @작성자      : 홍광표
 * @설명       : serialize Array Object create
 * multivalue attrbite info -> array
 * let param = SerializeObject.run("reoForm");
 * 리스트 데이터 감싸고 있는 dom html에
 * multivalue="XXXX" attr 선언
 * 해당 리스트는 array로 감싸짐
 **********************************************************************************************/
export class SerializeObject {

    constructor(id, nullStatus = false){
        this.rinput = /^(?:input)/i;
        this.tinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i;
        this.rselect = /^(?:select)/i;
        this.rtextarea = /^(?:textarea)/i;
        this.o = {};
        this.s = null;
        this.sIndex = 0;
        this.nullStatus = nullStatus;
        if(id){
            let children = document.getElementById(id).children;
            this.setObjectLoop(children)
        }
        return this.o;
    }

    static run(id, nullStatus = false){
        this.nullStatus = nullStatus;
        return new SerializeObject(id);
    }

    /**********************************************************************************************
     * @Method 설명 : Object loop
     * @작성일   : 2018-06-06
     * @작성자   : 홍광표
     * @변경이력  :
     **********************************************************************************************/
    setObjectLoop(children){
        if(children != null){
            for(var a = 0 ; a < children.length ; a++){
                var target = children[a];
                let value = target.value;

                if( (value || !this.nullStatus) && (this.rinput.test( target.nodeName ) || this.rselect.test( target.nodeName ) || this.rtextarea.test( target.nodeName ) )){
                    if(target.name && !target.disabled && ( target.checked || this.tinput.test( target.type ) || this.rselect.test( target.nodeName ) || this.rtextarea.test( target.nodeName ))) {
                        if (this.o[target.name]) {
                            if (!this.o[target.name].push) {
                                this.o[target.name] = [this.o[target.name]];
                            }

                            if(this.rselect.test( target.nodeName )) {
                                for(let c in target.children){
                                    let child = target.children[c];
                                    if(child.selected){
                                        this.o[target.name].push(value || '');
                                        break;
                                    }
                                }
                            }else{
                                this.o[target.name].push(value || '');
                            }
                        } else {
                            if(this.rselect.test( target.nodeName )) {
                                for(let c in target.children){
                                    let child = target.children[c];
                                    if(child.selected){
                                        this.o[target.name] = value || '';
                                        break;
                                    }
                                }
                            }else{
                                this.o[target.name] = value || '';
                            }
                        }
                    }
                }else if( (value || !this.nullStatus) && (this.rselect.test( target.nodeName ))){
                    if (this.o[target.name]) {
                        if (!this.o[target.name].push) {
                            this.o[target.name] = [this.o[target.name]];
                        }
                        for(let c in target.children){
                            let child = target.children[c];
                            if(child.selected){
                                this.o[target.name].push(child.value || '');
                                break;
                            }
                        }
                    } else {
                        for(let c in target.children){
                            let child = target.children[c];
                            if(child.selected){
                                this.o[target.name] = child.value || '';
                                break;
                            }
                        }
                        this.o[target.name] = value || '';
                    }
                }else if( (value || !this.nullStatus) && (this.rtextarea.test( target.nodeName ))){
                    if (this.o[target.name]) {
                        if (!this.o[target.name].push) {
                            this.o[target.name] = [this.o[target.name]];
                        }
                        this.o[target.name].push(target.innerHTML || '');
                    } else {
                        this.o[target.name] = target.innerHTML || '';
                    }
                }else if(target.getAttribute("multivalue")){
                    this.s = [{}];   //초기화
                    this.sIndex = 0;
                    this.setArrayLoop(target.children, target.getAttribute("multivalue"));
                }else{
                    this.setObjectLoop(target.children);
                }
            }
        }
    }

    /**********************************************************************************************
     * @Method 설명 : Array loop
     * @작성일   : 2018-06-06
     * @작성자   : 홍광표
     * @변경이력  :
     **********************************************************************************************/
    setArrayLoop(children, name){
        let itemInitStatus = false;
        if(typeof name === 'undefined' || name === ''){
            return;
        }
        for(let a = 0 ; a < children.length ; a++){
            let target = children[a];
            if(this.rinput.test( target.nodeName ) || this.rselect.test( target.nodeName ) || this.rtextarea.test( target.nodeName ) ){
                if(target.name && !target.disabled && ( target.checked || this.tinput.test( target.type ) || this.rselect.test( target.nodeName ) || this.rtextarea.test( target.nodeName ))) {
                    if (target.name == '') {
                        continue;
                    }
                    let oo = this.s[this.sIndex];
                    if (typeof oo[target.name] != "undefined") {
                        this.sIndex++;
                        this.s.push({});
                    }
                    oo = this.s[this.sIndex];
                    if(this.rselect.test( target.nodeName )) {
                        for(let c in target.children){
                            let child = target.children[c];
                            if(child.selected){
                                oo[target.name] = target.value;
                                itemInitStatus = true;
                                break;
                            }
                        }
                    }else{
                        oo[target.name] = target.value;
                    }

                    itemInitStatus = true;
                }
            }else{
                this.setArrayLoop(target.children,name);
            }
        }

        if(itemInitStatus){
            this.o[name] = this.s;
        }else{
            return;
        }
    }


}