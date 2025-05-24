import { fetchImages } from './images.js';
import { heart } from './heart.js';
//Globala variabler
const myApiKey = "Tc9ZD2gK"; //API nyckel
let placeContainer; //div element för att hålla temaparker
let allPlaces = []; //array för alla platser
let imgUrl; //urlen för den bild som ska visas

async function init() {
    placeContainer = document.querySelector("#placeContainer"); //hämtar det tomma div-elementet i HTML
    await getData(); //anropa funktion getData

    //eventlyssnare för knapparna för filtreringen
    document.querySelector("#categoryBtn").addEventListener("click", () => {
        toggleDropdown("category");
    });
    document.querySelector("#priceBtn").addEventListener("click", () => {
        toggleDropdown("price");
    });
    document.querySelector("#cityBtn").addEventListener("click", () => {
        toggleDropdown("city");
    });
    
}
window.addEventListener("DOMContentLoaded", init);

//för att kunna klicka utanför knappen för att stänga dropdownen
document.addEventListener("click", (e) => {
    const dropdowns = document.querySelectorAll(".dropdownMenu");
    const isBtn = e.target.closest("button");
    const isMenu = e.target.closest(".dropdownMenu");

    if (!isBtn && ! isMenu) {
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("open");
        }
    }
})

//funktion för dropdown menyerna i filtreringen
function toggleDropdown(id) {
    let menu = document.querySelectorAll(".dropdownMenu");

    for (let i = 0; i < menu.length; i++) {
        if (menu[i].id == id ) {
            menu[i].classList.toggle("open");
        } else {
            menu[i].classList.remove("open");
        }
    }
}

//funktion som hämtar data från SMAPI
async function getData() {
    
    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    let response = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions); //skicka förfrågan tilll SMAPI

    if (response.ok) {
        let data = await response.json();
        allPlaces = data.payload;

        filters(allPlaces);
        showPlaces(allPlaces); // skicka vidare till funktion showPlaces
    } else {
        placeContainer.innerText = "Fel vid hämtning: " + response.status; //felmeddelande 
}
}

function filters(places) {
    const categories = new Set();
    const prices = new Set();
    const cities = new Set();

    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        if (place.description) categories.add(place.description);
        if (place.price_range) prices.add(place.price_range);
        if (place.city) cities.add(place.city);
    }

    fill("category", Array.from(categories).sort());
    fill("price", Array.from(prices).sort((a, b) => a-b));
    fill("city", Array.from(cities).sort());
}

function fill(id, items) {
    const container = document.getElementById(id);
    container.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        const label = document.createElement("label");
        label.classList.add("dropdown-item");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = item;
        checkbox.name = id;
        checkbox.addEventListener("change", applyFilter);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + item));

        container.appendChild(label);

       
    }
}

function applyFilter() {

    const filters = {
        categories: checkedValues("category"),
        prices: checkedValues("price"),
        cities: checkedValues("city")
    }; 

    const filtered = filterPlaces(allPlaces, filters);

    showPlaces(filtered);
    
}

function checkedValues(name) {
    const checkboxes = document.querySelectorAll("input[name='" + name + "']:checked");

    return Array.from(checkboxes).map(checkbox => checkbox.value);
}

function filterPlaces(places, filters) {

    return places.filter(place => {

        const matchCategory = filters.categories.length == 0 || filters.categories.includes(place.description);

        const matchPrice = filters.prices.length == 0 || filters.prices.includes(place.price_range);

        const matchCity = filters.cities.length == 0 || filters.cities.includes(place.city);

        return matchCategory && matchPrice && matchCity;
    });
}
//funktion som skriver ut turistmålen på sidan
async function showPlaces(places) {
    placeContainer.innerHTML = ""; // rensar innehållet

    //loopa genom varje turistmål i listan
    for (let i = 0; i < places.length; i++) {
        const place = places[i]; //aktuellt turistmål
        markerLocations(place);

        const newDiv = document.createElement("div"); //skapa nytt div-element för turistmålet
        newDiv.classList.add("smapiPlace"); //lägg till en class

        let shortDescription = "";

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "..."
        if (place.abstract == "") {
            shortDescription = "Ingen beskrivning tillgänglig";
        } else if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "... <i>Läs mer</i>";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        newDiv.innerHTML = "<img id='img-" + place.id + "' src='photos/noimage.jpg' alt='Laddar..' class='picture'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

        placeContainer.appendChild(newDiv); //lägg till det nya div-elementet i det tomma div-elementet i HTML

        //gör så bilderna från flickr hämtas i bakgrunden så allt från smapi hämtas först och filter kan funka direkt
        fetchImages(place).then((imgUrl) => {
            const imgElem = document.querySelector("#img-" + place.id);
            if (imgElem && imgUrl) {
                imgElem.src = imgUrl;
            }

        });
         
        heart(newDiv);
    }

}
