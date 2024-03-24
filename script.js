document.addEventListener('DOMContentLoaded', function () {
    const cardContainer = document.getElementById('card-container');
    const resetBtn = document.getElementById('reset-btn');
    const timerDisplay = document.getElementById('timer');
    const timeAdditionDisplay = document.getElementById('time-addition'); // New time addition display
    const startBtn = document.getElementById('start-btn');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const scoreboard = document.getElementById('scoreboard'); // Scoreboard container
    const scoreValue = document.getElementById('score-value'); // Score value span
  
    const symbols = ['🚀','👽', '🌌', '🪐','🌠', '🛸', '👾', '🌕'];
    const totalPairs = symbols.length;
    const gameTime = 60; // 1 minute in seconds
    let timeLeft = gameTime;
    let flippedCards = [];
    let matchedPairs = 0;
    let timerStarted = false;
    let gameStarted = false;
    let timerInterval;
    let score = 0;

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                endGame(); // Call endGame when time runs out
            }
            if (matchedPairs === totalPairs) {
                clearInterval(timerInterval);
                endGame(); // Call endGame when all pairs are matched
            }
        }, 1000);
        startBtn.disabled = true; // Disable the Start button once the timer starts
    }

    resetBtn.addEventListener('click', resetGame);

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updateAdditionDisplay(timeAdded) {
        timeAdditionDisplay.textContent = `+${timeAdded}`;
        timeAdditionDisplay.style.display = 'block';
        setTimeout(() => {
            timeAdditionDisplay.style.display = 'none';
        }, 1000); // Hide after 1 second
    }

    function createCards() {
        const cardSymbols = symbols.concat(symbols); // Duplicate symbols array to create pairs
        cardSymbols.sort(() => Math.random() - 0.5); // Shuffle the symbols

        cardSymbols.forEach(symbol => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="front"></div>
                <div class="back">
                    <div class="symbol hidden">${symbol}</div>
                </div>
            `;
            card.addEventListener('click', () => flipCard(card));
            cardContainer.appendChild(card);
        });
    }
	function flipCard(card) {
    // Check if the card can be flipped (less than 2 flipped cards, not already matched, and timer started)
    if (flippedCards.length < 2 && !flippedCards.includes(card) && !card.classList.contains('matched') && timerStarted) {
        card.classList.add('flipped');
        const hiddenContent = card.querySelector('.hidden');

        // Delay toggling the flipped class to allow the CSS animation to play
        setTimeout(() => {
            // Check if the card is still flipped (i.e., not matched yet)
            if (card.classList.contains('flipped')) {
                card.classList.remove('flipped');
                card.classList.add('flipped-back');
                hiddenContent.classList.toggle('visible');
            }
        }, 100); // Adjust timing as needed

        flippedCards.push(card);

        // Check for matching when two cards are flipped
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}
    function checkMatch() {
        const [firstCard, secondCard] = flippedCards;
        const symbol1 = firstCard.textContent;
        const symbol2 = secondCard.textContent;

        if (symbol1 === symbol2) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;

            // Add 3 seconds to the timer
            const timeAdded = 3;
            timeLeft += timeAdded;
            updateTimerDisplay();

            // Display the added time
            updateAdditionDisplay(timeAdded);

            if (matchedPairs === totalPairs) {
                // Turn all cards green immediately
                const allCards = document.querySelectorAll('.card');
                allCards.forEach(card => {
                    card.classList.add('matched');
                });
                endGame(); // Call endGame when all pairs are matched
            }
        } else {
            // If cards don't match, remove the 'flipped' class after a delay to animate flipping back
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                const hiddenContent1 = firstCard.querySelector('.hidden');
                const hiddenContent2 = secondCard.querySelector('.hidden');
                hiddenContent1.classList.remove('visible');
                hiddenContent2.classList.remove('visible');
            }, 500); // Adjust the delay to match your animation duration
        }

        flippedCards = [];
    }
function endGame() {
        clearInterval(timerInterval);
        timerStarted = false;
        gameStarted = false;

        const timeTaken = gameTime - timeLeft; // Calculate the time taken to complete the game
        const scoreRating = calculateScore(timeTaken); // Calculate the score rating
        scoreValue.textContent = ` ${timeTaken} seconds || ${scoreRating}`; // Update score value with rating

        scoreboard.style.display = 'block'; // Show the scoreboard
    }

    function calculateScore(timeTaken) {
        if (timeTaken >= 40) {
            return "Bad";
        } else if (timeTaken >= 20 && timeTaken < 40) {
            return "Average";
        } else {
            return "Great";
        }
    }

    function resetGame() {
        clearInterval(timerInterval);
        timeLeft = gameTime;
        updateTimerDisplay();
        cardContainer.innerHTML = '';
        matchedPairs = 0;
        timerStarted = false;
        gameStarted = false;
        createCards();
        pauseResumeBtn.innerHTML = 'PAUSE';
        pauseResumeBtn.disabled = true;
        pauseResumeBtn.style.backgroundColor = 'transparent';
        startBtn.disabled = false; // Enable the Start button when the game is reset
        startBtn.style.backgroundColor = 'transparent';
        scoreValue.textContent = '';
    }

    startBtn.addEventListener('click', () => {
        if (!gameStarted) {
            startTimer();
            timerStarted = true;
            gameStarted = true;
            pauseResumeBtn.innerHTML = 'PAUSE';
            pauseResumeBtn.disabled = false;
            pauseResumeBtn.style.backgroundColor = 'transparent';
        }
    });

    pauseResumeBtn.addEventListener('click', () => {
        if (gameStarted) {
            if (timerStarted) {
                clearInterval(timerInterval);
                timerStarted = false;
                pauseResumeBtn.innerHTML = 'RESUME'; 
            } else {
                startTimer();
                timerStarted = true;
                pauseResumeBtn.innerHTML = 'PAUSE'; 
                pauseResumeBtn.style.backgroundColor = '#transparent';
            }
        }
    });

    resetBtn.addEventListener('click', resetGame);

    createCards();
    pauseResumeBtn.style.backgroundColor = 'transparent';
});