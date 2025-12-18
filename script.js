let currentLang = "en";

const texts = {
  en: {
    title: "Will my plant survive?",
    subtitle: "A quick estimation. Be honest. We will.",
    plant: "Plant",
    water: "Watering (times per week)",
    light: "Light",
    temp: "Temperature (°C)",
    button: "Face the truth",
    lights: ["Low light", "Medium light", "Bright light"],
    share: "Share my plant skills 😎",
    shareText: (name, score) =>
      `My ${name} has a ${score} chance of survival! 🌿\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  },
  fr: {
    title: "Ma plante va-t-elle survivre ?",
    subtitle: "Une estimation rapide. Soyez honnête. Nous le serons.",
    plant: "Plante",
    water: "Arrosage (fois par semaine)",
    light: "Lumière",
    temp: "Température (°C)",
    button: "Voir la vérité",
    lights: ["Faible lumière", "Lumière moyenne", "Lumière vive"],
    share: "Partager mes talents de jardinier 😎",
    shareText: (name, score) =>
      `Ma ${name} a ${score} de chances de survie 🌿\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`
  }
};

const plantSelect = document.getElementById("plantSelect");
const lightSelect = document.getElementById("light");
const shareBtn = document.getElementById("shareBtn");
const scoreDiv = document.querySelector(".score");
const emojiDiv = document.querySelector(".emoji");
const messageDiv = document.querySelector(".message");
const reasonDiv = document.querySelector(".reason");
const tipDiv = document.querySelector(".tip");
const tempSlider = document.getElementById("temperature");
const tempValue = document.getElementById("tempValue");

function applyLanguage() {
  document.querySelector("h1").textContent = texts[currentLang].title;
  document.querySelector(".subtitle").textContent = texts[currentLang].subtitle;
  document.querySelectorAll("label")[0].textContent = texts[currentLang].plant;
  document.querySelectorAll("label")[1].textContent = texts[currentLang].water;
  document.querySelectorAll("label")[2].textContent = texts[currentLang].light;
  document.querySelectorAll("label")[3].textContent = texts[currentLang].temp;
  document.querySelector("button").textContent = texts[currentLang].button;
  shareBtn.textContent = texts[currentLang].share;

  lightSelect.innerHTML = "";
  texts[currentLang].lights.forEach((l, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = l;
    lightSelect.appendChild(opt);
  });

  plantSelect.innerHTML = "";
  plants.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.name[currentLang];
    plantSelect.appendChild(opt);
  });
}

document.querySelector(".lang-switch").addEventListener("click", () => {
  currentLang = currentLang === "en" ? "fr" : "en";
  document.querySelector(".lang-switch").textContent =
    currentLang.toUpperCase();
  applyLanguage();
});

tempSlider.addEventListener("input", () => {
  tempValue.textContent = `${tempSlider.value}°C`;
});

applyLanguage();

/* Share */
shareBtn.addEventListener("click", () => {
  const plant = plants[plantSelect.value];
  const score = scoreDiv.textContent;
  const text = texts[currentLang].shareText(
    plant.name[currentLang],
    score
  );

  if (navigator.share) {
    navigator.share({
      title: texts[currentLang].title,
      text
    });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  }
});
