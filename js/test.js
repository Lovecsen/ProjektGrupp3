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

if (window.location.pathname.includes("index.html")) {
    function init() {

        //anropar funktion för att avgöra vilken fråga som ska visas
        for (let i = 0; i < questionElems.length; i++) {
            setQuestion(i);
        }
        showQuestion(0);
        nextBtns[3].addEventListener("click", result); //anropa functionen i formfunction.js
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
}


function result() {

    let answers = []; //tom array för att hålla svaren som användaren gör

    //svarsalternativen för första frågan
    const input1 = document.querySelector(".first:checked");
    if (input1) {
        if (input1.id == "outside") {
            answers.push("Y");
        } else if (input1.id == "inside") {
            answers.push("N")
        } else if (input1.id == "both") {
            answers.push("."); //den kunde inte vara tom?
        }
    }

    //svarsalternativ för andra frågan
    const input2 = document.querySelector(".second:checked");
    if (input2) {
        if (input2.id == "yes") {
            answers.push("Y");
        } else if (input2.id == "no") {
            answers.push("N");
        } else if (input2.id == "yesno") {
            answers.push("."); //den kunde inte vara tom?
        }
    }

    //svarsalternativ för tredje frågan
    const input3 = document.querySelector(".third:checked");

    if (input3) {
        if (input3.id == "activity") {
            answers.push("activity");
        } else if (input3.id == "sights") {
            answers.push("attraction");
        } else if (input3.id == "both3") {
            answers.push("activity, attraction");
        }
    }

    //svarsalternativ för fjärde frågan
    const input4 = document.querySelectorAll(".fourth:checked");
    let price = []; //array för att hålla flera värden för pris om användaren väljer mer än ett alternativ
    for (let checkbox of input4) {
        if (checkbox.id == "0") {
            price.push("0-25");
            price.push("25-100");
        }
        if (checkbox.id == "100") {
            price.push("100-250");
        }
        if (checkbox.id == "300") {
            price.push("250-500");
        }
        if (checkbox.id == "500") {
            price.push("500-1250");
            price.push("1250-5000");
        }
    }
    answers.push(price.join(",")); //alla valda prisintervall läggs in i arrayen som ett strängvärde med ett kommatecken emellan

    //sparas i localstorage för att följa med till nästa sida
    localStorage.setItem("answer1", answers[0]);
    localStorage.setItem("answer2", answers[1]);
    localStorage.setItem("answer3", answers[2]);
    localStorage.setItem("answer4", answers[3]);

}

