// Initialisation des éléments du canvas et du contexte de dessin
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

// Dimensions d'une cellule de grille
var grid = 16;
var count = 0;

// Initialisation de l'objet serpent
var snake = {
  x: 176,
  y: 176,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4,
  score: 0, // Score initial du serpent
};

// Initialisation de l'objet pomme
var apple = {
  x: 167,
  y: 167,
};

// Cette fonction détermine combien de frames nous devons attendre avant de mettre à jour le jeu.
function getFramesToSkipByScore(score) {
  // Nous commençons par sauter 10 frames, puis nous déduisons 1 frame tous les 5 points, avec un minimum de 1 frame à sauter.
  return Math.max(10 - Math.floor(score / 5), 1);
}

// Fonction pour obtenir un entier aléatoire dans un intervalle donné
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getSpeedByScore(score) {
  return Math.min(4 + Math.floor(score / 5), 10); // Augmentez la vitesse tous les 5 points, avec une vitesse maximale de 10
}

// Indicateur pour savoir si le jeu a démarré
var gameStarted = false;

// Fonction pour démarrer le jeu
function startGame() {
    gameStarted = true;
    document.getElementById("startGame").style.display = "none";
    document.getElementById("restartGame").style.display = "inline-block";
    document.getElementById("quitGame").style.display = "inline-block";
  }  

// Fonction pour jouer le son de manger
function playEatingSound() {
  let audioElement = document.getElementById("appleSound");
  audioElement.currentTime = 0; // Repart de zéro si le son est déjà en cours de lecture
  audioElement.play();
  setTimeout(() => {
    audioElement.pause();
  }, 1000); // Arrête le son après 1 seconde
}

// Boucle principale du jeu
function loop() {
  requestAnimationFrame(loop);
  // Si le jeu n'a pas encore démarré, on ne fait rien
  if (!gameStarted) {
    return;
  }
  // Ralentit la boucle de jeu en fonction du score
  if (++count < getFramesToSkipByScore(snake.score)) {
    return;
  }
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Met à jour la position du serpent
  snake.x += snake.dx;
  snake.y += snake.dy;
  // Gère le déplacement du serpent à travers les bords
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // Ajoute une nouvelle tête à la liste des cellules du serpent
  snake.cells.unshift({ x: snake.x, y: snake.y });
  // Retire la queue du serpent si nécessaire
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // Dessine la pomme
  context.font = grid + "px Arial";
  context.fillText("🍎", apple.x, apple.y + grid - 4);
  // Dessine le serpent
  context.fillStyle = "#0a5c0a";
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    // Si le serpent mange la pomme
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      snake.score++;
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      playEatingSound();
    }
    // Vérifie la collision du serpent avec lui-même
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        snake.score = 0; // Réinitialise le score lors de la collision
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
  // Affiche le score
  context.fillStyle = "white";
  context.font = "24px Sans-Serif";
  context.fillText("Score: " + snake.score, 10, 30);
}
document.getElementById("quitGame").addEventListener("click", quit);

// Quitter
function quit() {
    var confirmation = window.confirm("Êtes-vous sûr de vouloir quitter le jeu?");
    
    if (confirmation) {
      window.location.href = 'index.html';
    }
  }
  
// Démarre la boucle principale du jeu
requestAnimationFrame(loop);

// Gestion des événements clavier pour déplacer le serpent
document.addEventListener("keydown", function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Gestion des événements de clic pour déplacer le serpent avec les boutons
document.getElementById("arrow-left").addEventListener("click", function () {
  if (snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
});

document.getElementById("arrow-up").addEventListener("click", function () {
  if (snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
});

document.getElementById("arrow-right").addEventListener("click", function () {
  if (snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
});

document.getElementById("arrow-down").addEventListener("click", function () {
  if (snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

document.getElementById("restartGame").addEventListener("click", function () {
  // Réinitialisez l'état du serpent
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  snake.score = 0;

  // Gestion mouvements avec tactile
  function getCanvasCoordinates(touchEvent, canvasElement) {
    var rect = canvasElement.getBoundingClientRect();
    var scaleX = canvasElement.width / rect.width;
    var scaleY = canvasElement.height / rect.height;
    
    return {
      x: (touchEvent.clientX - rect.left) * scaleX,
      y: (touchEvent.clientY - rect.top) * scaleY
    };
  }
  
  let touchStartX = 0;
  let touchStartY = 0;
  
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    var coords = getCanvasCoordinates(e.touches[0], canvas);
    touchStartX = coords.x;
    touchStartY = coords.y;
  }, false);
  
  canvas.addEventListener('touchend', function(e) {
    e.preventDefault();
    var coords = getCanvasCoordinates(e.changedTouches[0], canvas);
    let touchEndX = coords.x;
    let touchEndY = coords.y;
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;
  
    const minimumSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Mouvement horizontal
      if (deltaX > minimumSwipeDistance && snake.dx === 0) { // Déplacement vers la droite
        snake.dx = grid;
        snake.dy = 0;
      } else if (deltaX < -minimumSwipeDistance && snake.dx === 0) { // Déplacement vers la gauche
        snake.dx = -grid;
        snake.dy = 0;
      }
    } else {
      // Mouvement vertical
      if (deltaY > minimumSwipeDistance && snake.dy === 0) { // Déplacement vers le bas
        snake.dx = 0;
        snake.dy = grid;
      } else if (deltaY < -minimumSwipeDistance && snake.dy === 0) { // Déplacement vers le haut
        snake.dx = 0;
        snake.dy = -grid;
      }
    }
  }, false);
  
  // Re-positionnez la pomme
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;

  // Si le jeu n'était pas déjà démarré, le démarrer
  gameStarted = true;
  document.getElementById("startGame").style.display = "none";
});

// Écouteur d'événement pour démarrer le jeu avec le bouton
document.getElementById("startGame").addEventListener("click", startGame);

// Démarre la boucle principale du jeu
requestAnimationFrame(loop);
