var socket = io();
var map;
var centered = false;


function initialize() {

	var mapOptions = {
		center: new google.maps.LatLng(38.88332, -77.0167),
		disableDefaultUI: true,
		styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}],
		zoom: 2
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	document.getElementById('cbEarth').addEventListener('click', function (event) {
		document.getElementById('cbEarth').checked ? map.setMapTypeId(google.maps.MapTypeId.SATELLITE) : map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

socket.on('tweet', function(tweet){

	var tweedeckTemplate = document.getElementById("tweet-template").textContent;
	var tweedeckHtml = Mustache.render(tweedeckTemplate, tweet);
	var tweetdeckBookmark = document.createElement("div");
    tweetdeckBookmark.innerHTML = tweedeckHtml;
	document.getElementById("tweetFrame").insertBefore(tweetdeckBookmark, document.getElementById("tweetFrame").firstChild);

	//MAP
	var myLatlng = new google.maps.LatLng(tweet.latitude, tweet.longitude);

	var infowindowTemplate = document.getElementById("infowindow-template").textContent;
	var infowindowHtml = Mustache.render(infowindowTemplate, tweet);
	var infowindowBookmark = document.createElement("div");
	infowindowBookmark.innerHTML = infowindowHtml;

	var infowindow = new InfoBox({
         content: infowindowBookmark,
         disableAutoPan: true,
         maxWidth: 250,
         pixelOffset: new google.maps.Size(-140, 0),
         zIndex: null,
         boxStyle: {
            background: "url('/images/tipbox.gif') no-repeat",
            opacity: 0.75,
            width: "280px"
        },
        closeBoxMargin: "12px 4px 2px 2px",
        closeBoxURL: "/images/close.gif",
        infoBoxClearance: new google.maps.Size(1, 1)
    });


	var marker = new google.maps.Marker({
      position: myLatlng,
	    animation: google.maps.Animation.DROP,
	    icon: '../images/bird-small.png',
      map: map,
      title: tweet.name
    });
	if (document.getElementById("cbAutopan").checked && centered === false) {
		map.setCenter(myLatlng);
		//delay for next autopan so it does not go crazy
		centered = true;
		setTimeout(function(){ centered = false; }, 1000);
	}
	infowindow.open(map, marker);

	google.maps.event.addListener(marker, "click", function() {
		infowindow.open(map,marker);
	});

	tweetdeckBookmark.addEventListener("mouseover", function() {
		marker.setAnimation(google.maps.Animation.BOUNCE);
		marker.setIcon('../images/bird1.png')
	}, false);

	tweetdeckBookmark.addEventListener("mouseout", function() {
		marker.setAnimation(null);
		marker.setIcon('../images/bird-small.png')
	}, false);

  var test = tweetdeckBookmark.getElementsByClassName("tweetLocation")
	test[0].addEventListener("click", function() {
		map.setCenter(myLatlng);
		infowindow.open(map,marker);
	}, false);

	setTimeout(function(){ infowindow.close(); }, 5000);
});
