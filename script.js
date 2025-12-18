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
const calculateBtn = document.getElementById("calculateBtn");
const langBtn = document.getElementById("langBtn");

// Populate plant select
plants.forEach((plant,index)=>{
  const option = document.createElement("option");
  option.value=index;
  option.textContent=plant.name;
  plantSelect.appendChild(option);
});

// Update temperature display
tempSlider.addEventListener("input",()=>{tempValue.textContent=`${tempSlider.value}°C`;});

// Animate score
function getEmoji(score){
  if(score<=10) return "☠️";
  if(score<=25) return "💀";
  if(score<=50) return "☹️";
  if(score<=75) return "⚠️";
  if(score<=90) return "🌿";
  return "🌟";
}

function getMessage(score, reason){
  if(score<=10) return reason ? `Critical issue: ${reason}` : "Critical issues detected!";
  if(score<=25) return reason ? `Major concern: ${reason}` : "Major care needed!";
  if(score<=50) return reason ? `Attention needed: ${reason}` : "Some care adjustments recommended.";
  if(score<=75) return reason ? `Minor tweaks: ${reason}` : "Your plant is mostly okay.";
  if(score<=90) return reason ? `Good, minor adjustments: ${reason}` : "Looking good!";
  return "Perfect! Your plant should thrive!";
}

function getMiniTip(plant){
  return plant.tip;
}

function animateScore(targetScore, reason){
  let current=0;
  scoreDiv.textContent="0%";
  emojiDiv.textContent="🌿";
  scoreDiv.classList.remove("pulse","bounce");
  messageDiv.classList.remove("fade-in","show");
  reasonDiv.classList.remove("fade-in","show");
  tipDiv.classList.remove("fade-in","show");
  shareBtn.classList.remove("fade-in","show","hidden");

  const interval=setInterval(()=>{
    current++;
    if(current>targetScore) current=targetScore;
    scoreDiv.textContent=current+"%";
    emojiDiv.textContent=getEmoji(current);
    scoreDiv.classList.add("pulse");
    if(current===targetScore){
      clearInterval(interval);
      scoreDiv.classList.add("bounce");
      messageDiv.textContent=getMessage(targetScore,reason);
      reasonDiv.textContent=reason?reason:"No critical issues";
      tipDiv.textContent=getMiniTip(plants[plantSelect.value]);
      messageDiv.classList.add("fade-in","show");
      reasonDiv.classList.add("fade-in","show");
      tipDiv.classList.add("fade-in","show");
      shareBtn.classList.add("fade-in","show");
      saveHistory(plantSelect.value,targetScore);
    }
  },15);
}

function saveHistory(plantIndex,score){
  let history=JSON.parse(localStorage.getItem("plantHistory")||"[]");
  const plant=plants[plantIndex];
  history.push({name:plant.name,score,date:new Date().toISOString()});
  localStorage.setItem("plantHistory",JSON.stringify(history));
}

function calculate(){
  const plant=plants[plantSelect.value];
  const userWater=parseInt(document.getElementById("water").value);
  const userLight=parseInt(document.getElementById("light").value);
  const userTemp=parseInt(document.getElementById("temperature").value);

  let score=100;
  let reason="";

  const waterDiff=Math.abs(userWater-plant.water);
  const lightDiff=Math.abs(userLight-plant.light);
  const tempDiff=Math.abs(userTemp-plant.temp);

  if(waterDiff>0){score-=waterDiff*20; reason=userWater>plant.water?"Too much water":"Not enough water";}
  if(lightDiff>0 && !reason){score-=lightDiff*15; reason=userLight>plant.light?"Too much light":"Not enough light";}
  if(tempDiff>5 && !reason){score-=15; reason="Temperature mismatch";}

  score=Math.max(0,Math.min(100,score));
  animateScore(score,reason);
  resultDiv.classList.remove("hidden");
}

// Share button
shareBtn.addEventListener("click",()=>{
  const plant=plants[plantSelect.value];
  const score=scoreDiv.textContent;
  const shareText=`My ${plant.name} has a ${score} chance of survival! 🌿\nhttps://nbzj4bq9sc-ship-it.github.io/Plants/`;

  if(navigator.share){
    navigator.share({title:'Will my plant survive?',text:shareText}).catch(err=>console.log(err));
  }else{
    navigator.clipboard.writeText(shareText).then(()=>alert("Result copied! Share it anywhere."));
  }
});

// Language switch
langBtn.addEventListener("click",()=>{
  if(langBtn.textContent==="FR"){
    langBtn.textContent="EN";
    document.getElementById("title").innerHTML='<img src="logo.svg" class="logo" alt="logo"> Ma plante va-t-elle survivre?';
    document.getElementById("subtitle").textContent="Une estimation rapide. Soyez honnête. Nous le serons.";
    document.getElementById("labelPlant").textContent="Plante";
    document.getElementById("labelWater").textContent="Arrosage (fois par semaine)";
    document.getElementById("labelLight").textContent="Lumière";
    document.getElementById("light").options[0].text="Faible";
    document.getElementById("light").options[1].text="Moyenne";
    document.getElementById("light").options[2].text="Élevée";
    document.getElementById("labelTemp").textContent="Température (°C)";
    document.getElementById("calculateBtn").textContent="Affronter la vérité";
    document.getElementById("disclaimer").textContent="Pas scientifique. Juste expérience. Les plantes ont parfois une personnalité.";
    document.getElementById("credits").textContent="Créé par Romain Daney. Inspiré par les guides de soins pour plantes. 🌱";
    // Translate plants
    plants.forEach((plant,index)=>{
      plantSelect.options[index].textContent=plant.name_fr || plant.name;
    });
  }else{
    langBtn.textContent="FR";
    document.getElementById("title").innerHTML='<img src="logo.svg" class="logo" alt="logo"> Will my plant survive?';
    document.getElementById("subtitle").textContent="A quick estimation. Be honest. We will.";
    document.getElementById("labelPlant").textContent="Plant";
    document.getElementById("labelWater").textContent="Watering (times per week)";
    document.getElementById("labelLight").textContent="Light";
    document.getElementById("light").options[0].text="Low light";
    document.getElementById("light").options[1].text="Medium light";
    document.getElementById("light").options[2].text="Bright light";
    document.getElementById("labelTemp").textContent="Temperature (°C)";
    document.getElementById("calculateBtn").textContent="Face the truth";
    document.getElementById("disclaimer").textContent="Not science. Just experience. Plants sometimes have personality.";
    document.getElementById("credits").textContent="Created by Romain Daney. Inspired by houseplant care guides. 🌱";
    plants.forEach((plant,index)=>{
      plantSelect.options[index].textContent=plant.name;
    });
  }
});
