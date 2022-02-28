let failAudio = new Audio('static/audio/fail.mp3');
let successAudio = new Audio('static/audio/success.mp3');
let quiz = document.querySelector("quiz")
let questionNumber = 1
let difficulty = 1
let correctAnswers=0
let input
let form

const makeQuestion = () => {
    fetch( './questions.json' )
        .then( res => res.json() )
        .then( data => {
            let question = document.createElement('div');
            let answers = data[difficulty-1][questionNumber-difficulty].answers;
            // set Bootstrap classname for li element
            question.classList.add('row', 'my-3');
            // add the employee's info as the text of the li element
            question.innerHTML = 
            `<div class="card neutral col-10 offset-${Math.round(1-Math.sin(questionNumber*Math.PI/2))}" style="width: 18rem;" id="question${questionNumber}">
                <div class="card-body">
                    <h5 class="card-title">Question ${questionNumber}</h5>
                    <p class="card-text">${data[difficulty-1][questionNumber-difficulty].question}</p>
                    <form id="form${questionNumber}">
                        <div class="form-outline">
                            <input type="search" id="input${questionNumber}" class="form-control" placeholder="Type your answer here and press enter"
                            aria-label="Search" />
                        </div>
                    </form>
                </div>
            </div>`;
            // create click event lister for each  question
            createEvents( question, answers )
            // add question element into quiz section
            quiz.appendChild(question)
} ) }

const createEvents = ( q, aList ) => {
    q.addEventListener( 'submit', ( e ) => {
        e.preventDefault();
        input = document.getElementById("input" + questionNumber)
        input.disabled = true
        currentCard = document.getElementById("question" + questionNumber)
        currentCard.classList.remove('neutral')
        if (aList.includes(input.value)) {
            successAudio.play()
            currentCard.classList.add('success')
            difficulty++
            correctAnswers++
        } else {
            failAudio.play()
            currentCard.classList.add('failure')
        }
        questionNumber++
        if (questionNumber <= 10) {
            makeQuestion()
        } else {
            createResults()
        }
    } )
}

const createResults = () => {
            let statements = ["It's ok to get a less than perfect score; It is a very hard quiz.", "Wow, cheat much?"]
            let success = (correctAnswers === 10) * 1
            let results = document.createElement('results')
            results.innerHTML = 
            `<h3>Results</h3>
            <h2>${correctAnswers}/10</h2>
            <p>${statements[success]}</p>
            <a href=".">Try again</a>`
            document.querySelector("main").appendChild(results)
            document.querySelector("results").style.opacity = 1
}
makeQuestion()