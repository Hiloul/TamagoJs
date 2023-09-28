let hunger = 100;
let happiness = 100;
let health = 100;
let cleanliness = 100;
let lifeInterval;

// Cachez les actions et les statistiques au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  document.querySelector(".controls").style.display = "none";
  document.querySelector(".stats").style.display = "none";
});

function setPet() {
    const petSelector = document.getElementById("petSelector");
    const selectedPet = petSelector.options[petSelector.selectedIndex].value;
  
    document.getElementById("pet").textContent = selectedPet;
    document.querySelector(".choosePet").style.display = "none";
  
    // Afficher la section de nomination une fois le pet choisi
    document.querySelector(".name").style.display = "block";
  }
  
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  function setName() {
    const nameInput = document.getElementById("tamagotchiName");
    const nameDisplay = document.getElementById("displayedName");
  
    if (nameInput.value.trim()) {
      let capitalized = capitalizeFirstLetter(nameInput.value.trim());
      nameDisplay.textContent = capitalized;
      nameInput.style.display = "none";
      document.querySelector(".name button").style.display = "none";
  
      // Montrer les actions et les statistiques
      document.querySelector(".controls").style.display = "block";
      document.querySelector(".stats").style.display = "block";
  
      // Commencer le jeu dès que le Tamagotchi est nommé
      lifeInterval = setInterval(decreaseStats, 1000);
    } else {
      alert("Veuillez entrer un nom valide !");
    }
  }
  
  // Cachez initialement la section de nomination
  document.addEventListener("DOMContentLoaded", function() {
      document.querySelector(".name").style.display = "none";
  });
  
  function playAlertSound() {
    let audioElement = document.getElementById("alertSound");
    audioElement.currentTime = 0; // Repart de zéro si le son est déjà en cours de lecture
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 1000); // Arrête le son après 3 secondes
}  

function checkForWarning() {
  const warningLimit = 20;
  const warningEmoji = "⚠️";

  if (
    hunger <= warningLimit ||
    happiness <= warningLimit ||
    health <= warningLimit ||
    cleanliness <= warningLimit
  ) {
    document.getElementById("warning").textContent = warningEmoji;
    playAlertSound();
  } else {
    document.getElementById("warning").textContent = "";
  }
}

function restartGame() {
  // Réinitialiser les statistiques
  hunger = 100;
  happiness = 100;
  health = 100;
  cleanliness = 100;
  updateStats();

  // Réinitialiser l'emoji du Tamagotchi
  document.getElementById("pet").textContent = "🐣";

  // Masquer le bouton Redémarrer
  document.getElementById("restartBtn").style.display = "none";

  // Cachez les actions et les statistiques au redémarrage
  document.querySelector(".controls").style.display = "none";
  document.querySelector(".stats").style.display = "none";

  // Afficher l'input et le bouton pour nommer le Tamagotchi
  document.getElementById("tamagotchiName").style.display = "inline-block";
  document.querySelector(".name button").style.display = "inline-block";
  document.getElementById("displayedName").textContent =
    "Nom de votre Tamagotchi :";

  // Reset the choosePet display
  document.querySelector(".choosePet").style.display = "block";

  // Commencer le jeu
  if (!lifeInterval) {
    lifeInterval = setInterval(decreaseStats, 1000);
  }
}

function decreaseStats() {
  hunger -= Math.floor(Math.random() * 5);
  happiness -= Math.floor(Math.random() * 5);
  health -= Math.floor(Math.random() * 5);
  cleanliness -= Math.floor(Math.random() * 5);

  if (hunger <= 0 || happiness <= 0 || health == 0 || cleanliness == 0) {
    document.getElementById("pet").textContent = "💀";
    playLooseSound();
    clearInterval(lifeInterval);
    lifeInterval = null;
    let tamagotchiName = document.getElementById("displayedName").textContent;
    alert(`Oh non! ${tamagotchiName} est mort!`);
    // Afficher le bouton Redémarrer après la mort
    document.getElementById("restartBtn").style.display = "block";
  }

  updateStats();
}

function updateStats() {
  document.getElementById("hunger").textContent = hunger;
  document.getElementById("happiness").textContent = happiness;
  document.getElementById("health").textContent = health;
  document.getElementById("cleanliness").textContent = cleanliness;
  checkForWarning();
}

function playEatingSound() {
    let audioElement = document.getElementById("eatingSound");
    audioElement.currentTime = 0; // Repart de zéro si le son est déjà en cours de lecture
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 3000); // Arrête le son après 3 secondes
}

function feed() {
    let randomIncrease = Math.floor(Math.random() * 11) + 10;
    hunger += randomIncrease;
    if (hunger > 100) hunger = 100;
    animatePet("🥪", "shake");
    playEatingSound();
    updateStats();
}

function playingSound() {
    let audioElement = document.getElementById("playingSound");
    audioElement.currentTime = 0;
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 3000);
}

function play() {
  let randomIncrease = Math.floor(Math.random() * 11) + 10;
  happiness += randomIncrease;
  if (happiness > 100) happiness = 100;
  animatePet("🪀", "bouncing");
  playingSound();
  updateStats();
}

function playHealingSound() {
    let audioElement = document.getElementById("healingSound");
    audioElement.currentTime = 0; // Repart de zéro si le son est déjà en cours de lecture
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 3000); // Arrête le son après 3 secondes
}

function heal() {
  let randomIncrease = Math.floor(Math.random() * 11) + 10;
  health += randomIncrease;
  if (health > 100) health = 100;
  animatePet("🚑", "heartbeat");
  playHealingSound();
  updateStats();
}

function playWashingSound() {
    let audioElement = document.getElementById("washingSound");
    audioElement.currentTime = 0;
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 3000);
}

function wash() {
  let randomIncrease = Math.floor(Math.random() * 11) + 10;
  cleanliness += randomIncrease;
  if (cleanliness > 100) cleanliness = 100;
  animatePet("🛀", "bouncing");
  playWashingSound();
  updateStats();
}

function animatePet(emoji, animationClass) {
  let petElem = document.getElementById("pet");
  let originalPetEmoji = petElem.textContent;
  petElem.textContent = emoji;
  petElem.classList.add(animationClass);
  setTimeout(() => {
    petElem.textContent = originalPetEmoji;
    petElem.classList.remove(animationClass);
  }, 3000);
}


function playLooseSound() {
    let audioElement = document.getElementById("looseSound");
    audioElement.currentTime = 0;
    audioElement.play();
    setTimeout(() => {
        audioElement.pause();
    }, 1000);
}

function quit() {
  let tamagotchiName = document.getElementById("displayedName").textContent;
  const confirmation = confirm(
    `Êtes-vous sûr de vouloir quitter et mettre fin à la vie de ${tamagotchiName}?`
  );
  if (!confirmation) {
    return;
  }
  hunger = 0;
  happiness = 0;
  health = 0;
  cleanliness = 0;
  if (hunger <= 0 || happiness <= 0 || health <= 0 || cleanliness <= 0) {
    document.getElementById("pet").textContent = "💀";
    alert(`Tu as quitté, ${tamagotchiName} est mort!`);
    clearInterval(lifeInterval);
    // Afficher le bouton Redémarrer après avoir quitté
    document.getElementById("restartBtn").style.display = "block";
  }
  playLooseSound();
  updateStats();
}
