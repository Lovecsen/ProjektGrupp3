//Globala variabler
const myApiKey = "Tc9ZD2gK"; //API nyckel
let placeContainer; //div element för att hålla temaparker
let allPlaces = []; //array för alla platser

function init() {
    placeContainer = document.querySelector("#placeContainer");
    getData();
}
window.addEventListener("DOMContentLoaded", init);

async function getData() {
    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions);

    if (response.ok) {
        let data = await response.json();
        showPlaces(data.payload); // vi kallar nu på funktionen med ett annat namn
    } else {
        placeContainer.innerText = "Fel vid hämtning: " + response.status;
    }
}

function showPlaces(places) {
    placeContainer.innerHTML = ""; // rensar innehållet först

    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const newDiv = document.createElement("div");
        newDiv.classList.add("smapiPlace");

        newDiv.innerHTML = "<h4>" + place.name + "</h4><p>Stad: " + place.city + "</p><p>Pris: " + place.price_range + " kr</p>";

        placeContainer.appendChild(newDiv);
    }
}
