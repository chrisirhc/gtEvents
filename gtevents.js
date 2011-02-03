/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

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
