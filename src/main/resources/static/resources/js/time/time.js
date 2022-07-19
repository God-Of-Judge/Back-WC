"use strict";


$(()=>{
    new Join();
})

export class Join
{
    constructor() {
        console.log('join')
        this.eventBindgin();
    }

    eventBindgin(){
        let isAll = true;

        $('.btn_slct_area').on('click', (e)=> {

            let locTmpl = require('time.html');
            let callObj = {'key' : $('#wantLoc').val()};

            axios.post('/test4', callObj).then((result) => {
                // console.log(result);

                // console.log(locTmpl(result));
                $('.want_loc').append(locTmpl(result));
                $('.want_loc').removeClass('hidden');
                // console.log('test2');
                $('#total').on('click', (e)=> {


                    $('.hope_list > li').each((idx, obj)=>{
                        let $obj = $(obj).children('a');
                        if(isAll){
                            $obj.removeClass('active');


                        } else {
                            // $obj.before("<strike>");
                            // $obj.after("</strike>");
                            $obj.addClass('active');
                        }
                    })
                    if (isAll){
                        isAll = false;
                    } else {
                        isAll = true;
                    }
                })

                $('.btn_complete').on('click', (e)=>{
                    let selectedKeyArray = new Array();
                    $('.hope_list > li').each((idx, obj)=>{
                        if($(obj).children('a').hasClass('active')){
                            let wantKey = $(obj).children('a').data('key');
                            // console.log(wantKey);
                            selectedKeyArray.push(wantKey);
                        }
                    })
                    // console.log(selectedKeyArray);
                    console.log(_.join(selectedKeyArray, ','));
                    $('#wantLoc').val(_.join(selectedKeyArray, ',')); // lodash
                    $('.want_loc').empty().addClass('hidden');
                })
                $('.pop_cls').on('click', (e)=>{
                    $('.want_loc').empty().addClass('hidden');
                });

                $('.btn_reset').on('click', (e)=>{
                    $('.hope_list > li').each((idx, obj)=>{
                        let $obj = $(obj).children('a');
                        if($obj.hasClass('active')){
                            $obj.removeClass('active');
                        }
                    })
                })

                $('.hope_list > li > a').on('click', (e)=>{
                    if($(e.currentTarget).hasClass('active')){
                        $(e.currentTarget).removeClass('active');
                    }else{
                        $(e.currentTarget).addClass('active');
                    }
                })
            })
        })


    }
}