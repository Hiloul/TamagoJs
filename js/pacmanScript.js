// Demarrer bouton
document.getElementById("startButton").addEventListener("click", function () {
  // Cacher le bouton Démarrer
  this.style.display = "none";

  // Afficher le jeu
  document.getElementById("gameContainer").style.display = "block";

  // Initialiser le jeu (toutes les fonctions d'initialisation vont ici)
  initGame();
});

// Récupération des références du canvas et du contexte de dessin
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Définition de la taille d'une cellule (en pixels)
const tileSize = 20;

// Définition des propriétés initiales de Pac-Man
let pacMan = {
  x: 7,
  y: 7,
  dx: 1,
  dy: 0,
};

// Fonction pour dessiner Pac-Man sur le canvas
function drawPacMan() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    pacMan.x * tileSize + tileSize / 2,
    pacMan.y * tileSize + tileSize / 2,
    tileSize / 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(
    pacMan.x * tileSize + tileSize / 2,
    pacMan.y * tileSize + tileSize / 2
  );
  ctx.fill();
}

// Initialisation du score
let score = 0;

// Initialisation du nombre de vie
let lives = 6;


// Définition du labyrinthe
const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// Maze = tableau 2d, 1 = mur (point ou il se stop)  2 = point (a manger)

// Fonction qui vérifie si tous les points et fruits ont été mangés
function areAllPointsEaten() {
  for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
          if (maze[y][x] === 2 || maze[y][x] === 3 || maze[y][x] === 4) {
              return false;
          }
      }
  }
  return true; 
}

// Incones fruits
const iconImage1 = new Image();
iconImage1.src = "./assets/pacman/ananas.png";
const iconImage2 = new Image();
iconImage2.src = "./assets/pacman/pomme.png";
let iconPlaced = false;

function placeRandomIcon(iconValue) {
  let iconPlaced = false;
  while (!iconPlaced) {
    const randomX = Math.floor(Math.random() * maze[0].length);
    const randomY = Math.floor(Math.random() * maze.length);
    // Vérifiez si la position est un point
    if (maze[randomY][randomX] === 2) {
      maze[randomY][randomX] = iconValue;
      iconPlaced = true;
    }
  }
}
// Placer 3 icônes de type 1 et 2 icônes de type 2 par exemple :
for (let i = 0; i < 2; i++) placeRandomIcon(3);
for (let i = 0; i < 1; i++) placeRandomIcon(4);

// Fonction pour dessiner le labyrinthe
function drawMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      } else if (maze[y][x] === 2) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize / 6,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (maze[y][x] === 3) {
        ctx.drawImage(
          iconImage1,
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      } else if (maze[y][x] === 4) {
        ctx.drawImage(
          iconImage2,
          x * tileSize,
          y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }
}

// Génération aléatoire du nombre de fantômes (entre 1 et 4)
const numberOfGhosts = Math.floor(Math.random() * 4) + 1;
const ghosts = [];
const ghostImages = [];
const ghostUrls = [
  "./assets/pacman/red-ghost.png",
  "./assets/pacman/blue-ghost.png",
  "./assets/pacman/purple-ghost.png",
  "./assets/pacman/green-ghost.png",
];
let imagesLoaded = 0;

for (let i = 0; i < 4; i++) {
  let img = new Image();
  img.src = ghostUrls[i];
  img.onload = function () {
    imagesLoaded++;
    if (imagesLoaded === 4) {
      // Toutes les images sont chargées
    }
  };
  ghostImages.push(img);
}

// Initialisation des fantômes
for (let i = 0; i < numberOfGhosts; i++) {
  let ghost;
  do {
    ghost = {
      x: Math.floor(Math.random() * maze[0].length),
      y: Math.floor(Math.random() * maze.length),
      dx: Math.floor(Math.random() * 2) * 2 - 1,
      dy: Math.floor(Math.random() * 2) * 2 - 1,
      image: ghostImages[i % 4], // Utilisez l'image correspondante
    };
  } while (maze[ghost.y][ghost.x] === 1);
  ghosts.push(ghost);
}

// Fonction pour dessiner un fantôme
function drawGhost(ghost) {
  ctx.drawImage(
    ghost.image,
    ghost.x * tileSize,
    ghost.y * tileSize,
    tileSize,
    tileSize
  );
}

// Fonction pour vérifier si une cellule donnée est un mur
function isWall(x, y) {
  return (
    x < 0 ||
    x >= maze[0].length ||
    y < 0 ||
    y >= maze.length ||
    maze[y][x] === 1
  );
}

// Mise à jour du jeu
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const nextX = pacMan.x + pacMan.dx;
  const nextY = pacMan.y + pacMan.dy;

// Vérifiez d'abord si la prochaine case est un point
if (maze[nextY][nextX] === 2) {
  score += 1;  // +1 point pour un point
  maze[nextY][nextX] = 0; // Effacer le point
} else if (maze[nextY][nextX] === 3 || maze[nextY][nextX] === 4) {
  score += 2;  // +2 points pour un fruit
  maze[nextY][nextX] = 0; // Effacer le fruit
}

  // Ensuite, vérifiez si ce n'est pas un mur
  if (!isWall(nextX, nextY)) {
      // Déplacement de Pac-Man
      pacMan.x = nextX;
      pacMan.y = nextY;
  }

  // Vérifie que Pac-Man a mangé un point ou un fruit:
  if (areAllPointsEaten()) {
    alert("Bravo! Vous avez gagné!");

  // redémarrer le jeu
  restartGame();
  return;
}

  function getRandomDirection() {
    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  // Logique de déplacement des fantômes
  for (let ghost of ghosts) {
    let nextGhostX = ghost.x + ghost.dx;
    let nextGhostY = ghost.y + ghost.dy;

    if (isWall(nextGhostX, nextGhostY)) {
      let newDirection;
      do {
        newDirection = getRandomDirection();
        nextGhostX = ghost.x + newDirection.dx;
        nextGhostY = ghost.y + newDirection.dy;
      } while (isWall(nextGhostX, nextGhostY));

      ghost.dx = newDirection.dx;
      ghost.dy = newDirection.dy;
    }

    ghost.x = nextGhostX;
    ghost.y = nextGhostY;
    drawGhost(ghost);

    if (ghost.x === pacMan.x && ghost.y === pacMan.y) {
      lives--; // Réduisez le nombre de vies
      if (lives <= 0) {
        restartGame(true); // une fonction pour réinitialiser complètement le jeu
        return; // arrête la mise à jour pour cette frame
      } 
}}
  drawMaze();
  drawPacMan();

// Afficher le score
ctx.fillStyle = "white";
ctx.font = "20px 'Press Start 2P'";
ctx.textAlign = "left";  // alignement à gauche pour le score
ctx.fillText("Score: " + score, 10, 20);

// Afficher les vies
ctx.textAlign = "right";  // alignement à droite pour les vies
ctx.fillText("Lives: " + lives, canvas.width - 10, 20);
}


// Écoute des touches du clavier pour déplacer Pac-Man
document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowUp":
      pacMan.dx = 0;
      pacMan.dy = -1;
      break;
    case "ArrowDown":
      pacMan.dx = 0;
      pacMan.dy = 1;
      break;
    case "ArrowLeft":
      pacMan.dx = -1;
      pacMan.dy = 0;
      break;
    case "ArrowRight":
      pacMan.dx = 1;
      pacMan.dy = 0;
      break;
  }
});

// Gestion mouvements avec tactile
function getCanvasCoordinates(touchEvent, canvasElement) {
  var rect = canvasElement.getBoundingClientRect();
  var scaleX = canvasElement.width / rect.width;
  var scaleY = canvasElement.height / rect.height;

  return {
    x: (touchEvent.clientX - rect.left) * scaleX,
    y: (touchEvent.clientY - rect.top) * scaleY,
  };
}
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
  "touchstart",
  function (e) {
    e.preventDefault();
    var coords = getCanvasCoordinates(e.touches[0], canvas);
    touchStartX = coords.x;
    touchStartY = coords.y;
  },
  false
);

canvas.addEventListener(
  "touchend",
  function (e) {
    e.preventDefault();
    var coords = getCanvasCoordinates(e.changedTouches[0], canvas);
    let touchEndX = coords.x;
    let touchEndY = coords.y;
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    const minimumSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Mouvement horizontal
      if (deltaX > minimumSwipeDistance) {
        pacMan.dx = 1;
        pacMan.dy = 0;
      } else if (deltaX < -minimumSwipeDistance) {
        pacMan.dx = -1;
        pacMan.dy = 0;
      }
    } else {
      // Mouvement vertical
      if (deltaY > minimumSwipeDistance) {
        pacMan.dx = 0;
        pacMan.dy = 1;
      } else if (deltaY < -minimumSwipeDistance) {
        pacMan.dx = 0;
        pacMan.dy = -1;
      }
    }
  },
  false
);
document.getElementById("quitGame").addEventListener("click", quit);

// Quitter
function quit() {
  var confirmation = window.confirm("Êtes-vous sûr de vouloir quitter le jeu?");

  if (confirmation) {
    window.location.href = "index.html";
  }
}

function initGame() {
  // Placer les icônes :
  for (let i = 0; i < 3; i++) placeRandomIcon(3);
  for (let i = 0; i < 2; i++) placeRandomIcon(4);

  // Charger les images de fantôme et démarrer le jeu :
  let imagesLoaded = 0;
  for (let i = 0; i < 4; i++) {
    let img = new Image();
    img.src = ghostUrls[i];
    img.onload = function () {
      imagesLoaded++;
      if (imagesLoaded === 4) {
        // Toutes les images sont chargées, vous pouvez démarrer le jeu ici
        updateGame();
      }
    };
    ghostImages.push(img);
  }

  // Initialisation des fantômes
  for (let i = 0; i < numberOfGhosts; i++) {
    let ghost;
    do {
      ghost = {
        x: Math.floor(Math.random() * maze[0].length),
        y: Math.floor(Math.random() * maze.length),
        dx: Math.floor(Math.random() * 2) * 2 - 1,
        dy: Math.floor(Math.random() * 2) * 2 - 1,
        image: ghostImages[i % 4],
      };
    } while (maze[ghost.y][ghost.x] === 1);
    ghosts.push(ghost);
  }

  // Mise à jour du jeu
  setInterval(updateGame, 600);
}

function restartGame() {
  // Réinitialiser Pac-Man à sa position et direction initiales
  pacMan.x = 7;
  pacMan.y = 7;
  pacMan.dx = 1;
  pacMan.dy = 0;
  score = 0;
  lives = 6;

  // Réinitialiser le labyrinthe
  // (Vous devrez peut-être garder une copie du labyrinthe original pour le restaurer)
  const originalMaze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1],
    [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];
  for (let i = 0; i < maze.length; i++) {
    maze[i] = [...originalMaze[i]];
  }

  // Réinitialiser et replacer les fantômes et les fruits
  ghosts.length = 0; // Vider le tableau de fantômes
  for (let i = 0; i < numberOfGhosts; i++) {
    let ghost;
    do {
      ghost = {
        x: Math.floor(Math.random() * maze[0].length),
        y: Math.floor(Math.random() * maze.length),
        dx: Math.floor(Math.random() * 2) * 2 - 1,
        dy: Math.floor(Math.random() * 2) * 2 - 1,
        image: ghostImages[i % 4],
      };
    } while (maze[ghost.y][ghost.x] === 1);
    ghosts.push(ghost);
  }
  for (let i = 0; i < 2; i++) placeRandomIcon(3);
  for (let i = 0; i < 1; i++) placeRandomIcon(4);

  // Nettoyer le canvas et redessiner le labyrinthe
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPacMan();
  for (let ghost of ghosts) {
    drawGhost(ghost);
  }
}

// Écouteur d'événement pour le bouton "restartGame"
document.getElementById("restartGame").addEventListener("click", function () {
  restartGame();
});

// Demarrer bouton
document.getElementById("startButton").addEventListener("click", function () {
  // Cacher le bouton Démarrer
  this.style.display = "none";
  document.getElementById("restartGame").style.display = "inline-block";
  document.getElementById("quitGame").style.display = "inline-block";

  // Afficher le jeu
  document.getElementById("gameContainer").style.display = "block";

  // Initialiser le jeu
  initGame();
});
