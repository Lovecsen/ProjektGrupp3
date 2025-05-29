
let map; //objekt för kartan
let markers = []; //array för att hålla markörerna

function init() {
    initMap("map"); //anropar initmap
}
window.addEventListener("load", init);

//funktion för kartan
function initMap(id) {
    //nytt kartobjekt
    map = L.map(id).setView([57.353, 15.601], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 5
    }).addTo(map);
}

//funktion för att visa markörer för alla turistmål
function markerLocations(obj) {

    let myIcon = L.icon({
        iconUrl: "photos/marker.svg",
        iconAnchor: [10, 40] 
    });
    let marker = L.marker([obj.lat, obj.lng], { icon: myIcon }).addTo(map); //ny markör med lat och lng för de olika objekten
    markers.push(marker); //lägger markörerna i arrayen

    smallInfo(marker, obj); //anropar smallInfo
}

//funktion för att visa markörer för närliggande turistmål
function nearLocations(obj) {

    let myIcon = L.icon({
        iconUrl: "photos/markernear.svg"
    }); //egen markör för att skilja på det aktuella turistmålet och de närliggande

    map.setView([obj.lat, obj.lng], 10); //sätter kartan till objektets lat och lng och zoomar in

    let marker = L.marker([obj.lat, obj.lng], { icon: myIcon }).addTo(map); //ny markör med lat och lng för de olika objekten

    smallInfo(marker, obj); //anrop smallInfo

}

//funktion för att visa små informationsrutor vid hover för markörerna
function smallInfo(marker, obj) {
    //gör så markern väntas in att bli renderad innan vi försökter få tag i DOM-elementet
    setTimeout(() => {
        const elem = marker.getElement(); //hämtar elementet kopplat till markören
        if (!elem) return; //om inte elem finns avbryts funktionen

        const smallInfo = document.createElement('div'); //div element för att visa info bredvid markörer
        smallInfo.classList.add("smallInfoDiv"); //lägg till klass

        smallInfo.innerHTML = "<h4>" + obj.name + "</h4><p>" + obj.description + "</p><p>" + obj.price_range + " kr</p>";

        document.body.appendChild(smallInfo); //lägger smallInfo i document.body så den kan visas vid markören

        elem.addEventListener('pointerenter', () => {
            const size = elem.getBoundingClientRect(); //hämtar position och storlek för elem
            //hur smallInfo ska visas
            smallInfo.style.left = size.right + 10 + 'px';
            smallInfo.style.top = size.top + 'px';
            smallInfo.style.display = 'block';
        });

        elem.addEventListener('pointerleave', () => {
            smallInfo.style.display = 'none' //dölj smallInfo
        });

        elem.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            localStorage.setItem("selectedPlaceId", obj.id); //spara i lokalStorage så den markör man klickas på är den information som visas på produktsidan
            window.location.href = "product.html";
        });
    }, 0);
}