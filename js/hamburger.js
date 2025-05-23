function init() {
    const hamburgerIcon = document.querySelector("#hamburgerIcon");

    hamburgerIcon.addEventListener("pointerdown", showHamburger);

    let navHeart = document.querySelector("#favorites");

    if (!navHeart) return;

    navHeart.addEventListener("pointerenter", () => {

        navHeart.src = "photos/redfavorites.svg";
    });

    navHeart.addEventListener("pointerleave", () => {
        navHeart.src = "photos/heart.svg";
    });
}
window.addEventListener("DOMContentLoaded", init);

function showHamburger() {
    const hamburgerMenu = document.querySelector("#hamburgerMenu");

    if (hamburgerMenu.style.display == "block") {
        hamburgerMenu.style.display = "none";
    } else {
        hamburgerMenu.style.display = "block";
    }
}

// Stäng dropdown-menyn om man klickar  utanför
window.addEventListener("pointerdown", function (event) {
    if (!hamburgerIcon.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.style.display = "none";
    }
});
