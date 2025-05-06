//javascript för att hantera formuläret med frågor för att ge förslag utifrån användarens preferenser

let prevBtn2;
let prevBtn3;
let prevBtn4;
let firstNextBtn; //knapp för nästa fråga (på fråga 1)
let secondNextBtn; //knapp för nästa fråga (på fråga 2)
let thirdNextBtn;
let fourthNextBtn;
let question1;
let question2;
let question3;
let question4;
let radioBtn4;

let visitedQuestions = {
    q1: false,
    q2: false,
    q3: false,
    q4: false
};

function init() {

    firstNextBtn = document.querySelector("#firstNext"); //knapp för nästa fråga
    firstNextBtn.classList.add("disabled"); //lägger till classen för inaktiverad knapp
    firstNextBtn.disabled = true; //inaktiverar nästa knappen
    firstNextBtn.addEventListener("click", nextQuestion2); //anrop av funktion för att byta fråga

    question1 = document.querySelector("#question1"); //första frågan i formuläret
    question2 = document.querySelector("#question2"); //andra frågan i formuläret
    question3 = document.querySelector("#question3");
    question4 = document.querySelector("#question4");

    secondNextBtn = document.querySelector("#secondNext");
    thirdNextBtn = document.querySelector("#thirdNext");
    fourthNextBtn = document.querySelector("#fourthNext");

    resetInputs(question1, "q1");

    let radioBtn1 = document.querySelectorAll(".first"); //knapparna för svarsalternativen

    for (let i = 0; i < radioBtn1.length; i++) {
    radioBtn1[i].addEventListener("click", next1); //anropar funktionen next när ett alternativ har klickats i
    }

}
window.addEventListener("DOMContentLoaded", init);

//funktion för att göra nästa knappen på fråga 1 aktiverad
function next1() {
    question1.classList.remove("hide"); //visar fråga 1 om tillbaka knappen tryckts på
    question2.classList.add("hide"); //gömmer fråga 2 om tillbaka knappen tryckts på

    firstNextBtn.classList.remove("disabled"); //tar bort klassen för inaktiverad knapp
    firstNextBtn.disabled = false; //aktiverar knappen
}

//funktion för att byta fråga i formuläret
function nextQuestion2() {
    question1.classList.add("hide"); //lägg till klass för att dölja frågan
    question2.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question2, "q2");

    prevBtn2 = document.querySelector("#previous2");
    prevBtn2.addEventListener("click", next1);

    secondNextBtn.classList.add("disabled");
    secondNextBtn.disabled = true;
    secondNextBtn.addEventListener("click", nextQuestion3); //anrop av funktion för att byta fråga

    let radioBtn2 = document.querySelectorAll(".second");

    for (let i = 0; i < radioBtn2.length; i++) {
        radioBtn2[i].addEventListener("click", next2); //anropar funktionen next när ett alternativ har klickats i
        }
}

//funktion för att göra nästa knappen på fråga 2 aktiverad
function next2() {
    question2.classList.remove("hide"); //visar fråga 2 om tillbaka knappen tryckts på
    question3.classList.add("hide"); //gömmer fråga 3 om tillbaka knappen tryckts på

    secondNextBtn.classList.remove("disabled"); //tar bort klassen för inaktiverad knapp
    secondNextBtn.disabled = false; //aktiverar knappen
}

function nextQuestion3() {
    question2.classList.add("hide"); //lägg till klass för att dölja frågan
    question3.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question3, "q3");

    prevBtn3 = document.querySelector("#previous3");
    prevBtn3.addEventListener("click", next2);

    thirdNextBtn.classList.add("disabled");
    thirdNextBtn.disabled = true;
    thirdNextBtn.addEventListener("click", nextQuestion4); //anrop av funktion för att byta fråga

    let radioBtn3 = document.querySelectorAll(".third");

    for (let i = 0; i < radioBtn3.length; i++) {
        radioBtn3[i].addEventListener("click", next3); //anropar funktionen next när ett alternativ har klickats i
        }

}

function next3() {
    question3.classList.remove("hide"); //visar fråga 3 om tillbaka knappen tryckts på
    question4.classList.add("hide"); //gömmer fråga 4 om tillbaka knappen tryckts på

    thirdNextBtn.classList.remove("disabled"); //tar bort klassen för inaktiverad knapp
    thirdNextBtn.disabled = false; //aktiverar knappen
}

function nextQuestion4() {
    question3.classList.add("hide"); //lägg till klass för att dölja frågan
    question4.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question4, "q4");

    prevBtn4 = document.querySelector("#previous4");
    prevBtn4.addEventListener("click", next3);

    fourthNextBtn.classList.add("disabled");
    fourthNextBtn.disabled = true;

    radioBtn4 = document.querySelectorAll(".fourth");

    for (let i = 0; i < radioBtn4.length; i++) {
        radioBtn4[i].addEventListener("click", next4); //anropar funktionen next när ett alternativ har klickats i
        }
}

function next4() {

    let checked = false;

    for (let i = 0; i < radioBtn4.length; i++) {
        if (radioBtn4[i].checked) {
            checked = true;
            break;
        }
    }

    if (checked) {
        fourthNextBtn.classList.remove("disabled"); //tar bort klassen för inaktiverad knapp
        fourthNextBtn.disabled = false; //aktiverar knappen
    } else {
        fourthNextBtn.classList.add("disabled");
        fourthNextBtn.disabled = true;
    }
}

function resetInputs(questionElement, key) {
    if (!visitedQuestions[key]) {
        let inputs = questionElement.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = false;
        }
        visitedQuestions[key] = true;
    }
}