export function heart(elem) {

    let heartPicture = elem.querySelector(".heart"); //hjärtan bilden på varje turistmål

    if (!heartPicture) return; //om heartPicture inte finns avbryts funktionen

    const placeId = heartPicture.dataset.id.toString(); //hämtar data-id och sparar i en sträng
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []; //hämta från localstorage

    //om turistmålet är favorit så är hjärtat rött
    if (favorites.includes(placeId)) {
        heartPicture.src = "photos/smallredheart.svg";
    }

    //mus är i hjärtat blir det rött
    heartPicture.addEventListener("pointerenter", () => {
        if (!favorites.includes(placeId)) {
            heartPicture.src = "photos/smallredheart.svg";
        }
    });

    //mus lämnar hjärtat är det vitt
    heartPicture.addEventListener("pointerleave", () => {
        if (!favorites.includes(placeId)) {
            heartPicture.src = "photos/smallheart.svg";
        }
    });

    //klickar man på hjärtat blir det rött och sparas i localstorage
    heartPicture.addEventListener("pointerdown", (e) => {
        e.stopPropagation(); //stoppar eventuella andra eventlyssnare

        favorites = JSON.parse(localStorage.getItem("favorites")) || []; //hämta från localstorage

        //om turistmålet inte redan finns bland favoriter läggs den till och hjärtat blir rött, finns den redan tas den bort från localstorage och hjärtat blir vitt
        if (!favorites.includes(placeId)) {
            favorites.push(placeId);
            heartPicture.src = "photos/smallredheart.svg";
        } else {
            favorites = favorites.filter(id => id !== placeId);
            heartPicture.src = "photos/smallheart.svg";
        }
        localStorage.setItem("favorites", JSON.stringify(favorites)); //lägger till ändringar i localstorage
    });
    //förhindrar att informationssidan dyker upp när man klickar på hjärtat
    heartPicture.addEventListener("click", (e) => {
        e.stopPropagation();
    })
}