// Credits: JOHN RÉ (JohnDev19) 
// This project is licensed under the MIT License. 
// Please do not change the credits.

        const box = document.getElementById('box');
        const gameContainer = document.getElementById('game-container');
        const scoreElement = document.getElementById('score-value');
        const gameOverElement = document.getElementById('game-over');
        const finalScoreElement = document.getElementById('final-score');
        const restartBtn = document.getElementById('restart-btn');
        const dayNightToggle = document.getElementById('day-night-toggle');
        const mountains = document.getElementById('mountains');
        const hills = document.getElementById('hills');
        const ground = document.getElementById('ground');

        let isJumping = false;
        let isGameOver = false;
        let score = 0;
        let gameSpeed = 5;
        let obstacles = [];
        let clouds = [];
        let powerUps = [];
        let trees = [];
        let birds = [];
        let isInvincible = false;

        const environments = [
            { name: 'default', groundColor: '#8B4513', skyColor: '#97deff', obstacleColor: '#666' },
            { name: 'winter', groundColor: '#FFFFFF', skyColor: '#E0FFFF', obstacleColor: '#87CEEB' },
            { name: 'desert', groundColor: '#F4A460', skyColor: '#87CEEB', obstacleColor: '#8B4513' },
            { name: 'beach', groundColor: '#F0E68C', skyColor: '#00BFFF', obstacleColor: '#20B2AA' }
        ];
        let currentEnvironment = 0;

        function gameLoop() {
            if (!isGameOver) {
                score++;
                scoreElement.textContent = score;
                
                gameSpeed = 5 + Math.floor(score / 500);

                if (score % 100 === 0) {
                    createObstacle();
                }

                if (score % 200 === 0) {
                    createCloud();
                }

                if (Math.random() < 0.01) {
                    createTree();
                }

                if (Math.random() < 0.005) {
                    createBird();
                }

                if (score % 1000 === 0) {
                    createPowerUp();
                    changeEnvironment();
                }

                updateElements(obstacles, gameSpeed);
                updateElements(clouds, gameSpeed / 2);
                updateElements(powerUps, gameSpeed);
                updateElements(trees, gameSpeed);
                updateElements(birds, gameSpeed * 1.5);

                updateParallax();

                requestAnimationFrame(gameLoop);
            }
        }

        function updateElements(elements, speed) {
            elements.forEach((element, index) => {
                const left = parseInt(window.getComputedStyle(element).getPropertyValue('left'));
                
                if (left < -100) {
                    element.remove();
                    elements.splice(index, 1);
                } else {
                    element.style.left = (left - speed) + 'px';
                    
                    if (checkCollision(box, element)) {
                        if (element.classList.contains('power-up')) {
                            activatePowerUp(element);
                        } else if (!isInvincible && element.classList.contains('obstacle')) {
                            gameOver();
                        }
                    }
                }
            });
        }

        function createObstacle() {
            const obstacle = document.createElement('div');
            obstacle.classList.add('obstacle');
            obstacle.style.left = gameContainer.offsetWidth + 'px';
            obstacle.style.backgroundColor = environments[currentEnvironment].obstacleColor;
            gameContainer.appendChild(obstacle);
            obstacles.push(obstacle);
        }

        function createCloud() {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.style.left = gameContainer.offsetWidth + 'px';
            cloud.style.top = Math.random() * (gameContainer.offsetHeight / 2) + 'px';
            cloud.style.width = Math.random() * 100 + 50 + 'px';
            cloud.style.height = Math.random() * 40 + 20 + 'px';
            cloud.style.animation = `float ${Math.random() * 5 + 5}s infinite alternate`;
            gameContainer.appendChild(cloud);
            clouds.push(cloud);
        }

        function createTree() {
            const tree = document.createElement('div');
            tree.classList.add('tree');
            tree.style.left = gameContainer.offsetWidth + 'px';
            gameContainer.appendChild(tree);
            trees.push(tree);
        }

        function createBird() {
            const bird = document.createElement('div');
            bird.classList.add('bird');
            bird.style.left = gameContainer.offsetWidth + 'px';
            bird.style.top = Math.random() * (gameContainer.offsetHeight * 0.6) + 'px';
            bird.style.animation = `fly ${Math.random() * 2 + 1}s infinite alternate`;
            gameContainer.appendChild(bird);
            birds.push(bird);
        }

        function createPowerUp() {
            const powerUp = document.createElement('div');
            powerUp.classList.add('power-up');
            powerUp.style.left = gameContainer.offsetWidth + 'px';
            powerUp.style.bottom = Math.random() * (gameContainer.offsetHeight / 2) + (gameContainer.offsetHeight / 4) + 'px';
            gameContainer.appendChild(powerUp);
            powerUps.push(powerUp);
        }

        function activatePowerUp(powerUp) {
            powerUp.remove();
            powerUps = powerUps.filter(p => p !== powerUp);
            isInvincible = true;
            box.style.backgroundColor = 'gold';
            setTimeout(() => {
                isInvincible = false;
                box.style.backgroundColor = '#333';
            }, 5000);
        }

        function jump() {
            if (!isJumping && !isGameOver) {
                isJumping = true;
                box.style.animation = 'jump 0.7s cubic-bezier(0.4, 0, 0.2, 1)';

                setTimeout(() => {
                    box.style.animation = 'run 0.3s infinite';
                    isJumping = false;
                }, 700);
            }
        }

        function checkCollision(element1, element2) {
            const rect1 = element1.getBoundingClientRect();
            const rect2 = element2.getBoundingClientRect();

            return !(rect1.right < rect2.left || 
                    rect1.left > rect2.right || 
                    rect1.bottom < 

 rect2.top || 
                    rect1.top > rect2.bottom);
        }

        function gameOver() {
            isGameOver = true;
            gameOverElement.style.display = 'block';
            finalScoreElement.textContent = score;
            box.style.animation = 'none';
        }

        function restartGame() {
            isGameOver = false;
            score = 0;
            gameSpeed = 5;
            gameOverElement.style.display = 'none';
            
            obstacles.forEach(obstacle => obstacle.remove());
            clouds.forEach(cloud => cloud.remove());
            powerUps.forEach(powerUp => powerUp.remove());
            trees.forEach(tree => tree.remove());
            birds.forEach(bird => bird.remove());
            obstacles = [];
            clouds = [];
            powerUps = [];
            trees = [];
            birds = [];
            
            box.style.animation = 'run 0.3s infinite';
            box.style.backgroundColor = '#333';
            
            changeEnvironment(0);
            gameLoop();
        }

        function toggleDayNight() {
            document.body.classList.toggle('night-mode');
            dayNightToggle.textContent = document.body.classList.contains('night-mode') ? '🌙' : '🌞';
        }

        function updateParallax() {
            const mountainsSpeed = gameSpeed * 0.2;
            const hillsSpeed = gameSpeed * 0.5;

            const currentMountainsPosition = parseFloat(getComputedStyle(mountains).backgroundPositionX);
            const currentHillsPosition = parseFloat(getComputedStyle(hills).backgroundPositionX);

            mountains.style.backgroundPositionX = `${currentMountainsPosition - mountainsSpeed}px`;
            hills.style.backgroundPositionX = `${currentHillsPosition - hillsSpeed}px`;
        }

        function changeEnvironment(index = undefined) {
            if (index !== undefined) {
                currentEnvironment = index;
            } else {
                currentEnvironment = (currentEnvironment + 1) % environments.length;
            }
            const env = environments[currentEnvironment];
            ground.style.backgroundColor = env.groundColor;
            gameContainer.style.background = `linear-gradient(${env.skyColor}, ${env.groundColor})`;
            obstacles.forEach(obstacle => obstacle.style.backgroundColor = env.obstacleColor);
        }

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                jump();
            }
        });

        gameContainer.addEventListener('touchstart', jump);
        restartBtn.addEventListener('click', restartGame);
        dayNightToggle.addEventListener('click', toggleDayNight);

        window.addEventListener('resize', () => {
            box.style.bottom = gameContainer.offsetHeight * 0.2 + 'px';
        });

        box.style.animation = 'run 0.3s infinite';
        gameLoop();