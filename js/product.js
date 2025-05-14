// Globala variabler
const apiKey = "Tc9ZD2gK";
const storedPlace = localStorage.getItem("selectedPlace");
let productDetails;

function init() {
    productDetails = document.querySelector("#productDetails"); // hämta produkt-diven

    const placeId = localStorage.getItem("selectedPlaceId"); // hämta turistmålets id

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
        "<p><strong>Pris:</strong> " + product.price_range + " kr</p>" +
        "<p><strong>Beskrivning:</strong> " + product.abstract + "</p>";

    productDetails.appendChild(newProduct);

}
