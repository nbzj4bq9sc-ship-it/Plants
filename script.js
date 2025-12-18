const plantSelect = document.getElementById("plantSelect");
const resultDiv = document.getElementById("result");
const scoreDiv = document.querySelector(".score");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");
const tipDiv = document.querySelector(".tip");

// Populate select
plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

// Wording by percentage ranges
function getMessage(score) {
  if(score <= 10) return "☠️ This plant is doomed… maybe try another one!";
  if(score <= 25) return "💀 Danger zone! Your plant needs serious attention.";
  if(score <= 50) return "☹️ Not looking good. Adjust water or light.";
  if(score <= 75) return "⚠️ Could be better. Keep an eye on it and tweak care.";
  if(score <= 90) return "🌿 You’re doing well! Just minor tweaks needed.";
  return "🌟 Perfect! This plant should thrive beautifully!";
}

// Animate score from 0 to target
function animateScore(targetScore) {
  let current = 0;
  scoreDiv.textContent = "0%";
  const interval = setInterval(() => {
    current++;
    if(current > targetScore) current = targetScore;
    scoreDiv.textContent = current + "%";
    if(current === targetScore) clearInterval(interval);
  }, 15);
}

function calculate() {
  const plant = plants[plantSelect.value];
  const userWater = parseInt(document.getElementById("water").value);
  const userLight = parseInt(document.getElementById("light").value);

  let score = 100; // Start at 100 to allow perfect score
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

  // Animate score
  animateScore(score);

  // Set messages
  messageDiv.textContent = getMessage(score);
  reasonDiv.textContent = reason ? `Main issue: ${reason}` : "Nothing critical";
  tipDiv.textContent = plant.tip;

  resultDiv.classList.remove("hidden");
}
