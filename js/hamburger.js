function init() {
    const hamburgerIcon = document.querySelector("#hamburgerIcon"); //bilden på hamburgermenyn
    hamburgerIcon.addEventListener("pointerdown", showHamburger); //eventlyssnare för klick på hamburgermenyn

    let navHeart = document.querySelector("#favorites"); //bilden för favoriter i navbaren

    if (!navHeart) return; //om inte navHeart finns avbryts funktionen

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

//funktion för att visa/dölja innehållet i hamburgarmenyn
function showHamburger() {
    let hamburgerMenu = document.querySelector("#hamburgerMenu"); //id för listan i hamburgermenyn

    //för att visa dropdown för hamburgermenyn
    if (hamburgerMenu.style.display == "block") {
        hamburgerMenu.style.display = "none";
    } else {
        hamburgerMenu.style.display = "block";
    }
}

// Stäng dropdown-menyn om man klickar utanför
window.addEventListener("pointerdown", function (event) {
    if (!hamburgerIcon.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.style.display = "none";
    }
});
