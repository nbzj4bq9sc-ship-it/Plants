const plantSelect = document.getElementById("plantSelect");
const resultDiv = document.getElementById("result");
const scoreDiv = document.querySelector(".score");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");
const tipDiv = document.querySelector(".tip");
const shareBtn = document.getElementById("shareBtn");

// Populate select
plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

// Convert score to approximate lifespan
function scoreToDuration(score) {
  if(score <= 10) return "a few days";
  if(score <= 25) return "1-2 weeks";
  if(score <= 50) return "1-2 months";
  if(score <= 75) return "6-12 months";
  if(score <= 90) return "1-2 years";
  return "several years";
}

// Wording by percentage ranges (message remains)
function getMessage(score) {
  if(score <= 10) return "☠️ This plant is doomed… maybe try another one!";
  if(score <= 25) return "💀 Danger zone! Your plant needs serious attention.";
  if(score <= 50) return "☹️ Not looking good. Adjust water or light.";
  if(score <= 75) return "⚠️ Could be better. Keep an eye on it and tweak care.";
  if(score <= 90) return "🌿 You’re doing well! Just minor tweaks needed.";
  return "🌟 Perfect! This plant should thrive beautifully!";
}

// Animate score (duration now) + fade/slide for tip & share button
function animateScore(targetScore) {
  let current = 0;
  scoreDiv.textContent = "calculating...";
  scoreDiv.classList.remove("pulse", "bounce");
  messageDiv.classList.remove("fade-in", "show");
  reasonDiv.classList.remove("fade-in", "show");
  tipDiv.classList.remove("fade-in", "show");
  shareBtn.classList.remove("fade-in", "show", "hidden");

  const interval = setInterval(() => {
    current++;
    if(current > targetScore) current = targetScore;

    scoreDiv.textContent = scoreToDuration(current);

    scoreDiv.classList.add("pulse");

    if(current === targetScore) {
      clearInterval(interval);
      scoreDiv.classList.add("bounce");
      messageDiv.classList.add("fade-in", "show");
      reasonDiv.classList.add("fade-in", "show");
      tipDiv.classList.add("fade-in", "show");
      shareBtn.classList.add("fade-in", "show");
    }
  }, 15);
}

function calculate() {
  const plant = plants[plantSelect.value];
  const userWater = parseInt(document.getElementById("water").value);
  const userLight = parseInt(document.getElementById("light").value);

  let score = 100;
  let reason = "";

  const waterDiff = Math.abs(userWater - plant.water);
  const lightDiff = Math.abs(userLight - plant.light);

  if (waterDiff > 0) {
    score -= waterDiff * 20;
    reason = userWater > plant.water ? "Too much water" : "Not enough water";
  }

  if (lightDiff > 0) {
    score -= lightDiff * 15;
    if (!reason) reason = userLight > plant.light ? "Too much light" : "Not enough light";
  }

  score = Math.max(0, Math.min(100, score));

  animateScore(score);

  messageDiv.textContent = getMessage(score);
  reasonDiv.textContent = reason ? `Main issue: ${reason}` : "Nothing critical";
  tipDiv.textContent = plant.tip;

  resultDiv.classList.remove("hidden");
}

// Share button functionality
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const duration = scoreDiv.textContent;

  const text = `I think my ${plant.name} will survive ${duration}! Check your plant here: https://your-site-url.com`;

  if (navigator.share) {
    navigator.share({
      title: 'How long will my plant survive?',
      text: text,
      url: 'https://nbzj4bq9sc-ship-it.github.io/Plants/',
    }).catch(err => console.log('Share cancelled', err));
  } else {
    navigator.clipboard.writeText(text).then(() => {
      alert("Result copied! Share it anywhere.");
    });
  }
});
