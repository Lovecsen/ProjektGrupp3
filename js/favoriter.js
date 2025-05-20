
function init() {

}
window.addEventListener("DOMContentLoaded", init);

function heart(elem) {

    const heartPicture = elem.querySelector(".heart");
    const placeId = heartPicture.dataset.id;

    let favorites = JSON.parse(localStorage.getItem("favoriter")) || [];

    let liked = favorites.includes(placeId);

    if (liked) {
        heartPicture.src = "photos/smallredheart.svg";
    }

    heartPicture.addEventListener("pointerenter", () => {
        if (!liked) {
            heartPicture.src = "photos/smallredheart.svg";
        }
    });

    heartPicture.addEventListener("pointerleave", () => {
        if (!liked) {
            heartPicture.src = "photos/smallheart.svg";
        }
    });

    heartPicture.addEventListener("pointerdown", (e) => {
        e.stopPropagation();

        if (!liked) {
            heartPicture.src = "photos/smallredheart.svg";
            favorites.push(placeId);
            liked = true;
        } else {
            heartPicture.src = "photos/smallheart.svg";
            favorites = favorites.filter(name => name !== placeId);
            liked = false;
        }

        localStorage.setItem("favoriter", JSON.stringify(favorites));
    });
}
