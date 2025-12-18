const plantSelect = document.getElementById("plantSelect");
const scoreDiv = document.querySelector(".score");
const emojiDiv = document.querySelector(".emoji");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");
const tipDiv = document.querySelector(".tip");
const resultDiv = document.getElementById("result");
const shareBtn = document.getElementById("shareBtn");
const tempSlider = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");
const langBtn = document.getElementById("langBtn");

let currentLang = "en";

/* ========= TRANSLATIONS ========= */

const t = {
  en: {
    light: ["Low", "Medium", "Bright"],
    share: "Share my plant skills 😎",
    shareText: (plant, score) =>
      `My ${plant} has a ${score} chance of survival!\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  },
  fr: {
    light: ["Faible", "Moyenne", "Forte"],
    share: "Partager mes talents de jardinier 😎",
    shareText: (plant, score) =>
      `Ma ${plant} a ${score} de chance de survie !\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  }
};

/* ========= INIT ========= */

function populatePlants() {
  plantSelect.innerHTML = "";
  plants.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.name[currentLang];
    plantSelect.appendChild(opt);
  });
}

function translateLight() {
  const options = document.querySelectorAll("#light option");
  options.forEach((opt, i) => {
    opt.textContent = t[currentLang].light[i];
  });
}

langBtn.onclick = () => {
  currentLang = currentLang === "en" ? "fr" : "en";
  langBtn.textContent = currentLang === "en" ? "FR" : "EN";
  populatePlants();
  translateLight();
};

populatePlants();
translateLight();

tempSlider.oninput = () => {
  tempValue.textContent = `${tempSlider.value}°C`;
};

/* ========= SCORE ========= */

function getEmoji(score) {
  if (score < 25) return "💀";
  if (score < 50) return "☹️";
  if (score < 75) return "⚠️";
  if (score < 90) return "🌿";
  return "🌟";
}

function calculate() {
  const plant = plants[plantSelect.value];
  const water = +document.getElementById("water").value;
  const light = +document.getElementById("light").value;
  const temp = +tempSlider.value;

  let score = 100;
  score -= Math.abs(water - plant.water) * 20;
  score -= Math.abs(light - plant.light) * 15;
  if (Math.abs(temp - plant.temp) > 5) score -= 15;
  score = Math.max(0, Math.min(100, score));

  scoreDiv.textContent = score + "%";
  emojiDiv.textContent = getEmoji(score);
  messageDiv.textContent = score >= 75 ? "Looking good!" : "Attention needed.";
  reasonDiv.textContent = "";
  tipDiv.textContent = plant.tip[currentLang];

  resultDiv.classList.remove("hidden");
  shareBtn.classList.remove("hidden");
}

/* ========= SHARE (NATIVE) ========= */

shareBtn.onclick = async () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;

  const text = t[currentLang].shareText(
    plant.name[currentLang],
    score
  );

  if (navigator.share) {
    navigator.share({
      title: "Will my plant survive?",
      text,
      url: "https://nbzj4bq9sc-ship-it.github.io/Plants/"
    });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  }
};
