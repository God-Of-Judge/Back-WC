"use strict";


$(()=>{
	new Sample();
	console.log("test");
	console.log("test");
})

export class Sample{
	constructor() {
		this.eventBind();

	}

	eventBind(){
		$('.base_info').on('click', (e)=>{
			console.log('aaa');
			location.href='/join';
		})

		$('#data > span').on('click', (e)=>{
			console.log('eeee')
			console.log('eeeeddd')
			console.log(e);
		})

		$('#test').on('click', (e)=>{
			let art = require("sample.html")
			console.log(art);

			axios.post('/test4').then((result)=>{
				$('#test1').append(art(result));
				console.log(result);
			})
		})
	}

}