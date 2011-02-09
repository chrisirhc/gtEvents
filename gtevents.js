/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

var offlineStore;
var detailEventId;
$(document).ready(function(){
	
	/* http://forum.jquery.com/topic/jquery-mobile-equivalent-of-document-ready */
	/* $(document).ready for each jquery mobile */
	/* TODO: Fire ready functions when the page is refreshed */
	if (typeof GTEVENTS == 'undefined') GTEVENTS = {};
	if (typeof GTEVENTS.Pages == 'undefined') GTEVENTS.Pages = {};
	jQuery("div[data-role*='page']").live('pageshow', function(event, ui) {
        var thisId=$(this).attr("id")
        thisId = thisId.replace(/\.html$/gi,"");
        if (typeof GTEVENTS.Pages[thisId] == 'function')  {
                GTEVENTS.Pages[thisId].call(this);
        }
	});
	
	/* offline storage init */
	offlineStore = new Lawnchair('gtevents');
	
	try {
		offlineStore.get('detailEventId', function(r){
			detailEventId = r.id;
		});
	} catch(err) {}
	
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

	$.getJSON("http://gtevents.localhost:3000/list?callback=?", function (data, status) {
    var i, eObj;
    for (i = 0; i < data.length && (eObj = data[i]); i++) {
    	log(eObj);
    	offlineStore.save({key:eObj["eid"], obj: eObj});
        $("#eventlist").append(
           	'<li id="'+ eObj["eid"] +'"><a href="#detail">'
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
	  		+ '<div class="event-list-thumbnail" style="background-image: url('
	  		+ eObj['pic']
	  		+')"></div>'
	  		+ '<div class="event-list-title-details-container">'
	  		+ '<div class="event-list-title">' + eObj["name"] + '</div>'
		  	+ '<div class="event-list-organizer">by ' + eObj["host"] + '</div>'
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
    
    /* store event id into database and change from list to detail view */
    $('#eventlist > li').bind('click', function(event){
		var detailEventId = ($(this).attr('id'));
		offlineStore.save({key:'detailEventId', id: detailEventId});
		
		/* manually handle link forwarding */
		event.stopPropagation();
		event.preventDefault();
		
		$.mobile.changePage('#detail', 'slide', false, true);
	});
	
	
	/* detail view page ready function */
	GTEVENTS.Pages.detail = function(){
		var eventObj;
		offlineStore.get('detailEventId', function(r){
			detailEventId = r.id;
		});
		log(detailEventId);
		
		/* not used for now */
		offlineStore.get(detailEventId, function(r){
			eventObj = r.obj;
		});
		log(eventObj);
		$.getJSON("http://chrisirhc.no.de/" + detailEventId + "?callback=?" , function(data,status){
			log(data);
			$('.detail-view-title').html(data.name);
			$('.detail-view-location').html('at ' + data.location);
			$('#detail-view-start-li span').html( parseTime(data.start_time)[0] + " " + parseTime(data.start_time)[1]);
			$('#detail-view-end-li span').html( parseTime(data.end_time)[0] + " " + parseTime(data.end_time)[1]);
		});
		
	}
	
	/* attendees view ready function */
	GTEVENTS.Pages.attendees = function(){
		$.mobile.pageLoading();
		$("#attendees-view-list").html('');
		$.getJSON("http://localhost:3000/rsvp_attend/" + detailEventId + "?callback=?" , function(data,status){
			for (i=0; i<data.length; i++){
				$("#attendees-view-list").append(
					'<li><div class="attendees-view-thumbnail" style="background-image: url('
					+ 'https://graph.facebook.com/' + data[i].id + '/picture'
					+ ');">'
					+ '</div><h3 class="attendees-view-name">'
					+ data[i].name
					+ '</h3></div>'
				);
			}
			$("#attendees-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
	}
	
	GTEVENTS.Pages.wall = function(){
		$.mobile.pageLoading();
		$("#wall-view-list").html('');
		$.getJSON("http://localhost:3000/eventwall/" + detailEventId + "?callback=?" , function(data,status){
			for (i=0; i<data.length; i++){
				$("#wall-view-list").append(
					'<li><div class="wall-view-thumbnail" style="background-image: url('
					+ 'https://graph.facebook.com/' + data[i].id + '/picture'
					+')"></div><div class="wall-view-content-container"><p class="wall-view-name">'
					+ data[i].name
					+ '</p><p class="wall-view-content">'
					+ data[i].message
					+ '</p><p class="wall-view-post-time">'
					+ parseTime(data[i].update_time)[0]
					+ ' ' + parseTime(data[i].update_time)[1]
					+ '</p></div></li>'
				);
			}
			$("#wall-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
	}
	
	GTEVENTS.Pages.description = function(){
		$.mobile.pageLoading();
		offlineStore.get(detailEventId, function(r){
			var eventObj = r.obj;
			log(eventObj.description);
			$('#description-view-content').html(eventObj.description.replace(/\n/g,'<br />'));
		});
		
		
		$.getJSON("http://localhost:3000/eventwall/" + detailEventId + "?callback=?" , function(data,status){
			
			for (i=0; i<data.length; i++){
				$("#wall-view-list").append(
					'<li><div class="wall-view-thumbnail" style="background-image: url('
					+ 'https://graph.facebook.com/' + data[i].id + '/picture'
					+')"></div><div class="wall-view-content-container"><p class="wall-view-name">'
					+ data[i].name
					+ '</p><p class="wall-view-content">'
					+ data[i].message
					+ '</p><p class="wall-view-post-time">'
					+ parseTime(data[i].update_time)[0]
					+ ' ' + parseTime(data[i].update_time)[1]
					+ '</p></div></li>'
				);
			}
			$("#wall-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
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
	if (minute < 10) minute = '0' + minute;
	
	var output = new Array;
	output[0] = month + " " + day + " "
	output[1] = hour + ":" + minute + " " + ampm;
	
	return output;
}