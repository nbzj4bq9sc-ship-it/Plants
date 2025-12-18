const plantSelect = document.getElementById("plantSelect");

plants.forEach((plant, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = plant.name;
  plantSelect.appendChild(option);
});

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
    reason = userWater > plant.water
      ? "Too much water"
      : "Not enough water";
  }

  if (lightDiff > 0) {
    score -= lightDiff * 15;
    if (!reason) {
      reason = userLight > plant.light
        ? "Too much light"
        : "Not enough light";
    }
  }

  score = Math.max(0, Math.min(100, score));

  let message = "";
  if (score >= 70) message = "You’re doing fine 🌿";
  else if (score >= 40) message = "This might work… keep an eye on it ⚠️";
  else message = "We’re not gonna lie 💀";

  const result = document.getElementById("result");
  result.classList.remove("hidden");
  result.innerHTML = `
    <div class="score">${score}%</div>
    <p>${message}</p>
    <p><strong>Main issue:</strong> ${reason || "Nothing critical"}</p>
  `;
}