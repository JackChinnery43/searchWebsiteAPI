window.addEventListener("load", function() {
    
    // stores the value input of the form to the searchButton variable
    // the event listener searches the input of the search bar when the submit button is clicked
    var searchButton = document.querySelector("#searchForm");
    searchButton.addEventListener("submit", function(event) {
        
        // store user input from search bar into searchBarInput variable
        var searchBarInput = document.querySelector("#searchBar").value.trim();
        
        // check user has inputted a value into the search bar, and display an error message if not
        var hint_error = document.querySelector("#hint_error");
        var hasInput = true;
        
        if(searchBarInput.length == 0) {
            document.querySelector("#hint_error").innerHTML = "It appears you didn't search for anything. Please try again."
            hasInput = false;
            event.preventDefault();
        } else {
            hint_error.style.display = "none";
        }
        
        // nest the HTTPRequest inside an if statement so that it only runs if the user has inputted a value
        if(hasInput) {
            event.preventDefault();
            var httpRequest = new XMLHttpRequest();
            var url = "https://www.vam.ac.uk/api/json/museumobject/search?q=" + encodeURIComponent(searchBarInput);

            httpRequest.onload = function() {
                var data = JSON.parse(httpRequest.responseText);
                html(data);
                // log the data to the console to check for bugs
                console.log(data);
            };  

            httpRequest.open("GET", url, true);
            httpRequest.send();  
            
        }
    });
    
    // function that handles the HTML, creating new elements to store the data
    function html(htmlData) {
        var htmlDiv = document.querySelector(".results_section");
        
        // while loop that replaces the last search results with the latest
        while(htmlDiv.firstChild) {
            htmlDiv.removeChild(htmlDiv.firstChild);
        }
        
        // for loop that loops through the API data 
        for (i = 0; i < htmlData.records.length; i++) {
            var imgID = htmlData.records[i].fields.primary_image_id;
            var createDiv = document.createElement("div");
            var createImg = document.createElement("img");
            var createPTitle = document.createElement("p");
            var createPArtist = document.createElement("p");
            var createPLocation = document.createElement("p");
            
            if (imgID) {
                var imgURL = "https://media.vam.ac.uk/media/thira/collection_images/" + imgID.substring(0,6) + "/" + imgID + ".jpg";   
            } 
            else {
                var imgURL = "images/result_empty.jpg";
            }
            
            // img of the item
            createImg.setAttribute("src", imgURL);
            createDiv.appendChild(createImg);
            
            // title of the item
            createPTitle.innerHTML = "Title: " + htmlData.records[i].fields.title;
            createDiv.appendChild(createPTitle);

            // artist of the item
            createPArtist.innerHTML = "Artist: " + htmlData.records[i].fields.artist;
            createDiv.appendChild(createPArtist);

            // location of the item
            createPLocation.innerHTML = "Location: " + htmlData.records[i].fields.location;
            createDiv.appendChild(createPLocation);

            htmlDiv.appendChild(createDiv);
        }
    } 
});