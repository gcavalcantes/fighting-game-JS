const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 350,
        y: 223,
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
    x:0,
    y:0
    },
    offset: {
        x: 0,
        y: 0
    },
    velocity:{
        x:0,
        y:10
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 155,
    }
})

const enemy = new Fighter({
    position: {
    x:400,
    y:100
    },
    offset: {
        x: -50,
        y: 0
    },
    velocity:{
        x:0,
        y:0
    },
    color: 'blue'
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    //enemy.update()
    
    // Player 1 movement 
    player.velocity.x = 0

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
    }

    // Player 2 movement
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
    }

    // Detect for collision for player 1
    if (
        rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
        player.isAttacking
        ){
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#player2Health').style.width = enemy.health + '%';

    }

    // Detect for collision for player 2
    if (
        rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
        enemy.isAttacking
        ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#player1Health').style.width = player.health + '%';

    }

    // Ends the round based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {

    switch (event.key){
        // Player 1 keys down
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
        
        // Player 2 keys down
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }

})
window.addEventListener('keyup', (event) => {
    // Player 1 keys up
    switch (event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            player.velocity.y = 0
            break
    }

    // Player 2 keys up
    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            enemy.velocity.y = 0
            break
    }

})