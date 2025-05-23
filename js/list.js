import { fetchImages } from './images.js';
//Globala variabler
const myApiKey = "Tc9ZD2gK"; //API nyckel
let placeContainer; //div element för att hålla temaparker
let allPlaces = []; //array för alla platser
let imgUrl; //urlen för den bild som ska visas

function init() {
    placeContainer = document.querySelector("#placeContainer"); //hämtar det tomma div-elementet i HTML
    getData(); //anropa funktion getData
}
window.addEventListener("DOMContentLoaded", init);

//funktion som hämtar data från SMAPI
async function getData() {
    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions); //skicka förfrågan tilll SMAPI

    if (response.ok) {
        let data = await response.json();
        showPlaces(data.payload); // skicka vidare till funktion showPlaces
    } else {
        placeContainer.innerText = "Fel vid hämtning: " + response.status; //felmeddelande 
    }
}

//funktion som skriver ut turistmålen på sidan
async function showPlaces(places) {
    placeContainer.innerHTML = ""; // rensar innehållet

    //loopa genom varje turistmål i listan
    for (let i = 0; i < places.length; i++) {
        const place = places[i]; //aktuellt turistmål
        markerLocations(place);
        //fetchImages(place);

        const newDiv = document.createElement("div"); //skapa nytt div-element för turistmålet

        newDiv.classList.add("smapiPlace"); //lägg till en class

        let shortDescription = "";

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "..."
        if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "...";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        const imgUrl = await fetchImages(place); //HÄR hämtar vi bilden från den andra filen

        newDiv.innerHTML = "<img id='imgUrl' src='" + imgUrl + "' alt='" + place.name + "' class='picture'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

        placeContainer.appendChild(newDiv); //lägg till det nya div-elementet i det tomma div-elementet i HTML

        heart(newDiv);
    }

}
