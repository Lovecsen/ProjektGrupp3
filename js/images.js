function init() {
    

}
window.addEventListener("load", init);

function fetchImages (place) {
 var apiKey = "ef613a81486a76320dc01145298bc636";

    var url = "https://api.flickr.com/services/rest/?api_key=" + apiKey +
              "&method=flickr.photos.search" +
              "&lat=" + place.lat +
              "&lon=" + place.lon +
              "&per_page=" + 3 +
              "&format=json" +
              "&nojsoncallback=1";


 fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Fel vid hämtning av bilder");
            }
            return response.json();
        })
        .then(function(data) {
            showImages(data.photos.photo, place.name);
        })
        .catch(function(error) {
            console.error("Kunde inte hämta bilder:", error);
        });
}

function showImages(photos) {

    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        
    }

}