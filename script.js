let points = 0;
let upgrades = [
  { id: 1, name: "Auto-Clicker", cost: 10, level: 0, income: 1 },
  { id: 2, name: "Mega-Clicker", cost: 50, level: 0, income: 5 },
  { id: 3, name: "Super-Clicker", cost: 100, level: 0, income: 10 },
];

// DOM Elements
const pointsDisplay = document.getElementById('points');
const clickButton = document.getElementById('click-button');
const upgradesContainer = document.getElementById('upgrades');

// Load saved game
loadGame();

// Click Event
clickButton.addEventListener('click', () => {
  points++;
  updatePoints();
  animateButton(clickButton);
});

// Render Upgrades
function renderUpgrades() {
  upgradesContainer.innerHTML = '';
  upgrades.forEach(upgrade => {
    const button = document.createElement('button');
    button.textContent = `${upgrade.name} (Level: ${upgrade.level}) - Cost: ${upgrade.cost}`;
    button.addEventListener('click', () => buyUpgrade(upgrade));
    button.disabled = points < upgrade.cost;
    upgradesContainer.appendChild(button);
  });
}

// Buy Upgrade
function buyUpgrade(upgrade) {
  if (points >= upgrade.cost) {
    points -= upgrade.cost;
    upgrade.level++;
    upgrade.cost = Math.round(upgrade.cost * 1.5); // Increase cost
    updatePoints();
    renderUpgrades();
  }
}

// Auto-Income Logic
setInterval(() => {
  upgrades.forEach(upgrade => {
    points += upgrade.level * upgrade.income;
  });
  updatePoints();
}, 1000);

// Update Points Display
function updatePoints() {
  pointsDisplay.textContent = points;
  renderUpgrades();
  saveGame();
}

// Save Game
function saveGame() {
  localStorage.setItem('idleGame', JSON.stringify({ points, upgrades }));
}

// Load Game
function loadGame() {
  const savedGame = JSON.parse(localStorage.getItem('idleGame'));
  if (savedGame) {
    points = savedGame.points;
    upgrades = savedGame.upgrades;
    updatePoints();
  }
}

// Button Animation
function animateButton(button) {
  button.style.transform = 'scale(0.95)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 100);
}

// Initial Render
renderUpgrades();
