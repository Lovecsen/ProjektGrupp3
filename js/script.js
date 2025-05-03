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
        responsePopularOutsideDestinations(dataOutside);
    }

}

function responsePopularOutsideDestinations(jsonData) {

    popularOutside.innerHTML = "";

    for (let i = 0; i < jsonData.length; i++) {
        const outside = jsonData[i];
        const newDiv = document.createElement("div");
        
        newDiv.innerHTML = "<p>namn: " + outside.name + "</p>";

        popularOutside.appendChild(newDiv);
        
    }

}