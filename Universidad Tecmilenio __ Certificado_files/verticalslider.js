/*
 Plugin Name: jQuery Vertical Slider
 Author: Burak Aydin
*/

(function($){


$.fn.verticalSlider=function(options){


	var slider=this,
	inner=$('.vertical-inner'),
	height=0,
	length=inner.find('.slide').length,
	innerTop=0,
	totalHeight=0,
	winWidth=$(window).width();


	var defaults={

		index:1,		
		itemDistance:15, // each item distance between them as padding.
		animateTime:300,
		animateType:'linear',
		slideTop:'.vertical-top',
		slideBottom:'.vertical-bottom',

	};


		options=$.extend(defaults,options);



		inner.find('.slide').css({

			paddingTop:options.itemDistance,
			paddingBottom:options.itemDistance

		});



		inner.find('.slide').each(function(){

			totalHeight+=$(this).outerHeight();

		});		




		function add_class(opt){

			inner.find('.slide').removeClass('active-vertical');

			inner.find('.slide').eq(opt).addClass('active-vertical');

		}

		add_class(options.index);



		function activeHeight(opt){

			height=inner.find('.slide').eq(opt).outerHeight();

			slider.height(height);

		}

		activeHeight(options.index);




		function innerPosition(opt){

			innerTop=0;

			$('.slide').eq(opt).prevAll('.slide').each(function(){			

				innerTop=$(this).outerHeight()+innerTop;
				
				inner.css('marginTop',-innerTop+'px');				

			});

		}

		innerPosition(options.index);



		function setSlide(opt){

			var innerTop=0;

			inner.find('.slide').eq(opt).prevAll('.slide').each(function(){					

				innerTop=$(this).outerHeight()+innerTop;

			});				

			inner.animate({

				marginTop:-innerTop

			},options.animateTime,options.animateType);

		}		

		


		$(window).resize(function(){			

			activeHeight(options.index);
		
			innerPosition(options.index);	

		});
		


		$(options.slideBottom).click(function(){

			if(options.index<length-1){

				options.index++;

				setSlide(options.index);

				activeHeight(options.index);

				add_class(options.index);								

			}

		});



		$(options.slideTop).click(function(){

			if(options.index>0){

				options.index--;				

				setSlide(options.index);

				activeHeight(options.index);

				add_class(options.index);

			}

		});
	
}



})(jQuery);