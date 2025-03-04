let points = 0;
let totalPointsEarned = 0;
let totalClicks = 0;
let totalUpgradesPurchased = 0;
let upgrades = [
  { id: 1, name: "Auto-Clicker", cost: 10, level: 0, income: 1 },
  { id: 2, name: "Mega-Clicker", cost: 50, level: 0, income: 5 },
  { id: 3, name: "Super-Clicker", cost: 100, level: 0, income: 10 },
  { id: 4, name: "Ultra-Clicker", cost: 500, level: 0, income: 50 },
  { id: 5, name: "Omega-Clicker", cost: 1000, level: 0, income: 100 },
];

let achievements = [
  { id: 1, name: "First Click", condition: (game) => game.totalClicks >= 1, unlocked: false },
  { id: 2, name: "100 Points", condition: (game) => game.totalPointsEarned >= 100, unlocked: false },
  { id: 3, name: "10 Upgrades", condition: (game) => game.totalUpgradesPurchased >= 10, unlocked: false },
  { id: 4, name: "1,000 Points", condition: (game) => game.totalPointsEarned >= 1000, unlocked: false },
  { id: 5, name: "50 Clicks", condition: (game) => game.totalClicks >= 50, unlocked: false },
];

// DOM Elements
const pointsDisplay = document.getElementById('points');
const clickButton = document.getElementById('click-button');
const upgradesContainer = document.getElementById('upgrades');
const totalPointsDisplay = document.getElementById('total-points');
const totalClicksDisplay = document.getElementById('total-clicks');
const totalUpgradesDisplay = document.getElementById('total-upgrades');
const passiveIncomeDisplay = document.getElementById('passive-income');
const achievementsContainer = document.getElementById('achievements');
const restartButton = document.getElementById('restart-button');

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
  checkAchievements();
});

// Restart Event
restartButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to restart the game? All progress will be lost!")) {
    restartGame();
  }
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
    checkAchievements();
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
  checkAchievements();
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

// Render Achievements
function renderAchievements() {
  achievementsContainer.innerHTML = '';
  achievements.forEach(achievement => {
    const div = document.createElement('div');
    div.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
    div.textContent = `${achievement.name} ${achievement.unlocked ? '✅' : ''}`;
    achievementsContainer.appendChild(div);
  });
}

// Check Achievements
function checkAchievements() {
  achievements.forEach(achievement => {
    if (!achievement.unlocked && achievement.condition({ totalPointsEarned, totalClicks, totalUpgradesPurchased })) {
      achievement.unlocked = true;
      alert(`Achievement Unlocked: ${achievement.name}`);
    }
  });
  renderAchievements();
}

// Save Game
function saveGame() {
  localStorage.setItem('idleGame', JSON.stringify({
    points,
    totalPointsEarned,
    totalClicks,
    totalUpgradesPurchased,
    upgrades,
    achievements,
  }));
}

// Load Game
function loadGame() {
  const savedGame = JSON.parse(localStorage.getItem('idleGame'));
  if (savedGame) {
    points = savedGame.points || 0;
    totalPointsEarned = savedGame.totalPointsEarned || 0;
    totalClicks = savedGame.totalClicks || 0;
    totalUpgradesPurchased = savedGame.totalUpgradesPurchased || 0;
    upgrades = savedGame.upgrades || [];
    achievements = savedGame.achievements || [];
    updatePoints();
    updateStats();
    renderAchievements();
  }
}

// Restart Game
function restartGame() {
  points = 0;
  totalPointsEarned = 0;
  totalClicks = 0;
  totalUpgradesPurchased = 0;
  upgrades.forEach(upgrade => {
    upgrade.level = 0;
    upgrade.cost = [10, 50, 100, 500, 1000][upgrade.id - 1]; // Reset costs
  });
  achievements.forEach(achievement => achievement.unlocked = false);
  localStorage.removeItem('idleGame');
  updatePoints();
  updateStats();
  renderAchievements();
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
renderAchievements();
