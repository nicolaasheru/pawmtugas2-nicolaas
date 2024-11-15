// Array untuk menyimpan soal dan jawabannya
const questions = [
    { level: "1", word: "Apple", translation: "Apel" },
    { level: "2", word: "Banana", translation: "Pisang" },
    { level: "3", word: "Car", translation: "Mobil" },
    { level: "4", word: "Dog", translation: "Anjing" },
    { level: "5", word: "Cat", translation: "Kucing" },
    { level: "6", word: "Bird", translation: "Burung" },
    { level: "7", word: "Tree", translation: "Pohon" },
    { level: "8", word: "House", translation: "Rumah" },
    { level: "9", word: "Computer", translation: "Komputer" },
    { level: "10", word: "The cat is sitting near the door", translation: "Kucing duduk di dekat pintu" },
    { level: "11", word: "The apple is on the table", translation: "Apel ada di atas meja" },
    { level: "12", word: "The bird is in the tree", translation: "Burung ada di pohon" },
    { level: "13", word: "The car is parked near the house", translation: "Mobil diparkir di dekat rumah" },
    { level: "14", word: "I need a pen", translation: "Saya butuh sebuah pena" },
    { level: "15", word: "I have a new computer", translation: "Saya punya komputer baru" },
];

// Global variables
API_BASE_URL = "https://pawmtugas2-nicolaas-backend.vercel.app";
let currentLevel = 0;
let currentQuestionIndex = 0;
let questionsForLevel = [];

// DOM Elements
const levelDisplay = document.getElementById("level");
const levelBarProgress = document.querySelector(".level-bar-progress");
const quizWord = document.getElementById("quiz-word");
const userAnswer = document.getElementById("user-answer");
const submitButton = document.getElementById("submit-answer");
const nextButton = document.getElementById("next-question");
const resultMessage = document.getElementById("result-message");

// Check authentication
function checkAuthentication() {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    if (!token) {
        window.location.href = "./login.html";
    }
}

// Fetch user progress
async function fetchUserProgress() {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    try {
        const response = await fetch(`${API_BASE_URL}/user-progress`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user progress");
        }

        const { level } = await response.json();
        currentLevel = level;
        loadQuestionsForLevel(level);
    } catch (error) {
        console.error(error);
    }
}

// Load questions for the user's level
function loadQuestionsForLevel(level) {
    questionsForLevel = questions.filter(q => q.level === level);

    if (questionsForLevel.length > 0) {
        currentQuestionIndex = 0;
        loadQuestion();
    } else {
        displayCongratulations();
    }

    levelDisplay.textContent = level;
    updateLevelBar();
}

// Load the current question
function loadQuestion() {
    const currentQuestion = questionsForLevel[currentQuestionIndex];
    quizWord.textContent = currentQuestion.word;
    userAnswer.value = "";
    userAnswer.disabled = false;
    resultMessage.textContent = "";
    nextButton.disabled = true;
}

// Submit answer
submitButton.addEventListener("click", async () => {
    const userInput = userAnswer.value.trim();
    const currentQuestion = questionsForLevel[currentQuestionIndex];

    if (userInput.toLowerCase() === currentQuestion.translation.toLowerCase()) {
        resultMessage.textContent = "Correct! 🎉";
        resultMessage.style.color = "green";
        userAnswer.disabled = true;
        nextButton.disabled = false;
        currentLevel++;
        await upgradeLevel(currentLevel); // Update level in the backend
    } else {
        resultMessage.textContent = `Wrong! The correct answer is: ${currentQuestion.translation}`;
        resultMessage.style.color = "red";
    }
});

// Upgrade user level
async function upgradeLevel(level) {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    try {
        await fetch(`${API_BASE_URL}/upgrade-level`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ level }),
        });
    } catch (error) {
        console.error(error);
        alert("Failed to upgrade level.");
    }
}

// Handle "Next Question"
nextButton.addEventListener("click", async () => {
    const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

    try {
        const response = await fetch(`${API_BASE_URL}/user-progress`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user progress");
        }

        const { level } = await response.json();

        if (level === currentLevel) {
            currentQuestionIndex++;

            if (currentQuestionIndex >= questionsForLevel.length) {
                loadQuestionsForLevel(level);
            } else {
                loadQuestion();
            }
        } else {
            alert("You need to complete the current level before progressing!");
        }
    } catch (error) {
        console.error(error);
        alert("Failed to validate progress.");
    }
});

// Display congratulations message
function displayCongratulations() {
    document.querySelector(".quiz-container").innerHTML = `
        <h2>Congratulations!</h2>
        <p>You've completed the quiz! 🎉</p>
        <p>Continue improving your English with this helpful video:</p>
        <div class="video-container">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/W0CLcHqtQ_s?si=doQ6F7R8zZiA1KFC" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
}

// Update level bar
function updateLevelBar() {
    const progressPercentage = (currentLevel / questions.length) * 100;
    levelBarProgress.style.width = `${progressPercentage}%`;
}

// Check authentication and load progress on page load
document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication();
    fetchUserProgress();
});
