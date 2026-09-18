let votes = {
  game: 20,
  store: 19,
  todo: 18,
  quiz: 16,
};

let userChoice = "To-Do App 📝";

// DOM Elements
const votesGameEl = document.getElementById("votesGame");
const votesStoreEl = document.getElementById("votesStore");
const votesTodoEl = document.getElementById("votesTodo");
const votesQuizEl = document.getElementById("votesQuiz");
const totalVotesEl = document.getElementById("totalVotes");
const feedbackMsgEl = document.getElementById("feedbackMsg");

// Emoji Icon Elements
const iconGame = document.getElementById("iconGame");
const iconStore = document.getElementById("iconStore");
const iconTodo = document.getElementById("iconTodo");
const iconQuiz = document.getElementById("iconQuiz");

const btnVoteGame = document.getElementById("btnVoteGame");
const btnVoteStore = document.getElementById("btnVoteStore");
const btnVoteTodo = document.getElementById("btnVoteTodo");
const btnVoteQuiz = document.getElementById("btnVoteQuiz");
const resetBtn = document.getElementById("resetBtn");

// Animasi Pop Angka
function triggerPopAnimation(element) {
  element.classList.remove("scale-125", "text-indigo-400");
  void element.offsetWidth;
  element.classList.add("scale-125", "text-indigo-400");

  setTimeout(() => {
    element.classList.remove("scale-125", "text-indigo-400");
  }, 150);
}

// Animasi Emoji (Muter 360 derajat + membesar)
function triggerIconAnimation(iconElement) {
  iconElement.classList.remove("-rotate-12", "rotate-[360deg]", "scale-125");
  void iconElement.offsetWidth;
  iconElement.classList.add("rotate-[360deg]", "scale-125");

  setTimeout(() => {
    iconElement.classList.remove("rotate-[360deg]", "scale-125");
  }, 300);
}

// Function update UI
function updateUI(targetEl, targetIcon) {
  votesGameEl.textContent = votes.game;
  votesStoreEl.textContent = votes.store;
  votesTodoEl.textContent = votes.todo;
  votesQuizEl.textContent = votes.quiz;

  const total = votes.game + votes.store + votes.todo + votes.quiz;
  totalVotesEl.textContent = total;

  if (userChoice) {
    feedbackMsgEl.textContent = `✅ Kamu memilih ${userChoice}`;
  } else {
    feedbackMsgEl.textContent = "💡 Silakan berikan pilihanmu!";
  }

  // Jalankan animasi jika tombol diklik
  if (targetEl) triggerPopAnimation(targetEl);
  if (targetIcon) triggerIconAnimation(targetIcon);
  if (targetEl) triggerPopAnimation(totalVotesEl);
}

// Voting Actions
btnVoteGame.addEventListener("click", () => {
  votes.game++;
  userChoice = "Mini Game 🎮";
  updateUI(votesGameEl, iconGame);
});

btnVoteStore.addEventListener("click", () => {
  votes.store++;
  userChoice = "Mini Store 🛒";
  updateUI(votesStoreEl, iconStore);
});

btnVoteTodo.addEventListener("click", () => {
  votes.todo++;
  userChoice = "To-Do App 📝";
  updateUI(votesTodoEl, iconTodo);
});

btnVoteQuiz.addEventListener("click", () => {
  votes.quiz++;
  userChoice = "Quiz App 🧠";
  updateUI(votesQuizEl, iconQuiz);
});

// Reset Action
resetBtn.addEventListener("click", () => {
  votes = { game: 0, store: 0, todo: 0, quiz: 0 };
  userChoice = "";
  updateUI();
});

// Initial Render
updateUI();
