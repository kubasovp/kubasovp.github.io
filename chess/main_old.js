const board = document.getElementById('board');
const stat = document.getElementById('stat');
const figures = [
  { title: 'Тёмная ладья', name: 'brook' },
  { title: 'Тёмный конь', name: 'bknight' },
  { title: 'Тёмный слон', name: 'bbishop' },
  { title: 'Тёмная королева', name: 'bqueen' },
  { title: 'Тёмный король', name: 'bking' },
  { title: 'Тёмная пешка', name: 'bpawn' },
  { title: 'Светлая ладья', name: 'wrook' },
  { title: 'Светлый конь', name: 'wknight' },
  { title: 'Светлый слон', name: 'wbishop' },
  { title: 'Светлая королева', name: 'wqueen' },
  { title: 'Светлый король', name: 'wking' },
  { title: 'Светлая пешка', name: 'wpawn' }
];
let cellsArrYX = [[], [], [], [], [], [], [], []];
let selectedCell = -1;
let moveArr = [];

function createCells() {
  for (let i = 0; i < 64; i++) {
    let cell = document.createElement('div');
    let cellColor = (((Math.floor(i / 8) + i % 8) % 2) == 0) ? "white" : "black";
    cell.classList.add('cell');
    cell.classList.add(cellColor);
    cell.setAttribute('tabindex', '0');
    cell.onclick = function (event) {
      let cellTarget = event.currentTarget;
      isClick(cellTarget);
    }
    cell.onkeydown = function (event) { // Управление с клавиатуры
      let cellTarget = event.currentTarget;
      if (event.keyCode == 32) { // клавиша "пробел"
        isClick(cellTarget)
      }
      if ((event.keyCode == 37) && (cellsArrYX[cellTarget.y][cellTarget.x - 1])) { // влево
        cellsArrYX[cellTarget.y][cellTarget.x - 1].focus();
      }
      if ((event.keyCode == 39) && (cellsArrYX[cellTarget.y][cellTarget.x + 1])) { // вправо
        cellsArrYX[cellTarget.y][cellTarget.x + 1].focus();
      }
      if ((event.keyCode == 38) && (cellsArrYX[cellTarget.y - 1])) { // вверх
        cellsArrYX[cellTarget.y - 1][cellTarget.x].focus();
      }
      if ((event.keyCode == 40) && (cellsArrYX[cellTarget.y + 1])) { // вниз
        cellsArrYX[cellTarget.y + 1][cellTarget.x].focus();
      }
    }
    cell.y = Math.floor(i / 8);
    cell.x = (i % 8);
    cellsArrYX[(Math.floor(i / 8))].push(cell);
  }
}

const go = start();
function start() {
  cellsArrYX = [[], [], [], [], [], [], [], []];
  moveArr = [];
  board.innerHTML = '';
  stat.innerHTML = '';
  createCells();
  tempArr = [].concat(...cellsArrYX);
  tempArr.forEach(placement, 0);
  selectedCell = -1;
  stepNum = 0;
}

function placement(cell, i) {
  cell.setAttribute('title', i);
  // cell.innerHTML = cell.y + ' : ' + cell.x;
  if ((i === 0) || (i === 7)) setFiguresAttr(cell, 0);
  if ((i === 1) || (i === 6)) setFiguresAttr(cell, 1);
  if ((i === 2) || (i === 5)) setFiguresAttr(cell, 2);
  if (i === 3) setFiguresAttr(cell, 3);
  if (i === 4) setFiguresAttr(cell, 4);
  if ((i > 7) && (i < 16)) setFiguresAttr(cell, 5); // Тёмные пешки
  if ((i > 47) && (i < 56)) setFiguresAttr(cell, 11); // Светлые пешки
  if ((i === 56) || (i === 63)) setFiguresAttr(cell, 6);
  if ((i === 57) || (i === 62)) setFiguresAttr(cell, 7);
  if ((i === 58) || (i === 61)) setFiguresAttr(cell, 8);
  if (i === 59) setFiguresAttr(cell, 9);
  if (i === 60) setFiguresAttr(cell, 10);
  board.appendChild(cell);
}

function setFiguresAttr(cell, figureNumber) {
  cell.setAttribute('data-type', 'figure');
  cell.setAttribute('data-name', figures[figureNumber].name);
  cell.setAttribute('data-title', figures[figureNumber].title);
  if (figureNumber < 6) {
    cell.setAttribute('data-color', 'black');
  } else {
    cell.setAttribute('data-color', 'white');
  }
}

function isClick(cellTarget) {
  // Если еще нет выбраной фигуры
  if (selectedCell === -1) {
    if ((stepNum % 2 === 0) && (cellTarget.getAttribute('data-color') === 'black')) return console.log('Ход светлых'); // четный ход (белые)
    if ((stepNum % 2 !== 0) && (cellTarget.getAttribute('data-color') === 'white')) return console.log('Ход тёмных'); // нечетный ход (тёмные)
    // Если клик был по фигуре - выбираем её и просчитываем вохможные ходы
    if (cellTarget.getAttribute('data-type')) {
      console.log('Клик по фигуре ' + cellTarget.getAttribute('data-title'));
      selectedCell = cellTarget;
      getMoveArr(selectedCell);
      selectedCell.setAttribute('data-status', 'active');
    }
    // Если фигура уже выбрана
  } else {
    // Если клик по этой же фигуре - снимаем выбор
    if (selectedCell === cellTarget) {
      selectedCell.removeAttribute('data-status', 'active');
      clearMoveArr();
      selectedCell = -1;
      // Если клик по фигуре такого же цвета - перевыбираем фигуру и пересчитываем возможные ходы
    } else if (selectedCell.getAttribute('data-color') === cellTarget.getAttribute('data-color')) {
      selectedCell.removeAttribute('data-status', 'active');
      clearMoveArr();
      selectedCell = cellTarget;
      getMoveArr(selectedCell);
      selectedCell.setAttribute('data-status', 'active');
    } else if (cellTarget.getAttribute('data-status') === 'next-move') {
      !!!
      // Делаем ход: пишем лог, переносим атрибуты и обнуляем выбранную фигуру
      stepNum++;
      writeStat(selectedCell, cellTarget);
      moveAttr(selectedCell, cellTarget);
      selectedCell = -1;
    }
  }
}

function getMoveArr(selectedCell) {
  switch (selectedCell.getAttribute('data-name')) {
    case 'wpawn':
      moveArrWpawn(selectedCell);
      break;
    case 'bpawn':
      moveArrBpawn(selectedCell);
      break;
    case 'brook':
    case 'wrook':
      moveArrRook(selectedCell);
      break;
    case 'bknight':
    case 'wknight':
      moveArrKnight(selectedCell);
      break;
    case 'bbishop':
    case 'wbishop':
      moveArrBishop(selectedCell);
      break;
    case 'bqueen':
    case 'wqueen':
      moveArrRook(selectedCell);
      moveArrBishop(selectedCell);
      break;
    case 'bking':
    case 'wking':
      moveArrKing(selectedCell);
      break;
    default:
      break;
  }
}

function writeStat(selectedCell, cellTarget) {
  let newP = document.createElement('p');
  if (cellTarget.getAttribute('data-type') !== 'figure') {
    newP.innerHTML += `Ход ${stepNum}. ${selectedCell.getAttribute('data-title')} с ${selectedCell.y}:${selectedCell.x} на ${cellTarget.y}:${cellTarget.x}.`;
  } else {
    newP.innerHTML += `Ход ${stepNum}. ${selectedCell.getAttribute('data-title')} c ${selectedCell.y}:${selectedCell.x} зохавал ${cellTarget.getAttribute('data-title')} на ${cellTarget.y}:${cellTarget.x}.`;
  }
  stat.insertBefore(newP, stat.firstChild);
}

function moveAttr(selectedCell, cellTarget) {
  cellTarget.setAttribute('data-type', selectedCell.getAttribute('data-type'));
  cellTarget.setAttribute('data-name', selectedCell.getAttribute('data-name'));
  cellTarget.setAttribute('data-title', selectedCell.getAttribute('data-title'));
  cellTarget.setAttribute('data-color', selectedCell.getAttribute('data-color'));
  clearCell(selectedCell); // Убираем временные классы и дата-атрибуты
  if ((cellTarget.getAttribute('data-name') === 'wpawn') && (cellTarget.y === 0)) {
    alert('Ферзь');
    cellTarget.setAttribute('data-name', 'wqueen');
    cellTarget.setAttribute('data-title', 'Светлая королева');
  }
  if ((cellTarget.getAttribute('data-name') === 'bpawn') && (cellTarget.y === 7)) {
    alert('Ферзь');
    cellTarget.setAttribute('data-name', 'bqueen');
    cellTarget.setAttribute('data-title', 'Тёмная королева');
  }
}

function clearCell(cell) {
  cell.removeAttribute('data-status');
  cell.removeAttribute('data-type');
  cell.removeAttribute('data-name');
  cell.removeAttribute('data-title');
  cell.removeAttribute('data-color');
  clearMoveArr();
}

function clearMoveArr() {
  for (let i = 0; i < moveArr.length; i++) {
    moveArr[i].removeAttribute('data-status');
  }
  moveArr = [];
}

function moveArrWpawn(selectedCell) { // Светлая пешка
  let formulaMove = [[-1, +0], [-2, +0]];
  let formulaAttack = [[-1, -1], [-1, +1]];
  if (selectedCell.y === 6) {
    for (let i = 0; i < 2; i++) {
      let y = selectedCell.y; // строка
      let x = selectedCell.x; // ячейка в строке
      if (cellsArrYX[y + formulaMove[i][0]]) { // Есть ли такая строка
        if (cellsArrYX[x + formulaMove[i][1]]) { // Есть ли такая ячейка
          y = y + formulaMove[i][0];
          x = x + formulaMove[i][1];
          if (!cellsArrYX[y][x].getAttribute('data-type')) {
            cellsArrYX[y][x].setAttribute('data-status', 'next-move');
            moveArr.push(cellsArrYX[y][x]);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < 1; i++) {
      let y = selectedCell.y; // строка
      let x = selectedCell.x; // ячейка в строке
      if (cellsArrYX[y + formulaMove[i][0]]) { // Есть ли такая строка
        if (cellsArrYX[x + formulaMove[i][1]]) { // Есть ли такая ячейка
          y = y + formulaMove[i][0];
          x = x + formulaMove[i][1];
          if (!cellsArrYX[y][x].getAttribute('data-type')) {
            cellsArrYX[y][x].setAttribute('data-status', 'next-move');
            moveArr.push(cellsArrYX[y][x]);
          }
        }
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    // для атаки
    let yA = selectedCell.y; // строка
    let xA = selectedCell.x; // ячейка в строке
    if (cellsArrYX[yA + formulaAttack[i][0]]) { // Есть ли такая строка
      if (cellsArrYX[xA + formulaAttack[i][1]]) { // Есть ли такая ячейка
        yA = yA + formulaAttack[i][0];
        xA = xA + formulaAttack[i][1];
        if ((cellsArrYX[yA][xA].getAttribute('data-color')) && (cellsArrYX[yA][xA].getAttribute('data-color') !== selectedCell.getAttribute('data-color'))) {
          cellsArrYX[yA][xA].setAttribute('data-status', 'next-move');
          moveArr.push(cellsArrYX[yA][xA]);
        }
      }
    }
  }
}

function moveArrBpawn(selectedCell) { // Тёмная пешка
  let formulaMove = [[+1, +0], [+2, +0]];
  let formulaAttack = [[+1, -1], [+1, +1]];
  if (selectedCell.y === 1) {
    for (let i = 0; i < 2; i++) {
      let y = selectedCell.y; // строка
      let x = selectedCell.x; // ячейка в строке
      if (cellsArrYX[y + formulaMove[i][0]]) { // Есть ли такая строка
        if (cellsArrYX[x + formulaMove[i][1]]) { // Есть ли такая ячейка
          y = y + formulaMove[i][0];
          x = x + formulaMove[i][1];
          if (!cellsArrYX[y][x].getAttribute('data-type')) {
            cellsArrYX[y][x].setAttribute('data-status', 'next-move');
            moveArr.push(cellsArrYX[y][x]);
          }
        }
      }
    }
  } else {
    for (let i = 0; i < 1; i++) {
      let y = selectedCell.y; // строка
      let x = selectedCell.x; // ячейка в строке
      if (cellsArrYX[y + formulaMove[i][0]]) { // Есть ли такая строка
        if (cellsArrYX[x + formulaMove[i][1]]) { // Есть ли такая ячейка
          y = y + formulaMove[i][0];
          x = x + formulaMove[i][1];
          if (!cellsArrYX[y][x].getAttribute('data-type')) {
            console.log(y + formulaMove[i][0]);
            console.log('Пешка');
            cellsArrYX[y][x].setAttribute('data-status', 'next-move');
            moveArr.push(cellsArrYX[y][x]);
          }
        }
      }
    }
  }
  for (let i = 0; i < 2; i++) {
    // для атаки
    let yA = selectedCell.y; // строка
    let xA = selectedCell.x; // ячейка в строке
    if (cellsArrYX[yA + formulaAttack[i][0]]) { // Есть ли такая строка
      if (cellsArrYX[xA + formulaAttack[i][1]]) { // Есть ли такая ячейка
        yA = yA + formulaAttack[i][0];
        xA = xA + formulaAttack[i][1];
        if ((cellsArrYX[yA][xA].getAttribute('data-color')) && (cellsArrYX[yA][xA].getAttribute('data-color') !== selectedCell.getAttribute('data-color'))) {
          cellsArrYX[yA][xA].setAttribute('data-status', 'next-move');
          moveArr.push(cellsArrYX[yA][xA]);
        }
      }
    }
  }
}

function moveArrRook(selectedCell) { // Ладья и королева
  let y = selectedCell.y; // строка
  let x = selectedCell.x; // ячейка в строке
  for (let i = 1; i < 8; i++) {
    let checkedCell = cellsArrYX[y - i];
    if (checkedCell) {
      if ((checkedCell[x].getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell[x].getAttribute('data-color')) && ((checkedCell[x].getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
        break;
      } else {
        checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
      }
    }
  }
  // движение вниз
  for (let i = 1; i < 8; i++) {
    let checkedCell = cellsArrYX[y + i];
    if (checkedCell) {
      if ((checkedCell[x].getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell[x].getAttribute('data-color')) && ((checkedCell[x].getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
        break;
      } else {
        checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
      }
    }
  }
  // движение влево
  for (let i = 1; i < 8; i++) {
    let checkedCell = cellsArrYX[y][x - i];
    if (checkedCell) {
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
  // движение вправо
  for (let i = 1; i < 8; i++) {
    let checkedCell = cellsArrYX[y][x + i];
    if (checkedCell) {
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
}

function moveArrKnight(selectedCell) { // Конь
  let formula = [[+2, -1], [+2, +1], [+1, +2], [-1, +2], [-2, +1], [-2, -1], [-1, -2], [+1, -2]];
  for (let i = 0; i < 8; i++) {
    let y = selectedCell.y; // строка
    let x = selectedCell.x; // ячейка в строке
    y = y + formula[i][0];
    x = x + formula[i][1];
    if (cellsArrYX[y]) {
      if (cellsArrYX[x]) {
        if ((cellsArrYX[y][x].getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
          continue;
        } else {
          cellsArrYX[y][x].setAttribute('data-status', 'next-move');
          moveArr.push(cellsArrYX[y][x]);
        }
      }
    }
  }
}

function moveArrBishop(selectedCell) { // Слон и королева
  // Влево вверх
  for (let i = 1; i < 8; i++) {
    let y = selectedCell.y - i;
    let x = selectedCell.x - i;
    if ((cellsArrYX[y]) && (cellsArrYX[y][x])) {
      let checkedCell = cellsArrYX[y][x];
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
  // Вправо вниз
  for (let i = 1; i < 8; i++) {
    let y = selectedCell.y + i;
    let x = selectedCell.x + i;
    if ((cellsArrYX[y]) && (cellsArrYX[y][x])) {
      let checkedCell = cellsArrYX[y][x];
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
  // Влево вниз
  for (let i = 1; i < 8; i++) {
    let y = selectedCell.y + i;
    let x = selectedCell.x - i;
    if ((cellsArrYX[y]) && (cellsArrYX[y][x])) {
      let checkedCell = cellsArrYX[y][x];
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
  // Вправо вверх
  for (let i = 1; i < 8; i++) {
    let y = selectedCell.y - i;
    let x = selectedCell.x + i;
    if ((cellsArrYX[y]) && (cellsArrYX[y][x])) {
      let checkedCell = cellsArrYX[y][x];
      if ((checkedCell.getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
        break;
      } else if ((checkedCell.getAttribute('data-color')) && ((checkedCell.getAttribute('data-color')) !== (selectedCell.getAttribute('data-color')))) {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
}

function moveArrQueen(selectedCell) {

}

function moveArrKing(selectedCell) { // Король
  let formula = [[-1, -1], [-1, 0], [-1, +1], [0, -1], [0, +1], [+1, -1], [+1, 0], [+1, +1]];
  for (let i = 0; i < 8; i++) {
    let y = selectedCell.y; // строка
    let x = selectedCell.x; // ячейка в строке
    y = y + formula[i][0];
    x = x + formula[i][1];
    if (cellsArrYX[y]) {
      if (cellsArrYX[x]) {
        if ((cellsArrYX[y][x].getAttribute('data-color')) === (selectedCell.getAttribute('data-color'))) {
          continue;
        } else {
          cellsArrYX[y][x].setAttribute('data-status', 'next-move');
          moveArr.push(cellsArrYX[y][x]);
        }
      }
    }
  }
}



// function save() {
//   if (!localStorage.getItem('chess')) {
//     let boardCells = board.getElementsByClassName('cell');
//     let figureState = [];
//     for (let i = 0; i < 64; i++) {
//       if (boardCells[i].getAttribute('data-type')) {
//         figureState.push([boardCells[i].getAttribute('data-name'), i]);
//       }
//     }
//     localStorage.setItem('chess', JSON.stringify(figureState));
//   }
// }

// function load() {
//   let figureState = JSON.parse(localStorage.getItem('chess'));

  // for (let i = 0; i < figureState.length; i++) {
  //   for (let j = 0; j < 64; j++) {
  //     if (cellsArr[j].getAttribute('data-name') == figureState[i][0]) {
  //       // cellsArr[j].removeAttribute('data-name');
  //       clearCell(j);
  //     }
  //   }
  // }
  // for (let i = 0; i < figureState.length; i++) {
  //   let cell = cellsArr[figureState[i][1]];
  //   let name = figureState[i][0];
  //   setAttr(cell, name);
  //   // cellsArr[figureState[i][1]].setAttribute('data-name', figureState[i][0]);
  // }
// }
