//javascript för att hantera formuläret med frågor för att ge förslag utifrån användarens preferenser

let firstNextBtn; //knapp för nästa fråga

function init() {

    firstNextBtn = document.querySelector("#firstNext"); //knapp för nästa fråga
    firstNextBtn.classList.add("disabled"); //lägger till classen för inaktiverad knapp
    firstNextBtn.disabled = true; //inaktiverar nästa knappen

    let radioBtn = document.querySelectorAll(".first"); //knapparna för svarsalternativen

    for (let i = 0; i < radioBtn.length; i++) {
    radioBtn[i].addEventListener("click", next); //anropar funktionen next när ett alternativ har klickats i
    }

}
window.addEventListener("DOMContentLoaded", init);

//funktion för att göra nästa knappen aktiverad
function next() {
    firstNextBtn.classList.remove("disabled"); //tar bort klassen för inaktiverad knapp
    firstNextBtn.disabled = false; //aktiverar knappen
}