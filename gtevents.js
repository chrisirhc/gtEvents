/* shorthand method for debugging */
function log(x){
	console.log(x);
}
/* shorthand method for debugging */

var detailEventId;
/* var gtid = 'hlau8'; */
var gtid = PORTAL_CLIENT.getUsername();


var SERVER_ADDRESS = 'chrisirhc.no.de';

var firstLandOnMain = true;


$(document).ready(function(){
	
	/* http://forum.jquery.com/topic/jquery-mobile-equivalent-of-document-ready */
	/* jquery mobile page ready function */
	/* init GTEVENTS.Pages object */
	if (typeof GTEVENTS == 'undefined') GTEVENTS = {};
	if (typeof GTEVENTS.Pages == 'undefined') GTEVENTS.Pages = {};
	
	/* combine fb connect link with gtid */
	$('.fb-connect-btn').attr('href','http://'+ SERVER_ADDRESS +'/login/'+gtid);
	
	$('#header-search-button').bind('click',function(event){
  		event.stopPropagation();
  		event.preventDefault();
  		$.mobile.changePage('#search', 'slide', false, true);
	 });
	
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
	  	
	  	/* load all event only if it is first landed on #main */
	  	if (firstLandOnMain == true){
		  	getAllEvent();
		  	switchButtonState(true,'all');
		  	firstLandOnMain = false;
		 }
	  	
	  	$('#event-list-tab-all').bind('click',function(event){
	  		event.stopPropagation();
	  		event.preventDefault();
	  		getAllEvent();
	  		switchButtonState(true,'all');
	  		switchButtonState(false,'invited');
	  		switchButtonState(false,'attending');
	  	});
	  	
	  	$('#event-list-tab-attending').bind('click',function(event){
	  		event.stopPropagation();
	  		event.preventDefault();
	  		getAttendingEvent();
	  		switchButtonState(false,'all');
	  		switchButtonState(false,'invited');
	  		switchButtonState(true,'attending');
	  	});
	  	
	  	$('#event-list-tab-invited').bind('click',function(event){
	  		event.stopPropagation();
	  		event.preventDefault();
	  		getInvitedEvent();
	  		switchButtonState(false,'all');
	  		switchButtonState(true,'invited');
	  		switchButtonState(false,'attending');
	  	});
	  	
		
		/* state: down is true, up is false */
		function switchButtonState(state,button){
			if (state==true){
				$('#event-list-tab-'+button).attr('data-theme', 'b');
				$('#event-list-tab-'+button).removeClass('ui-btn-up-c ui-btn-hover-c').addClass('ui-btn-up-b');
			} else if (state==false) {
				$('#event-list-tab-'+button).attr('data-theme', 'c');
				$('#event-list-tab-'+button).removeClass('ui-btn-up-b').addClass('ui-btn-up-c ui-btn-hover-c');
			}
		}
		
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
		    	bindEventLink('#eventlist');		
		  	});
		}
		
		function getAttendingEvent(){
			$.mobile.pageLoading();
			$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/list/attending/"+gtid+"?callback=?", function (json, status, data) {
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
		    	bindEventLink('#eventlist');		
		  	});
		}
		
		function getAllEvent(){
			$.mobile.pageLoading();
			$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/list/smart/"+gtid+"?callback=?", function (json, status, data) {
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
		    	bindEventLink('#eventlist');		
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
		rsvpStatusWord['noreply'] = 0;
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
			$('#detail-view-attendees-count').html(json.total_count);
			$('#detail-view-wall-count').html(json.feed_count);
			
			/* RSVP get status*/
			$('#rsvp-status option')[ rsvpStatusWord[json.rsvp_status] ]['selected'] = true;
			$('#rsvp-status').selectmenu('refresh',true);
			
			/* RSVP set status*/
			$('#rsvp-status').change(function(){
				
				log ( $('#rsvp-status option:selected').attr('value') );
				var rsvpStatus = $('#rsvp-status option:selected').attr('value')
				$.getJSON("http://"+ SERVER_ADDRESS +"/event/rsvp/"+ rsvpStatus +"/event:fb:"+ detailEventId +"/"+ gtid + "?callback=?", function(data){
					$.parseJSON(data);
					if (data.response != 'true'){
						popErrorMessage('Error in setting RSVP status');
						$('#rsvp-status option')[ rsvpStatusWord[json.rsvp_status] ]['selected'] = true;
						$('#rsvp-status').selectmenu('refresh',true);
					}
				});
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
		$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/feed/event:fb:" + detailEventId + "?callback=?" , function(json,status,data){
			$("#wall-view-list").html('');
			jQuery.parseJSON(json);
			log(json);
			if (json.length > 0){
					for (i=0; i<json.length; i++){
						$("#wall-view-list").append(
							'<li><div class="wall-view-thumbnail" style="background-image: url('
							+ 'https://graph.facebook.com/' + json[i].actor_id + '/picture'
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
		$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/detail/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
			jQuery.parseJSON(json);
			desc = json;
			$('#description-view-content').html(json.description.replace(/\n/g,'<br />'));
		});
	}
	
	GTEVENTS.Pages.friends = function(){
		$('#description-view-content').html('');
		detailEventId = getLocalStorage("detailEventId");
		$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/attendance/friend/event:fb:" + detailEventId + '/' + gtid + "?callback=?" , function(json,status,data){
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
				$("#friends-view-list").html('<li>No friend is attending this event.<li>');
			}
			$("#friends-view-list").listview("refresh");
			$.mobile.pageLoading(true);
		});
	}
	
	GTEVENTS.Pages.search = function(){
		$('#search-form').bind('submit', function(e){
			e.preventDefault();
			e.stopPropagation();
			var searchTerm = $('#search-input').val();
			log(searchTerm);
			$.mobile.pageLoading();	
			$.retrieveJSON("http://"+ SERVER_ADDRESS +"/event/search/" + searchTerm + "/" + gtid + "?callback=?", function (json, status, data) {
			    var i, eObj;
			    jQuery.parseJSON(json);
			    console.log(json);
			    $("#eventlist-search").html('');
			    for (i = 0; i < json.length && (eObj = json[i]); i++) {
			    	location_ = (eObj["location"] == '')?'':('at ' + eObj["location"]);
			        $("#eventlist-search").append(
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
			            + '</a></li>');
		    	}
		    	$("#eventlist-search").listview("refresh");
		    	$.mobile.pageLoading(true);	
		    	bindEventLink('#eventlist-search');
		  	});
			
		});
		
		$('#search-form > .ui-input-search > .ui-input-clear').bind('click',function(){
			$("#eventlist-search").html('');
		});
		
	}
	
	
	/* call ready function when either the page is transition to or when this is the page */
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

/* manually handle link forwarding for list view in main view and search view*/
function bindEventLink(listName){
	
    $(listName + ' > li').bind('click', function(event){
		detailEventId = ($(this).attr('id'));
		setLocalStorage("detailEventId", detailEventId);
		
		event.stopPropagation();
		event.preventDefault();
		
		$.mobile.changePage('#detail', 'slide', false, true);
	});
}

/* display jquery mobile error dialog */
function popErrorMessage(errorMessage){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>" + errorMessage  + "</h1></div>")
	.css({ "display": "block", "opacity": 0.96, "top": $(window).scrollTop() + 100 })
	.appendTo( $('body'))
	.delay( 800 )
	.fadeOut( 400, function(){
		$(this).remove();
	}); 
}

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
