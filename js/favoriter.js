import { fetchImages } from './images.js';
function init() {

    showFavorites();

}
window.addEventListener("load", init);

async function showFavorites() {
    const favIds = (JSON.parse(localStorage.getItem("favoriter")) || []).map(id => id.toString());

    let favoriteDiv = document.querySelector("#favoritesContainer");

    if (!favoriteDiv) return;

    favoriteDiv.innerHTML = ""; //rensa innehåll först

    if (favIds.length == 0) {

        favoriteDiv.innerText = "Du har inte lagt några resmål i favoriter ännu";
        return;
    }

    let myApiKey = "Tc9ZD2gK";

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions); //skicka förfrågan tilll SMAPI

    let data = await response.json();
    const places = data.payload;

    let favoritePlaces = places.filter(place => favIds.includes(place.id.toString()));



    for (let i = 0; i < favoritePlaces.length; i++) {
        const place = favoritePlaces[i];
        markerLocations(place);
        const div = document.createElement("div");
        div.classList.add("smapiPlace");

        let shortDescription = "";

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "..."
        if (place.abstract == "") {
            shortDescription = "Ingen beskrivning tillgänglig";
        } else if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "...";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        let imgUrl = await fetchImages(place);

        div.innerHTML = "<img id='imgUrl' src='" + imgUrl + "' alt='" + place.name + "' class='picture'><img src='photos/trash.svg' alt='ta bort favorit' class='trash' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription + "</p>"; //skriver ut infon i div-elementet

        favoriteDiv.appendChild(div);
    }

}
