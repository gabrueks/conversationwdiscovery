

  $(".messages").animate({ scrollTop: $(document).height() }, "fast");

  $("#profile-img").click(function() {
  	$("#status-options").toggleClass("active");
  });

  $(".expand-button").unbind('click').on('click', function() {
    if($("#profile").is(".expanded") && $("#contacts").is(".expanded")){
      $("#profile").removeClass();
    	$("#contacts").removeClass();
    }else{
      $("#profile").toggleClass("expanded");
    	$("#contacts").toggleClass("expanded");
    }
  });

  $("#status-options ul li").click(function() {
  	$("#profile-img").removeClass();
  	$("#status-online").removeClass("active");
  	$("#status-away").removeClass("active");
  	$("#status-busy").removeClass("active");
  	$("#status-offline").removeClass("active");
  	$(this).addClass("active");


  	if($("#status-online").hasClass("active")) {
  		$("#profile-img").addClass("online");
  	} else if ($("#status-away").hasClass("active")) {
  		$("#profile-img").addClass("away");
  	} else if ($("#status-busy").hasClass("active")) {
  		$("#profile-img").addClass("busy");
  	} else if ($("#status-offline").hasClass("active")) {
  		$("#profile-img").addClass("offline");
  	} else {
  		$("#profile-img").removeClass();
  	};

  	$("#status-options").removeClass("active");
  });

  function newMessage() {
  	message = $(".message-input input").val();
  	if($.trim(message) == '') {
  		return false;
  	}
  	$('<li class="sent"><img src="https://cdn1.iconfinder.com/data/icons/ninja-things-1/1772/ninja-simple-512.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
  	$('.message-input input').val(null);
  	$('.contact.active .preview').html('<span>You: </span>' + message);
  	$(".messages").animate({ scrollTop: $(document).height() }, "fast");

    var url = "http://localhost:3000";
    fetch(url,{
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  method: "POST",
  body: JSON.stringify({"text": message})
  }).then(function(response){
      return response.json();
    }).then(function(json){
      if(json.matching_results == undefined || Array.isArray(json.intents)){
        $('<li class="replies"><img src="https://upload.wikimedia.org/wikipedia/en/0/00/IBM_Watson_Logo_2017.png" alt="" /><p>' + json.output.text + '</p></li>').appendTo($('.messages ul'));
      }else{
        for(var count = 0; count < json.passages.length; count++){
          $('<li class="replies"><img src="https://upload.wikimedia.org/wikipedia/en/0/00/IBM_Watson_Logo_2017.png" alt="" /><p>' +  json.passages[0].passage_text+ '</p></li>').appendTo($('.messages ul'));
        }
      }
    });
  };

  $('.submit').click(function() {
    newMessage();
  });

  $(window).on('keydown', function(e) {
    if (e.which == 13) {
      newMessage();
      return false;
    }
  });
