/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

var detailEventId;
var gtid = 'hlau'

$(document).ready(function(){
	
	/* http://forum.jquery.com/topic/jquery-mobile-equivalent-of-document-ready */
	/* $(document).ready for each page */
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
	
	/* expandable top 5 attending friend */
	$('.event-list-tab-friend').bind('click',function(event){
		/* do not follow link when click on tab in list */
		event.stopPropagation();
		log(event.isPropagationStopped());
		event.preventDefault();
		
		/* assume static content */
		var $extendedPanel = $(this).parent().parent().parent().parent().parent().next('.event-list-tab-extended');
		$extendedPanel.slideToggle('fast');
	},false)
	
	/* combine fb connect link with gtid */
	$('.fb-connect-btn').attr('href','http://localhost:3000/login/'+gtid);
	
	/* check if the user has connected with fb or not and hide certain functions */
	$.getJSON('http://localhost:3000/' + gtid + '?callback=?', function(data, status){
		if (data.login_status){
			$('.fb-connect-btn').hide();
		}
		else{
			$('#rsvp-container').hide();
			$('#detail-view-friend-list').hide();
			$('#detail-view-wall').hide();
			$('.detail-view-details').listview('refresh');
		}
	});
	
	
	/* Start the grabbing of the data from the server */
	
	$.retrieveJSON("http://localhost:3000/event/list/time/"+gtid+"?callback=?", function (json, status, data) {
	    var i, eObj;
	    json = eval(json); // DANGEROUS!
	    console.log(json);
	    $("#eventlist").html('');
	    for (i = 0; i < json.length && (eObj = json[i]); i++) {
	    	location_ = (eObj["location"] == '')?'':('at ' + eObj["location"]);
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
			  	+ '<div class="event-list-location">' + location_ + '</div>'
			  	+ '</div>'
	    		+ '</div>'
	    		+ '<div class="clear"></div>'
	      		+ '<div class="event-list-tab">'
	      		+ '<span class="event-list-tab-friend">' + eObj["friend_count"] +' friends</span>'
	                + '<span class="event-list-tab-attendees">' + eObj["total_count"] + ' attendees</span>'
	      		+ '</div>'
	            + '</a></li>');
    	}
    	$("#eventlist").listview("refresh");
    
	    /* manually handle link forwarding */
	    $('#eventlist > li').bind('click', function(event){
			detailEventId = ($(this).attr('id'));
			
			event.stopPropagation();
			event.preventDefault();
			
			$.mobile.changePage('#detail', 'slide', false, true);
		});
		
  	});
  
  	/* detail view page ready function */
	GTEVENTS.Pages.detail = function(){
		var eventObj;
		log(detailEventId);
		
		$.retrieveJSON("http://localhost:3000/event/detail/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			json = eval(json); // DANGEROUS!
			$('.detail-view-thumbnail').css('background-image', 'url(' + json.pic_big + ')');
			$('.detail-view-title').html(json.name);
			$('.detail-view-location').html('at ' + json.location);
			$('.detail-view-organizer').html('by ' + json.host);
			$('#detail-view-start-li span').html( parseTime(json.start_time)[0] + " " + parseTime(json.start_time)[1]);
			$('#detail-view-end-li span').html( parseTime(json.end_time)[0] + " " + parseTime(json.end_time)[1]);
			$('#detail-view-desc-p').html( json.description.slice(0,100) );
		});
		
	}
	
	/* attendees view ready function */
	GTEVENTS.Pages.attendees = function(){
		$.mobile.pageLoading();
		$("#attendees-view-list").html('');
		$.retrieveJSON("http://localhost:3000/event/attendance/event:fb:" + detailEventId + "?callback=?" , function(json,status,data){
			json = eval(json); // DANGEROUS!
			for (i=0; i<json.length; i++){
				$("#attendees-view-list").append(
					'<li><div class="attendees-view-thumbnail" style="background-image: url('
					+ 'https://graph.facebook.com/' + json[i].uid + '/picture'
					+ ');">'
					+ '</div><h3 class="attendees-view-name">'
					+ json[i].name
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
		$.retrieveJSON("http://localhost:3000/event/feed/" + detailEventId + "?callback=?" , function(json,status,data){
		json = eval(json);
		if (json.length > 0){
				for (i=0; i<json.length; i++){
					$("#wall-view-list").append(
						'<li><div class="wall-view-thumbnail" style="background-image: url('
						+ 'https://graph.facebook.com/' + json[i].id + '/picture'
						+')"></div><div class="wall-view-content-container"><p class="wall-view-name">'
						+ json[i].name
						+ '</p><p class="wall-view-content">'
						+ json[i].message
						+ '</p><p class="wall-view-post-time">'
						+ parseTime(json[i].update_time)[0]
						+ ' ' + parseTime(json[i].update_time)[1]
						+ '</p></div></li>'
					);
				}
			}
			else{
				$("#wall-view-list").html('<li>No wall post for this event<li>');
			}
			$("#wall-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
	}
	
	GTEVENTS.Pages.description = function(){
		$('#description-view-content').html('');
		$.retrieveJSON("http://localhost:3000/event/detail/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			json = eval(json);
			$('#description-view-content').html(json.description.replace(/\n/g,'<br />'));
		});
	}
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