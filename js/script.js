import { fetchImages } from './images.js';
import { heart } from './heart.js';
const myApiKey = "Tc9ZD2gK"; //API nyckel
let popularOutside; //div element för att hålla de populära turistmålen för utomhus
let popularInside; //div element för att hålla de populära turistmålen för inomhus
let wrapperElemOutside; //här läggs alla utomhus turistmål
let wrapperElemInside; //här läggs alla inomhus turistmål

//initiering 
function init() {
    window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
            window.location.reload(); //laddar om sidan för att favoriterna ska uppdateras
        }
    })
    let outsideBtn = document.querySelector("#outsideBtn"); //knapp för att visa alla utomhus turistmål

    //eventlyssnare för "se alla utomhus"- knappen så användaren skickas vidare till en redan filtrerad listsida med bara utomhus
    outsideBtn.addEventListener("pointerdown", function () {
        clearAllFilters(); //rensar tidigare filter
        localStorage.setItem("filterOutdoors", "Y"); //sparar i localStorage
        window.location.href = "list.html";
    });

    popularOutside = document.querySelector("#popularOutsideDiv #wrapperElem"); //div element för att hålla de populära turistmålen för utomhus
    wrapperElemOutside = document.querySelector("#wrapperElem"); //här läggs alla utomhus turistmål
    wrapperElemInside = document.querySelector("#wrapperElem2");//här läggs alla inomhus turistmål

    let insideBtn = document.querySelector("#insideBtn"); //knapp för att visa alla inomhus turistmål

    //eventlyssnare för "se alla inomhus"- knappen så användaren skickas vidare till en redan filtrerad listsida med bara inomhus
    insideBtn.addEventListener("pointerdown", function () {
        clearAllFilters(); //rensar tidigare filter
        localStorage.setItem("filterOutdoors", "N");
        window.location.href = "list.html";
    })

    document.querySelector("#allBtn").addEventListener("pointerdown", () => {
        clearAllFilters(); //rensar tidigare filter
        localStorage.removeItem("filterOutdoors");
        window.location.href = "list.html";
    })

    popularInside = document.querySelector("#popularInsideDiv div"); //div element för att hålla de populära turistmålen för inomhus

    popularOutsideDestinations(); //anrop av funktion för att hämta utomhusdata från SMAPI
    popularInsideDestinations(); //anrop av funktion för att hämta inomhusdata från SMAPI
}
window.addEventListener("DOMContentLoaded", init);

//funktion för att hämta utomhusdata från SMAPI
async function popularOutsideDestinations() {

    let responseOutside = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&ids=2,3,6,40,822"); //Hämta data från SMAPI för id 2,3,6,40 och 822

    //om data kunde hämtas
    if (responseOutside.ok) {
        let dataOutside = await responseOutside.json(); //skapa json av datan

        responsePopularOutsideDestinations(dataOutside.payload); //anrop av funktion för att skriva ut datan på webbplatsen
    } else popularOutside.innerText = "Fel vid hämtning: " + responseOutside.status; //om data inte kunde hämtas
}

//skriver ut datan från SMAPI för populära utomhus turistmål
async function responsePopularOutsideDestinations(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        const outside = jsonData[i]; //variabel för objektet i SMAPI
        const newDiv = document.createElement("div"); //nytt div element för SMAPI objektet
        newDiv.classList.add("smapiPopular"); //ny class för det nya div elementet
        let imgUrl = await fetchImages(outside); //hämtar bilder via flickr från images.js

        newDiv.innerHTML = "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + outside.id + "'><h3 class='name'>" + outside.name + "</h3><img src='" + imgUrl + "' alt='" + outside.name + "'><h4>Stad: " + outside.city + "</h4><p>Pris: " + outside.price_range + " kr</p>"; //strukturen för informationen

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", outside.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "product.html";
        });

        popularOutside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML

        heart(newDiv); //anropar heart för favoritfunktionen
    }
}

//funktion för att hämta inomhusdata från SMAPI
async function popularInsideDestinations() {

    let responseInside = await fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&ids=433,541,618,621,694"); //Hämta data från SMAPI för id 433,541,618,621 och 694

    //om data kunde hämtas
    if (responseInside.ok) {
        let dataInside = await responseInside.json(); //skapa json av datan

        responsePopularInsideDestinations(dataInside.payload); //anrop av funktion för att skriva ut datan på webbplatsen
    } else popularInside.innerText = "Fel vid hämtning: " + responseInside.status; //om data inte kunde hämtas
}

//skriver ut datan från SMAPI för populära utomhus turistmål
async function responsePopularInsideDestinations(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        const inside = jsonData[i]; //variabel för objektet i SMAPI
        const newDiv = document.createElement("div"); //nytt div element för SMAPI objektet
        newDiv.classList.add("smapiPopular"); //ny class för det nya div elementet
        let imgUrl = await fetchImages(inside); //hämtar bilder via flickr från images.js

        newDiv.innerHTML = "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + inside.id + "'><h3 class='name'>" + inside.name + "</h3><img src='" + imgUrl + "' alt='" + inside.name + "'><h4>Stad: " + inside.city + "</h4><p>Pris: " + inside.price_range + " kr</p>"; //strukturen för informationen

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", inside.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "product.html";
        });

        popularInside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML

        heart(newDiv); //anropar heart för favoritfunktionen
    }
}

function clearAllFilters() {
    localStorage.removeItem("filterOutdoors");
    localStorage.removeItem("filters");
}