/*
Plugin: jQuery Parallax
Version 1.1.3
Author: Ian Lunn
Twitter: @IanLunn
Author URL: http://www.ianlunn.co.uk/
Plugin URL: http://www.ianlunn.co.uk/plugins/jquery-parallax/

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

(function( $ ){
	var $window = $(window);
	var windowHeight = $window.height();

	$window.resize(function () {
		windowHeight = $window.height();
	});

	$.fn.parallax = function(xpos, speedFactor, applyHeight) {
		var $this = $(this);
		var getHeight;
		var firstTop;
		var paddingTop = 0;
		
		
		function update (){
			
			$this.each(function(){
								
				firstTop = $this.offset().top;

			});				
			
				var pos = $window.scrollTop();				
	
				$this.each(function(){					
					
					if(applyHeight==true){

						$this.css('backgroundPosition', xpos + " " + Math.round((firstTop - pos) * speedFactor) + "px");

					}else{
						
						var secondTop=windowHeight+pos;

						var secondVal=firstTop-secondTop;

						if(secondTop>firstTop){

							$this.css('backgroundPosition', xpos + " " + Math.round((secondVal) * speedFactor) + "px");

						}

					}
					
				});
			
		}		

		
		if (arguments.length < 1 || xpos === null) xpos = "50%";		
		if (arguments.length < 2 || speedFactor === null) speedFactor = 0.5;		
		if (arguments.length < 3 || applyHeight === null) applyHeight = true;

		$window.bind('scroll', update).resize(update);
		update();
	};
})(jQuery);