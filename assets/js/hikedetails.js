// Global variables
var trailID = "";
var hikeListEl = document.querySelector("#api-hike-detailp2");
var storesBtnEl = document.querySelector("#stores-btn");

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

    // Error catching here; if the trail can't be found, return to main site
    .catch(function(error) {
        document.location.replace("./index.html");
    });
}

// Builds the trail details on the page
var buildTrailDetails = function(trail) {

    // Clear anything currently included
    hikeListEl.innerHTML = "";

    // Build DOM elements
    var titleEl = document.createElement("h3");
    titleEl.textContent = trail.name;
    titleEl.classList = "hike-name";
    var imgEl = document.createElement("img");
    if(trail.imgSmallMed) {
        imgEl.setAttribute("src", trail.imgSmallMed);
    }
    else {
        imgEl.setAttribute("src", "./assets/images/hike-img-default.png");
    }
    imgEl.setAttribute("alt", "trail highlight");
    var summaryEl = document.createElement("p");
    summaryEl.innerHTML = "<h5>Summary: </h5>" + trail.summary;
    var locationEl = document.createElement("p");
    locationEl.innerHTML = "<h5>Location: </h5>" + trail.location;
    var distanceEl = document.createElement("p");
    distanceEl.innerHTML = "<h5>Distance: </h5>" + trail.length;
    var difficultyEl = document.createElement("p");
    difficultyEl.innerHTML = "<h5>Difficulty:  </h5>";

    // Create the image for the difficulty
    var difficultyImgEl = document.createElement("img");
    difficultyImgEl.setAttribute("src", "./assets/images/" + trail.difficulty + ".svg");
    difficultyImgEl.setAttribute("alt", trail.difficulty);
    difficultyEl.appendChild(difficultyImgEl);

    // Continue DOM elements
    var altitudeHighEl = document.createElement("p");
    altitudeHighEl.innerHTML = "<h5>High: </h5>" + trail.high + " feet"
    var altitudeLowEl = document.createElement("p");
    altitudeLowEl.innerHTML = "<h5>Low: </h5>" + trail.low + " feet"

    // Append elements on the list
    hikeListEl.appendChild(titleEl);
    hikeListEl.appendChild(imgEl);
    hikeListEl.appendChild(summaryEl);
    hikeListEl.appendChild(locationEl);
    hikeListEl.appendChild(distanceEl);
    hikeListEl.appendChild(difficultyEl);
    hikeListEl.appendChild(altitudeHighEl);
    hikeListEl.appendChild(altitudeLowEl);
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

// Passes query for trail-id to hikestores.html
var storesBtnHandler = function(event) {
    storesBtnEl.setAttribute("href", "./hikestores.html?trail-id=" + trailID);
}

getTrailID();
storesBtnEl.addEventListener("click", storesBtnHandler());