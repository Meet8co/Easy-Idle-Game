let points = 0;
let totalPointsEarned = 0;
let totalClicks = 0;
let totalUpgradesPurchased = 0;
let prestigeLevel = 0;
let prestigeBonus = 1;
let highestPoints = 0;

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
const prestigeButton = document.getElementById('prestige-button');
const prestigeLevelDisplay = document.getElementById('prestige-level');
const prestigeBonusDisplay = document.getElementById('prestige-bonus');
const highestPointsDisplay = document.getElementById('highest-points');
const themeToggle = document.getElementById('theme-toggle');

// Audio Elements
const clickSound = document.getElementById('click-sound');
const upgradeSound = document.getElementById('upgrade-sound');
const achievementSound = document.getElementById('achievement-sound');

// Load saved game
loadGame();

// Click Event
clickButton.addEventListener('click', () => {
  points += prestigeBonus;
  totalPointsEarned += prestigeBonus;
  totalClicks++;
  updatePoints();
  animateButton(clickButton);
  updateStats();
  checkAchievements();
  clickSound.play();
});

// Restart Event
restartButton.addEventListener('click', () => {
  if (confirm("Are you sure you want to restart the game? All progress will be lost!")) {
    restartGame();
  }
});

// Prestige Event
prestigeButton.addEventListener('click', () => {
  if (points >= 10000) {
    prestigeLevel++;
    prestigeBonus *= 2;
    points = 0;
    totalPointsEarned = 0;
    totalClicks = 0;
    totalUpgradesPurchased = 0;
    upgrades.forEach(upgrade => {
      upgrade.level = 0;
      upgrade.cost = [10, 50, 100, 500, 1000][upgrade.id - 1]; // Reset costs
    });
    updatePoints();
    updateStats();
    renderAchievements();
    alert(`Prestige Level ${prestigeLevel} unlocked! Bonus: ${prestigeBonus}x`);
  } else {
    alert("You need at least 10,000 points to prestige!");
  }
});

// Theme Toggle Event
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
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
    upgradeSound.play();
  }
}

// Auto-Income Logic
setInterval(() => {
  let passiveIncome = 0;
  upgrades.forEach(upgrade => {
    passiveIncome += upgrade.level * upgrade.income;
  });
  points += passiveIncome * prestigeBonus;
  totalPointsEarned += passiveIncome * prestigeBonus;
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
  passiveIncomeDisplay.textContent = calculatePassiveIncome() * prestigeBonus;
  prestigeLevelDisplay.textContent = prestigeLevel;
  prestigeBonusDisplay.textContent = `${prestigeBonus}x`;
  highestPoints = Math.max(highestPoints, totalPointsEarned);
  highestPointsDisplay.textContent = highestPoints;
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
  let gameState = {
    totalPointsEarned,
    totalClicks,
    totalUpgradesPurchased,
  };

  achievements.forEach(achievement => {
    if (!achievement.unlocked && achievement.condition(gameState)) {
      achievement.unlocked = true;
      alert(`Achievement Unlocked: ${achievement.name}`);
      achievementSound.play();
    }
  });
  renderAchievements();
  saveGame();
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
    prestigeLevel,
    prestigeBonus,
    highestPoints,
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
    prestigeLevel = savedGame.prestigeLevel || 0;
    prestigeBonus = savedGame.prestigeBonus || 1;
    highestPoints = savedGame.highestPoints || 0;
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
  prestigeLevel = 0;
  prestigeBonus = 1;
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
  button.classList.add('click-animation');
  setTimeout(() => {
    button.classList.remove('click-animation');
  }, 100);
}

// Initial Render
renderUpgrades();
updateStats();
renderAchievements();
