import { fetchImages } from './images.js'; //hämtar bilder från flickr via images.js
import { heart } from './heart.js'; //hämtar funktionen heart från heart.js filen
let resultElem; //element för att skriva ut turistmålen i resultatet
let answerElem; //element för meddelande när användaren får quizresultat
let allPlaces = []; //array för att hålla turistmålen som ska visas

function init() {
    //hämtar från localStorage
    const answer1 = localStorage.getItem("answer1");
    const answer2 = localStorage.getItem("answer2");
    const answer3 = localStorage.getItem("answer3");
    const answer4 = localStorage.getItem("answer4");

    getData(answer1, answer2, answer3, answer4);//anrop av getData

}
window.addEventListener("DOMContentLoaded", init)

//funktion för att hämta data från SMAPI
async function getData(answer1, answer2, answer3, answer4) {

    resultElem = document.querySelector("#destination"); //element för att hålla de nya div elementen för turistmålen
    answerElem = document.querySelector("#answer"); //p element som ska kunna ändras

    const myApiKey = "Tc9ZD2gK"; //API nyckel

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    //urlen för det som ska hämtas i smapi med värdena för svaren användaren gett
    let url = "https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions + "&type=" + answer3 + "&price_ranges=" + answer4;

    //om användaren svarade båda på första frågan läggs outdoors till urlen
    if (answer1 !== ".") url += "&outdoors=" + answer1;

    //om användaren svarade spelar ingen roll på andra frågan läggs child_discount till urlen
    if (answer2 !== ".") url += "&child_discount=" + answer2;

    try {
        const [smapiRes, jsonRes] = await Promise.all([
            await fetch(url), //hämtar från SMAPI med url
            fetch("json/destinations.json") //hämta från lokal json-fil
        ]);

        // Kontrollera att förfrågningarna lyckades 
        if (smapiRes.ok && jsonRes.ok) {
            //gör om svaren till json
            const smapiData = await smapiRes.json();
            const jsonData = await jsonRes.json();

            const priceRanges = answer4.split(",");
            //kontrollerar de valda filterna mot json
            const jsonFilter = jsonData.establishment.filter(place => {
                const typeMatch = answer3.includes(place.type);
                const priceMatch = priceRanges.includes(place.price_range);
                const outdoorsMatch = answer1 == "." || place.outdoors == answer1;
                const childMatch = answer2 == "." || place.child_discount == (answer2 == "Y");

                return typeMatch && priceMatch && outdoorsMatch && childMatch;
            });

            allPlaces = smapiData.payload.concat(jsonFilter); // slår ihop båda listorna

            //körs endast om man är i quizresultat
            if (window.location.pathname.includes("quizresult.html")) {
                 //om det inte finns något som matchas med svaren i smapi
                if (!allPlaces || allPlaces.length == 0) {
                answerElem.innerHTML = "<p>Inga resultat matchade dina svar. Klicka <a href='index.html'>här</a> för att kommer tillbaka till startsidan." + "<p>Vill du kolla på alla resmål, klicka <a href='listsida.html'>här</a> .";
                return;
           }
        }
        showResult(allPlaces); // skicka vidare till funktion showPlaces
        }
    } catch (error) {
        resultElem.innerText = "Fel vid hämtning: " + error.message;
    }
}

//visar resultaten på sidan
async function showResult(result) {
    //körs endast om man är i quizresultat
    if (window.location.pathname.includes("quizresult.html")) {
        for (let i = 0; i < result.length; i++) {
            const place = result[i]; //aktuellt turistmål

            markerLocations(place); //lägger till pin på kartan

            const newDiv = document.createElement("div"); //skapa nytt div-element för turistmålet
            newDiv.classList.add("smapiPlace"); //lägg till en class

            let shortDescription = ""; //tom sträng för att hålla breskrivning

            //om place.text finns används detta, annars används place.abstract. Om inget av dem finns, skrivs "ingen beskrivning tillgänglig" ut
            if (place.text && place.text.trim() !== "") {
                shortDescription = place.text.trim();
            } else if (place.abstract && place.abstract.trim() !== "") {
                shortDescription = place.abstract.trim(); //om beskrivning inte finns
            } else {
                shortDescription = "Ingen beskrivning tillgänglig";
            }

            // Om beskrivningen är längre än 100 tecken, kapa och lägg till "...Läs mer"
            if (shortDescription.length > 100) {
                shortDescription = shortDescription.substring(0, 100).trim() + "... <i>Läs mer</i>";
            }

            let imgUrl = await fetchImages(place); //hämtar bilder via flickr från images.js

            newDiv.innerHTML = "<img class='imgUrl' src='" + imgUrl + "' alt='" + place.name + "'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' data-id='" + place.id + "'><h4 class='name'>" + place.name + "</h4><p class='city'>Stad: " + place.city + "</p><p class='price'>Pris: " + place.price_range + " kr</p>" + "<p class='description'>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

            //användaren klickar på ett turistmål
            newDiv.addEventListener("pointerdown", function () {
                localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

                // Navigera till produkt.html
                window.location.href = "product.html";
            });

            resultElem.appendChild(newDiv); //lägg till det nya div-elementet i det tomma div-elementet i HTML

            heart(newDiv); //anropar heart för favoritfunktionen
        }
    }
}
