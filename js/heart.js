export function heart(elem) {

    const heartPicture = elem.querySelector(".heart");

    if (!heartPicture) return;

    const placeId = heartPicture.dataset.id.toString(); //hämtar data-id och sparar i en sträng

    let favorites = JSON.parse(localStorage.getItem("favoriter")) || []; //hämta från localstorage

    //om favorit så är hjärtat rött
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
        e.stopPropagation();

        favorites = JSON.parse(localStorage.getItem("favoriter")) || [];
        

        if (!favorites.includes(placeId)) {
            favorites.push(placeId);
            heartPicture.src = "photos/smallredheart.svg";
            
        } else {
            favorites = favorites.filter(id => id !== placeId);
            heartPicture.src = "photos/smallheart.svg";
            
        }
        localStorage.setItem("favoriter", JSON.stringify(favorites));
    });
}