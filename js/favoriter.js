import { fetchImages } from './images.js'; //hämtar bilder från flickr via images.js
let remove = null; //det resmål som ska tas bort

function init() {
    showFavorites(); //anrop av showFavorites
}
window.addEventListener("load", init);

async function showFavorites() {
    const favIds = (JSON.parse(localStorage.getItem("favoriter")) || []).map(id => id.toString()); //hämtar resmål som favoriserats via localStorage eller tom array om inget finns i localStorage - gör om array till sträng

    let favoriteDiv = document.querySelector("#favoritesContainer"); //div element där resmålen ska skrivas ut

    if (!favoriteDiv) return; //om inte favoriteDiv finns avslutas funktionen

    favoriteDiv.innerHTML = ""; //rensa innehåll först

    //om inga resmål har favoriserats
    if (favIds.length == 0) {
        favoriteDiv.innerText = "Du har inte lagt några resmål i favoriter ännu";
        return;
    }

    let myApiKey = "Tc9ZD2gK"; //API nyckel

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions); //skicka förfrågan tilll SMAPI

    let data = await response.json(); //inväntar svaret från SMAPI

    const places = data.payload; //payload egenskapen

    let favoritePlaces = places.filter(place => favIds.includes(place.id.toString())); //filtrerar ut alla platser som är favoriserade

    let confirm = document.querySelector("#confirm"); //div element för feedbackrutan när man tar bort ur favoriter
    let yes = document.querySelector("#yes"); //ja knappen för att ta bort ur favoriter
    let no = document.querySelector("#no"); //nej knappen för att ta bort ur favoriter

    //om användaren klickar på ja
    yes.onclick = function () {
        let fav = JSON.parse(localStorage.getItem("favoriter")) || []; //hämtar favoriter ur localstorage
        fav = fav.filter(id => id.toString() !== remove); //tar bort id:t från listan

        localStorage.setItem("favoriter", JSON.stringify(fav)); //uppdaterar localstorage
        confirm.classList.add("hide"); //döljer nrutan igen
        showFavorites(); //anropar showFavorites för att uppdatera favoriter
    };

    //om användaren klickar nej
    no.onclick = function () {
        confirm.classList.add("hide"); //döljer rutan igen
    };

    //rensar gamla markörer
    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];

    for (let i = 0; i < favoritePlaces.length; i++) {
        const place = favoritePlaces[i];
        markerLocations(place); //anrop av funktion i karta.js för markörer

        //skapar nytt div element för att hålla resmålen
        const div = document.createElement("div");
        div.classList.add("smapiPlace"); //lägger till klass

        let shortDescription = ""; //tom sträng för att hålla breskrivning

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "...Läs mer" 
        if (place.abstract == "") {
            shortDescription = "Ingen beskrivning tillgänglig"; //om beskrivning inte finns
        } else if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "... <i>Läs mer</i>";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        let imgUrl = await fetchImages(place); //hämtar bilder via flickr från images.js

        div.innerHTML = "<img id='imgUrl' src='" + imgUrl + "' alt='" + place.name + "' class='picture'><img src='photos/trash.svg' alt='ta bort favorit' class='trash' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription + "</p>"; //skriver ut infon i div-elementet

        const trash = div.querySelector(".trash"); //ikon för att ta bort favorit

        trash.addEventListener("click", function (e) {
            e.stopPropagation(); //stoppar eventuella andra eventlyssnare
            e.preventDefault(); //stoppar andra beteende

            remove = this.getAttribute("data-id"); //den som ska tas bort
            confirm.classList.remove("hide"); //visar rutan för att bekräfta borttagningen
        });

        //användaren klickar på ett turistmål
        div.addEventListener("pointerdown", function (e) {
            if (e.target.classList.contains("trash")) return; //om man klickar på soptunnan avbryts funktionen

            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

        favoriteDiv.appendChild(div); //lägger div i favoriteDiv
    }

}
