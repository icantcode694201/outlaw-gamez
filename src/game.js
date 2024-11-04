document.addEventListener("DOMContentLoaded", () => {
    let running;
    let gameScore = 0;
    let multiplier = 1;
    const scoreDisplay = document.getElementById('score');
    const multiplierDisplay = document.getElementById('multiplierDisplay');
    const incrementButton = document.getElementById('incrementButton');
    const resetButton = document.getElementById('resetButton');
    const achievementsList = document.getElementById('achievementsList');
    const itemsListContainer = document.getElementById('itemsListContainer');

    incrementButton.addEventListener('click', IncrementScore);
    resetButton.addEventListener('click', resetGame);

    let items = loadCandyItems();

    function initializeGame() {
        gameScore = 0;
        multiplier = 1;
        scoreDisplay.textContent = 'Candies: ' + gameScore;
        multiplierDisplay.textContent = 'Production Rate: x' + multiplier;
        running = true;
        achievementsList.innerHTML = '';
        updateItemDisplay();
    }

    function IncrementScore() {
        if (!running) return;
        gameScore += 1 * multiplier;
        scoreDisplay.textContent = 'Candies: ' + gameScore;
        updateItemDisplay();
        checkAchievementsDisplay();
    }

    function updateItemDisplay() {
        itemsListContainer.innerHTML = '';

        items.forEach((item, index) => {
            // Make the first 3 items always visible but initially unselectable
            const isAffordable = gameScore >= item.cost;
            if (isAffordable || index < 3) {
                const itemButton = document.createElement('button');
                itemButton.className = 'item-button';
                itemButton.textContent = `${item.name} - Cost: ${item.cost}`;
                
                // Quantity indicator
                const itemQuantity = document.createElement('span');
                itemQuantity.className = 'item-quantity';
                itemQuantity.textContent = `x${item.count}`;
                
                itemButton.appendChild(itemQuantity);
                itemsListContainer.appendChild(itemButton);

                // Check if item is affordable or always-visible initial item
                if (isAffordable) {
                    itemButton.onclick = () => purchaseItem(item);
                    itemButton.classList.remove('unselectable');
                } else {
                    itemButton.classList.add('unselectable');
                    itemButton.onclick = null;
                }
            }
        });
    }

    function purchaseItem(item) {
        if (gameScore >= item.cost) {
            gameScore -= item.cost;
            item.count += 1;
            multiplier += item.multiplier;
            scoreDisplay.textContent = 'Candies: ' + gameScore;
            multiplierDisplay.textContent = 'Production Rate: x' + multiplier;

            // Increase the item's price for future purchases
            item.cost = Math.ceil(item.cost * 1.15);

            updateItemDisplay();
            startAutomation(item);
        }
    }

    function startAutomation(item) {
        if (item.interval && item.count === 1) {
            setInterval(() => {
                if (running) {
                    gameScore += item.multiplier * item.count;
                    scoreDisplay.textContent = 'Candies: ' + gameScore;
                    checkAchievementsDisplay();
                }
            }, item.interval);
        }
    }

    function checkAchievementsDisplay() {
        const unlocked = checkAchievements(gameScore);
        unlocked.forEach(achievement => {
            if (!document.getElementById(achievement.name)) {
                const achievementElement = document.createElement('li');
                achievementElement.id = achievement.name;
                achievementElement.className = 'achievement';
                achievementElement.textContent = achievement.name;
                achievementsList.appendChild(achievementElement);
            }
        });
    }

    function resetGame() {
        initializeGame();
        items.forEach(item => item.count = 0);
    }

    initializeGame();
});
