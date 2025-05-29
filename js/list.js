import { fetchImages } from './images.js';
import { heart } from './heart.js';
//Globala variabler
const myApiKey = "Tc9ZD2gK"; //API nyckel
let placeContainer; //div element för att hålla temaparker
let allPlaces = []; //array för alla platser
let imgUrl; //urlen för den bild som ska visas
let dropdowns; //div för att hålla filteralternativen

async function init() {
    placeContainer = document.querySelector("#placeContainer"); //hämtar det tomma div-elementet i HTML
    await getData(); //anropa funktion getData

    const outdoorsFilter = localStorage.getItem("filterOutdoors"); //hämtar från localStorage
    dropdowns = document.querySelectorAll(".dropdownMenu"); //div för att hålla filteralternativen

    //detta filtrerar sidan efter om användaren klickat på "se alla utomhus" eller "se alla inomhus" knappen på första sidan
    if (outdoorsFilter == "Y") {
        const filtered = allPlaces.filter(place => place.outdoors == "Y"); //filtrera efter utomhus
        showPlaces(filtered);

        const input = document.querySelector("input[name='outdoors'][value='Y']"); //checkar boxen för utomhus i filter
        input.checked = true;
    } else if (outdoorsFilter == "N") {
        const filtered = allPlaces.filter(place => place.outdoors == "N"); //filtrera efter inomhus
        showPlaces(filtered);

        const input = document.querySelector("input[name='outdoors'][value='Y']"); //checkar boxen för inomhus i filter
        input.checked = true;
    }

    //eventlyssnare för knapparna för filtreringen
    document.querySelector("#categoryBtn").addEventListener("click", () => {
        toggleDropdown("category"); //ketegorifilter
    });
    document.querySelector("#priceBtn").addEventListener("click", () => {
        toggleDropdown("price"); //prisfilter
    });
    document.querySelector("#cityBtn").addEventListener("click", () => {
        toggleDropdown("city"); //stadfilter
    });
    document.querySelector("#outdoorsBtn").addEventListener("click", () => {
        toggleDropdown("outdoors"); //utomhusfilter
    });

    //rensar filter
    let clear = document.querySelector("#clear"); //rensa filter knapp
    clear.addEventListener("click", function () {
        localStorage.removeItem("filters"); //rensar localstorage
        getData();
    })


}
window.addEventListener("DOMContentLoaded", init);

//för att kunna klicka utanför knappen för att stänga dropdownen
document.addEventListener("click", (e) => {

    const isBtn = e.target.closest("button"); //knapp klickades på
    const isMenu = e.target.closest(".dropdownMenu"); //meny klickades på

    //om man inte klickat på knapp eller meny stängs alla öppna dropdowns
    if (!isBtn && !isMenu) {
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove("open"); //döljer den aktuella filterrutan
        }
    }
})

//funktion för dropdown menyerna i filtreringen
function toggleDropdown(id) {

    //visa eller dölja dropdown menyn
    for (let i = 0; i < dropdowns.length; i++) {
        if (dropdowns[i].id == id) {
            dropdowns[i].classList.toggle("open"); //visa filterrutan
        } else {
            dropdowns[i].classList.remove("open"); //dölj filterrutan
        }
    }

    //för att kunna stänga filterrutan med esc knappen
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            for (let i = 0; i < dropdowns.length; i++) {
                dropdowns[i].classList.remove("open"); //döljer filterrutan
            }
        }
    });
}

//funktion som hämtar data från SMAPI och lokal json-fil
async function getData() {

    const descriptions = "zipline,temapark,klippklättring,nöjespark,sevärdhet,museum,konstgalleri,glasbruk,slott,kyrka,hembygdspark,fornlämning,myrstack,naturreservat" //alla descriptions vi vill hämta

    try {
        const [smapiRes, jsonRes] = await Promise.all([
            fetch("https://smapi.lnu.se/api/?api_key=" + myApiKey + "&controller=establishment&method=getall&descriptions=" + descriptions), //skicka förfrågan tilll SMAPI
            fetch("json/destinations.json") //hämta från lokal json-fil
        ]);

        // Kontrollera att förfrågningarna lyckades 
        if (smapiRes.ok && jsonRes.ok) {

            //gör om svaren till json
            const smapiData = await smapiRes.json();
            const jsonData = await jsonRes.json();

            allPlaces = smapiData.payload.concat(jsonData.establishment); // slår ihop båda listorna

            filters(allPlaces); //skicka vidare till funktion filters
            showPlaces(allPlaces); // skicka vidare till funktion showPlaces
            restoreFilter(); //kontrollerar om det finns valda filter sedan innan

        }
    } catch (error) {
        placeContainer.innerText = "Fel vid hämtning: " + error.message; //felmeddelande om try går fel
    }
}

//sorterar de olika filtermöjligheterna
function filters(places) {
    //nya Set som ska fyllas med filterna
    const categories = new Set();
    const prices = new Set();
    const cities = new Set();
    const outdoors = new Set(["N", "Y"]);

    for (let i = 0; i < places.length; i++) {
        const place = places[i]; //aktuell
        if (place.description) categories.add(place.description); //valda filter läggs i categories
        if (place.price_range) prices.add(place.price_range); //valda filter läggs prices
        if (place.city) cities.add(place.city); //valda filter läggs i cities
        if (place.outdoors) outdoors.add(place.outdoors); //valda filter läggs i outdoors
    }

    //gör om till array och sortera alla filter efter bokstavsordning och anropa fill
    fill("category", Array.from(categories).sort());
    fill("price", Array.from(prices).sort((a, b) => {
        const aStart = parseInt(a.split("-")[0]);
        const bStart = parseInt(b.split("-"[0]));
        return aStart - bStart; //för att pris intervallerna ska vara i ordning
    }));
    fill("city", Array.from(cities).sort());

    //för att det ska skrivas ut inomhus och utomhus istället för N och Y i filtreringsrutan
    const outdoorsOptions = Array.from(outdoors).map(val => {
        return {
            value: val,
            label: val == "N" ? "Inomhus" :
                val == "Y" ? "Utomhus" : val
        }
    });
    fill("outdoors", outdoorsOptions);
}

//funktion för att filter ska finnas kvar om man kommer tillbaka till sidan eller laddar om
function restoreFilter() {
    let savedFilters = localStorage.getItem("filters"); //hämta filter från localstorage
    if (savedFilters) {
        let filter = JSON.parse(savedFilters); //omvandlar till js objekt
        //går igenom varje filtertyp
        for (let key in filter) {
            let values = filter[key]; //hämtar valda värden av de olika filterna
            for (let i = 0; i < values.length; i++) {
                let value = values[i];
                let input = document.querySelector("input[name='" + key + "'][value='" + value + "']"); //hittar de olika checkboxarna som har aktuellt key och value
                if (input) {
                    input.checked = true; //om det finns tidigare filter är input true
                }
            }
        }
        const filtered = filterPlaces(allPlaces, filter); //filtered innehåller de filter som ska tillämpas
        showPlaces(filtered); //anropar showplaces med filtered
    }
}

//skapar checkboxar för varje värde till dropdown menyn
function fill(id, items) {
    const container = document.getElementById(id); //div där filteralternativen ska vara
    container.innerHTML = ""; //rensar tidigare innehåll i dropdown-menyn

    for (let i = 0; i < items.length; i++) {
        const item = items[i]; //det aktuella setet med filter

        //för att ha stöd för både string och objekt eftersom vi behövde göra om N till inomhus och Y till utomhus
        const value = typeof item == "object" ? item.value : item;
        const labelText = typeof item == "object" ? item.label : item;

        //skapar nytt label element
        const label = document.createElement("label");
        label.classList.add("dropdown-item");

        //skapar nytt input element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = value;
        checkbox.name = id;
        checkbox.addEventListener("change", applyFilter);

        label.appendChild(checkbox); //lägger checkbox i label
        label.appendChild(document.createTextNode(" " + labelText));

        container.appendChild(label); //lägger label i container
    }
}

//hämtar alla valda checkbox-värden och skickar med till showPlaces för att visa resmålen
function applyFilter() {

    //objekt för att samla de filterval som gjorts
    const filters = {
        category: checkedValues("category"),
        price: checkedValues("price"),
        city: checkedValues("city"),
        outdoors: checkedValues("outdoors")
    };
    let theFilters = JSON.stringify(filters);
    localStorage.setItem("filters", theFilters); //lägger till i localstorage

    const filtered = filterPlaces(allPlaces, filters); //filtered innehåller de filter som ska tillämpas

    showPlaces(filtered); //anropar showplaces med filtered
}

//hämtar valda checkboxar 
function checkedValues(name) {
    const checkboxes = document.querySelectorAll("input[name='" + name + "']:checked"); //valda checkboxar

    return Array.from(checkboxes).map(checkbox => checkbox.value); //returnerar ikryssade checkboxar
}

//returnerar ny lista med värden för de olika filterna
function filterPlaces(places, filters) {

    //gå igenom varje place i listan places, returnerar ny lista med endast objekt som matchar villkoren
    return places.filter(place => {

        const matchCategory = filters.category.length == 0 || filters.category.includes(place.description); //ingen kategori vald eller om description finns med

        const matchPrice = filters.price.length == 0 || filters.price.includes(place.price_range); //om inget pris är valt eller om price_range finns med

        const matchCity = filters.city.length == 0 || filters.city.includes(place.city); //om ingen stad är vald eller om city finns med

        const matchOutdoors = filters.outdoors.length == 0 || filters.outdoors.includes(place.outdoors); //om varken utomhus eller inomhus är vald eller om outdoors finns med

        return matchCategory && matchPrice && matchCity && matchOutdoors;
    });
}

//funktion som skriver ut turistmålen på sidan
async function showPlaces(places) {

    placeContainer.innerHTML = ""; // rensar innehållet

    //rensar gamla markörer
    for (let i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
    markers = [];

    //loopa genom varje turistmål i listan
    for (let i = 0; i < places.length; i++) {
        const place = places[i]; //aktuellt turistmål
        markerLocations(place); //anrop av funktion i karta.js för markörer

        const newDiv = document.createElement("div"); //skapa nytt div-element för turistmålet
        newDiv.classList.add("smapiPlace"); //lägg till en class

        let shortDescription = ""; //tom sträng för att hålla breskrivning

        // Om beskrivningen är längre än 100 tecken, kapa och lägg till "...Läs mer"
        if (place.abstract == "") {
            shortDescription = "Ingen beskrivning tillgänglig"; //om beskrivning inte finns
        } else if (place.abstract.length > 100) {
            shortDescription = place.abstract.substring(0, 100).trim() + "... <i>Läs mer</i>";
        } else {
            shortDescription = place.abstract.trim(); //annars använd hela beskrivningen
        }

        newDiv.innerHTML = "<img id='img-" + place.id + "' src='photos/noimage.svg' alt='Laddar..' class='picture'><img src='photos/smallheart.svg' alt='favoritmarkering' class='heart' id='favorite' data-id='" + place.id + "'><h4 id='name'>" + place.name + "</h4><p id='city'>Stad: " + place.city + "</p><p id='price'>Pris: " + place.price_range + " kr</p>" + "<p id='description'>Beskrivning: " + shortDescription; //skriver ut infon i div-elementet

        newDiv.addEventListener("pointerdown", function () {
            localStorage.setItem("selectedPlaceId", place.id); // Spara turistmålets ID i localStorage

            // Navigera till produkt.html
            window.location.href = "produkt.html";
        });

        placeContainer.appendChild(newDiv); //lägg till det nya div-elementet i det tomma div-elementet i HTML

        //gör så bilderna från flickr hämtas i bakgrunden så allt från smapi hämtas först och filter kan funka direkt
        fetchImages(place).then((imgUrl) => {
            const imgElem = document.querySelector("#img-" + place.id);
            if (imgElem && imgUrl) {
                imgElem.src = imgUrl;
            }
        });
        heart(newDiv); //anropar heart för favoritfunktionen
    }
}
