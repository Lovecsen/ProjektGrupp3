// Globala variabler
const apiKey = "Tc9ZD2gK";
//const storedPlace = localStorage.getItem("selectedPlace");
let productDetails;
let reviewsDiv;
const placeId = localStorage.getItem("selectedPlaceId"); // hämta turistmålets id

function init() {
    console.log("placeId från localStorage:", placeId);

    productDetails = document.querySelector("#productDetails"); // hämta produkt-diven

    reviewsDiv = document.querySelector("#reviewsDiv"); // hämta recensioner-diven

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

    newProduct.innerHTML =
        "<h2>" + product.name + "</h2>" +
        "<p><strong>Stad:</strong> " + product.city + "</p>" +
        "<p><strong>Pris:</strong> " + product.price_range + " kr</p>" + "<p><strong>Webbplats:</strong> <a href='" + product.website + "'>" + product.website + "</a>" +
        "<p><strong>Beskrivning:</strong> " + product.abstract + "</p>";

    productDetails.appendChild(newProduct);

    getReviews(placeId);
}

async function getReviews(placeId) {
    const responseReviews = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getreviews&id=" + placeId)

    if (responseReviews.ok) {
        let dataReviews = await responseReviews.json();
        const reviews = dataReviews.payload;

        for (let i = 0; i < reviews.length; i++) {
            showReviews(reviews[i]);
        }
    }
    else {
        reviewsDiv.innerText = "Fel vid hämtning: " + responseReviews.status; //felmeddelande 
    }
}

function showReviews(reviews) {
    const newReview = document.createElement("div"); //skapa nytt div-element för recensionerna
    newReview.classList.add("smapiReviews"); //lägg till en class

    newReview.innerHTML =
        "<p><strong>" + reviews.name + "</strong></p>" +
        "<p>" + reviews.comment + "</p>" + "<p><i>" + reviews.relative_time + "</i></p>";
    console.log(newReview)

    reviewsDiv.appendChild(newReview);
}
