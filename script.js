const plantSelect = document.getElementById("plantSelect");
const resultDiv = document.getElementById("result");
const scoreDiv = document.querySelector(".score");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");

// Populate select
plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

// Wording by percentage ranges
function getMessage(score) {
  if (score === 100) return "🌟 Perfect! This plant will thrive!";
  if (score >= 75) return "🌿 You’re doing great!";
  if (score >= 50) return "⚠️ Could be better, watch closely.";
  if (score >= 25) return "☹️ Not looking good, be careful!";
  if (score >= 10) return "💀 Danger zone, reconsider your choices.";
  return "☠️ Deadly! This plant is doomed!";
}

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

  let score = 80;
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

  resultDiv.classList.remove("hidden");
}
