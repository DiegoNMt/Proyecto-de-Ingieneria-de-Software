/*
Plugin Name: jQuery Team Slider
Author: Burak Aydin
*/

(function($){

$.fn.teamslider=function(){


	'use strict';

	var defaults={

		times:300,

	};


	var customopt=$.extend(defaults,customopt);

	var slideLeft=182.5;

	var allImage=this.find('.img-inner-wrap').length;

	var currentImage=0;

	var teamimgslider=this.find('.team-img-inner');

	var teamtextslider=this.find('.team-text-inner');

	var teamtextinner=teamtextslider.children('.text-inner-wrap');

	var imginnerwrap=this.find('.img-inner-wrap');



	this.find('.img-inner-wrap div').css({

		width:150,
		height:150

	});

	if($(window).width()<992){

		this.find('.img-inner-wrap div').css({

			width:120,
			height:120

		});

	}
	

	$('.team-wrap').find('.arrow-left').click(function(){

		
		currentImage--;

		if(currentImage<-1){
			currentImage=-1;
		}

		setPosition(currentImage);

	});


	$('.team-wrap').find('.arrow-right').click(function(){

		currentImage++;

		if(currentImage>=allImage-1){

			currentImage=allImage-2;

		}

		setPosition(currentImage);

	});


	if($(window).width()<992){

		slideLeft=152.5;

	}
	


	function setPosition(pos){

		var px=slideLeft*pos;

		var indexImg=pos+1;

		imginnerwrap.removeClass('team-shadow');

		imginnerwrap.eq(indexImg).addClass('team-shadow');


		teamimgslider.stop().animate({

			left:-px

		},{duration:customopt.times});


		teamimgslider.children('.img-inner-wrap').find('div').stop().animate({

			width:150,
			height:150


		},{duration:250});

		


		teamimgslider.children('.img-inner-wrap').eq(indexImg).find('div').stop().animate({

			width:350,
			height:440

		},{duration:250,step:function(){

			teamimgslider.freetile();

		}});	



		if($(window).width()<1200){


			teamimgslider.children('.img-inner-wrap').eq(indexImg).find('div').stop().animate({

			width:320,
			height:397

		},{duration:250,step:function(){

			teamimgslider.freetile();

		}});

		}


		if($(window).width()<992){


			teamimgslider.children('.img-inner-wrap').find('div').stop().animate({

			width:120,
			height:120


		},{duration:250});


			teamimgslider.children('.img-inner-wrap').eq(indexImg).find('div').stop().animate({

			width:300,
			height:370

		},{duration:250,step:function(){

			teamimgslider.freetile();

		}});

		}




		if(currentImage<0){

			teamtextinner.eq(0).fadeIn(300).animate({

				marginLeft:0

			},{duration:300,queue:false});



			teamtextinner.eq(1).stop().fadeOut(300).css('display','none');


		}else if(currentImage==allImage-2){

			teamtextinner.eq(allImage-1).fadeIn(500).animate({

				marginLeft:0

			},{duration:300,queue:false});

			teamtextinner.eq(allImage-2).fadeOut(300).css('display','none');

		}else{

			teamtextinner.stop().css({
				marginLeft:60,
				display:'none'
			});

			
			teamtextinner.eq(indexImg).stop().fadeIn(500).animate({

				marginLeft:0

			},{duration:300,queue:false});

		}


	}
	

	$('.img-inner-wrap').eq(1).find('div').css({

		width:350,
		height:440

	});



	if($(window).width()<1200){

		$('.img-inner-wrap').eq(1).find('div').css({

			width:320,
			height:397

		});

	}


	if($(window).width()<992){

		$('.img-inner-wrap').eq(1).find('div').css({

			width:300,
			height:372

		});

	}



	teamtextinner.eq(1).css('display','block');

	imginnerwrap.eq(1).addClass('team-shadow');


}

})(jQuery);