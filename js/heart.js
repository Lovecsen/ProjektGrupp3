export function heart(elem) {

    const heartPicture = elem.querySelector(".heart");

    if (!heartPicture) return;

    const placeId = heartPicture.dataset.id.toString();

    let favorites = JSON.parse(localStorage.getItem("favoriter")) || [];

    if (favorites.includes(placeId)) {
        heartPicture.src = "photos/smallredheart.svg";
    }

    heartPicture.addEventListener("pointerenter", () => {
        if (!favorites.includes(placeId)) {
            heartPicture.src = "photos/smallredheart.svg";
        }
    });

    heartPicture.addEventListener("pointerleave", () => {
        if (!favorites.includes(placeId)) {
            heartPicture.src = "photos/smallheart.svg";
        }
    });

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