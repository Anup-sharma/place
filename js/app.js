
//Locations of Nallasopara city in India country
var nspLocations = [{
        title: 'Miraj Cinema',
        importance: 'Movie with Shopping',
        lat: 19.422985,
        lng: 72.808687
    },
    {
        title: 'Nirman nagar',
        importance: 'Municipal Corporation and Mayors Office',
        lat: 19.421786,
        lng: 72.816420
    },
    {
        title: 'central Park',
        importance: 'Petrol Pump and Famous family Resturant',
        lat: 19.422964,
        lng: 72.818854
    },
    {
        title: 'Oswall Nagari',
        importance: 'Home and US English Academy',
        lat: 19.428649,
        lng: 72.818546
    },
    {
        title: 'Adhiraj',
        importance: 'Gujrathi Families',
        lat: 19.426967,
        lng: 72.812970

    },
    {
        title: 'Donlane',
        importance: 'Shivaji School and Sabha on Lord Swaminarayan',

        lat: 19.418255,
        lng: 72.822296

    },
    {
        title: 'Achole Talao',
        importance: 'Nice Place for joggers and Instruments For Workout',

        lat: 19.410403,
        lng: 72.828046

    },
    {
        title: 'Link Road',
        importance: 'Fire Brigade and Agrawal Builders(ghar ho toh aisa)',

        lat: 19.407096,
        lng: 72.827514

    }
];
// Declaring global variables 
var map;
var fsclientID, fsclientSecret;

var Location = function(given) {
    var self = this;
    this.title = given.title;
    this.lat = given.lat;
    this.lng = given.lng;
    this.importance = given.importance;
    this.URL = "";
    this.street = "";
    this.city = "";
    this.visible = ko.observable(true);

    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.lng + '&client_id=' + fsclientID + '&client_secret=' + fsclientSecret + '&v=20171118' + '&query=' + this.title;

    $.getJSON(foursquareURL).done(function(given) {
        var results = given.response.venues[0];
        given.URL = results.url;
        if (typeof given.URL === 'undefined') {
            given.URL = "";
        }
        self.street = results.location.formattedAddress[0];
        self.city = results.location.formattedAddress[1];

    }).fail(function() {
        alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
    });

    this.infoWindow = new google.maps.InfoWindow({
        content: given.infoString
    });

    //settings for marker
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(given.lat, given.lng),
        map: map,
        title: given.title
    });

    this.visibleMarker = ko.computed(function() {
        if (this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);
    //When marker is clicked it shows information for that place
    this.marker.addListener('click', function() {
        given.infoString = '<div class="locationContent"><div class="title"><b>Title: ' + given.title + "</b></div>" +
            '<div class="content"><a href="' + given.URL + '">' + given.URL + "</a></div>" +
            '<div class="content">' + given.street + "</div>" +
            '<div class="content">' + given.city + "</div>" +
            '<div class="content">Importance: ' + given.importance + "</div>";

        self.infoWindow.setContent(given.infoString);

        self.infoWindow.open(map, this);
        //for bounce Animation
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
        //when location is clicked it should be zoomed
        map.setCenter(new google.maps.LatLng(given.lat, given.lng));
        map.setZoom(16);

    });

    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};
//use of knockout to filter the location as we searched location from location array.
function ProjViewModel() {
    var self = this;

    this.findLocation = ko.observable("");

    this.locationArray = ko.observableArray([]);

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: {
            lat: 19.4291979,
            lng: 72.8083441
        }
    });

    fsclientID = "MNHWZIBOVGQWGTJJWME5LLVAJFHGEXVMZ4T1ZRHLKUXWO2LL";
    fsclientSecret = "IATFRCM5PJJLVU24BFM5QR0B45PU2JEF43QZXMJUJDVIXD2Y";

    nspLocations.forEach(function(locationThing) {
        self.locationArray.push(new Location(locationThing));
    });

    this.searchedLocation = ko.computed(function() {
        var searched = self.findLocation().toLowerCase();
        if (!searched) {
            self.locationArray().forEach(function(locationThing) {
                locationThing.visible(true);
            });
            return self.locationArray();
        } else {
            return ko.utils.arrayFilter(self.locationArray(), function(locationThing) {
                var string = locationThing.title.toLowerCase();
                var result = (string.search(searched) >= 0);
                locationThing.visible(result);
                return result;
            });
        }
    }, self);

}
//Initialize map and apply bindings to ProjViewModel
function initMap() {
    ko.applyBindings(new ProjViewModel());
}
//When menu is clicked it should hide the filter and when double clicked it should again show the filter
var isMenuShowing = true;

function noMenu() {
    $(".override").hide();
    $(".menu").attr("src", "image/menu.png");
    isMenuShowing = false;
}

function yesMenu() {
    $(".override").show();
    $(".menu").attr("src", "image/menu.png");
    isMenuShowing = true;
}

function hideMenu() {
    if (isMenuShowing === true) {
        noMenu();
    } else {
        yesMenu();
    }
}
$(".menu").click(hideMenu);

//When weatherBox is clicked it should show the temperature and when it is clicked again it should hide the box.
var weatherBox = $("#weather-image-container");
var isWeatherVisible = 0;
weatherBox.click(function() {
    if (isWeatherVisible === 0) {
        if ($(window).width() < 670) {
            $(".predict li").css("display", "block");
            weatherBox.animate({
                width: "245"
            }, 500);
        } else {
            $(".predict li").css("display", "inline-block");
            weatherBox.animate({
                width: "380"
            }, 500);
        }
        isWeatherVisible = 1;
    } else {
        weatherBox.animate({
            width: "80"
        }, 500);
        isWeatherVisible = 0;
    }
});

//By using Weather Underground JSON and API key predict the temp.

var wunderground = "http://api.wunderground.com/api/5500ea162708c6c3/conditions/q/Ind/Mumbai.json";

$.getJSON(wunderground, function(data) {
    var list = $(".predict");
    detail = data.current_observation;
    list.append('<li>Temp: ' + detail.temp_f + '° F</li>');
    list.append('<li><img style="width: 25px" src="' + detail.icon_url + '">  ' + detail.icon + '</li>');
}).fail(function(jqxhr) {
    console.log('<p style="text-align: center;">Sorry!</p><p style="text-align: center;">Could Not Be Loaded. Try after sometime.</p>');
});



//when there is network problem then this message should be visible
function errorMessage() {
    alert("Google Map is not Loading due to loss of Internet Connection. Please try after some time");
}