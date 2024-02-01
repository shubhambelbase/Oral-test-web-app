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
    if (currentIndex >= randomizedWords.length) {
      currentIndex = 0;
      spokenWords.clear();
      randomizedWords = generateRandomOrder(wordsForTest);
    }

    if (currentUtterance) {
      speechSynthesis.cancel();
    }

    // Create a new SpeechSynthesisUtterance for the current word
    const currentWord = randomizedWords[currentIndex];
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'ne-NP'; // Set language to Nepali

    currentUtterance = utterance;

    speechSynthesis.speak(utterance);

    displayedWordElement.textContent = currentWord;
    spokenWords.add(currentWord);
    currentIndex++;

    startButton.disabled = true;

    utterance.onend = function() {
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

function generateRandomOrder(words) {
  const uniqueWords = Array.from(new Set(words));
  let randomOrder = [...uniqueWords];
  shuffleArray(randomOrder);
  return randomOrder;
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
  }
}
