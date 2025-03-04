let points = 0;
let totalPointsEarned = 0;
let totalClicks = 0;
let totalUpgradesPurchased = 0;
let upgrades = [
  { id: 1, name: "Auto-Clicker", cost: 10, level: 0, income: 1 },
  { id: 2, name: "Mega-Clicker", cost: 50, level: 0, income: 5 },
  { id: 3, name: "Super-Clicker", cost: 100, level: 0, income: 10 },
];

// DOM Elements
const pointsDisplay = document.getElementById('points');
const clickButton = document.getElementById('click-button');
const upgradesContainer = document.getElementById('upgrades');
const totalPointsDisplay = document.getElementById('total-points');
const totalClicksDisplay = document.getElementById('total-clicks');
const totalUpgradesDisplay = document.getElementById('total-upgrades');
const passiveIncomeDisplay = document.getElementById('passive-income');

// Load saved game
loadGame();

// Click Event
clickButton.addEventListener('click', () => {
  points++;
  totalPointsEarned++;
  totalClicks++;
  updatePoints();
  animateButton(clickButton);
  updateStats();
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
    totalUpgradesPurchased++;
    upgrade.cost = Math.round(upgrade.cost * 1.5); // Increase cost
    updatePoints();
    renderUpgrades();
    updateStats();
  }
}

// Auto-Income Logic
setInterval(() => {
  let passiveIncome = 0;
  upgrades.forEach(upgrade => {
    passiveIncome += upgrade.level * upgrade.income;
  });
  points += passiveIncome;
  totalPointsEarned += passiveIncome;
  updatePoints();
  updateStats();
}, 1000);

// Update Points Display
function updatePoints() {
  pointsDisplay.textContent = points;
  renderUpgrades();
  saveGame();
}

// Update Stats Display
function updateStats() {
  totalPointsDisplay.textContent = totalPointsEarned;
  totalClicksDisplay.textContent = totalClicks;
  totalUpgradesDisplay.textContent = totalUpgradesPurchased;
  passiveIncomeDisplay.textContent = calculatePassiveIncome();
}

// Calculate Passive Income
function calculatePassiveIncome() {
  return upgrades.reduce((total, upgrade) => total + upgrade.level * upgrade.income, 0);
}

// Save Game
function saveGame() {
  localStorage.setItem('idleGame', JSON.stringify({
    points,
    totalPointsEarned,
    totalClicks,
    totalUpgradesPurchased,
    upgrades,
  }));
}

// Load Game
function loadGame() {
  const savedGame = JSON.parse(localStorage.getItem('idleGame'));
  if (savedGame) {
    points = savedGame.points;
    totalPointsEarned = savedGame.totalPointsEarned;
    totalClicks = savedGame.totalClicks;
    totalUpgradesPurchased = savedGame.totalUpgradesPurchased;
    upgrades = savedGame.upgrades;
    updatePoints();
    updateStats();
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
updateStats();
