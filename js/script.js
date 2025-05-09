const myApiKey = "Tc9ZD2gK"; //API nyckel
let popularOutside; //div element för att hålla de populära turistmålen för utomhus
let popularInside; //div element för att hålla de populära turistmålen för inomhus
let wrapperElemOutside;
let currentIx = 0;
let slideWidth;
const minDrag = 50;
let xStart = 0;

//initiering 
function init() {
    let outsideBtn = document.querySelector("#outsideBtn"); //knapp för att visa alla utomhus turistmål
    popularOutside = document.querySelector("#popularOutsideDiv #wrapperElem"); //div element för att hålla de populära turistmålen för utomhus
    wrapperElemOutside = document.querySelector("#wrapperElem");


    let insideBtn = document.querySelector("#insideBtn"); //knapp för att visa alla inomhus turistmål
    popularInside = document.querySelector("#popularInsideDiv div"); //div element för att hålla de populära turistmålen för inomhus

    wrapperElemOutside.addEventListener("pointerdown", dragStart);

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

function showSlide() {
    slideWidth = wrapperElemOutside.querySelector(".smapiPopular").offsetWidth; 
    wrapperElemOutside.style.transitionDuration = "0.3s";
    wrapperElemOutside.style.transform = "translateX(" + (-currentIx * slideWidth) + "px)";
}

function dragStart(e) {
    if (!e.isPrimary) return;
    e.preventDefault();
    xStart = e.pageX;

    wrapperElemOutside.style.transitionDuration ="0s";

    document.addEventListener("pointermove", dragMove);
    document.addEventListener("pointerup", dragEnd);
    document.addEventListener("pointercancel", dragEnd);
}

function dragMove(e) {
    if (!e.isPrimary) return;
    let deltaX = e.pageX - xStart;
    wrapperElemOutside.style.transform = "translateX(" + (deltaX - currentIx * slideWidth) + "px)";
}

function dragEnd(e) {
    if (!e.isPrimary) return;

    let deltaX = e.pageX - xStart;

    if (deltaX > minDrag && currentIx > 0) {
        currentIx--;
    } else if (deltaX < -minDrag && currentIx < wrapperElemOutside.children.length - 1) {
        currentIx++;
    }
    showSlide();

    document.removeEventListener("pointermove", dragMove);
    document.removeEventListener("pointerup", dragEnd);
    document.removeEventListener("pointercancel", dragEnd);
}