/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

/* does not work */
/* webkit css animation as substitute */
$.fn.animate2 = function(css, speed, fn) {
if(speed === 0) { // differentiate 0 from null
	  this.css(css)
	  window.setTimeout(fn, 0)
	} else {
	  if($.browser.safari) {
	    var s = []
	    for(var i in css) 
	        s.push(i)
	  
	    this.css({ webkitTransitionProperty: s.join(", "),
	              webkitTransitionDuration: speed+ "ms" });
	    window.setTimeout(function(x,y) {
	      x.css(y)
	    },0, this, css) // have to wait for the above CSS to get applied
	    window.setTimeout(fn, speed)
	  } else {
	    this.animate(css, speed, fn)
	  }
	}
}

$.fn.slideToggle_webkit = function(speed){
	if (speed=='fast') speed=500;
	this.each(function() {
		var hidden = jQuery(this).is(":hidden");
		if (hidden){
			var h = $(this).css('height');
			$(this).css('height', 0);
			$(this).css('display', 'block');
			log($(this).css('height'));
			$(this).animate2({height: h},speed);
		}
	});
}
/* webkit css animation as substitute */

$(document).ready(function(){
	
	
	$('.event-list-tab-friend').bind('click',function(event){
		/* do not follow link when click on tab in list */
		event.stopPropagation();
		log(event.isPropagationStopped());
		event.preventDefault();
		
		/* assume static content */
		var $extendedPanel = $(this).parent().parent().parent().parent().parent().next('.event-list-tab-extended');
		$extendedPanel.slideToggle('fast');
	},false)
	
	
});