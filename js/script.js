const myApiKey = "Tc9ZD2gK"; //API nyckel
let popularOutside; //div element för att hålla de populära turistmålen för utomhus
let popularInside; //div element för att hålla de populära turistmålen för inomhus

//initiering 
function init() {
    let outsideBtn = document.querySelector("#outsideBtn"); //knapp för att visa alla utomhus turistmål
    popularOutside = document.querySelector("#popularOutsideDiv"); //div element för att hålla de populära turistmålen för utomhus

    let insideBtn = document.querySelector("#insideBtn"); //knapp för att visa alla inomhus turistmål
    popularInside = document.querySelector("#popularInsideDiv"); //div element för att hålla de populära turistmålen för inomhus

    popularOutsideDestinations(); //anrop av funktion för att hämta utomhusdata från SMAPI
    popularInsideDestinations(); //anrop av funktion för att hämta inomhusdata från SMAPI
}
window.addEventListener("DOMContentLoaded", init);

//funktion för att hämta utomhusdata från SMAPI
async function popularOutsideDestinations() {

    let responseOutside = await fetch ("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&ids=2,3,6,40,822"); //Hämta data från SMAPI för id 2,3,6,40 och 822
 
    //om data kunde hämtas
    if (responseOutside.ok) {
        let dataOutside = await responseOutside.json(); //skapa json av datan
        
        responsePopularOutsideDestinations(dataOutside.payload); //anrop av funktion för att skriva ut datan på webbplatsen
    } else popularOutside.innerText = "Fel vid hämtning: " + responseOutside.status; //om data inte kunde hämtas

}

//skriver ut datan från SMAPI för populära utomhus turistmål
function responsePopularOutsideDestinations(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        const outside = jsonData[i]; //variabel för objektet i SMAPI
        const newDiv = document.createElement("div"); //nytt div element för SMAPI objektet
        newDiv.classList.add("smapiPopular"); //ny class för det nya div elementet

        newDiv.innerHTML = "<h4>" + outside.name + "</h4><p>Stad: " + outside.city + "</p><p>Pris: " + outside.price_range + " kr</p>"; //strukturen för informationen

        popularOutside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML
        
    }
}

//funktion för att hämta inomhusdata från SMAPI
async function popularInsideDestinations() {

    let responseInside = await fetch ("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&ids=433,541,618,621,694"); //Hämta data från SMAPI för id 433,541,618,621 och 694

    //om data kunde hämtas
    if (responseInside.ok) {
        let dataInside = await responseInside.json(); //skapa json av datan
        
        responsePopularInsideDestinations(dataInside.payload); //anrop av funktion för att skriva ut datan på webbplatsen
    } else popularInside.innerText = "Fel vid hämtning: " + responseInside.status; //om data inte kunde hämtas

}

//skriver ut datan från SMAPI för populära utomhus turistmål
function responsePopularInsideDestinations(jsonData) {

    for (let i = 0; i < jsonData.length; i++) {
        const inside = jsonData[i]; //variabel för objektet i SMAPI
        const newDiv = document.createElement("div"); //nytt div element för SMAPI objektet
        newDiv.classList.add("smapiPopular"); //ny class för det nya div elementet

        newDiv.innerHTML = "<h4>" + inside.name + "</h4><p>Stad: " + inside.city + "</p><p>Pris: " + inside.price_range + " kr</p>"; //strukturen för informationen

        popularInside.appendChild(newDiv); //lägger in det nya divelementet i det befintliga i HTML
        
    }
}