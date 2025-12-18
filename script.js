const plantSelect = document.getElementById("plantSelect");
const resultDiv = document.getElementById("result");
const scoreDiv = document.querySelector(".score");
const emojiDiv = document.querySelector(".emoji");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");
const tipDiv = document.querySelector(".tip");
const shareBtn = document.getElementById("shareBtn");
const tempSlider = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");
const shareCanvas = document.getElementById("shareCanvas");

// Update temperature display
tempSlider.addEventListener("input", () => {
  tempValue.textContent = `${tempSlider.value}°C`;
});

// Populate select
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

// Wording by percentage ranges
function getMessage(score) {
  if(score <= 10) return "☠️ This plant is doomed… maybe try another one!";
  if(score <= 25) return "💀 Danger zone! Your plant needs serious attention.";
  if(score <= 50) return "☹️ Not looking good. Adjust water, light or temp.";
  if(score <= 75) return "⚠️ Could be better. Keep an eye on it and tweak care.";
  if(score <= 90) return "🌿 You’re doing well! Just minor tweaks needed.";
  return "🌟 Perfect! This plant should thrive beautifully!";
}

// Animate score
function animateScore(targetScore) {
  let current = 0;
  scoreDiv.textContent = "0%";
  emojiDiv.textContent = "🌿";
  scoreDiv.classList.remove("pulse", "bounce");
  messageDiv.classList.remove("fade-in", "show");
  reasonDiv.classList.remove("fade-in", "show");
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
      messageDiv.classList.add("fade-in", "show");
      reasonDiv.classList.add("fade-in", "show");
      tipDiv.classList.add("fade-in", "show");
      shareBtn.classList.add("fade-in", "show");

      saveHistory(plantSelect.value, current); // save local history
      generateShareImage(); // draw image on canvas
    }
  }, 15);
}

// Mini tip by combination
function getMiniTip(userWater, userLight, userTemp, plant) {
  let tips = [];
  if(userWater > plant.water) tips.push("Too much water!");
  if(userWater < plant.water) tips.push("Water more!");
  if(userLight > plant.light) tips.push("Too much light!");
  if(userLight < plant.light) tips.push("Increase light!");
  if(Math.abs(userTemp - plant.temp) > 5) tips.push("Temperature is off!");
  return tips.join(" ");
}

// Local history
function saveHistory(plantIndex, score){
  let history = JSON.parse(localStorage.getItem("plantHistory")||"[]");
  const plant = plants[plantIndex];
  history.push({name: plant.name, score, date: new Date().toISOString()});
  localStorage.setItem("plantHistory", JSON.stringify(history));
}

// Generate share image
function generateShareImage(){
  const ctx = shareCanvas.getContext("2d");
  shareCanvas.width = 500;
  shareCanvas.height = 250;
  ctx.fillStyle = "#fffaf2";
  ctx.fillRect(0,0,500,250);
  ctx.fillStyle = "#333";
  ctx.font = "24px sans-serif";
  ctx.fillText(`Plant: ${plants[plantSelect.value].name}`, 20, 50);
  ctx.fillText(`Score: ${scoreDiv.textContent}`, 20, 100);
  ctx.fillText(`${emojiDiv.textContent}`, 20, 150);
  ctx.fillText(`${tipDiv.textContent}`, 20, 200);
  shareCanvas.classList.add("hidden"); // keep hidden
}

// Calculate
function calculate() {
  const plant = plants[plantSelect.value];
  const userWater = parseInt(document.getElementById("water").value);
  const userLight = parseInt(document.getElementById("light").value);
  const userTemp = parseInt(document.getElementById("temperature").value);

  let score = 100;
  let reason = "";

  const waterDiff = Math.abs(userWater - plant.water);
  const lightDiff = Math.abs(userLight - plant.light);
  const tempDiff = Math.abs(userTemp - plant.temp);

  if (waterDiff > 0) {
    score -= waterDiff * 20;
    reason = userWater > plant.water ? "Too much water" : "Not enough water";
  }

  if (lightDiff > 0) {
    score -= lightDiff * 15;
    if (!reason) reason = userLight > plant.light ? "Too much light" : "Not enough light";
  }

  if (tempDiff > 5) { // penalty for temp mismatch
    score -= 15;
    if (!reason) reason = "Temperature mismatch";
  }

  score = Math.max(0, Math.min(100, score));

  animateScore(score);

  messageDiv.textContent = getMessage(score);
  reasonDiv.textContent = reason ? `Main issue: ${reason}` : "Nothing critical";
  tipDiv.textContent = getMiniTip(userWater, userLight, userTemp, plant);

  resultDiv.classList.remove("hidden");
}

// Share button
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const canvasData = shareCanvas.toDataURL("image/png");

  if (navigator.share) {
    navigator.share({
      title: 'Will my plant survive?',
      text: `I think my ${plant.name} will survive ${score}!`,
      files: [dataURLtoFile(canvasData, 'plant.png')],
    }).catch(err => console.log('Share cancelled', err));
  } else {
    navigator.clipboard.writeText(`I think my ${plant.name} will survive ${score}!`).then(()=>{
      alert("Result copied! Share it anywhere.");
    });
  }
});

// Helper: dataURL -> File
function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){ u8arr[n] = bstr.charCodeAt(n); }
  return new File([u8arr], filename, {type:mime});
}
