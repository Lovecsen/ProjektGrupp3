
let map; //objekt för kartan
let marker; //objekt för markör på kartan

function init() {
    initMap("map");

}
window.addEventListener("load", init);

function initMap(id) {

    //nytt kartobjekt
    map = L.map(id).setView([57.353,15.601], 7);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    marker = L.marker([0, 0]).addTo(map); //ny markör

}