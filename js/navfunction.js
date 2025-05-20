

function init() {
    let navHeart = document.querySelector("#favorites");

    navHeart.addEventListener("pointerenter", () => {

        navHeart.src = "photos/redfavorites.svg";
    });

    navHeart.addEventListener("pointerleave", () => {
        navHeart.src = "photos/heart.svg";
    });
}
window.addEventListener("load", init);