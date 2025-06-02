import { fetchImages } from './images.js'; //hämtar bilder från flickr via images.js
let remove = null; //det resmål som ska tas bort
let favoritePlaces = []; //array för att hålla favoriterna
let favoriteDiv; //div element där resmålen ska skrivas ut
let confirmRemove; //div element för feedbackrutan när man tar bort ur favoriter

function init() {
    favoriteDiv = document.querySelector("#favoritesContainer"); //div element där resmålen ska skrivas ut

    confirmRemove = document.querySelector("#confirm"); //div element för feedbackrutan när man tar bort ur favoriter
    let yes = document.querySelector("#yes"); //ja knappen för att ta bort ur favoriter
    let no = document.querySelector("#no"); //nej knappen för att ta bort ur favoriter

    //om användaren klickar på ja
    yes.addEventListener("pointerdown", function () {

        let fav = JSON.parse(localStorage.getItem("favorites")) || []; //hämtar favoriter ur localstorage
        fav = fav.filter(id => id.toString() !== remove); //tar bort id:t från listan

        localStorage.setItem("favorites", JSON.stringify(fav)); //uppdaterar localstorage

        confirmRemove.classList.add("hide"); //döljer nrutan igen
        getFavorites();
    });

    //om användaren klickar nej
    no.addEventListener("pointerdown", function () {
        confirmRemove.classList.add("hide"); //döljer rutan igen
    });

    getFavorites(); //anrop av getFavorites

}
window.addEventListener("load", init);

async function getFavorites() {
    const favIds = (JSON.parse(localStorage.getItem("favorites")) || []).map(id => id.toString()); //hämtar resmål som favoriserats via localStorage eller tom array om inget finns i localStorage - gör om array till sträng

    if (!favoriteDiv) return; //om inte favoriteDiv finns avslutas funktionen

    favoriteDiv.innerHTML = ""; //rensa innehåll först

    //om inga resmål har favoriserats
    if (favIds.length == 0) {
        favoriteDiv.innerText = "Du har inte lagt några resmål i favoriter ännu";
        return;
    }

    const myApiKey = "Tc9ZD2gK"; //API nyckel

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat,älgpark" //alla descriptions vi vill hämta

    try {
        const [smapiRes, jsonRes] = await Promise.all([
            fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions), //skicka förfrågan tilll SMAPI
            fetch("json/destinations.json") //hämta från lokal json-fil
        ])

        if (smapiRes.ok && jsonRes.ok) {
            //gör om svaren till json
            const smapiData = await smapiRes.json();
            const jsonData = await jsonRes.json();

            let places = smapiData.payload.concat(jsonData.establishment); //payload egenskapen
            favoritePlaces = places.filter(place => favIds.includes(place.id.toString())); //filtrerar ut alla platser som är favoriserade
            showFavorites();

        }
    } catch (error) {
        favoriteDiv.innerText = "Fel vid hämtning: " + error.message;
    }
}


async function showFavorites() {
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

        //om place.text finns används detta, annars används place.abstract. Om inget av dem finns, skrivs "ingen beskrivning tillgänglig" ut
        if (place.text && place.text.trim() !== "") {
            shortDescription = place.text.trim();
        } else if (place.abstract && place.abstract.trim() !== "") {
            shortDescription = place.abstract.trim(); //om beskrivning inte finns
        } else {
            shortDescription = "Ingen beskrivning tillgänglig";
        }

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "...Läs mer"
        if (shortDescription.length > 100) {
            shortDescription = shortDescription.substring(0, 100).trim() + "... <i>Läs mer</i>";
        }

        let imgUrl = await fetchImages(place); //hämtar bilder via flickr från images.js

        div.innerHTML = "<img class='imgUrl' src='" + imgUrl + "' alt='" + place.name + "'><img src='photos/trash.svg' alt='ta bort favorit' class='heart' data-id='" + place.id + "'><h4 class='name'>" + place.name + "</h4><p class='city'>Stad: " + place.city + "</p><p class='price'>Pris: " + place.price_range + " kr</p>" + "<p class='description'>Beskrivning: " + shortDescription + "</p>"; //skriver ut infon i div-elementet

        const trash = div.querySelector(".heart"); //ikon för att ta bort favorit

        trash.addEventListener("pointerdown", function (e) {
            e.stopPropagation(); //stoppar eventuella andra eventlyssnare
            e.preventDefault(); //stoppar andra beteende

            remove = this.getAttribute("data-id"); //den som ska tas bort

            confirmRemove.classList.remove("hide"); //visar rutan för att bekräfta borttagningen
        });

        //förhindrar att informationssidan dyker upp när man klickar på soptunnan
        trash.addEventListener("click", (e) => {
            e.stopPropagation();
        })

        //använder click för att det ska funka att skrolla på touch
        div.addEventListener("click", function (e) {
            if (e.target.classList.contains("trash")) return; //om man klickar på soptunnan avbryts funktionen

            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "product.html";
        });

        favoriteDiv.appendChild(div); //lägger div i favoriteDiv

    }

}

