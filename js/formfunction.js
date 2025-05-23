import { fetchImages } from './images.js';
import { heart } from './heart.js';
let resultElem;

//tar med svaren från föregående sida med localstorage
window.addEventListener("DOMContentLoaded", () => {
    const answer1 = localStorage.getItem("answer1");
    const answer2 = localStorage.getItem("answer2");
    const answer3 = localStorage.getItem("answer3");
    const answer4 = localStorage.getItem("answer4");

    getData(answer1, answer2, answer3, answer4);
    
});

async function getData(answer1, answer2, answer3, answer4) {
    
    resultElem = document.querySelector("#destination"); //element för att hålla de nya div elementen för turistmålen

    let myApiKey = "Tc9ZD2gK";

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    //urlen för det som ska hämtas i smapi med värdena för svaren användaren gett
    let url = "https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions + "&type=" + answer3 + "&price_ranges=" + answer4;

    //om användaren svarade båda på första frågan läggs en till sträng till urlen
    if (answer1 !== ".") url += "&outdoors=" + answer1;
    
    //om användaren svarade spelar ingen roll på andra frågan läggs en till sträng till urlen
    if (answer2 !== ".") url += "&child_discount=" + answer2;

    let response = await fetch(url);
   
    let data = await response.json();

    if (window.location.pathname.includes("quizresultat.html")) {
    //om det inte finns något som matchas med svaren i smapi
    if (!data.payload || data.payload.length == 0) {
        resultElem.innerText = "Inga resultat matchade dina svar";
        return;
    }
    }
 
    showResult(data.payload); // skicka vidare till funktion showPlaces

    //rensar svaren från localstorage
    localStorage.removeItem("answer1");
    localStorage.removeItem("answer2");
    localStorage.removeItem("answer3");
    localStorage.removeItem("answer4");
}


async function showResult(result) {
if (window.location.pathname.includes("quizresultat.html")) {
    for (let i = 0; i < result.length; i++) {
        const place = result[i]; //aktuellt turistmål

        markerLocations(place); //lägger till pin på kartan

        const newDiv = document.createElement("div"); //skapa nytt div-element för turistmålet

        newDiv.classList.add("smapiPlace"); //lägg till en class

        let shortDescription = ""; //kort beskrivning som ska visas

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "..."
        if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "...";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        let imgUrl = await fetchImages(place);

        newDiv.innerHTML = "<img id='imgUrl' src='" + imgUrl + "' alt='" + place.name + "' class='picture'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

        resultElem.appendChild(newDiv); //lägg till det nya div-elementet i det tomma div-elementet i HTML

        heart(newDiv);
    }
}
}
