(function($) {
	$.fn.horizontal_touch_slider = function(settings) {
		var config = {
    		
		 };
	     
	    if (settings) $.extend(config, settings);
		
		
		
		if (!this) return false;
		
		return this.each(function() {
			var $t = $(this);
			
			this.addEventListener('touchstart', onTouchStart, false);
			this.addEventListener("touchmove", onTouchMove, false);
			this.addEventListener("touchend", onTouchEnd, false);
			
			var originalCoord = { x: 0, y: 0 };
			var finalCoord = { x: 0, y: 0 };
			var changeX_ = 0;
			var timeStamp = 0;
			
			var maxWidth = $t.innerWidth();
			console.log(maxWidth);
			
			function onTouchStart (e) {
			
				timeStamp = Number(new Date());
				originalCoord.x = event.targetTouches[0].pageX;
				originalCoord.y = event.targetTouches[0].pageY;
				log('start:'+e.touches[0].pageX+' '+e.touches[0].pageY);
			
			}
			
			function onTouchMove (e) {
				e.preventDefault();
				
				finalCoord.x = event.targetTouches[0].pageX;
				finalCoord.y = event.targetTouches[0].pageY;
				
				changeX = originalCoord.x - finalCoord.x;
				
				if ((changeX+changeX_) < 0){
					changeX = (changeX/Math.abs(changeX)) * Math.pow(Math.abs(changeX+changeX_),0.8);
					changeX_=0;
				}
				
				$t.css('-webkit-transition', '-webkit-transform 0s');
				$t.css('-webkit-transform', 'translate3d('+ -(changeX+changeX_) +'px,0px,0px)');
				
			}
			
			function onTouchEnd (e) {
				var curTimeStamp = Number(new Date());
				var timeDifference = curTimeStamp - timeStamp;
				
				if ((changeX + changeX_) < 0){
					/* recoil */
					
					$t.css('-webkit-transition', '-webkit-transform 0.23s');
					$t.css('-webkit-transform', 'translate3d(0px,0px,0px)');
					changeX_ = 0;
				}
				else{
					/* momemtum */
					var momemtum_distance = ( changeX / timeDifference * 100);
					var momemtum_time = timeDifference / 0.3 / 1000;
					console.log(momemtum_distance);
					
					changeX += momemtum_distance;
					
					$t.css('-webkit-transition', '-webkit-transform '+ momemtum_time +'s  cubic-bezier(0,0,0.25,1)');
					$t.css('-webkit-transform', 'translate3d('+ -(changeX+changeX_) +'px,0px,0px)');
					console.log(-(changeX+changeX_));
					
					changeX_ += changeX;
				}
			}
			
		})
	};
})(jQuery);