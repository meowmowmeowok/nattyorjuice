const portraits = [
  { id: 1, src: "assets/images/juiced.webp" },
  { id: 2, src: "assets/images/juiced2.webp" },
  { id: 3, src: "assets/images/juiced3.webp" },
  { id: 4, src: "assets/images/juiced4.webp" },
  { id: 5, src: "assets/images/juiced5.webp" },
  { id: 6, src: "assets/images/juiced6.webp" },
  { id: 7, src: "assets/images/juiced7.webp" },
  { id: 8, src: "assets/images/juiced8.jpg" },
  { id: 9, src: "assets/images/juiced9.webp" },
  { id: 10, src: "assets/images/juiced10.jpg" },
  { id: 11, src: "assets/images/juiced11.webp" },
  { id: 12, src: "assets/images/juiced12.webp" },
  { id: 13, src: "assets/images/juiced13.jpg" },
  { id: 14, src: "assets/images/juiced14.jpg" },
  { id: 15, src: "assets/images/juiced15.webp" },
  { id: 16, src: "assets/images/juiced16.jpeg" },
  { id: 17, src: "assets/images/juiced17.jpeg" },
  { id: 18, src: "assets/images/juiced18.jpg" },
  { id: 19, src: "assets/images/juiced19.jpeg" },
  { id: 20, src: "assets/images/juiced20.avif" }
];

const uniquePortraits = [...new Map(portraits.map((portrait) => [portrait.src, portrait])).values()];
const TOTAL_IMAGES = uniquePortraits.length;

const introBand = document.querySelector(".intro-band");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const reviewScreen = document.querySelector("#review-screen");
const startButton = document.querySelector("#start-button");
const quizImage = document.querySelector("#quiz-image");
const questionCount = document.querySelector("#question-count");
const progressFill = document.querySelector("#progress-fill");
const scoreLine = document.querySelector("#score-line");
const reviewImage = document.querySelector("#review-image");
const reviewTitle = document.querySelector("#review-title");
const reviewChoice = document.querySelector("#review-choice");
const previousReviewButton = document.querySelector("#previous-review-button");
const nextReviewButton = document.querySelector("#next-review-button");

let quizOrder = [];
let answers = [];
let currentIndex = 0;
let reviewIndex = 0;

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporary = shuffled[index];
    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temporary;
  }

  return shuffled;
}

function formatIndex(index) {
  return String(index + 1).padStart(2, "0");
}

function showIntro() {
  introBand.hidden = false;
  quizScreen.hidden = true;
  resultScreen.hidden = true;
  reviewScreen.hidden = true;
}

function startGame() {
  quizOrder = shuffle(uniquePortraits);
  answers = [];
  currentIndex = 0;
  reviewIndex = 0;

  introBand.hidden = true;
  resultScreen.hidden = true;
  reviewScreen.hidden = true;
  quizScreen.hidden = false;

  renderQuestion();
}

function renderQuestion() {
  const portrait = quizOrder[currentIndex];
  const visibleIndex = formatIndex(currentIndex);

  quizImage.src = portrait.src;
  quizImage.alt = `Portrait ${currentIndex + 1} of ${TOTAL_IMAGES}`;
  questionCount.textContent = `${visibleIndex} / ${TOTAL_IMAGES}`;
  progressFill.style.width = `${((currentIndex + 1) / TOTAL_IMAGES) * 100}%`;
}

function submitAnswer(choice) {
  const portrait = quizOrder[currentIndex];
  answers.push({ ...portrait, choice });

  if (currentIndex === TOTAL_IMAGES - 1) {
    showResult();
    return;
  }

  currentIndex += 1;
  renderQuestion();
}

function showResult() {
  const score = answers.filter((answer) => answer.choice === "juice").length;

  scoreLine.textContent = `${score} / ${TOTAL_IMAGES}`;
  introBand.hidden = true;
  quizScreen.hidden = true;
  reviewScreen.hidden = true;
  resultScreen.hidden = false;
}

function showReview() {
  introBand.hidden = true;
  reviewIndex = 0;
  resultScreen.hidden = true;
  quizScreen.hidden = true;
  reviewScreen.hidden = false;
  renderReview();
}

function renderReview() {
  const answer = answers[reviewIndex];
  const visibleIndex = formatIndex(reviewIndex);
  const choice = answer.choice.toUpperCase();

  reviewImage.src = answer.src;
  reviewImage.alt = `Reviewed portrait ${reviewIndex + 1} of ${TOTAL_IMAGES}`;
  reviewTitle.textContent = `Image ${visibleIndex} / ${TOTAL_IMAGES}`;
  reviewChoice.textContent = `You picked ${choice}`;
  previousReviewButton.disabled = reviewIndex === 0;
  nextReviewButton.disabled = reviewIndex === answers.length - 1;
}

document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    submitAnswer(button.dataset.choice);
  });
});

startButton.addEventListener("click", startGame);
document.querySelector("#review-button").addEventListener("click", showReview);
document.querySelector("#restart-button").addEventListener("click", startGame);
document.querySelector("#back-to-result-button").addEventListener("click", showResult);

previousReviewButton.addEventListener("click", () => {
  if (reviewIndex > 0) {
    reviewIndex -= 1;
    renderReview();
  }
});

nextReviewButton.addEventListener("click", () => {
  if (reviewIndex < answers.length - 1) {
    reviewIndex += 1;
    renderReview();
  }
});

document.addEventListener("keydown", (event) => {
  if (quizScreen.hidden) {
    return;
  }

  const key = event.key.toLowerCase();

  if (key === "n") {
    submitAnswer("natty");
  }

  if (key === "j") {
    submitAnswer("juice");
  }
});

showIntro();
