/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

var detailEventId;
var gtid = 'hlau8';
var SERVER_ADDRESS = 'localhost:3000'

$(document).ready(function(){
	
	/* http://forum.jquery.com/topic/jquery-mobile-equivalent-of-document-ready */
	/* jquery mobile page ready function */
	/* init GTEVENTS.Pages object */
	if (typeof GTEVENTS == 'undefined') GTEVENTS = {};
	if (typeof GTEVENTS.Pages == 'undefined') GTEVENTS.Pages = {};
	
	/* combine fb connect link with gtid */
	$('.fb-connect-btn').attr('href','http://'+ SERVER_ADDRESS +'/login/'+gtid);
	/* check if the user has connected with fb or not and hide certain functions */
	/* status store offline so that there is no delay in hiding the facebook img */
	$.retrieveJSON('http://'+ SERVER_ADDRESS +'/status/' + gtid + '?callback=?', function(json, status, data){
		jQuery.parseJSON(json);
		log(json.login_status);
		if (json.login_status == 'true'){
			/* logged in */
			$('.fb-connect-btn').hide();
			$('#rsvp-container').show();
			$('#detail-view-friend-list').show();
			$('#detail-view-wall').show();
			$('.detail-view-details').listview('refresh');
		}
		else{
			$('#rsvp-container').hide();
			$('#detail-view-friend-list').hide();
			$('#detail-view-wall').hide();
			$('.detail-view-details').listview('refresh');
		}
	});
	
	/* #main page ready function */
	GTEVENTS.Pages.main = function(){
	
		/* expandable top 5 attending friend */
		$('.event-list-tab-friend').bind('click',function(event){
			/* do not follow link when click on tab in list */
			event.stopPropagation();
			event.preventDefault();
			
			/* assume static content */
			var $extendedPanel = $(this).parent().parent().parent().parent().parent().next('.event-list-tab-extended');
			$extendedPanel.slideToggle('fast');
		},false)
		
		getAllEvent();
		
		/* Start the grabbing of the data from the server */
	  	
	  	$('#event-list-tab-all-link').bind('click',function(event){
	  		event.stopPropagation();
	  		event.preventDefault();
	  		getAllEvent();
	  	});
	  	
	  	$('#event-list-tab-all-invited').bind('click',function(event){
	  		event.stopPropagation();
	  		event.preventDefault();
	  		getAllEvent();
	  	});
		
		function getInvitedEvent(){
			$.mobile.pageLoading();
			$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/list/invited/"+gtid+"?callback=?", function (json, status, data) {
			    var i, eObj;
			    jQuery.parseJSON(json);
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
		    	$.mobile.pageLoading(true);
		    	bindLink();		
		  	});
		}
		
		function getAllEvent(){
			$.mobile.pageLoading();
			$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/list/time/"+gtid+"?callback=?", function (json, status, data) {
			    var i, eObj;
			    jQuery.parseJSON(json);
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
		    	$.mobile.pageLoading(true);
		    	bindLink();		
		  	});
		}
			
		function bindLink(){
			/* manually handle link forwarding */
		    $('#eventlist > li').bind('click', function(event){
				detailEventId = ($(this).attr('id'));
				setLocalStorage("detailEventId", detailEventId);
				
				event.stopPropagation();
				event.preventDefault();
				
				$.mobile.changePage('#detail', 'slide', false, true);
			});
		}
		
	}
	
	
	
	/* #detail view page ready function */
	GTEVENTS.Pages.detail = function(){
		var eventObj;
		detailEventId = getLocalStorage("detailEventId");
		console.log(detailEventId);
		
		var rsvpStatusWord = [];
		rsvpStatusWord['not_replied'] = 0;
		rsvpStatusWord['attending'] = 1;
		rsvpStatusWord['maybe'] = 2;
		rsvpStatusWord['declined'] = 3;
		
		$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/detail/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			jQuery.parseJSON(json);
			log(json);
			$('.detail-view-thumbnail').css('background-image', 'url(' + json.pic_big + ')');
			$('.detail-view-title').html(json.name);
			$('.detail-view-location').html('at ' + json.location);
			$('.detail-view-organizer').html('by ' + json.host);
			$('#detail-view-start-li span').html( parseTime(json.start_time)[0] + " " + parseTime(json.start_time)[1]);
			$('#detail-view-end-li span').html( parseTime(json.end_time)[0] + " " + parseTime(json.end_time)[1]);
			$('#detail-view-desc-p').html( json.description.slice(0,100) );
			$('#detail-view-friend-count').html(json.friend_count);
			$('#detail-view-attendees-count').html(json.total_count);
			
			
			/* RSVP get status*/
			$('#rsvp-status option')[ rsvpStatusWord[json.rsvp_status] ]['selected'] = true;
			$('#rsvp-status').selectmenu('refresh',true);
			
			/* RSVP set status*/
			$('#rsvp-status').change(function(){
				$.mobile.pageLoading();
				log ( $('#rsvp-status option:selected').attr('value') );
				var rsvpStatus = $('#rsvp-status option:selected').attr('value')
				$.getJSON("http://"+ SERVER_ADDRESS +"/event/rsvp/"+ rsvpStatus +"/event:fb:"+ detailEventId +"/"+ gtid, function(data){ log(data); $.mobile.pageLoading(true); });
			});
			
		});	
		
	}
	
	/* #attendees view ready function */
	GTEVENTS.Pages.attendees = function(){
		$.mobile.pageLoading();
		detailEventId = getLocalStorage("detailEventId");
		
		$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/attendance/total/event:fb:" + detailEventId + "?callback=?" , function(json,status,data){
			$("#attendees-view-list").html('');
			jQuery.parseJSON(json);
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
	
	/* #wall view ready function */
	GTEVENTS.Pages.wall = function(){
		$.mobile.pageLoading();
		detailEventId = getLocalStorage("detailEventId");
		$.retrieveJSON("http://"+ SERVER_ADDRESS +":3000/event/feed/event:fb:" + detailEventId + "?callback=?" , function(json,status,data){
			$("#wall-view-list").html('');
			jQuery.parseJSON(json);
			log(json);
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
	
	/* #description view ready function */
	GTEVENTS.Pages.description = function(){
		$('#description-view-content').html('');
		detailEventId = getLocalStorage("detailEventId");
		$.retrieveJSON("http://"+ SERVER_ADDRESS +":3000/event/detail/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			jQuery.parseJSON(json);
			$('#description-view-content').html(json.description.replace(/\n/g,'<br />'));
		});
	}
	
	GTEVENTS.Pages.friends = function(){
		$('#description-view-content').html('');
		detailEventId = getLocalStorage("detailEventId");
		$.retrieveJSON("http://"+ SERVER_ADDRESS +":3000/event/attendance/friend/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			$("#friends-view-list").html('');
			jQuery.parseJSON(json);
			if (json.length > 0){
				for (i=0; i<json.length; i++){
					$("#friends-view-list").append(
						'<li><div class="friends-view-thumbnail" style="background-image: url('
						+ 'https://graph.facebook.com/' + json[i].uid + '/picture'
						+ ');">'
						+ '</div><h3 class="friends-view-name">'
						+ json[i].name
						+ '</h3></div>'
					);
				}
			} else {
				$("#friends-view-list").html('<li>No wall post for this event<li>');
			}
			$("#friends-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
	}
	
	
	/* call function when either the page is transition to or when this is the page */
	jQuery("div[data-role*='page']").live('pageshow', function(event, ui) {
        var thisId=$(this).attr("id")
        thisId = thisId.replace(/\.html$/gi,"");
        if (typeof GTEVENTS.Pages[thisId] == 'function')  {
                GTEVENTS.Pages[thisId].call(this);
        }
	});
	thisPageHash = window.location.hash.slice(1);
	if (typeof GTEVENTS.Pages[thisPageHash] == 'function')  {
    	GTEVENTS.Pages[thisPageHash].call(this);
    }
    if (thisPageHash == ""){ // for main page
    	GTEVENTS.Pages.main.call();
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

/* simple wrapper for local storage: set function */
function setLocalStorage(key,value){
	if (typeof(localStorage) != 'undefined' ){
		try {
			localStorage.setItem(key,value); //saves to the database, ÒkeyÓ, ÒvalueÓ
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				console.log('LocalStorage: Quota Exceeded');
			}
		}
	}
}

/* simple wrapper for local storage: get function */
function getLocalStorage(key){
	var value;
	if (typeof(localStorage) != 'undefined' ){
		try {
			value = localStorage.getItem(key); //saves to the database, ÒkeyÓ, ÒvalueÓ
		} catch (e) {
			if (e == QUOTA_EXCEEDED_ERR) {
				console.log('LocalStorage: Quota Exceeded');
			}
		}
	}
	return value;
}
