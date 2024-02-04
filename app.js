let wordsForTest = [];
let randomizedWords = [];
let currentIndex = 0;
let spokenWords = new Set();
let currentUtterance = null;

// Fade-in animation for the entire body
document.body.style.opacity = 1; // Ensure the body starts visible
document.body.style.animation = 'fadeIn 1s ease-in-out forwards';

// Show the guide modal
function showGuide() {
    const guideModal = document.getElementById('guideModal');
    guideModal.style.display = 'block';
}

// Close the guide modal
function closeGuideModal() {
    const guideModal = document.getElementById('guideModal');
    guideModal.style.display = 'none';
}

// Close the guide modal if the user clicks outside the modal
window.onclick = function(event) {
    const guideModal = document.getElementById('guideModal');
    if (event.target === guideModal) {
        guideModal.style.display = 'none';
    }
}

// Add this function to clear the words and reset everything
function clearWords() {
    const wordInput = document.getElementById('wordInput');
    wordInput.value = ''; // Clear the written words

    // Reset everything
    currentIndex = 0;
    spokenWords.clear();
    randomizedWords = [];

    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    const displayedWordElement = document.getElementById('displayedWord');
    displayedWordElement.textContent = '';

    const startButton = document.getElementById('startButton');
    startButton.disabled = false;
}

function startOralTest() {
    const wordInput = document.getElementById('wordInput');
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');

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
