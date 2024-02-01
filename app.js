// app.js
let wordsForTest = [];
let randomizedWords = [];
let currentIndex = 0;
let spokenWords = new Set(); // To keep track of spoken words
let currentUtterance = null; // To keep track of the current utterance

function startOralTest() {
    const wordInput = document.getElementById('wordInput');
    const startButton = document.getElementById('startButton');
    const displayedWordElement = document.getElementById('displayedWord');

    wordsForTest = wordInput.value.trim().split(/\s+/);

    if (wordsForTest.length > 0) {
        // Generate a random order for the words (without repetition)
        randomizedWords = generateRandomOrder(wordsForTest);

        if (currentIndex >= randomizedWords.length) {
            // Reset the index when all words are spoken
            currentIndex = 0;
            spokenWords.clear(); // Clear the set of spoken words
            randomizedWords = generateRandomOrder(wordsForTest); // Regenerate the random order
        }

        if (currentUtterance) {
            // If there's an ongoing speech, stop it
            speechSynthesis.cancel();
        }

        // Create a new SpeechSynthesisUtterance for the current word
        const currentWord = randomizedWords[currentIndex];
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'ne-NP'; // Set language to Nepali

        // Keep track of the current utterance
        currentUtterance = utterance;

        // Use the SpeechSynthesis API to speak the word
        speechSynthesis.speak(utterance);

        // Display the current word
        displayedWordElement.textContent = currentWord;

        // Add the current word to the set of spoken words
        spokenWords.add(currentWord);

        // Increment the index for the next word
        currentIndex++;

        // Disable the "Start Oral Test" button during speech synthesis
        startButton.disabled = true;

        // Set up an event listener for the end of speech
        utterance.onend = function () {
            // Check if all unique words are spoken
            if (currentIndex < randomizedWords.length) {
                // Re-enable the "Start Oral Test" button after speech synthesis ends
                startButton.disabled = false;
            } else {
                // Display a message when every word is completed
                alert('Oral test completed. Every word has been spoken.');
            }
        };
    } else {
        alert('Please enter words for the test.');
    }
}

// Function to generate a random order for words (without repetition)
function generateRandomOrder(words) {
    const uniqueWords = Array.from(new Set(words));
    let randomOrder = [...uniqueWords];
    shuffleArray(randomOrder);
    return randomOrder;
}

// Function to stop the current speech
function stopSpeech() {
    if (currentUtterance) {
        speechSynthesis.cancel();
        currentIndex = 0;
        spokenWords.clear(); // Clear the set of spoken words

        // Re-enable the "Start Oral Test" button when speech is stopped
        const startButton = document.getElementById('startButton');
        startButton.disabled = false;
    }
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}