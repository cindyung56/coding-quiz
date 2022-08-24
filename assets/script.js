var highScoreLink = document.querySelector("#high-score-link");
var questionTimer = document.querySelector("#question-timer");
var textContainer = document.querySelector("#text-container");
var pageHeading = document.querySelector("#page-heading");
var instructionsEl = document.querySelector("#instructions");
var startBtn = document.querySelector("#start-button");
var questionContainer = document.querySelector("#question-container");
var answerOptionList = document.querySelector("#answer-options");
var rightOrWrong = document.querySelector("#right-or-wrong");
var highScoreInput = document.querySelector("#enter-high-score");
var currentScore = document.querySelector("#current-score");
var submitScoreBtn = document.querySelector("#submit-score");
var userInitials = document.querySelector("#user-initials");

var questionsArray = [
    {
        question: "What coding language represents the content of a web page?",
        choices: ["HTML", "CSS", "JavaScript", "API"],
        correctAnswer: "HTML" 
    },
    {
        question: "What coding language is used to style a web page?",
        choices: ["Java", "Ruby", "Python", "CSS"],
        correctAnswer: "CSS" 
    },
    {
        question: "What JavaScript function is used to connect buttons with certain actions?",
        choices: ["console.log", "getElementByID", "addEventListener", "querySelector"],
        correctAnswer: "addEventListener" 
    },
    {
        question: "In CSS, there are elements, classes, and IDs. Which is prioritized the most?",
        choices: ["IDs", "Classes", "Elements", "They're all of equal importance."],
        correctAnswer: "IDs" 
    },
    {
        question: "What is a block of code that does actions whenever it is called upon?",
        choices: ["variable", "function", "comment", "array"],
        correctAnswer: "function" 
    },
    {
        question: "What is the last index of an array x in JavaScript?",
        choices: ["x[0]", "x[-1]", "x[x.length]", "x[x.length - 1]"],
        correctAnswer: "x[x.length - 1]" 
    },

]

var secondsLeft = 10;
var rwSeconds = 3;
var winCounter = 0;
var isQuestionCorrect;
var questionIndex = 0;
var answeredQuestions = 0;
var currentQuestion = questionsArray[questionIndex];

// FUNCTIONS

// load page on refresh
function init(){
    questionContainer.setAttribute("style", "display: none");
    highScoreInput.setAttribute("style", "display: none");
    getScores();
}

// get scores from localStorage, if scores doesn't exist then make a new array and store it
function getScores(){
    var scoreArray = JSON.parse(localStorage.getItem("scores"));
    if (scoreArray === null){
        scoreArray = [];
        localStorage.setItem("scores", JSON.stringify(scoreArray));
    }
}

// when start button has been pressed, hide all initialized content and start the game
function startBtnPressed(){
    questionTimer.textContent = secondsLeft + " seconds left";
    questionContainer.setAttribute("style", "display: contents");

    instructionsEl.setAttribute("style", "display: none");
    startBtn.setAttribute("style", "display: none");

    setTimer();
    createQuestion();
    
}

// create new question every time this function is called
function createQuestion(){
    if(secondsLeft === 0 || answeredQuestions === questionsArray.length){
        endScreen();
        return;
    }

    // replace heading with current question, and add options to questionContainer
    pageHeading.textContent = "#" + (questionIndex+1) + ". " + currentQuestion.question;

    for (var i = 0; i < currentQuestion.choices.length; i++){
        var choice = document.createElement("li");
        var choiceBtn = document.createElement("button");
        choiceBtn.textContent = currentQuestion.choices[i];
        choiceBtn.setAttribute("class", "multiple-choice");
        choice.appendChild(choiceBtn);
        answerOptionList.appendChild(choice);
    }
}


//check to see if the chosen answer was correct
function checkIfCorrect(){
    if (isQuestionCorrect === true){
        console.log()
        winCounter++;
        rightOrWrong.textContent = "Correct!";
    } else if (isQuestionCorrect === false){
        secondsLeft -= 10;
        rightOrWrong.textContent = "Wrong!";
    }

    if (isQuestionCorrect !== undefined){
        rightWrongCounter();
        answeredQuestions++;
        questionIndex++;
        currentQuestion = questionsArray[questionIndex];
        pageHeading.textContent = "";
        answerOptionList.innerHTML = "";
        createQuestion(); 
    }
    
}




// create code for the timer to count down
function setTimer(){
    var timerInterval = setInterval(function(){
        secondsLeft--;

        if (secondsLeft !== 1){
            questionTimer.textContent = secondsLeft + " seconds left";
        } else if (secondsLeft === 1){
            questionTimer.textContent = secondsLeft + " second left";
        }
        
        if (secondsLeft <= 0 || answeredQuestions === questionsArray.length){
            secondsLeft = 0;
            questionTimer.textContent = secondsLeft + " seconds left";
            clearInterval(timerInterval);
            endScreen();
            return;
        }
    }, 1000);
}

function rightWrongCounter(){
    var timerInterval = setInterval(function(){
        rwSeconds--;
        
        if (rwSeconds === 0){
            clearInterval(timerInterval);
            rwSeconds = 3;
            rightOrWrong.textContent = "";
            return;
        }
    }, 1000);
}

// function to show high score at the end, and options to play again or see other high scores
function endScreen(){
    pageHeading.textContent = "All done!";
    currentScore.textContent = winCounter + " points";
    questionContainer.setAttribute("style", "display: none");
    highScoreInput.setAttribute("style", "display: contents");
}

// when the user submits their initials and score to the leaderboard
function submitBtnPressed(event){
    event.preventDefault();
    var scoreArray = JSON.parse(localStorage.getItem("scores"));
    
    var user = {
        initials: userInitials.value.trim(),
        score: winCounter
    }
    scoreArray.push(user);

    localStorage.setItem("scores", JSON.stringify(scoreArray));
    displayHighScores();
}

// function to show scores after initials have been submitted
function displayHighScores(){
    
}


startBtn.addEventListener("click", startBtnPressed);

questionContainer.addEventListener("click", function(event){
    event.stopPropagation();
    var element = event.target;
    if (element.matches("button")){
        if (element.textContent === currentQuestion.correctAnswer){
        isQuestionCorrect = true;
        } else{
        isQuestionCorrect = false;
        }

        checkIfCorrect();
    }
});

submitScoreBtn.addEventListener("click", submitBtnPressed);


init();