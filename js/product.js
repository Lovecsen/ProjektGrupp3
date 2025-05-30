import { fetchImages } from './images.js';
import { heart } from './heart.js';
// Globala variabler
const apiKey = "Tc9ZD2gK";
//const storedPlace = localStorage.getItem("selectedPlace");
let productDetails; //element för att hålla information från SMAPI
let reviewsDiv; //element för att hålla recensionerna
const placeId = localStorage.getItem("selectedPlaceId"); // hämta turistmålets id
let nearDiv; //element för att hålla närliggande turistmål

function init() {

    productDetails = document.querySelector("#productDetails"); // hämta produkt-diven
    reviewsDiv = document.querySelector("#reviewsDiv"); // hämta recensioner-diven
    nearDiv = document.querySelector("#near"); //hämta nära turistmål-diven

    getProductDetails(placeId); //anropar getProductDetails med turistmål från localStorage

}
window.addEventListener("DOMContentLoaded", init);

// Funktion som hämtar turistmålets info från SMAPI
async function getProductDetails(placeId) {

    try {
        const [smapiRes, jsonRes] = await Promise.all([
            fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getall&ids=" + placeId), //hämta turistmålet från SMAPI
            fetch("json/destinations.json") //hämta från lokal json-fil
        ]);

        // Kontrollera att förfrågningarna lyckades
        if (smapiRes.ok && jsonRes.ok) {

            //gör om svaren till json
            const smapiData = await smapiRes.json(); 
            const jsonData = await jsonRes.json();

            const allPlaces = [
                ...(smapiData.payload || []),
                ...(jsonData.establishment || [])
            ];  // slår ihop båda 

            const product = allPlaces.find(p => p.id == placeId); //hitta id:t för turistmålet som ska

            if (product) {
            showProductDetails(product); 
            } else {
                productDetails.innerText = "Turistmål hittades inte.";
            }
        } else {
            productDetails.innerText = "Fel vid hämtning: " + smapiRes.status + "," + jsonRes.status; //felmeddelande 
        }
    } catch (error) {
        productDetails.innerText = "Ett fel uppstod " + error.message;
    }
}

//visa informationen på sidan
async function showProductDetails(product) {
    const newProduct = document.createElement("div"); //skapa nytt div-element för turistmålet
    newProduct.classList.add("smapiProduct"); //lägg till en class
    markerLocations(product); //anrop av funktion i karta.js för markörer

    //Om ingen beskrivning finns skrivs "Ingen beskrivning tillgänglig" ut, annars är description text från SMAPI, finns inte text är det abstract
    let description = "";
    if (product.text && product.text.trim() !== "") {
        description = product.text.trim();
    } else if (product.abstract && product.abstract.trim() !== "") {
        description = product.abstract.trim();
    } else {
        description = "Ingen beskrivning tillgänglig";
    }

    let imgUrl = await fetchImages(product); //hämtar bilder via flickr från images.js
    //skriver ut infon i div-elementet
    newProduct.innerHTML =
        "<h2 id='header'>" + product.name + "</h2><img src='" + imgUrl + "' alt='" + product.name + "' id='productImage'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' id='favorite' data-id='" + product.id + "'><p id='city'><strong>Stad:</strong> " + product.city + "</p>" +
        "<p id='price'><strong>Pris:</strong> " + product.price_range + " kr</p>" + "<p id='website'><strong>Webbplats:</strong> <a href='" + product.website + "'>" + product.website + "</a>" +
        "<p id='description'><strong>Beskrivning:</strong> " + description + "</p>";

    productDetails.appendChild(newProduct); //lägger newProduct i favoriteDiv

    getReviews(placeId); //anrop för att få recensioner
    getNear(product); //anrop för att få närliggande turistmål
    heart(newProduct); //anropar heart för favoritfunktionen

}

//funktion för att hämta recensioner
async function getReviews(placeId) {
    const responseReviews = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getreviews&id=" + placeId); //hämta recensioner från SMAPI

    if (responseReviews.ok) {
        const dataReviews = await responseReviews.json(); //inväntar svaret från SMAPI
        const reviews = dataReviews.payload; //payloaf egenskap

        //om det inte finns recensioner, skriv ut "Inga recensioner tilgängliga" och avbryt funktionen
        if (reviews == "") {
            reviewsDiv.innerHTML = "<p>Inga recensioner tillgängliga</p>"
            return;
        }

        for (let i = 0; i < reviews.length; i++) {
            showReviews(reviews[i]);
        }
    }
}

//funktion för att visa recensionerna
function showReviews(reviews) {
    const newReview = document.createElement("div"); //skapa nytt div-element för recensionerna
    newReview.classList.add("smapiReviews"); //lägg till en class

    newReview.innerHTML =
        "<p><strong>" + reviews.name + "</strong></p>" +
        "<p>" + reviews.comment + "</p>" + "<p><i>" + reviews.relative_time + "</i></p>"; //skriver ut infon i div elementet

    reviewsDiv.appendChild(newReview); //läger newReview i reviewsDiv
}

//funktion för att hämta närliggande resmål
async function getNear(product) {

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat,älgpark" //alla descriptions vi vill hämta

    const responseNearAct = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=activity&method=getfromlatlng&descriptions=" + descriptions + "&lat=" + product.lat + "&lng=" + product.lng + "&radius=100&order_by=distance_in_km&sort_in=ASC"); //hämtar aktiviteter med resmålets lat och lng

    const responseNearAtt = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=attraction&method=getfromlatlng&descriptions=" + descriptions + "&lat=" + product.lat + "&lng=" + product.lng + "&radius=100&order_by=distance_in_km&sort_in=ASC"); //hämtar sevärdheter med resmålets lat och lng

    let bothActAtt = []; //array för att hålla aktiviteterna och sevärdheterna

    if (responseNearAct.ok) {
        let dataAct = await responseNearAct.json(); //inväntar svar från SMAPI

        let nearAct = dataAct.payload.filter(item => item.id !== product.id); //tar bort det aktuella turistmålet för att inte visa den bland närliggande turistmål
        bothActAtt.push(...nearAct); //lägger till objekt i arrayen
    }

    if (responseNearAtt.ok) {
        let dataAtt = await responseNearAtt.json(); //inväntar svar från SMAPI

        let nearAtt = dataAtt.payload.filter(item => item.id !== product.id); //tar bort det aktuella turistmålet för att inte visa den bland närliggande turistmål
        bothActAtt.push(...nearAtt); //lägger till objekt i arrayen
    }

    //sortera efter avstånd
    bothActAtt.sort((a, b) => a.distance_in_km - b.distance_in_km);

    const nearest = bothActAtt.slice(0, 3); //korta ner till endast 3 resmål

    const ids = nearest.map(item => item.id).join(","); //idn till sträng med , emellan för att separera resmålens idn

    const responseNear = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getall&ids=" + ids); //hämta närliggande från SMAPI

    const dataNear = await responseNear.json(); //inväntar svar från SMAPI
    const establishment = dataNear.payload; //payload egenskap

    for (let i = 0; i < establishment.length; i++) {
        await showNear(establishment[i]); //anropa showNear
    }
}

//funktion för att skriva ut närliggande turistmål
async function showNear(near) {
    const newNear = document.createElement("div"); //skapa nytt div-element för recensionerna
    newNear.classList.add("smapiPopular"); //lägg till en class

    let imgUrl = await fetchImages(near); //hämtar bilder via flickr från images.js

    newNear.innerHTML =
        "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + near.id + "'><h3>" + near.name + "</h3><img src='" + imgUrl + "' alt='" + near.name + "'><h4>Stad: " + near.city + "</h4><p>Pris: " + near.price_range + " kr</p>"; //strukturen för informationen

    newNear.addEventListener("pointerdown", function () {
        localStorage.setItem("selectedPlaceId", near.id); // Spara turistmålets ID i localStorage

        // Navigera till produkt.html
        window.location.href = "product.html";
    });

    nearDiv.appendChild(newNear); //lägger newNear i nearDiv

    let nearMarkersBtn = document.querySelector("#nearMarkers"); //"se närligande turistmål på kartan"-knappen
    nearMarkersBtn.addEventListener("pointerdown", () => {
        nearLocations(near); //anropar nearLocations i karta.js för att sätta ut markörer för närliggande turistmål
    });

    heart(newNear); //anropar heart för favoritfunktionen
}
