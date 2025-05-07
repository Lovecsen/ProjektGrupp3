let questionElems = [
    document.querySelector("#question1"),
    document.querySelector("#question2"),
    document.querySelector("#question3"),
    document.querySelector("#question4")
] //array för de olika frågorna

let nextBtns = [
    document.querySelector("#firstNext"),
    document.querySelector("#secondNext"),
    document.querySelector("#thirdNext"),
    document.querySelector("#fourthNext")
] //array för de olika nästa knapparna

let prevBtns = [
    null,
    document.querySelector("#previous2"),
    document.querySelector("#previous3"),
    document.querySelector("#previous4")
] //array för de olika tillbaka knapparna

let inputClasses = ["first", "second", "third", "fourth"]; //array för namnet på klasserna i de olika input elementen för de olika svarsalternativen

let visitedQuestions = [false, false, false, false]; //array för false för vardera fråga gällande att den ska vara false fram till att användaren får frågan

function init() {

    console.log(nextBtns);
    console.log(questionElems);

    //anropar funktion för att avgöra vilken fråga som ska visas
    for (let i = 0; i < questionElems.length; i++) {
        setQuestion(i);
    }
    showQuestion(0);
}
window.addEventListener("DOMContentLoaded", init);

//funktion för att sätta den frågan som ska visas
function setQuestion(index) {
    
    const question = questionElems[index]; //den aktuella frågan
    const nextBtn = nextBtns[index]; //den aktuella nästa knappen
    const prevBtn = prevBtns[index]; //den aktuella tillbaka knappen
    const input = inputClasses[index]; //den aktuella klassen för input elementet
    const theInputs = question.querySelectorAll("." + input); //den aktuella klassen för input svaren

    //om nästa knappen
    if (nextBtn) {
        nextBtn.classList.add("disabled");
        nextBtn.disabled = true;
        
        if (!inputChecked(theInputs)) {
            nextBtn.classList.add("disabled");
            nextBtn.disabled = true; //inaktivera knappen om inga radio knappar klickats i
        }
        for (let inputHtml of theInputs) {
            inputHtml.addEventListener("change", () => {
                if (inputChecked(theInputs)) {
                nextBtn.classList.remove("disabled");
                nextBtn.disabled = false;
                } else {
                    nextBtn.classList.add("disabled");
                    nextBtn.disabled = true;
                }
            });
        }
        nextBtn.addEventListener("click", () => showQuestion(index + 1));
    }
    if (prevBtn && index > 0) {
        prevBtn.addEventListener("click", () => showQuestion(index - 1));
    }

}

function showQuestion(theIndex) {
    for (let i = 0; i < questionElems.length; i++) {
        if (i == theIndex) {
            questionElems[i].classList.remove("hide");
            if (!visitedQuestions[i]) {
                inputReset(questionElems[i]);
                visitedQuestions[i] = true;
            }
        } else {
            questionElems[i].classList.add("hide");
        }
    }
}

function inputReset(Qelem) {
    const inputs = Qelem.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    for (let input of inputs) {
        input.checked = false;
    }
}

function inputChecked(inputs) {


    
    return Array.from(inputs).some(input => input.checked);
    
}