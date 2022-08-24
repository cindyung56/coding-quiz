// VARIABLES 

// grabbing all elements of importance
var highScoreLink = document.querySelector("#high-score-link");
var highScoreWindow = document.querySelector("#high-score-window");
var highScoreWindowList = document.querySelector("#high-score-window-list");

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
var scoreLeaderboard = document.querySelector("#leaderboard");
var listOfPlayers = document.querySelector("#list-of-players");
var goBackBtn = document.querySelector("#go-back-btn");
var clearScoresBtn = document.querySelector("#clear-scores-btn");

// array of all the questions that appear when round has started
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
    {
        question: "What represents an array in JavaScript?",
        choices: ["' '", "{ }", "< >", "[ ]"],
        correctAnswer: "[ ]" 
    },
    {
        question: "Which heading tag is considered the most important on a webpage?",
        choices: ["h1", "h2", "h3", "h4"],
        correctAnswer: "h1" 
    },
    {
        question: "Which of the following is NOT a pseudo-class?",
        choices: [":visited", ":hover", ":active", "::after"],
        correctAnswer: "::after" 
    },
    {
        question: "What is the equivalent of hover in JavaScript?",
        choices: ["dblclick", "click", "mouseout", "mouseover"],
        correctAnswer: "mouseover" 
    },
    {
        question: "Can you style elements in HTML without using a style.css file?",
        choices: ["Yes", "No", "Maybe", "I don't know"],
        correctAnswer: "Yes" 
    },
]

// Global Variables
var secondsLeft = 75;
var rwSeconds = 2;
var winCounter = 0;
var isQuestionCorrect;
var questionIndex = 0;
var answeredQuestions = 0;
var currentQuestion = questionsArray[questionIndex];


// FUNCTIONS

// load starting page on refresh/initial load/user decides to go back from finishing a round
function init(){
    questionContainer.dataset.state = "hidden";
    highScoreInput.dataset.state = "hidden";
    scoreLeaderboard.dataset.state = "hidden";
    pageHeading.textContent = "Coding Quiz Challenge";
    instructionsEl.dataset.state = "visible";
    startBtn.dataset.state = "visible";
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

// display the high scores in highScoreWindow
function updateHighScoreWindow(){
    highScoreWindowList.innerHTML = "";

    var scoreArray = JSON.parse(localStorage.getItem("scores"));
    
    for (var i = 0; i < scoreArray.length; i++){
        var player = document.createElement("li");
        player.textContent = "#"+ (i+1) + " " + scoreArray[i].initials + ": " + scoreArray[i].score + " points";
        highScoreWindowList.appendChild(player);
    }
}


// when start button has been pressed, hide all initialized content and start the game
function startBtnPressed(){
    questionTimer.textContent = secondsLeft + " seconds left";
    questionContainer.dataset.state = "visible";
    
    instructionsEl.dataset.state = "hidden";
    startBtn.dataset.state = "hidden";

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

// allow the correct or wrong message to display for 3 seconds, and then reset it back for the next problem
function rightWrongCounter(){
    var timerInterval = setInterval(function(){
        rwSeconds--;
        
        if (rwSeconds === 0){
            clearInterval(timerInterval);
            rightOrWrong.textContent = "";
            rwSeconds = 2;
            return;
        }
    }, 1000);
}

// function to show high score at the end, and options to play again or see other high scores
function endScreen(){
    pageHeading.textContent = "All done!";
    currentScore.textContent = winCounter + " points";
    questionContainer.dataset.state = "hidden";
    highScoreInput.dataset.state = "visible";
}

// when the user submits their initials and score to the leaderboard
function submitBtnPressed(event){
    event.preventDefault();
    console.log(userInitials.value);
    if (userInitials.value !== ""){
        var scoreArray = JSON.parse(localStorage.getItem("scores"));
    
        var user = {
            initials: userInitials.value.trim(),
            score: winCounter
        }
        scoreArray.push(user);

        localStorage.setItem("scores", JSON.stringify(scoreArray));
        displayHighScores();
    } else{
        rightOrWrong.textContent = "Must enter your initials before you submit!";
        rightWrongCounter();
    }
}

// function to show scores after initials have been submitted
function displayHighScores(){
    highScoreInput.dataset.state = "hidden";
    scoreLeaderboard.dataset.state = "visible";
    var scoreArray = JSON.parse(localStorage.getItem("scores"));

    scoreArray.sort(function(a, b){
        return b.score - a.score;
    });

    listOfPlayers.innerHTML = "";

    for (var i = 0; i < scoreArray.length; i++){
        var player = document.createElement("li");
        player.setAttribute("class", "player-scores");
        player.textContent = "#"+ (i+1) + " " + scoreArray[i].initials + ": " + scoreArray[i].score + " points";
        listOfPlayers.appendChild(player);
    }
}

// reset everything necessary when the user decides to do the quiz again
function goBack(){
    scoreLeaderboard.dataset.state = "hidden";
    winCounter = 0;
    secondsLeft = 75;
    questionIndex = 0;
    answeredQuestions = 0;
    currentQuestion = questionsArray[questionIndex];
    answerOptionList.innerHTML = "";
    userInitials.value = "";
    init();
}

// clears high scores from local storage
function clearHighScores(){
    var scoreArray = JSON.parse(localStorage.getItem("scores"));
    scoreArray = [];
    localStorage.setItem("scores", JSON.stringify(scoreArray));
    displayHighScores();
}


// EVENT LISTENERS

// when the start button is pressed, run the startBtnPressed function
startBtn.addEventListener("click", startBtnPressed);

// when an answer has been pressed, check to see if it matches the correct answer
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

// when the submit button has been pressed, add the score to the leaderboard
submitScoreBtn.addEventListener("click", submitBtnPressed);

// when the user decides to play again
goBackBtn.addEventListener("click", goBack);

// clear the list when the user wants to clear the scores, and update the list to be cleared
clearScoresBtn.addEventListener("click", clearHighScores);

highScoreLink.addEventListener("mouseover", function(event){
    updateHighScoreWindow();
    highScoreWindow.dataset.state = "visible";
})
highScoreLink.addEventListener("mouseout", function(event){
    highScoreWindow.dataset.state = "hidden";
})

init();