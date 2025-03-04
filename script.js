let points = 0;
let autoClickerLevel = 0;

// DOM Elements
const pointsDisplay = document.getElementById('points');
const clickButton = document.getElementById('click-button');
const upgradeButton = document.getElementById('upgrade-1');

// Click Event
clickButton.addEventListener('click', () => {
  points++;
  updatePoints();
});

// Upgrade Event
upgradeButton.addEventListener('click', () => {
  if (points >= 10) {
    points -= 10;
    autoClickerLevel++;
    updatePoints();
    startAutoClicker();
  }
});

// Auto-Clicker Logic
function startAutoClicker() {
  setInterval(() => {
    points += autoClickerLevel;
    updatePoints();
  }, 1000);
}

// Update Points Display
function updatePoints() {
  pointsDisplay.textContent = points;
}
