let scene, camera, renderer;
let player, bullets = [], enemies = [];
let playerSpeed = 0.4; // Increased player speed
let bulletSpeed = 0.5;
let enemySpeed = 0.05;
let canShoot = true;
let score = 0;
let highScore = 0;
let keys = {};

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
        if (event.key === ' ') {
            shoot();
        }
    }, false);
    document.addEventListener('keyup', (event) => keys[event.key] = false, false);

    // Display score
    displayScores();

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

function animate() {
    requestAnimationFrame(animate);

    // Move player smoothly
    movePlayer();

    // Move bullets
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].position.z -= bulletSpeed;
        if (bullets[i].position.z < -50) {
            scene.remove(bullets[i]);
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
            if (bullets[i].position.distanceTo(enemies[j].position) < 1) { // Increased collision radius
                // Remove bullet and enemy from the scene
                scene.remove(bullets[i]);
                bullets.splice(i, 1);
                i--;

                scene.remove(enemies[j]);
                enemies.splice(j, 1);
                j--;

                // Increase score and update display
                score++;
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
