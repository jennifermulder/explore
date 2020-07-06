let map;
let service;
let infowindow;
let area;
let displayMarkerDetails;

// Fixme: Update map elementId name
let mapContainerId = "map";
// Fixme: Update zipcode elementId name
let zipcodeId = "zipcode";
// Default position: San Francisco, CA.
let searchAreaPos = { lat: 37.773972, lng: -122.431297 };
// Console debug log.
let debug = 0;
// Search keyword for nearby places.
let searchKeyword = 'sporting good store';
// Max nearcbySearch results.
let maxresults = 10;

// Main function that runs the show.
function main() {
    if(debug)
        console.log("start::func main()");
    infowindow = new google.maps.InfoWindow();
    area = new google.maps.LatLngBounds();
    
    var zipcode = document.getElementById(zipcodeId).value;

    // Search nearby places.
    getNearbySearch(zipcode);

    // Update search area and redo search of nearby places.
    updateSearchArea();
}

/* Helper function */
// Geocode zipcode or address to lattitude/longitude and search nearby places.
function getNearbySearch(zipcode) {
    if(debug) {
        console.log("start::func setupMap()");
        console.log("Zipcode provided = " + zipcode);
    }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address : zipcode},
        function(results,status) {
            if(status == google.maps.GeocoderStatus.OK) {
                // init map with zipcode
                searchAreaPos.lat = results[0].geometry.location.lat();
                searchAreaPos.lng = results[0].geometry.location.lng();
                
                map = new google.maps.Map(document.getElementById(mapContainerId), {
                    center: searchAreaPos,
                    zoom: 15
                });
                map.setCenter(results[0].geometry.location);
                

                console.log(searchAreaPos);
                let request = {
                    location: searchAreaPos,
                    rankBy: google.maps.places.RankBy.DISTANCE,
                    keyword: searchKeyword 
                };
                service = new google.maps.places.PlacesService(map);
                // Search nearby based on searchKeyword
                service.nearbySearch(request,
                    function(results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            // DOM elements for store list and details
                            if (document.contains(document.getElementById("StoreList"))) {
                                document.getElementById('StoreList').remove();
                            }
                            createStoreListDOM(zipcode);
                            for (var i = 0; i < maxresults; i++) {
                                createMarker(results[i]);
                                map.fitBounds(area);
                                let storesLI = document.createElement('li');
                                storesUL.appendChild(storesLI);
                                storesLI.innerHTML += results[i].name;
                            }
                        }
                    }
                );
            } else {
                if(debug)
                    console.log("Google GEOCODE API status::" + status);
            }
        }
    );
}
// Create a map marker/pin
function createMarker(place) {
    if(debug)
        console.log("start::func createMarker()");
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    area.extend(place.geometry.location);

    displayMarkerDetails = 1;
    google.maps.event.addListener(marker, "click", function() {
        if(debug)
            console.log("Click registered on marker");
        infowindow.setContent(place.name);
        infowindow.open(map, this);
        let request = {
            placeId: place.place_id,
            fields: ['name', 'formatted_address', 'website']
        };
        service.getDetails(request,
            function(placeResult, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    if (document.contains(document.getElementById("StoreDetails"))) {
                        document.getElementById('StoreDetails').remove();
                    }
                    createStoreDetailDOM(zipcode);
                    if(displayMarkerDetails){
                        let storeDetailLI = document.createElement('li');
                        storeDetailUL.appendChild(storeDetailLI);
                        storeDetailLI.innerHTML += "Name: " + placeResult.name;
                        storeDetailLI = document.createElement('li');
                        storeDetailUL.appendChild(storeDetailLI);
                        storeDetailLI.innerHTML += "Address: " + placeResult.formatted_address;
                        storeDetailLI = document.createElement('li');
                        storeDetailUL.appendChild(storeDetailLI);
                        storeDetailLI.innerHTML += "Website: " + placeResult.website;
                    }
                }
            }
        );
    });
}
// Create HTML DOM for store list
function createStoreListDOM(zipcode) {
    // Display nearby search results as a DOM list
    storesList = document.createElement('div');
    storesList.id = 'StoreList';
    storesList.innerHTML = 'Store List near ' + zipcode;
    storesUL = document.createElement('ul');
    storesList.appendChild(storesUL);
    document.body.insertBefore(storesList, document.getElementById(mapContainerId).nextSibling);
}
// Create HTML DOM for detail on selected store
function createStoreDetailDOM(zipcode) {
    // Display details on selected result as a DOM list
    storeDetailList = document.createElement('div');
    storeDetailList.id = 'StoreDetails';
    storeDetailList.innerHTML = 'Selected Store Details';
    storeDetailUL = document.createElement('ul');
    storeDetailList.appendChild(storeDetailUL);
    document.body.insertBefore(storeDetailList, document.getElementById("StoreList").nextSibling);
}
// Redo nearby place search when a new zipcode is provided
function updateSearchArea() {
    document.getElementById("submit").addEventListener("click", function() {
        main();
      });
}