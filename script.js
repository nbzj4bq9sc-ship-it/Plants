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
const langBtn = document.getElementById("langBtn");

let currentLang = 'en';

// Language translations
const translations = {
  fr: {
    title: "🌱 Ma plante survivra-t-elle ?",
    subtitle: "Une estimation rapide. Soyez honnête. Nous le serons.",
    labelPlant: "Plante",
    labelWater: "Arrosage (fois par semaine)",
    labelLight: "Lumière",
    labelTemp: "Température (°C)",
    btnCalculate: "Affrontez la vérité",
    shareBtn: "Partagez mes compétences 😎",
    disclaimer: "Pas scientifique. Juste de l’expérience. Les plantes ont parfois une personnalité.",
    credits: "Créé par Romain Daney. Inspiré des guides de soins des plantes d'intérieur. 🌱",
    waterTooMuch: "Vous devriez arroser votre {plant} {n} fois par semaine maximum.",
    waterTooLittle: "Vous devriez arroser votre {plant} au moins {n} fois par semaine.",
    lightTooMuch: "Réduisez la lumière pour votre {plant}.",
    lightTooLittle: "Augmentez la lumière pour votre {plant}.",
    tempIssue: "Ajustez la température autour de votre {plant}.",
    shareText: "Ma {plant} a {score} de chance de survie !\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/",
    waterOptions: ["0", "1", "2", "3+"],
    lightOptions: ["Faible", "Moyenne", "Élevée"]
  },
  en: {
    title: "🌱 Will my plant survive?",
    subtitle: "A quick estimation. Be honest. We will.",
    labelPlant: "Plant",
    labelWater: "Watering (times per week)",
    labelLight: "Light",
    labelTemp: "Temperature (°C)",
    btnCalculate: "Face the truth",
    shareBtn: "Share my plant skills 😎",
    disclaimer: "Not science. Just experience. Plants sometimes have personality.",
    credits: "Created by Romain Daney. Inspired by houseplant care guides. 🌱",
    waterTooMuch: "You should water your {plant} {n} times per week maximum.",
    waterTooLittle: "You should water your {plant} at least {n} times per week.",
    lightTooMuch: "Reduce light exposure for your {plant}.",
    lightTooLittle: "Increase light for your {plant}.",
    tempIssue: "Adjust the temperature around your {plant}.",
    shareText: "My {plant} has a {score} chance of survival!\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/",
    waterOptions: ["0", "1", "2", "3+"],
    lightOptions: ["Low light", "Medium light", "Bright light"]
  }
};

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

// Language switch
langBtn.addEventListener("click", () => {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  langBtn.textContent = currentLang === 'en' ? "FR" : "EN";
  updateLanguage();
});

function updateLanguage() {
  const t = translations[currentLang];
  document.querySelector("h1").childNodes[0].textContent = t.title.slice(2);
  document.querySelector(".subtitle").textContent = t.subtitle;
  document.querySelector("label[for='plantSelect']").textContent = t.labelPlant;
  document.querySelector("label[for='water']").textContent = t.labelWater;
  document.querySelector("label[for='light']").textContent = t.labelLight;
  document.querySelector("label[for='temperature']").textContent = t.labelTemp;
  document.querySelector("button[onclick='calculate()']").textContent = t.btnCalculate;
  shareBtn.textContent = t.shareBtn;
  document.querySelector(".disclaimer").textContent = t.disclaimer;
  document.querySelector(".credits").textContent = t.credits;

  // update options
  const waterSelect = document.getElementById("water");
  const lightSelect = document.getElementById("light");
  t.waterOptions.forEach((txt, i) => waterSelect.options[i].textContent = txt);
  t.lightOptions.forEach((txt, i) => lightSelect.options[i].textContent = txt);
}

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

// Main issue
function getMainIssue(plant, userWater, userLight, userTemp) {
  const t = translations[currentLang];
  const waterDiff = Math.abs(userWater - plant.water);
  const lightDiff = Math.abs(userLight - plant.light);
  const tempDiff = Math.abs(userTemp - plant.temp);

  if (waterDiff > 0) {
    if(userWater > plant.water) return t.waterTooMuch.replace("{plant}", plant.name).replace("{n}", plant.water);
    else return t.waterTooLittle.replace("{plant}", plant.name).replace("{n}", plant.water);
  }
  if (lightDiff > 0) {
    if(userLight > plant.light) return t.lightTooMuch.replace("{plant}", plant.name);
    else return t.lightTooLittle.replace("{plant}", plant.name);
  }
  if (tempDiff > 5) {
    return t.tempIssue.replace("{plant}", plant.name);
  }
  return "";
}

// Animate score
function animateScore(targetScore, plant, userWater, userLight, userTemp) {
  let current = 0;
  scoreDiv.textContent = "0%";
  emojiDiv.textContent = "🌿";
  scoreDiv.classList.remove("pulse", "bounce");
  messageDiv.classList.remove("fade-in", "show");
  reasonDiv.classList.remove("fade-in", "show", "hidden");
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
      reasonDiv.textContent = getMainIssue(plant, userWater, userLight, userTemp);
      tipDiv.textContent = plant.tip;

      messageDiv.classList.add("fade-in", "show");
      reasonDiv.classList.add("fade-in", "show");
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

// Calculate
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

  animateScore(score, plant, userWater, userLight, userTemp);
  resultDiv.classList.remove("hidden");
}

// Share button
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const t = translations[currentLang];
  const shareText = t.shareText.replace("{plant}", plant.name).replace("{score}", score);

  if (navigator.share) {
    navigator.share({
      title: t.title,
      text: shareText
    }).catch(err => console.log('Share cancelled', err));
  } else {
    navigator.clipboard.writeText(shareText).then(()=>{
      alert(currentLang==='fr'?"Résultat copié ! Partagez-le où vous voulez.":"Result copied! Share it anywhere.");
    });
  }
});
