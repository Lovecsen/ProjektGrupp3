const myApiKey = "Tc9ZD2gK";
let popularOutside;

function init() {
    let popularBtn = document.querySelector("#popularBtn");
    popularOutside = document.querySelector("#popularOutsideDiv");

    console.log("popularOutside hittad:", popularOutside);
    popularOutsideDestinations();
}
window.addEventListener("DOMContentLoaded", init);

async function popularOutsideDestinations() {

    let responseOutside = await fetch ("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&ids=2,3,6,40,822");

    if (responseOutside.ok) {
        let dataOutside = await responseOutside.json();
        console.log("Data hämtad:", dataOutside);
        responsePopularOutsideDestinations(dataOutside.payload);
    } else popularOutside.innerText = "Fel vid hämtning: " + responseOutside.status;

}

function responsePopularOutsideDestinations(jsonData) {

    popularOutside.innerHTML = "";

    for (let i = 0; i < jsonData.length; i++) {
        const outside = jsonData[i];
        const newDiv = document.createElement("div");
        newDiv.classList.add("smapiPopular");

        newDiv.innerHTML = "<h4>" + outside.name + "</h4><p>Stad: " + outside.city + "</p><p>Pris: " + outside.price_range + " kr</p>";

        popularOutside.appendChild(newDiv);
        
    }

}