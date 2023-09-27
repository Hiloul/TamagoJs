let hunger = 100;
let happiness = 100;
let health = 100;
let cleanliness = 100;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function setName() {
  const nameInput = document.getElementById("tamagotchiName");
  const nameDisplay = document.getElementById("displayedName");

  if (nameInput.value.trim()) {
    // Si le champ n'est pas vide ou ne contient pas seulement des espaces
    let capitalized = capitalizeFirstLetter(nameInput.value.trim());
    nameDisplay.textContent = capitalized;
    nameInput.style.display = "none"; // Cache l'input
    document.querySelector(".name button").style.display = "none"; // Cache le bouton
    nameInput.value = ""; // Efface la valeur du champ
  } else {
    alert("Veuillez entrer un nom valide !");
  }
}

function decreaseStats() {
  hunger -= Math.floor(Math.random() * 5);
  happiness -= Math.floor(Math.random() * 5);
  health -= Math.floor(Math.random() * 5);
  cleanliness -= Math.floor(Math.random() * 5);

  if (hunger <= 0 || happiness <= 0 || health == 0 || cleanliness == 0) {
    document.getElementById("pet").textContent = "💀";

    let tamagotchiName = document.getElementById("displayedName").textContent;

    alert(`Oh non! ${tamagotchiName} est mort!`);

    clearInterval(lifeInterval);
  }

  updateStats();
}

function updateStats() {
  document.getElementById("hunger").textContent = hunger;
  document.getElementById("happiness").textContent = happiness;
  document.getElementById("health").textContent = health;
  document.getElementById("cleanliness").textContent = cleanliness;
}

function feed() {
  hunger += 20;
  if (hunger > 100) hunger = 100;

  updateStats();
}

function play() {
  happiness += 20;
  if (happiness > 100) happiness = 100;

  updateStats();
}

function heal() {
  health += 20;
  if (health > 100) health = 100;

  updateStats();
}

function wash() {
  cleanliness += 20;
  if (cleanliness > 100) cleanliness = 100;

  updateStats();
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

  if (hunger <= 0 || happiness <= 0 || health == 0 || cleanliness == 0) {
    document.getElementById("pet").textContent = "💀";
    alert(`Tu as quitté, ${tamagotchiName} est mort!`);
    clearInterval(lifeInterval);
  }

  updateStats();
}

const lifeInterval = setInterval(decreaseStats, 5000); // Toutes les 5 secondes, les statistiques diminuent
