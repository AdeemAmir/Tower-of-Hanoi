import { sleep } from './common.js'
import { hanSol } from './hanoiAlgo.js'

const towers = document.querySelectorAll('.tower');
let towerContent = [[], [], []];
let size = 3;
let discs;
const sleepTime = 300;
let speed = 100;
const DISC_COLORS = ['#3b3eac', '#ff6f61', '#00b8a9', '#ffba08', '#9d4edd', '#b5179e'];
const startWidth = 90;
let stepCount = 0;
let currentTower;
let originTower;
let startTime;
// dom elements
const newGameBtn = document.getElementById('newGameBtn')
const discSelect = document.getElementById('discSelect')
const speedRange = document.getElementById('speedRange')
const btnSolve = document.getElementById('btnSolve')
const timerDisplay = document.getElementById('timerDisplay')


const buildTowers = (towers) => {
  towers.forEach(tower => {
    const stem = document.createElement('div')
    stem.className = 'stem'
    const plate = document.createElement('div')
    plate.className = 'plate'
    tower.innerHTML = ''
    tower.appendChild(stem)
    tower.appendChild(plate)
  })
}

start();

function start() {
  towerContent = [[], [], []]
  startTime = Date.now()
  buildTowers(towers)

  for (let i = 0; i < size; i++) {
    let tower = document.createElement('div')
    tower.classList.add('disc')
    tower.draggable = true
    tower.style.backgroundColor = DISC_COLORS[i]
    tower.style.width = (startWidth - 15 * i) + 'px'
    towerContent[0].push(tower)
  }

  towerContent[0].forEach(t => {
    towers[0].innerHTML = t.outerHTML + towers[0].innerHTML
  })

  for (let i = 0; i < towers.length; i++) {
    towers[i].classList.add('t' + i)
    towers[i].addEventListener('dragenter', dragenter)
    towers[i].addEventListener('dragover', dragover)
  }

  discs = document.querySelectorAll('.disc')

  discs.forEach(disc => {
    disc.addEventListener('dragstart', dragstart)
    disc.addEventListener('dragend', dragend)
  })
}

function dragenter() {
  if (!originTower) {
    originTower = this
  }
}

function dragover() {
  currentTower = this
}
function dragstart() {
  this.classList.add('is-dragging')
}

function dragend() {
  let originTowerIndex = originTower.classList[1][1]
  let currentTowerIndex = currentTower.classList[1][1]
  this.classList.remove('is-dragging')

  moveTower(originTowerIndex, currentTowerIndex, this)

  originTower = undefined
  originTowerIndex = undefined

  checkGameOver()
}

function moveTower(originTowerIndex, currentTowerIndex, disc) {
  if (isDroppable(originTowerIndex, currentTowerIndex, disc)) {
    towerContent[currentTowerIndex].push(towerContent[originTowerIndex].pop());
    originTower.removeChild(disc);
    currentTower.prepend(disc);
    stepCount++;
  }
}

function isDroppable(originTowerIndex, currentTowerIndex, disc) {
  let top = isOnTop(originTowerIndex, disc)
  let topDiscIsLess = isDiscLessThan(currentTowerIndex, disc)

  return top && topDiscIsLess
}

function isOnTop(originTowerIndex, disc) {
  let size = towerContent[originTowerIndex].length
  return disc.style.width === towerContent[originTowerIndex][size - 1].style.width
}

function isDiscLessThan(currentTowerIndex, disc) {
  let size = towerContent[currentTowerIndex].length

  if (!towerContent[currentTowerIndex][size - 1]) {
    return true
  } else {
    let sizeTop = disc.style.width.substring(0, disc.style.width.indexOf('p'))
    let sizeBottom = towerContent[currentTowerIndex][size - 1].style.width.substring(0, towerContent[currentTowerIndex][size - 1].style.width.indexOf('p'))

    return Number(sizeTop) < Number(sizeBottom)
  }
}

function moveTopDisc(originTowerIndex, destinyTowerIndex) {
  originTower = towers[originTowerIndex]
  currentTower = towers[destinyTowerIndex]
  let disc = getTopDisc(originTowerIndex)
  moveTower(originTowerIndex, destinyTowerIndex, disc)
}

function getTopDisc(towerIndex) {
  let size = towerContent[towerIndex].length

  let sizeDisc = towerContent[towerIndex][size - 1].style.width
  let indexDisc = -1
  discs.forEach((el, index) => {
    if (el.style.width === sizeDisc) {
      indexDisc = index
    }
  })
  return discs[indexDisc]
}

function checkGameOver() {
  if (towerContent[2].length === size) {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minimumSteps = Math.pow(2, size) - 1;
    showPopup(
      `Game Over!`,
      `Time Taken: ${formatTime(timeTaken)}<br>
      Steps Taken: ${stepCount}<br>
      Minimum Steps: ${minimumSteps}`
    );
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showPopup(title, message) {
  const popup = document.createElement('div');
  popup.className = 'popup';

  const popupContent = `
    <div class="popup-content">
      <h2>${title}</h2>
      <p>${message}</p>
      <button id="closePopup">Close</button>
    </div>
  `;

  popup.innerHTML = popupContent;
  document.body.appendChild(popup);

  document.getElementById('closePopup').onclick = () => popup.remove();
}


async function moves(movements) {
  const startTime = Date.now()
  for (let i = 0; i < movements.length; i++) {
    const element = movements[i];
    moveTopDisc(element.origin, element.destiny)
    await sleep(5 * sleepTime - 14 * speed)
  }
  const timeTaken = Date.now() - startTime
  timerDisplay.textContent = `Time Taken: ${formatTime(timeTaken)}`
}

class Game {
  newGame = () => {
    speedRange.addEventListener('input', event => {
      speed = event.target.value
    })

    newGameBtn.addEventListener('click', () => {
      size = discSelect.selectedIndex + 1
      stepCount = 0;
      start()
    })

    btnSolve.onclick = function() {
      const movements = hanSol(size)
      moves(movements)
    }
  }
}export default Game;
