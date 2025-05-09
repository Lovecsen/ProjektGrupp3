
let map;
let marker;

function init() {
    initMap("map");

}
window.addEventListener("load", init);

function initMap(id) {
    map = L.map(id).setView([57.353,15.601], 7);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    marker = L.marker([0, 0]).addTo(map);

}