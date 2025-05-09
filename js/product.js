// Globala variabler
const apiKey = "Tc9ZD2gK";
const storedPlace = localStorage.getItem("selectedPlace");
let productDetailsDiv; 

function init() {
    productDetailsDiv = document.querySelector("#productDetails"); // hämta produkt-diven

    const placeId = localStorage.getItem("selectedPlaceId"); // hämta turistmålets id

    if (placeId) {
        getProductDetails(placeId); 
    } else {
        productDetailsDiv.innerText = "Ingen turistdestination vald.";
    }
}
window.addEventListener("DOMContentLoaded", init);

// Funktion som hämtar turistmålets info från SMAPI
async function getProductDetails(placeId) {
    const response = await fetch("https://smapi.lnu.se/api/?api_key=" + apiKey + "&controller=establishment&method=getbyid&id=" + placeId);

    if (response.ok) {
        const data = await response.json();
        const product = data.payload;
        showProductDetails(product);

    } else {
        productDetailsDiv.innerText = "Fel vid hämtning av turistmålet.";
    }
}

function showProductDetails(product) {
    productDetailsDiv.innerHTML =
        "<h2>" + product.name + "</h2>" +
        "<p><strong>Stad:</strong> " + product.city + "</p>" +
        "<p><strong>Pris:</strong> " + product.price_range + " kr</p>" +
        "<p><strong>Beskrivning:</strong> " + product.abstract + "</p>";
}
