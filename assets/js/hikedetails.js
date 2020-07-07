
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
    console.log(trail);
}

// Gets the hike ID from the query selector
var getTrailID = function() {
    var trailID = document.location.search.split("=")[1];
    if(trailID) {
        getTrailDetails(trailID);
    }
    else {
        document.location.replace("./index.html");
    }
}

getTrailDetails("7011192");