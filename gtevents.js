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
	
	/* Start the grabbing of the data from the server */
	/* Not sure if this cross-domain request works on the phones */

	$.getJSON("http://chrisirhc.no.de/?callback=?", function (data, status) {
    var i, eObj;
    for (i = 0; i < data.length && (eObj = data[i]); i++) {
        $("#eventlist").append(
           	'<li><a href="#bar">'
           	+ '<div class="event-list-time"><span class="event-list-time-span">'
           	+ eObj["start_time"]
           	+ '</span> - <span class="event-list-time-span">'
           	+ eObj["end_time"]
           	+ '</span></div>'
           	+ '<div class="event-list-title-container">'
	  		+ '<div class="event-list-thumbnail"></div>'
	  		+ '<div class="event-list-title-details-container">'
	  		+ '<div class="event-list-title">' + eObj["name"] + '</div>'
		  	+ '<div class="event-list-organizer">by ' + eObj["organizer"] + '</div>'
		  	+ '<div class="event-list-location">at ' + eObj["location"] + '</div>'
		  	+ '</div>'
    		+ '</div>'
    		+ '<div class="clear"></div>'
      		+ '<div class="event-list-tab">'
      		+ '<span class="event-list-tab-friend">35 friends</span>'
                + '<span class="event-list-tab-attendees">146 attendees</span>'
      		+ '</div>'
            + '</a></li>');
    }
    $("#eventlist").listview("refresh");
  });
});
