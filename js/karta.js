
let map; //objekt för kartan

function init() {
    initMap("map");
}
window.addEventListener("load", init);

function initMap(id) {

    //nytt kartobjekt
    map = L.map(id).setView([57.353,15.601], 6);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        minZoom: 5
    }).addTo(map);

}

function markerLocations(obj) {
    const marker = L.marker([obj.lat, obj.lng]).addTo(map); //ny markör med lat och lng för de olika objekten
    
    
    //gör så markern väntas in att bli renderad innan vi försökter få tag i DOM-elementet
    setTimeout(() => {
        const el = marker.getElement();
        if (!el) return;

        const smallInfo = document.createElement('div'); //div element för att visa info bredvid markörer
        smallInfo.classList.add("smallInfoDiv");
        smallInfo.innerHTML = "<h4>" + obj.name + "</h4><p>" + obj.description + "</p><p>" + obj.price_range + " kr</p>";
        document.body.appendChild(smallInfo);

        el.addEventListener('pointerenter', (e) => {
            const rect = el.getBoundingClientRect();
            smallInfo.style.left = rect.right + 10 + 'px';
            smallInfo.style.top = rect.top + 'px';
            smallInfo.style.display = 'block';
        });

        el.addEventListener('pointerleave', () => {
            smallInfo.style.display = 'none'
        });

        el.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            window.location.href = "produkt.html";
        });
    }, 0);

}

function nearLocations(obj) {

    map.setView([obj.lat, obj.lng], 10); //sätter kartan till objektets lat och lng oc zoomar in

    const marker = L.marker([obj.lat, obj.lng]).addTo(map); //ny markör med lat och lng för de olika objekten
    
}