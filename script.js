const plantSelect = document.getElementById("plantSelect");
const resultDiv = document.getElementById("result");
const scoreDiv = document.querySelector(".score");
const emojiDiv = document.querySelector(".emoji");
const messageDiv = document.querySelector(".message");
const tipDiv = document.querySelector(".tip");
const shareBtn = document.getElementById("shareBtn");
const tempSlider = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");

// Update temperature display
tempSlider.addEventListener("input", () => {
  tempValue.textContent = `${tempSlider.value}°C`;
});

// Populate plant select
plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

// Emoji by score
function getEmoji(score){
  if(score <= 10) return "☠️";
  if(score <= 25) return "💀";
  if(score <= 50) return "☹️";
  if(score <= 75) return "⚠️";
  if(score <= 90) return "🌿";
  return "🌟";
}

// Message by score
function getMessage(score) {
  if(score <= 10) return "Critical care needed!";
  if(score <= 25) return "Major care needed!";
  if(score <= 50) return "Some care adjustments recommended.";
  if(score <= 75) return "Minor tweaks recommended.";
  if(score <= 90) return "Looking good!";
  return "Perfect! Your plant should thrive!";
}

// Animate score
function animateScore(targetScore) {
  let current = 0;
  scoreDiv.textContent = "0%";
  emojiDiv.textContent = "🌿";
  scoreDiv.classList.remove("pulse", "bounce");
  messageDiv.classList.remove("fade-in", "show");
  tipDiv.classList.remove("fade-in", "show");
  shareBtn.classList.remove("fade-in", "show", "hidden");

  const interval = setInterval(() => {
    current++;
    if(current > targetScore) current = targetScore;
    scoreDiv.textContent = current + "%";
    emojiDiv.textContent = getEmoji(current);
    scoreDiv.classList.add("pulse");

    if(current === targetScore) {
      clearInterval(interval);
      scoreDiv.classList.add("bounce");
      messageDiv.textContent = getMessage(targetScore);
      tipDiv.textContent = plants[plantSelect.value].tip;

      messageDiv.classList.add("fade-in", "show");
      tipDiv.classList.add("fade-in", "show");
      shareBtn.classList.add("fade-in", "show");

      saveHistory(plantSelect.value, targetScore);
    }
  }, 15);
}

// Local history
function saveHistory(plantIndex, score){
  let history = JSON.parse(localStorage.getItem("plantHistory")||"[]");
  const plant = plants[plantIndex];
  history.push({name: plant.name, score, date: new Date().toISOString()});
  localStorage.setItem("plantHistory", JSON.stringify(history));
}

// Calculate function
function calculate() {
  const plant = plants[plantSelect.value];
  const userWater = parseInt(document.getElementById("water").value);
  const userLight = parseInt(document.getElementById("light").value);
  const userTemp = parseInt(document.getElementById("temperature").value);

  let score = 100;

  const waterDiff = Math.abs(userWater - plant.water);
  const lightDiff = Math.abs(userLight - plant.light);
  const tempDiff = Math.abs(userTemp - plant.temp);

  if (waterDiff > 0) score -= waterDiff * 20;
  if (lightDiff > 0) score -= lightDiff * 15;
  if (tempDiff > 5) score -= 15;

  score = Math.max(0, Math.min(100, score));

  animateScore(score);
  resultDiv.classList.remove("hidden");
}

// Share button (text + link only)
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const shareText = `My ${plant.name} has a ${score} chance of survival!\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`;

  if (navigator.share) {
    navigator.share({
      title: 'Will my plant survive?',
      text: shareText
    }).catch(err => console.log('Share cancelled', err));
  } else {
    navigator.clipboard.writeText(shareText).then(()=>{
      alert("Result copied! Share it anywhere.");
    });
  }
});
