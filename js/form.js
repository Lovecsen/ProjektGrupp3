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

    let isChecked = false;
    for (let i = 0; i < radioBtn1.length; i++) {
        if (radioBtn1[i].checked) {
            isChecked = true;
        }
        radioBtn1[i].addEventListener("change", function () {
            firstNextBtn.classList.remove("disabled");
            firstNextBtn.disabled = false;
        }); 
    }

    if (isChecked) {
        firstNextBtn.classList.remove("disabled");
        firstNextBtn.disabled = false;
    } else {
        firstNextBtn.classList.add("disabled");
        firstNextBtn.disabled = true;
    }

    firstNextBtn.addEventListener("click", nextQuestion2); //anrop av funktion för att byta fråga
}
window.addEventListener("DOMContentLoaded", init);

function prevQuestion1() {
    question1.classList.remove("hide"); //visar fråga 1 om tillbaka knappen tryckts på
    question2.classList.add("hide"); //gömmer fråga 2 om tillbaka knappen tryckts på
}

//funktion för att byta fråga i formuläret
function nextQuestion2() {
    question1.classList.add("hide"); //lägg till klass för att dölja frågan
    question2.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question2, "q2");

    prevBtn2 = document.querySelector("#previous2");
    prevBtn2.addEventListener("click", prevQuestion1);

    question2.classList.remove("hide"); //visar fråga 1 om tillbaka knappen tryckts på
    question3.classList.add("hide"); //gömmer fråga 2 om tillbaka knappen tryckts på

    let radioBtn2 = document.querySelectorAll(".second");

    let isChecked = false;
    for (let i = 0; i < radioBtn2.length; i++) {
        if (radioBtn2[i].checked) {
            isChecked = true;
        }
        radioBtn2[i].addEventListener("change", function () {
            secondNextBtn.classList.remove("disabled");
            secondNextBtn.disabled = false;
        }); 
    }

    if (isChecked) {
        secondNextBtn.classList.remove("disabled");
        secondNextBtn.disabled = false;
    } else {
        secondNextBtn.classList.add("disabled");
        secondNextBtn.disabled = true;
    }

    secondNextBtn.addEventListener("click", nextQuestion3); //anrop av funktion för att byta fråga
}


function nextQuestion3() {
    question2.classList.add("hide"); //lägg till klass för att dölja frågan
    question3.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question3, "q3");

    prevBtn3 = document.querySelector("#previous3");
    prevBtn3.addEventListener("click", nextQuestion2);

    question3.classList.remove("hide"); //visar fråga 1 om tillbaka knappen tryckts på
    question4.classList.add("hide"); //gömmer fråga 2 om tillbaka knappen tryckts på

    let radioBtn3 = document.querySelectorAll(".third");

    let isChecked = false;
    for (let i = 0; i < radioBtn3.length; i++) {
        if (radioBtn3[i].checked) {
            isChecked = true;
        }
        radioBtn3[i].addEventListener("change", function () {
            thirdNextBtn.classList.remove("disabled");
            thirdNextBtn.disabled = false;
        }); 
    }

    if (isChecked) {
        thirdNextBtn.classList.remove("disabled");
        thirdNextBtn.disabled = false;
    } else {
        thirdNextBtn.classList.add("disabled");
        thirdNextBtn.disabled = true;
    }

    thirdNextBtn.addEventListener("click", nextQuestion4); //anrop av funktion för att byta fråga

}

function nextQuestion4() {
    question3.classList.add("hide"); //lägg till klass för att dölja frågan
    question4.classList.remove("hide"); //tar bort klass för att visa frågan

    resetInputs(question4, "q4");

    prevBtn4 = document.querySelector("#previous4");
    prevBtn4.addEventListener("click", nextQuestion3);

    radioBtn4 = document.querySelectorAll(".fourth");

    let isChecked = false;
    for (let i = 0; i < radioBtn4.length; i++) {
        if (radioBtn4[i].checked) {
            isChecked = true;
        }
        radioBtn4[i].addEventListener("change", function () {
            fourthNextBtn.classList.remove("disabled");
            fourthNextBtn.disabled = false;
        }); 
    }

    if (isChecked) {
        fourthNextBtn.classList.remove("disabled");
        fourthNextBtn.disabled = false;
    } else {
        fourthNextBtn.classList.add("disabled");
        fourthNextBtn.disabled = true;
    }

    fourthNextBtn.addEventListener("click", nextQuestion4); //anrop av funktion för att byta fråga
}

//kollar om användaren ser frågan för första gången elelr inte
function resetInputs(questionElement, key) {
    if (!visitedQuestions[key]) {
        let inputs = questionElement.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].checked = false;
        }
        visitedQuestions[key] = true;
    }
}