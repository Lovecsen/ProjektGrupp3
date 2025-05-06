function init() {
    const hamburgerIcon = document.querySelector("#hamburgerIcon");

    hamburgerIcon.addEventListener("click", showHamburger);
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
window.addEventListener("click", function (event) {
    if (!hamburgerIcon.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.style.display = "none";
    }
});
