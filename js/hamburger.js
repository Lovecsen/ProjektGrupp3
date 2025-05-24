function init() {
    const hamburgerIcon = document.querySelector("#hamburgerIcon");

    hamburgerIcon.addEventListener("pointerdown", showHamburger);

    let navHeart = document.querySelector("#favorites");

    if (!navHeart) return;

    //mus är över hjärtat ändras det till rött
    navHeart.addEventListener("pointerenter", () => {

        navHeart.src = "photos/redfavorites.svg";
    });

    //mus försvinner från hjärtat ändras det tillbaka
    navHeart.addEventListener("pointerleave", () => {
        navHeart.src = "photos/heart.svg";
    });
}
window.addEventListener("DOMContentLoaded", init);

function showHamburger() {
    const hamburgerMenu = document.querySelector("#hamburgerMenu");

    //för att visa dropdown för hamburgermenyn
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
