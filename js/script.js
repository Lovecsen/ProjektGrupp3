import { fetchImages } from './images.js';
import { heart } from './heart.js';
const myApiKey = "Tc9ZD2gK"; //API nyckel
let popularOutside; //div element för att hålla de populära turistmålen för utomhus
let popularInside; //div element för att hålla de populära turistmålen för inomhus
let wrapperElemOutside;
let wrapperElemInside;
let dragged = null;
let currentIxOutside = 0;
let currentIxInside = 0;
let slideWidth;
const minDrag = 50;
let xStart = 0;

//initiering 
function init() {
    let outsideBtn = document.querySelector("#outsideBtn"); //knapp för att visa alla utomhus turistmål
    popularOutside = document.querySelector("#popularOutsideDiv #wrapperElem"); //div element för att hålla de populära turistmålen för utomhus
    wrapperElemOutside = document.querySelector("#wrapperElem");
    wrapperElemInside = document.querySelector("#wrapperElem2");


    let insideBtn = document.querySelector("#insideBtn"); //knapp för att visa alla inomhus turistmål
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
        let imgUrl = await fetchImages(outside);

        newDiv.innerHTML = "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + outside.id + "'><h3>" + outside.name + "</h3><img src='" + imgUrl + "' alt='" + outside.name + "'><h4>Stad: " + outside.city + "</h4><p>Pris: " + outside.price_range + " kr</p>"; //strukturen för informationen

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", outside.id); // Spara turistmålets ID i localStorage
            
            // Navigera till produkt.html
            window.location.href = "produkt.html";
            });


        popularOutside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML

        heart(newDiv);

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
        let imgUrl = await fetchImages(inside);

        newDiv.innerHTML = "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + inside.id + "'><h3>" + inside.name + "</h3><img src='" + imgUrl + "' alt='" + inside.name + "'><h4>Stad: " + inside.city + "</h4><p>Pris: " + inside.price_range + " kr</p>"; //strukturen för informationen
        

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", inside.id); // Spara turistmålets ID i localStorage
            
            // Navigera till produkt.html
            window.location.href = "produkt.html";
            });

        popularInside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML

        heart(newDiv);
    }
}