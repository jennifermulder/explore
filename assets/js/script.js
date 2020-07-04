// Global variables
var hikeListEl = document.querySelector("#hike-search-container");

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
    // Loop through all hikes provided to the user (10)
    for(var i = 0; i < trails.length; i++) {
        // console.log(trails[i].imgSmall, trails[i].name, trails[i].length);
        var hikeRowEl = document.createElement("div");
        hikeRowEl.classList = "row";
        var hikeColEl = document.createElement("div");
        hikeColEl.classList = "col s12 m7";
        var hikeCardEl = document.createElement("div");
        hikeCardEl.classList = "card";
        hikeImgContainer = document.createElement("div");
        hikeImgContainer.classList = "card-image";
        var hikeImgEl = document.createElement("img");
        hikeImgEl.setAttribute("src", trails[i].imgMedium);
        hikeImgEl.setAttribute("alt", "Sorry, this hike's image is not available.");
        var hikeTitleEl = document.createElement("span");
        hikeTitleEl.classList = "card-title";
        hikeTitleEl.textContent = trails[i].name;
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

searchAddress("37388");