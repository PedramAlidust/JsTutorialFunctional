let scene, camera, renderer;
let player, bullets = [], enemies = [];
let playerSpeed = 0.4; // Increased player speed
let bulletSpeed = 0.5;
let enemySpeed = 0.05;
let canShoot = true;
let score = 0;
let highScore = 0;
let kills = 0;
let maxKills = 10;
let gameDuration = 10000; // 10 seconds in milliseconds
let startTime, gameOver = false;
let keys = {}; 
let collisionThreshold = 5; // Distance threshold for collision detection
 
function init() {
    // Set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create player
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    scene.add(player);

    // Create initial enemies
    for (let i = 0; i < 5; i++) {
        createEnemy();
    }

    // Add event listener for key presses
    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
        if (event.key === ' ' && !gameOver) {
            shoot();
        }
        if (event.key === 'r' && gameOver) {
            resetGame();
        }
    }, false);
    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
    }, false);

    // Display score
    displayScores();

    // Start the game timer
    startTime = Date.now();
    
    // Start render loop
    animate();
}

function createEnemy() {
    const enemyGeometry = new THREE.BoxGeometry(1, 1, 1);
    const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.x = Math.random() * 20 - 10;
    enemy.position.y = Math.random() * 20 - 10;
    enemy.position.z = -Math.random() * 20;
    scene.add(enemy);
    enemies.push(enemy);
}

function shoot() {
    if (canShoot) {
        const bulletGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Increased bullet size
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.copy(player.position);
        bullet.position.z += 1; // Ensure bullet is in front of the player

        // Set bullet direction
        bullet.velocity = new THREE.Vector3(0, 0, -bulletSpeed); // Move bullets in the direction opposite to camera view
        scene.add(bullet);
        bullets.push(bullet);
        canShoot = false;
        setTimeout(() => canShoot = true, 300); // Allow shooting every 300ms
    }
}

function movePlayer() {
    if (keys['ArrowLeft']) player.position.x -= playerSpeed;
    if (keys['ArrowRight']) player.position.x += playerSpeed;
    if (keys['ArrowUp']) player.position.y += playerSpeed;
    if (keys['ArrowDown']) player.position.y -= playerSpeed;
}

function displayScores() {
    const scoreDiv = document.getElementById('score');
    if (!scoreDiv) {
        const newDiv = document.createElement('div');
        newDiv.id = 'score';
        newDiv.style.position = 'absolute';
        newDiv.style.top = '10px';
        newDiv.style.left = '10px';
        newDiv.style.color = 'white';
        newDiv.style.fontSize = '20px';
        document.body.appendChild(newDiv);
    }
    document.getElementById('score').innerHTML = `Score: ${score} <br> High Score: ${highScore}`;
}

function displayGameOver() {
    const gameOverDiv = document.getElementById('game-over');
    if (!gameOverDiv) {
        const newDiv = document.createElement('div');
        newDiv.id = 'game-over';
        newDiv.style.position = 'absolute';
        newDiv.style.top = '50%';
        newDiv.style.left = '50%';
        newDiv.style.transform = 'translate(-50%, -50%)';
        newDiv.style.color = 'red';
        newDiv.style.fontSize = '40px';
        newDiv.style.textAlign = 'center';
        newDiv.innerHTML = `Game Over<br>Your Score: ${score}<br>Press R to Restart`;
        document.body.appendChild(newDiv);
    }
}

function resetGame() {
    gameOver = false;
    score = 0;
    kills = 0;
    player.position.set(0, 0, 0);

    // Remove existing enemies and bullets
    enemies.forEach(enemy => scene.remove(enemy));
    bullets.forEach(bullet => scene.remove(bullet));
    enemies = [];
    bullets = [];

    // Create new enemies
    for (let i = 0; i < 5; i++) {
        createEnemy();
    }

    // Remove game over message
    const gameOverDiv = document.getElementById('game-over');
    if (gameOverDiv) {
        gameOverDiv.remove();
    }

    // Update score display
    displayScores();

    // Reset timer
    startTime = Date.now();
}

function isCollision(bullet, enemy) {
    // Define the distance between the center of the bullet and enemy
    const distance = bullet.position.distanceTo(enemy.position);

    // Check if the distance is less than the threshold
    return distance < collisionThreshold;
}

function animate() {
    requestAnimationFrame(animate);

    if (!gameOver) {
        // Move player smoothly
        movePlayer();

        // Move bullets
        for (let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            bullet.position.add(bullet.velocity);
            if (bullet.position.z < -50) { // Adjust this boundary as needed
                scene.remove(bullet);
                bullets.splice(i, 1);
                i--;
            }
        }

        // Move enemies
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].position.z += enemySpeed;
            if (enemies[i].position.z > 20) {
                enemies[i].position.z = -20;
                enemies[i].position.x = Math.random() * 20 - 10;
                enemies[i].position.y = Math.random() * 20 - 10;
            }
        }

        // Check for collisions between bullets and enemies
        for (let i = 0; i < bullets.length; i++) {
            for (let j = 0; j < enemies.length; j++) {
                if (isCollision(bullets[i], enemies[j])) {
                    // Remove bullet and enemy from the scene
                    scene.remove(bullets[i]);
                    bullets.splice(i, 1);
                    i--;

                    scene.remove(enemies[j]);
                    enemies.splice(j, 1);
                    j--;

                    // Increase score and kills
                    score++;
                    kills++;
                    if (score > highScore) {
                        highScore = score;
                    }
                    displayScores();

                    // Create a new enemy to replace the killed one
                    createEnemy();
                    break;
                }
            }
        }

        // Check if the game is over due to timeout
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= gameDuration) {
            if (kills < maxKills) {
                gameOver = true;
                displayGameOver();
                return;
            }
        }
    }

    // Check if the 'R' key is pressed to restart
    if (keys['r'] && gameOver) {
        resetGame();
    }

    renderer.render(scene, camera);
}

// Adjust the scene when the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize the game
init();
