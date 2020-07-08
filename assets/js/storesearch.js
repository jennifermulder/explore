let map;
let service;
let infowindow;
let area;
let displayMarkerDetails;

// Fixme: Update map elementId name
let mapContainerId = "map";
// Fixme: Update store detail history elementId name
let storeHistoryContainerId = "storeSearchHistory";
// Fixme: Update zipcode elementId name
let zipcodeId = "zipcode";
// Default position: San Francisco, CA.
let defaultArea = "San Francisco, CA";
let searchAreaPos = { lat: 37.773972, lng: -122.431297 };
// Console debug log.
let debug = 0;
// Search keyword for nearby places.
let searchKeyword = 'sporting good store';
// Max nearcbySearch results.
let maxresults = 10;
// Local storage for store detail
let storeHistory = JSON.parse(localStorage.getItem("store")) || [];
let maxStoreHistory = 5;

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
    if (zipcode === ""){
        zipcode = defaultArea;
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
                if(debug)
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
    historyStoreDetailDOM();
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
                    createStoreDetailDOM();
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

                        // Local storage for selected stores
                        historyStoreDetail(placeResult.name, placeResult.formatted_address);
                        historyStoreDetailDOM();
                    }
                }
            }
        );
    });
}
// Maintain a history of store details clicked by the user
function historyStoreDetail(name, address){
    storeDetail = name + "[" + address + "]"
    if(debug)
        console.log(storeDetail);
    // Check if store is already is local storage
    if(storeHistory.includes(storeDetail) == false) {
        storeHistory.push(storeDetail);
    }
    if(debug)
        console.log(storeHistory.length);
    if(storeHistory.length >= maxStoreHistory){
        if(debug)
            console.log("Max local storage exceeded, will start splicing");
        storeHistory.splice(0, (storeHistory.length - maxStoreHistory));
    }
    localStorage.setItem("store",JSON.stringify(storeHistory));
}
// Create HTML DOM for store list
function createStoreListDOM(zipcode) {
    // Display nearby search results as a DOM list
    storesList = document.createElement('div');
    storesList.classList = "container center-align";
    storesList.id = 'StoreList';
    storesList.innerHTML = '<h3>Stores near </h3>' + zipcode;
    storesUL = document.createElement('ul');
    storesList.appendChild(storesUL);
    document.body.insertBefore(storesList, document.getElementById(mapContainerId).nextSibling);
}
// Create HTML DOM for detail on selected store
function createStoreDetailDOM() {
    // Display details on selected result as a DOM list
    storeDetailList = document.createElement('div');
    storeDetailList.id = 'StoreDetails';
    storeDetailList.innerHTML = 'Selected Store Details';
    storeDetailUL = document.createElement('ul');
    storeDetailList.appendChild(storeDetailUL);
    document.body.insertBefore(storeDetailList, document.getElementById("StoreList").nextSibling);
}
// Create HTML DOM for store list history and display as a list
function historyStoreDetailDOM() {
    if(debug)
        console.log("Refreshing store history");
    // Remove existing history from HTML page as a part of the refresh
    if (document.contains(document.getElementById('StoreDetailsHistory'))) {
        document.getElementById('StoreDetailsHistory').remove();
    }
    // Display history of stores selected as a DOM list
    storeDetailListHistory = document.createElement('div');
    storeDetailListHistory.id = 'StoreDetailsHistory';
    storeDetailListHistory.innerHTML = '<h3>History of Selected Stores</h3>';
    storeDetailHistoryUL = document.createElement('ul');
    storeDetailListHistory.appendChild(storeDetailHistoryUL);
    document.body.insertBefore(storeDetailListHistory, document.getElementById(storeHistoryContainerId).nextSibling);
    // Display history on HTML pulled from localstorage
    for (var i = 0; i < storeHistory.length; i++) {
        let storeHistoryLI = document.createElement('li');
        storeDetailHistoryUL.appendChild(storeHistoryLI);
        storeHistoryLI.innerHTML += storeHistory[i];
    }
}
// Redo nearby place search when a new zipcode is provided
function updateSearchArea() {
    document.getElementById("submit").addEventListener("click", function() {
        main();
      });
}


////////// Build trail portion /////////////

// Function to pull trail details
var getTrailDetails = function(trailID) {
    
    var apiURL = "https://www.hikingproject.com/data/get-trails-by-id?" + 
                 "ids=" + trailID + 
                 "&key=200820241-a86aed042606dfdfd7bf8931045a1ecf";

    // Get details of the hike
    fetch(apiURL)
    .then(function(response) {
        return response.json();
    })

    // Function that provides functionality to build page
    .then(function(data) {
        buildTrailDetails(data.trails[0]);
    })

    // Error catching here
    .catch(function(error) {
        alert("Unable to find the requested trail.");
    });
}

// Builds the trail details on the page
var buildTrailDetails = function(trail) {
    var cardContentEl = document.querySelector("#card-contentp3");
    cardContentEl.innerHTML = "";

    var hikeNameEl = document.createElement("p");
    hikeNameEl.textContent = trail.name;
    hikeNameEl.classList = "hike-name";
    var hikeCityEl = document.createElement("p");
    hikeCityEl.textContent = trail.location;

    cardContentEl.appendChild(hikeNameEl);
    cardContentEl.appendChild(hikeCityEl);
}

// Gets the hike ID from the query selector
var getTrailID = function() {
    trailID = document.location.search.split("=")[1];
    if(trailID) {
        getTrailDetails(trailID);
    }
    else {
        document.location.replace("./index.html");
    }
}

getTrailID();