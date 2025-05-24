export async function fetchImages(place) {
    const lat = place.lat; //objektets latitud
    const lng = place.lng; //objektets longitud

    let answer = await fetch("https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=ef613a81486a76320dc01145298bc636&lat=" + lat + "&lon=" + lng + "&per_page=1&format=json&nojsoncallback=1&");
    let JSONdata = await answer.json();

    if (JSONdata.photos.photo.length > 0) {
        const photo = JSONdata.photos.photo[0];
        const imgUrl = "https://live.staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + "_m.jpg";
        return imgUrl;
    } else {
        return "photos/noimage.svg"; // en defaultbild om inget hittas
    }
}

//window.addEventListener("load", fetchImages(place));