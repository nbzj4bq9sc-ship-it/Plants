// Elements
const plantSelect = document.getElementById("plantSelect");
const waterInput = document.getElementById("water");
const lightSelect = document.getElementById("light");
const tempSlider = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");
const resultDiv = document.getElementById("result");
const scoreDiv = resultDiv.querySelector(".score");
const emojiDiv = resultDiv.querySelector(".emoji");
const messageDiv = resultDiv.querySelector(".message");
const reasonDiv = resultDiv.querySelector(".reason");
const tipDiv = resultDiv.querySelector(".tip");
const shareBtn = document.getElementById("shareBtn");
const langBtn = document.getElementById("langBtn");

// Text elements for translation
const titleEl = document.getElementById("title");
const subtitleEl = document.getElementById("subtitle");
const labelPlant = document.getElementById("labelPlant");
const labelWater = document.getElementById("labelWater");
const labelLight = document.getElementById("labelLight");
const labelTemp = document.getElementById("labelTemp");
const calculateBtn = document.getElementById("calculateBtn");
const disclaimerEl = document.getElementById("disclaimer");
const creditsEl = document.getElementById("credits");

// Language state
let currentLang = "en";

// Translation data
const translations = {
  en: {
    title: "Will my plant survive?",
    subtitle: "A quick estimation. Be honest. We will.",
    plant: "Plant",
    water: "Watering (times per week)",
    light: "Light",
    temp: "Temperature (°C)",
    calculate: "Face the truth",
    disclaimer: "Not science. Just experience. Plants sometimes have personality.",
    share: "Share my plant skills 😎",
    credits: "Created by Romain Daney. Inspired by houseplant care guides. 🌱",
    lightOptions: ["Low", "Medium", "Bright"],
    shareText: (plantName, score) => `My ${plantName} has a ${score} chance of survival! 🌿\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  },
  fr: {
    title: "Ma plante survivra-t-elle ?",
    subtitle: "Estimation rapide. Soyez honnête. Nous aussi.",
    plant: "Plante",
    water: "Arrosage (fois par semaine)",
    light: "Lumière",
    temp: "Température (°C)",
    calculate: "Affrontez la vérité",
    disclaimer: "Pas scientifique. Juste de l’expérience. Les plantes ont parfois leur personnalité.",
    share: "Partage mes skills de plante 😎",
    credits: "Créé par Romain Daney. Inspiré des guides de soins de plantes. 🌱",
    lightOptions: ["Faible", "Moyenne", "Élevée"],
    shareText: (plantName, score) => `Ma ${plantName} a ${score} de chance de survie ! 🌿\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  }
};

// Update text function
function updateLanguage() {
  const t = translations[currentLang];
  titleEl.querySelector("img") ? null : titleEl.innerHTML = t.title; 
  subtitleEl.textContent = t.subtitle;
  labelPlant.textContent = t.plant;
  labelWater.textContent = t.water;
  labelLight.textContent = t.light;
  labelTemp.textContent = t.temp;
  calculateBtn.textContent = t.calculate;
  disclaimerEl.textContent = t.disclaimer;
  creditsEl.textContent = t.credits;
  shareBtn.textContent = t.share;

  // Update light options
  Array.from(lightSelect.options).forEach((opt, idx) => {
    opt.textContent = t.lightOptions[idx];
  });

  // Update plant names
  plantSelect.innerHTML = "";
  plants.forEach((plant, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = currentLang === "fr" ? plant.name_fr || plant.name : plant.name;
    plantSelect.appendChild(option);
  });

  // Update lang button
  langBtn.textContent = currentLang === "en" ? "FR" : "EN";
}

// Initial population
updateLanguage();

// Temperature slider update
tempSlider.addEventListener("input", () => {
  tempValue.textContent = `${tempSlider.value}°C`;
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
function getMessage(score, reason) {
  if(score <= 10) return reason ? `Critical issue: ${reason}` : "Critical issues detected!";
  if(score <= 25) return reason ? `Major concern: ${reason}` : "Major care needed!";
  if(score <= 50) return reason ? `Attention needed: ${reason}` : "Some care adjustments recommended.";
  if(score <= 75) return reason ? `Minor tweaks: ${reason}` : "Your plant is mostly okay.";
  if(score <= 90) return reason ? `Good, minor adjustments: ${reason}` : "Looking good!";
  return "Perfect! Your plant should thrive!";
}

// Mini tip (plant independent)
function getMiniTip(plant){
  return plant.tip;
}

// Animate score
function animateScore(targetScore, reason) {
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

    if(current === targetScore){
      clearInterval(interval);
      scoreDiv.classList.add("bounce");
      messageDiv.textContent = getMessage(targetScore, reason);
      reasonDiv.textContent = reason ? reason : "";
      tipDiv.textContent = getMiniTip(plants[plantSelect.value]);

      messageDiv.classList.add("fade-in","show");
      reasonDiv.classList.add("fade-in","show");
      tipDiv.classList.add("fade-in","show");
      shareBtn.classList.add("fade-in","show");

      saveHistory(plantSelect.value, targetScore);
    }
  }, 15);
}

// Calculate
function calculate(){
  const plant = plants[plantSelect.value];
  const userWater = parseInt(waterInput.value);
  const userLight = parseInt(lightSelect.value);
  const userTemp = parseInt(tempSlider.value);

  let score = 100;
  let reason = "";

  const waterDiff = Math.abs(userWater - plant.water);
  const lightDiff = Math.abs(userLight - plant.light);
  const tempDiff = Math.abs(userTemp - plant.temp);

  if (waterDiff > 0){
    score -= waterDiff * 20;
    reason = userWater > plant.water ? (currentLang==="fr"?"Trop d’eau":"Too much water") : (currentLang==="fr"?"Pas assez d’eau":"Not enough water");
  }
  if (lightDiff > 0){
    score -= lightDiff * 15;
    if(!reason) reason = userLight > plant.light ? (currentLang==="fr"?"Trop de lumière":"Too much light") : (currentLang==="fr"?"Pas assez de lumière":"Not enough light");
  }
  if(tempDiff > 5){
    score -= 15;
    if(!reason) reason = currentLang==="fr"?"Température non adaptée":"Temperature mismatch";
  }

  score = Math.max(0, Math.min(100, score));
  animateScore(score, reason);
  resultDiv.classList.remove("hidden");
}

// Local history
function saveHistory(plantIndex, score){
  let history = JSON.parse(localStorage.getItem("plantHistory")||"[]");
  const plant = plants[plantIndex];
  history.push({name: plant.name, score, date: new Date().toISOString()});
  localStorage.setItem("plantHistory", JSON.stringify(history));
}

// Share
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const shareText = translations[currentLang].shareText(currentLang==="fr"?plant.name_fr||plant.name:plant.name, score);

  if (navigator.share){
    navigator.share({
      title: translations[currentLang].title,
      text: shareText
    }).catch(err=>console.log("Share cancelled", err));
  } else {
    navigator.clipboard.writeText(shareText).then(()=>{
      alert(currentLang==="fr"?"Résultat copié!":"Result copied! Share it anywhere.");
    });
  }
});

// Language toggle
langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fr" : "en";
  updateLanguage();
});
