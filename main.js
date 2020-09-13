const score = document.querySelector('.score'),
    bestScore = document.querySelector('.bestScore'),
    start = document.querySelector('.start'),
    level = document.querySelector('.level'),
    levelButton = document.querySelectorAll('.levelButton'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');


car.classList.add('car');

start.addEventListener('click', () => {
    if (!gameArea.classList.contains('hide')) {
        gameArea.classList.add('hide');
    }
    if (!score.classList.contains('hide')) {
        score.classList.add('hide');
    }    
    if (!bestScore.classList.contains('hide')) {
        bestScore.classList.add('hide');
    }    
    level.classList.remove('hide');
    start.classList.add('hide');
});

for (let i = 0; i < levelButton.length; i++) {
    levelButton[i].addEventListener('click', function(){
        setting.speed = 6;
        setting.traffic = 3;
        setting.speed = setting.speed + i * 2;
        setting.traffic = setting.traffic - i / 2;
        startGame();
    })
};

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowRight : false,
    ArrowLeft : false
};

const setting = {
    start: false,
    score: 0,
    bestScore: 0,
    speed: 6,
    traffic: 3
};

function getQuantityElements(heightElement) {
    return gameArea.offsetHeight / heightElement;
}

function startGame(){
    start.innerHTML='';
    score.classList.remove('hide');
    bestScore.classList.remove('hide');  
    score.classList.remove('scoreResult');    
    score.style.top = '';
    score.style.background = '';
    score.style.color = '';
    gameArea.classList.remove('hide');
    gameArea.innerHTML = '';    
    
    for (let i = 0; i < getQuantityElements(100) + 1; i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i< getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 4) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./images/enemy${enemyImg}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;    
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame(){    
    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML ='Score:<br>' + setting.score;
        bestScore.innerHTML ='Best Score:<br>' + localStorage.getItem('score');
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x >0){
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }
        if (keys.ArrowUp && setting.y >0){
            setting.y -= setting.speed;
        }
        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
    
}

function startRun(event){
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)){
        keys[event.key] = true;
    }    
}

function stopRun(event){
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)){
    keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){ 
        line.y += setting.speed;
        line.style.top = line.y +'px';
        if (line.y >= gameArea.offsetHeight){
            line.y = -100;
        }
    });  
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if (carRect.top <= enemyRect.bottom &&   carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
            setting.start = false; 
            start.classList.remove('hide'); 
            start.innerHTML='Oops!<br> Click here to start again!';
            start.style.background = 'crimson';
            score.style.top = start.offsetHeight;
            score.classList.add('scoreResult'); 
            if (setting.score > localStorage.getItem('score')){
                localStorage.setItem('score', setting.score);
                score.innerHTML ='Congratulations!!! <br> You have beaten your highest score!<br>' + setting.score;        
                score.style.background = 'transparent url(./images/salut.gif) center / cover no-repeat';  
                score.style.color = 'yellow';                      
            }  
            setting.bestScore = localStorage.getItem('score');            
        }
        item.y +=setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y >= gameArea.offsetHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}
