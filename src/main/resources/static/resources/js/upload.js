$('.btn_slct_area').on('click', (e)=> {

    let locTmpl2 = require('upload2.html');
    let callObj = {'key': $('#locWantKey').val()};

    axios.post('/loc', callObj).then((result) => {

        // console.log(locTmpl2(result));
        $('#locTest').append(locTmpl2(result));
        $('#locTest').removeClass('hidden');

        $('.choiceLoc > ul > li > a').on('click', (e)=>{
            if($(e.currentTarget).hasClass('chk_active')){
                $(e.currentTarget).removeClass('chk_active');
            }else{
                $(e.currentTarget).addClass('chk_active');
            }
        })

        $('.btn_complete').on('click', (e)=>{
            let selectedKeyArray2 = new Array();
            $('.choiceLoc > ul > li').each((idx, obj)=>{
                if($(obj).children('a').hasClass('chk_active')){
                    let wantKey = $(obj).children('a').data('key');
                    // console.log(wantKey);
                    selectedKeyArray2.push(wantKey);
                }
            })
            // console.log(selectedKeyArray2);
            // console.log(_.join(selectedKeyArray2, ','));
            $('#locWantKey').val(_.join(selectedKeyArray2, ',')); // lodash
            $('#locTest').empty().addClass('hidden');
        })

        $('.btn_cls').on('click', (e)=>{
            $('#locTest').empty().addClass('hidden');
        });

    })


})