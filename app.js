let wordsForTest = [];
let randomizedWords = [];
let currentIndex = 0;
let spokenWords = new Set();
let currentUtterance = null;
let progressBar = document.getElementById('progressBar');
let progressValue = 0;
let autoSpeechInterval = null;

document.body.style.opacity = 1;
document.body.style.animation = 'fadeIn 1s ease-in-out forwards';

function showGuide() {
    const guideModal = document.getElementById('guideModal');
    guideModal.style.display = 'block';
}

function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    guideModal.style.display = 'none';
}

window.onclick = function(event) {
    const guideModal = document.getElementById('guideModal');
    if (event.target === guideModal) {
        guideModal.style.display = 'none';
    }
}

function clearWords() {
    const wordInput = document.getElementById('wordInput');
    wordInput.value = '';

    currentIndex = 0;
    spokenWords.clear();
    randomizedWords = [];

    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    const displayedWordElement = document.getElementById('displayedWord');
    displayedWordElement.textContent = '';

    const displayedWordContainer = document.getElementById('displayedWordContainer');
    displayedWordContainer.style.display = 'none';

    const startButton = document.getElementById('startButton');
    startButton.disabled = false;

    // Reset progress bar
    progressValue = 0;
    progressBar.style.width = '0%';
}

function startOralTest() {
    const wordInput = document.getElementById('wordInput');
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');
    const displayedWordContainer = document.getElementById('displayedWordContainer');

    wordsForTest = wordInput.value.trim().split(/\s+/);

    if (wordsForTest.length > 0) {
        if (currentIndex >= randomizedWords.length) {
            currentIndex = 0;
            spokenWords.clear();
            randomizedWords = generateRandomOrder(wordsForTest);
        }

        if (currentUtterance) {
            speechSynthesis.cancel();
        }

        const currentWord = randomizedWords[currentIndex];
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'ne-NP';

        currentUtterance = utterance;

        speechSynthesis.speak(utterance);

        displayedWordElement.textContent = currentWord;
        displayedWordContainer.style.display = document.getElementById('displayCheckbox').checked ? 'block' : 'none';
        spokenWords.add(currentWord);
        currentIndex++;

        startButton.disabled = true;

        const progressInterval = setInterval(function() {
            if (progressValue < 100) {
                progressValue += 1;
                progressBar.style.width = progressValue + '%';
            } else {
                clearInterval(progressInterval);
            }
        }, 100);

        utterance.onend = function () {
            if (currentIndex < randomizedWords.length) {
                startButton.disabled = false;
            } else {
                alert('Oral test completed. Every word has been spoken.');
            }
            clearInterval(progressInterval);
            progressValue = 0;
            progressBar.style.width = '0%';
        };
    } else {
        alert('Please enter words for the test.');
    }
}

function repeatWord() {
    if (currentUtterance) {
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(randomizedWords[currentIndex - 1]);
        utterance.lang = 'ne-NP';

        speechSynthesis.speak(utterance);
    }
}

function resetOralTest() {
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');
    const displayedWordContainer = document.getElementById('displayedWordContainer');

    currentIndex = 0;
    spokenWords.clear();
    randomizedWords = generateRandomOrder(wordsForTest);

    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    const currentWord = randomizedWords[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'ne-NP';

    currentUtterance = utterance;

    speechSynthesis.speak(utterance);

    displayedWordElement.textContent = currentWord;
    displayedWordContainer.style.display = document.getElementById('displayCheckbox').checked ? 'block' : 'none';
    spokenWords.add(currentWord);
    currentIndex++;

    startButton.disabled = true;

    utterance.onend = function () {
        if (currentIndex < randomizedWords.length) {
            startButton.disabled = false;
        } else {
            alert('Oral test completed. Every word has been spoken.');
        }
    };
}

function stopSpeech() {
    if (currentUtterance) {
        speechSynthesis.cancel();
        currentIndex = 0;
        spokenWords.clear();

        const startButton = document.getElementById('startButton');
        startButton.disabled = false;
    }
}

function updateDisplayWordVisibility() {
    const displayedWordContainer = document.getElementById('displayedWordContainer');
    displayedWordContainer.style.display = document.getElementById('displayCheckbox').checked ? 'block' : 'none';
}

document.getElementById('displayCheckbox').addEventListener('change', updateDisplayWordVisibility);

function generateRandomOrder(words) {
    const uniqueWords = Array.from(new Set(words));
    let randomOrder = [...uniqueWords];
    shuffleArray(randomOrder);
    return randomOrder;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// New function to handle auto speech
function startAutoSpeech() {
    if (autoSpeechInterval) {
        clearInterval(autoSpeechInterval);
    }

    const wordInput = document.getElementById('wordInput');
    wordsForTest = wordInput.value.trim().split(/\s+/);

    if (wordsForTest.length > 0) {
        randomizedWords = generateRandomOrder(wordsForTest);
        currentIndex = 0;

        // Speak the first word immediately
        speakNextWord();

        // Start the interval for subsequent words with a shorter delay
        autoSpeechInterval = setInterval(speakNextWord, 8000); // Adjust delay as needed
    } else {
        alert('Please enter words for the test.');
    }
}

function speakNextWord() {
    if (currentIndex < randomizedWords.length) {
        if (currentUtterance) {
            speechSynthesis.cancel();
        }

        const currentWord = randomizedWords[currentIndex];
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'ne-NP';

        currentUtterance = utterance;

        // Display the current word
        const displayedWordElement = document.getElementById('displayedWord');
        displayedWordElement.textContent = currentWord;
        const displayedWordContainer = document.getElementById('displayedWordContainer');
        displayedWordContainer.style.display = 'block';

        // Display the countdown timer
        let timer = 5; // Initial timer value (in seconds)
        const timerElement = document.getElementById('timer');
        timerElement.textContent= timer;

        // Update timer every second
        const countdown = setInterval(function() {
            timer--;
            timerElement.textContent = timer;

            if (timer === 0) {
                clearInterval(countdown);
            }
        }, 1000);

        speechSynthesis.speak(utterance);

        spokenWords.add(currentWord);
        currentIndex++;
    } else {
        clearInterval(autoSpeechInterval);
        alert('Auto speech completed.');
    }
        }
