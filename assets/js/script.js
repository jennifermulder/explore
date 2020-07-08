// Global variables
var hikeListEl = document.querySelector("#hike-search-container");
var locationSearchFormEl = document.querySelector("#location-search-form");
var locationSearchDescription = document.querySelector("#location-search");

// Calls to GeoCoding API by Google and returns lat/long
var searchAddress = function(address) {

    var apiURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=AIzaSyAWVEsp8JBkgZyxhUjCaO2o7XN61ULxz6w";

    // Use first fetch to get latitude and longitude of user-input city
    fetch(apiURL)
        .then(function(googleResponse) {
            return googleResponse.json();
        })
        .then(function(googleData) {
            var lat = googleData.results[0].geometry.location.lat;
            var lon = googleData.results[0].geometry.location.lng;

            // Once we get lat/long, use second fetch to retrieve data from HikingProject API
            var hikingURL = "https://www.hikingproject.com/data/get-trails?" +
                "lat=" + lat +
                "&lon=" + lon +
                "&key=200820241-a86aed042606dfdfd7bf8931045a1ecf"
            return fetch(hikingURL)
        })

    // Response to inner fetch
    .then(function(response) {
            return response.json();
        })
        // Function that provides functionality to build page
        .then(function(data) {
            buildListView(data.trails);
        })

    // Error if bad connection to server
    .catch(function(error) {
        alert("Unable to find the requested city.");
    });
};

var buildListView = function(trails) {

    // Clear the current list
    hikeListEl.innerHTML = "";

    // If trails is empty, display error message
    if (trails.length === 0) {
        var noTrailWarning = document.querySelector("p");
        noTrailWarning.classList = "flow-text";
        noTrailWarning.textContent = "Sorry, no trails are available for the given location. Try a more specific location.";
        hikeListEl.appendChild(noTrailWarning);
    }

    // Loop through all hikes provided to the user (10)
    for (var i = 0; i < trails.length; i++) {

        // Build elements required in a hike preview item
        var hikeRowEl = document.createElement("div");
        // hikeRowEl.classList = "row";
        var hikeColEl = document.createElement("div");
        hikeColEl.classList = "col s12 m6 l4";
        var hikeCardEl = document.createElement("div");
        hikeCardEl.classList = "card";
        hikeImgContainer = document.createElement("div");
        hikeImgContainer.classList = "card-image";
        var hikeImgEl = document.createElement("img");
        hikeImgEl.setAttribute("alt", "Trail preview");
        var hikeTitleEl = document.createElement("span");
        hikeTitleEl.classList = "card-title";
        hikeTitleEl.textContent = trails[i].name;
        if (trails[i].imgMedium) {
            hikeImgEl.setAttribute("src", trails[i].imgMedium);
        } else {
            hikeImgEl.setAttribute("src", "./assets/images/hike-img-default.png");
            hikeTitleEl.classList = "card-title black-text";
        }
        var hikeLengthContainer = document.createElement("div");
        hikeLengthContainer.classList = "card-content";
        var hikeLengthEl = document.createElement("p");
        hikeLengthEl.textContent = "Length: " + trails[i].length + " miles";
        var hikeActionContainer = document.createElement("div");
        hikeActionContainer.classList = "card-action";
        var hikeLinkEl = document.createElement("a");
        hikeLinkEl.setAttribute("href", "./hikedetails.html");
        hikeLinkEl.textContent = "View this hike here!";

        // Add all elements to the appropriate container
        hikeImgContainer.appendChild(hikeImgEl);
        hikeImgContainer.appendChild(hikeTitleEl);
        hikeLengthContainer.appendChild(hikeLengthEl);
        hikeActionContainer.appendChild(hikeLinkEl);
        hikeCardEl.appendChild(hikeImgContainer);
        hikeCardEl.appendChild(hikeLengthContainer);
        hikeCardEl.appendChild(hikeActionContainer);
        hikeColEl.appendChild(hikeCardEl);
        hikeRowEl.appendChild(hikeColEl);

        // Add the container to the full list
        hikeListEl.appendChild(hikeRowEl);
    }
}

// Process when the form is submitted
var formSubmitHandler = function(event) {
    event.preventDefault();

    // Get the address the user input, if empty, alert them and return
    var address = locationSearchDescription.value;
    if (!address) {
        alert("You must enter an address.");
        return;
    }
    locationSearchDescription.value = "";

    // Search for the provided address
    var searchResultEl = document.querySelector("#search-result");
    searchResultEl.textContent = "Search Results for: " + address.toUpperCase();
    searchAddress(address);
}

locationSearchFormEl.addEventListener("submit", formSubmitHandler);