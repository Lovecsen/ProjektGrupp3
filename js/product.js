import { fetchImages } from './images.js';
import { heart } from './heart.js';
// Globala variabler
const apiKey = "Tc9ZD2gK";
//const storedPlace = localStorage.getItem("selectedPlace");
let productDetails;
let reviewsDiv;
const placeId = localStorage.getItem("selectedPlaceId"); // hämta turistmålets id
let nearDiv;

function init() {
    console.log("placeId från localStorage:", placeId);

    productDetails = document.querySelector("#productDetails"); // hämta produkt-diven

    reviewsDiv = document.querySelector("#reviewsDiv"); // hämta recensioner-diven

    nearDiv = document.querySelector("#near");

    getProductDetails(placeId);

}
window.addEventListener("DOMContentLoaded", init);

// Funktion som hämtar turistmålets info från SMAPI
async function getProductDetails(placeId) {
    const response = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getall&ids=" + placeId);

    if (response.ok) {
        let data = await response.json();
        const product = data.payload[0];
        showProductDetails(data.payload[0]); //eftrsom vi anger ett exakt id får vi bara ett svar och kan skriva index 0 istället för att göra en for loop
    }
    else {
        productDetails.innerText = "Fel vid hämtning: " + response.status; //felmeddelande 
    }
}

function showProductDetails(product) {
    const newProduct = document.createElement("div"); //skapa nytt div-element för turistmålet
    newProduct.classList.add("smapiProduct"); //lägg till en class
    markerLocations(product);

    //Om ingen beskrivning finns skrivs "Ingen beskrivning tillgänglig" ut
    let description = product.abstract;
    if (product.abstract == "") {
        description = "Ingen beskrivning tillgänglig";
    }

    newProduct.innerHTML =
        "<h2>" + product.name + "</h2>" +
        "<p><strong>Stad:</strong> " + product.city + "</p>" +
        "<p><strong>Pris:</strong> " + product.price_range + " kr</p>" + "<p><strong>Webbplats:</strong> <a href='" + product.website + "'>" + product.website + "</a>" +
        "<p><strong>Beskrivning:</strong> " + description + "</p>";

    productDetails.appendChild(newProduct);

    getReviews(placeId);
    getNear(product);
}

async function getReviews(placeId) {
    const responseReviews = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getreviews&id=" + placeId)

    if (responseReviews.ok) {
        let dataReviews = await responseReviews.json();
        const reviews = dataReviews.payload;

        //om det inte finns recensioner, skriv ut "Inga recensioner tilgängliga"
        if (reviews == "") {
            reviewsDiv.innerHTML = "<p>Inga recensioner tillgängliga</p>"
            return
        }

        for (let i = 0; i < reviews.length; i++) {
            showReviews(reviews[i]);
        }
    }
}

function showReviews(reviews) {
    const newReview = document.createElement("div"); //skapa nytt div-element för recensionerna
    newReview.classList.add("smapiReviews"); //lägg till en class

    newReview.innerHTML =
        "<p><strong>" + reviews.name + "</strong></p>" +
        "<p>" + reviews.comment + "</p>" + "<p><i>" + reviews.relative_time + "</i></p>";


    reviewsDiv.appendChild(newReview);

}

async function getNear(product) {

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    const responseNearAct = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=activity&method=getfromlatlng&descriptions=" + descriptions + "&lat=" + product.lat + "&lng=" + product.lng + "&radius=100&order_by=distance_in_km&sort_in=ASC");

    const responseNearAtt = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=attraction&method=getfromlatlng&descriptions=" + descriptions + "&lat=" + product.lat + "&lng=" + product.lng + "&radius=100&order_by=distance_in_km&sort_in=ASC");

    let bothActAtt = [];

    if (responseNearAct.ok) {
        let dataAct = await responseNearAct.json();

        const nearAct = dataAct.payload.filter(item => item.id !== product.id);
        bothActAtt = bothActAtt.concat(nearAct);
    }

    if (responseNearAtt.ok) {
        let dataAtt = await responseNearAtt.json();
        const nearAtt = dataAtt.payload.filter(item => item.id !== product.id);
        bothActAtt = bothActAtt.concat(nearAtt);
    }

    //sortera efter avstånd
    bothActAtt.sort((a, b) => a.distance_in_km - b.distance_in_km);

    const nearest = bothActAtt.slice(0, 3);

    const ids = nearest.map(item => item.id).join(",");

    const responseNear = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getall&ids=" + ids);

    const dataNear = await responseNear.json();
    const establishment = dataNear.payload;

    for (const near of establishment) {
        await showNear(near);
    }
}

async function showNear(near) {
    const newNear = document.createElement("div"); //skapa nytt div-element för recensionerna
    newNear.classList.add("smapiPopular"); //lägg till en class

    let imgUrl = await fetchImages(near);

    newNear.innerHTML =
        "<img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + near.id + "'><h3>" + near.name + "</h3><img src='" + imgUrl + "' alt='" + near.name + "'><h4>Stad: " + near.city + "</h4><p>Pris: " + near.price_range + " kr</p>"; //strukturen för informationen

        newNear.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", near.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

    nearDiv.appendChild(newNear);

    let nearMarkersBtn = document.querySelector("#nearMarkers");
    nearMarkersBtn.addEventListener("pointerdown", () => {
        nearLocations(near);
    });

    heart(newNear);

}
