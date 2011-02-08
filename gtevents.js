/* global variable */
var detailEventId;

/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

$(document).ready(function(){
	
	/* http://forum.jquery.com/topic/jquery-mobile-equivalent-of-document-ready */
	/* $(document).ready for each jquery mobile */
	if (typeof GTEVENTS == 'undefined') GTEVENTS = {};
	if (typeof GTEVENTS.Pages == 'undefined') GTEVENTS.Pages = {};
	jQuery("div[data-role*='page']").live('pageshow', function(event, ui) {
        var thisId=$(this).attr("id")
        thisId = thisId.replace(/\.html$/gi,"");
        if (typeof GTEVENTS.Pages[thisId] == 'function')  {
                GTEVENTS.Pages[thisId].call(this);
        }
	});
	
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

	$.getJSON("http://chrisirhc.no.de/?callback=?", function (data, status) {
    var i, eObj;
    for (i = 0; i < data.length && (eObj = data[i]); i++) {
        $("#eventlist").append(
           	'<li id="'+ eObj["id"] +'"><a href="#detail">'
           	+ '<div class="event-list-time">'
           	+ parseTime(eObj["start_time"])[0]
           	+'<span class="event-list-time-span">'
           	+ parseTime(eObj["start_time"])[1]
           	+ '</span> - '
           	+ parseTime(eObj["end_time"])[0]
           	+ '<span class="event-list-time-span">'
           	+ parseTime(eObj["end_time"])[1]
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
    
    /* store event id into global */
    $('#eventlist > li').bind('click', function(event){
		detailEventId = ($(this).attr('id'));
		
		/* manually handle link forwarding */
		event.stopPropagation();
		event.preventDefault();
		
		$.mobile.changePage('#detail', 'slide', false, true);
	});
	
	GTEVENTS.Pages.detail = function(){
		$.getJSON("http://chrisirhc.no.de/" + detailEventId + "?callback=?" , function(data,status){
			log(data);
			$('.detail-view-title').html(data.name);
			$('.detail-view-location').html('at ' + data.location);
			$('#detail-view-start-li span').html( parseTime(data.start_time)[0] + " " + parseTime(data.start_time)[1]);
			$('#detail-view-end-li span').html( parseTime(data.end_time)[0] + " " + parseTime(data.end_time)[1]);
		});
		
		/* !global unbind for all div. consider another way */
		$('div').unbind('pageshow');
	}
	
	GTEVENTS.Pages.friend = function(){
		
	}
    
  });
});

/* take in UNIX time in string format and output [0] as date and [1] as time */
function parseTime(time){
	var monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
	var t = new Date(parseInt(time));
	
	/* beware index start at 0 */
	var month = monthString[t.getMonth()];
	var day = t.getDate();
	
	var hour = t.getHours();
	var ampm = (hour<12)?"am":"pm";
	if (hour==0) hour=12;
	else if (hour>12) hour-=12;
	
	var minute = t.getMinutes();
	if (minute == 0) minute = "00";
	
	var output = new Array;
	output[0] = month + " " + day + " "
	output[1] = hour + ":" + minute + " " + ampm;
	
	return output;
}