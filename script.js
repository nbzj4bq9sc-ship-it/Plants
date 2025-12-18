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

/* ================= LANGUAGE ================= */

let currentLang = "en";

const translations = {
  en: {
    title: "🌱 Will my plant survive?",
    subtitle: "A quick estimation. Be honest. We will.",
    plant: "Plant",
    water: "Watering (times per week)",
    light: "Light",
    temp: "Temperature (°C)",
    calculate: "Face the truth",
    share: "Share my plant skills 😎",
    disclaimer: "Not science. Just experience. Plants sometimes have personality.",
    credits: "Created by Romain Daney. Inspired by houseplant care guides. 🌱",
    shareText: (plant, score) =>
      `My ${plant} has a ${score} chance of survival!\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`,
    copied: "Result copied! Share it anywhere.",
    waterTooMuch: (plant, n) =>
      `You should water your ${plant} ${n} times per week maximum.`,
    waterTooLittle: (plant, n) =>
      `You should water your ${plant} at least ${n} times per week.`,
    lightTooMuch: (plant) =>
      `Reduce light exposure for your ${plant}.`,
    lightTooLittle: (plant) =>
      `Increase light for your ${plant}.`,
    tempIssue: (plant) =>
      `Adjust the temperature around your ${plant}.`
  },

  fr: {
    title: "🌱 Ma plante survivra-t-elle ?",
    subtitle: "Une estimation rapide. Soyez honnête. Nous le serons.",
    plant: "Plante",
    water: "Arrosage (fois par semaine)",
    light: "Lumière",
    temp: "Température (°C)",
    calculate: "Affrontez la vérité",
    share: "Partager mes talents de jardinier 😎",
    disclaimer: "Pas scientifique. Juste de l’expérience. Les plantes ont parfois du caractère.",
    credits: "Créé par Romain Daney. Inspiré des guides de plantes d’intérieur. 🌱",
    shareText: (plant, score) =>
      `Ma ${plant} a ${score} de chance de survie !\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`,
    copied: "Résultat copié !",
    waterTooMuch: (plant, n) =>
      `Vous devriez arroser votre ${plant} ${n} fois par semaine maximum.`,
    waterTooLittle: (plant, n) =>
      `Vous devriez arroser votre ${plant} au moins ${n} fois par semaine.`,
    lightTooMuch: (plant) =>
      `Réduisez la lumière pour votre ${plant}.`,
    lightTooLittle: (plant) =>
      `Augmentez la lumière pour votre ${plant}.`,
    tempIssue: (plant) =>
      `Ajustez la température autour de votre ${plant}.`
  }
};

langBtn.addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fr" : "en";
  langBtn.textContent = currentLang === "en" ? "FR" : "EN";
  applyLanguage();
});

function applyLanguage() {
  document.getElementById("title").textContent = translations[currentLang].title;
  document.getElementById("subtitle").textContent = translations[currentLang].subtitle;
  document.getElementById("labelPlant").textContent = translations[currentLang].plant;
  document.getElementById("labelWater").textContent = translations[currentLang].water;
  document.getElementById("labelLight").textContent = translations[currentLang].light;
  document.getElementById("labelTemp").textContent = translations[currentLang].temp;
  document.getElementById("calculateBtn").textContent = translations[currentLang].calculate;
  shareBtn.textContent = translations[currentLang].share;
  document.getElementById("disclaimer").textContent = translations[currentLang].disclaimer;
  document.getElementById("credits").textContent = translations[currentLang].credits;
}

/* ================= INIT ================= */

tempSlider.addEventListener("input", () => {
  tempValue.textContent = `${tempSlider.value}°C`;
});

plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

/* ================= EMOJI ================= */

function getEmoji(score) {
  if (score <= 10) return "☠️";
  if (score <= 25) return "💀";
  if (score <= 50) return "☹️";
  if (score <= 75) return "⚠️";
  if (score <= 90) return "🌿";
  return "🌟";
}

/* ================= MAIN ISSUE ================= */

function getMainIssue(plant, userWater, userLight, userTemp) {
  const t = translations[currentLang];

  if (userWater !== plant.water) {
    return userWater > plant.water
      ? t.waterTooMuch(plant.name, plant.water)
      : t.waterTooLittle(plant.name, plant.water);
  }

  if (userLight !== plant.light) {
    return userLight > plant.light
      ? t.lightTooMuch(plant.name)
      : t.lightTooLittle(plant.name);
  }

  if (Math.abs(userTemp - plant.temp) > 5) {
    return t.tempIssue(plant.name);
  }

  return "";
}

/* ================= SCORE ANIMATION ================= */

function animateScore(targetScore, plant, userWater, userLight, userTemp) {
  let current = 0;

  scoreDiv.textContent = "0%";
  emojiDiv.textContent = "🌿";

  const interval = setInterval(() => {
    current++;
    if (current > targetScore) current = targetScore;

    scoreDiv.textContent = current + "%";
    emojiDiv.textContent = getEmoji(current);

    if (current === targetScore) {
      clearInterval(interval);

      messageDiv.textContent =
        current >= 90 ? "Perfect!" :
        current >= 75 ? "Looking good!" :
        current >= 50 ? "Some adjustments needed." :
        "Care needed.";

      reasonDiv.textContent = getMainIssue(
        plant,
        userWater,
        userLight,
        userTemp
      );

      tipDiv.textContent = plant.tip;

      messageDiv.classList.add("show");
      reasonDiv.classList.add("show");
      tipDiv.classList.add("show");
      shareBtn.classList.remove("hidden");

      saveHistory(plantSelect.value, targetScore);
    }
  }, 15);
}

/* ================= HISTORY ================= */

function saveHistory(plantIndex, score) {
  let history = JSON.parse(localStorage.getItem("plantHistory") || "[]");
  history.push({
    plant: plants[plantIndex].name,
    score,
    date: new Date().toISOString()
  });
  localStorage.setItem("plantHistory", JSON.stringify(history));
}

/* ================= CALCULATE ================= */

function calculate() {
  const plant = plants[plantSelect.value];
  const userWater = parseInt(document.getElementById("water").value);
  const userLight = parseInt(document.getElementById("light").value);
  const userTemp = parseInt(document.getElementById("temperature").value);

  let score = 100;

  score -= Math.abs(userWater - plant.water) * 20;
  score -= Math.abs(userLight - plant.light) * 15;

  if (Math.abs(userTemp - plant.temp) > 5) {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  animateScore(score, plant, userWater, userLight, userTemp);
  resultDiv.classList.remove("hidden");
}

/* ================= SHARE ================= */

shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const text = translations[currentLang].shareText(plant.name, score);

  navigator.clipboard.writeText(text);
  alert(translations[currentLang].copied);
});
