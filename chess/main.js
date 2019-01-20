var board = document.getElementById('board');
var cell;
var cellsArr = board.getElementsByTagName("div");
var selectedCell = -1;
var nextMoveArr = [];
var stat = document.getElementById('stat');

for (var i = 0; i < 64; i++) {
  cell = document.createElement('div');
  var cellClass = (((Math.floor(i / 8) + i % 8) % 2) == 0) ? "white" : "black";
  cell.classList.add('cell');
  cell.classList.add(cellClass);
  cell.setAttribute('tabindex', '0');
  board.appendChild(cell);
};

var figures = [
  { title: 'Тёмная ладья', name: 'brook' },
  { title: 'Тёмный конь', name: 'bknight' },
  { title: 'Тёмный слон', name: 'bbishop' },
  { title: 'Тёмный ферзь', name: 'bqueen' },
  { title: 'Тёмный король', name: 'bking' },
  { title: 'Тёмная пешка', name: 'bpawn' },
  { title: 'Светлая ладья', name: 'wrook' },
  { title: 'Белый конь', name: 'wknight' },
  { title: 'Светлый слон', name: 'wbishop' },
  { title: 'Светлый ферзь', name: 'wqueen' },
  { title: 'Светлый король', name: 'wking' },
  { title: 'Светлая пешка', name: 'wpawn' }
];

function setFiguresAttr(i, figureNumber) {
  cellsArr[i].setAttribute('data-type', 'figure');
  cellsArr[i].setAttribute('data-name', figures[figureNumber].name);
  cellsArr[i].setAttribute('data-title', figures[figureNumber].title);
  if (i < 16) {
    cellsArr[i].setAttribute('data-color', 'black');
  } else {
    cellsArr[i].setAttribute('data-color', 'white');
  }
}

function placementFigures() {
  for (var i = 0; i < 64; i++) {
    cellsArr[i].setAttribute('title', i);
    if ((i === 0) || (i === 7)) setFiguresAttr(i, 0);
    if ((i === 1) || (i === 6)) setFiguresAttr(i, 1);
    if ((i === 2) || (i === 5)) setFiguresAttr(i, 2);
    if (i === 3) setFiguresAttr(i, 3);
    if (i === 4) setFiguresAttr(i, 4);
    if ((i === 56) || (i === 63)) setFiguresAttr(i, 6);
    if ((i === 57) || (i === 62)) setFiguresAttr(i, 7);
    if ((i === 58) || (i === 61)) setFiguresAttr(i, 8);
    if (i === 59) setFiguresAttr(i, 9);
    if (i === 60) setFiguresAttr(i, 10);
    if ((i > 7) && (i < 16)) {
      setFiguresAttr(i, 5);
    } else if ((i > 47) && (i < 56)) {
      setFiguresAttr(i, 11);
    }
    // cellsArr[52].focus();
    cellsArr[i].onclick = function () { // Этот блок я нагуглил и не понимаю, что тут происходит. Комментарии в нем не мои
      var currentCell = i; // нужно сохранить состояние переменой, которое будет использоваться в функции-замыкании
      return function () {
        isClick(currentCell); // выводим переменную,которая была в момент создания функции
      };
    }(); // сразу вызываем, что бы обработчику присвоилась именно функция-замыкание
    cellsArr[i].onkeydown = function () { // Управление с клавиатуры ///////////////////////////////////
      var currentCell = i;
      return function (event) {
        if (event.keyCode == 32) { // клавиша "пробел"
          isClick(currentCell)
        }
        if ((event.keyCode == 37) && (currentCell - 1 >= 0)) { // влево
          cellsArr[currentCell - 1].focus();
        }
        if ((event.keyCode == 39) && (currentCell + 1 <= 63)) { // вправо
          cellsArr[currentCell + 1].focus();
        }
        if ((event.keyCode == 38) && (currentCell - 8 >= 0)) { // вверх
          cellsArr[currentCell - 8].focus();
        }
        if ((event.keyCode == 40) && (currentCell + 8 <= 63)) { // вниз
          cellsArr[currentCell + 8].focus();
        }
      };
    }();
  }
}

var start = begin();

function begin() {
  for (var i = 0; i < 64; i++) {
    clearCell(i);
  }
  selectedCell = -1;
  stepNum = 0;
  placementFigures();
  stat.innerHTML = '';
  nextMoveArr = [];
}

function clearCell(selectedCell) {
  cellsArr[selectedCell].removeAttribute('data-status');
  cellsArr[selectedCell].removeAttribute('data-type');
  cellsArr[selectedCell].removeAttribute('data-name');
  cellsArr[selectedCell].removeAttribute('data-title');
  cellsArr[selectedCell].removeAttribute('data-color');
}

function writeStat(selectedFigure, currentCell) {
  var newP = document.createElement('p');
  if (cellsArr[currentCell].getAttribute('data-type') !== 'figure') {
    newP.innerHTML += `Ход ${stepNum}. ${cellsArr[selectedFigure].getAttribute('data-title')} с ${selectedFigure} на ${currentCell}.`;
  } else {
    newP.innerHTML += `Ход ${stepNum}. ${cellsArr[selectedFigure].getAttribute('data-title')} c ${selectedFigure} зохавал ${cellsArr[currentCell].getAttribute('data-title')} на ${currentCell}.`;
  }
  stat.insertBefore(newP, stat.firstChild);
}

function isClick(currentCell) {
  if (selectedCell === -1) { // Если фигура еще не выбрана
    if ((stepNum % 2) && (cellsArr[currentCell].getAttribute('data-color') === 'white')) return; // нечетный ход
    if ((!(stepNum % 2)) && (cellsArr[currentCell].getAttribute('data-color') === 'black')) return;
    if (cellsArr[currentCell].getAttribute('data-type') === 'figure') { // Если клик по клетке с фигурой
      selectedCell = currentCell; // Биндим эту фигуру
      workWithNextMoveArr(selectedCell); // получаем массив возможных ходов для этой фигуры
      cellsArr[selectedCell].setAttribute('data-status', 'active');
    }
  } else { // То есть, если фигура уже выбрана
    if (cellsArr[currentCell].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) { // Если цвет одинаковый
      if (selectedCell === currentCell) { // Если был клик по уже выбранной фигуре - снимаем выбор
        cellsArr[currentCell].removeAttribute('data-status');
        selectedCell = -1;
        workWithNextMoveArr(selectedCell);  // Очишаем массив возможных ходов
      } else { // или, если был клик по другой фигуре аналогичного цвета - меняем выбранную фигуру на эту
        cellsArr[selectedCell].removeAttribute('data-status');
        selectedCell = currentCell;
        workWithNextMoveArr(selectedCell); // Очишаем массив возможных ходов
        cellsArr[selectedCell].setAttribute('data-status', 'active');
        workWithNextMoveArr(selectedCell); // Заново получаем массив возможных ходов
      }
    } else if (moveAllowed(selectedCell, currentCell)) { // Перемещение фигуры
      ++stepNum;
      writeStat(selectedCell, currentCell); // Пишем лог
      cellsArr[currentCell].setAttribute('data-type', cellsArr[selectedCell].getAttribute('data-type'));
      cellsArr[currentCell].setAttribute('data-name', cellsArr[selectedCell].getAttribute('data-name'));
      cellsArr[currentCell].setAttribute('data-title', cellsArr[selectedCell].getAttribute('data-title'));
      cellsArr[currentCell].setAttribute('data-color', cellsArr[selectedCell].getAttribute('data-color'));
      clearCell(selectedCell); // Убираем временные классы и дата-атрибуты
      selectedCell = -1; // Обнуляем выбранную фигуру
    }
  }
}

function moveAllowed(selectedCell, currentCell) {
  if (workWithNextMoveArr(selectedCell)) {
  }
  return true;
}

function workWithNextMoveArr(selectedCell) {
  if (nextMoveArr.length === 0) { // Если массив возможных ходов пустой
    switch (cellsArr[selectedCell].getAttribute('data-name')) {
      case 'wpawn':
        nextMoveWpawn(selectedCell);
        break;
      case 'bpawn':
        nextMoveBpawn(selectedCell);
        break;
      case 'brook':
      case 'wrook':
        nextMoveRook(selectedCell);
        break;
      case 'bknight':
      case 'wknight':
        nextMovKnight(selectedCell);
        break;
      case 'bbishop':
      case 'wbishop':
        nextMoveBishop(selectedCell);
        break;
      case 'bqueen':
      case 'wqueen':
        nextMoveQueen(selectedCell);
        break;
      case 'bking':
      case 'wking':
        nextMoveKing(selectedCell);
        break;
      default:
        break;
    } 
  } else { // Если массив возможных ходов уже был рассчитан, очищаем его и убираем временные атрибуты с клеток
    var nextMoveArrLength = nextMoveArr.length;
    while (nextMoveArrLength--) {
      var nextMoveNum = nextMoveArr[nextMoveArrLength];
      cellsArr[nextMoveNum].removeAttribute('data-status');
    }
    nextMoveArr = [];
  }
}


function nextMoveWpawn(selectedCell) {
  var i = selectedCell;
  while (i--) {
    if ((selectedCell > 47) && (selectedCell < 56)) {
      if ((i === selectedCell - 8) || (i === selectedCell - 16)) {
        nextMoveArr.push(i);
        if ((i > -1) && (i < 64)) {
          if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
        }
        // if (((i === selectedCell - 15) && (cellsArr[i].getAttribute('data-color') !== cellsArr[selectedCell].getAttribute('data-color'))) ||
        //    ((i === selectedCell - 17) && (cellsArr[i].getAttribute('data-color') !== cellsArr[selectedCell].getAttribute('data-color')))) {
        //   nextMoveArr.push(i);
        //   cellsArr[i].setAttribute('data-status', 'next-move');
        // }
        cellsArr[i].setAttribute('data-status', 'next-move');
      }
    } else if (i === selectedCell - 8) {
      nextMoveArr.push(i);
      if ((i > -1) && (i < 64)) {
        if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
      }
      // if (((i === selectedCell - 9) && (cellsArr[i].getAttribute('data-color') !== cellsArr[selectedCell].getAttribute('data-color'))) ||
      //    ((i === selectedCell - 7) && (cellsArr[i].getAttribute('data-color') !== cellsArr[selectedCell].getAttribute('data-color')))) {
      //   nextMoveArr.push(i);
      //   cellsArr[i].setAttribute('data-status', 'next-move');
      // }
      cellsArr[i].setAttribute('data-status', 'next-move');
    }
  }
}
function nextMoveBpawn(selectedCell) {
  var i = 64;
  while (i--) {
    if ((selectedCell > 7) && (selectedCell < 16)) {
      if ((i === selectedCell + 8) || (i === selectedCell + 16)) {
        nextMoveArr.push(i);
        cellsArr[i].setAttribute('data-status', 'next-move');
      }
    } else {
      if ((i === selectedCell + 8)) {
        nextMoveArr.push(i);
        if ((i > -1) && (i < 64)) {
          if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
        }
        cellsArr[i].setAttribute('data-status', 'next-move');
      }
    }
  }
}
function nextMoveRook(selectedCell) {
  var i = selectedCell;
  while (i > 0) {
    nextMoveArr.push(i);
    cellsArr[i].setAttribute('data-status', 'next-move');
    i = i - 8;
    if ((i > -1) && (i < 64)) {
      if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
    }
  }
  var i = selectedCell;
  while (i < 64) {
    nextMoveArr.push(i);
    cellsArr[i].setAttribute('data-status', 'next-move');
    i = i + 8;
    if ((i > -1) && (i < 64)) {
      if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
    }
  }
  var row = Math.floor(selectedCell / 8);
  var i = selectedCell;
  while (Math.floor(i / 8) === row) {
    nextMoveArr.push(i);
    cellsArr[i].setAttribute('data-status', 'next-move');
    i = i + 1;
    if ((i > -1) && (i < 64)) {
      if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
    }
  }
  var i = selectedCell;
  while (Math.floor(i / 8) === row) {
    nextMoveArr.push(i);
    cellsArr[i].setAttribute('data-status', 'next-move');
    i = i - 1;
    if ((i > -1) && (i < 64)) {
      if (cellsArr[i].getAttribute('data-color') === cellsArr[selectedCell].getAttribute('data-color')) break;
    }
  }
}
function nextMovKnight(selectedCell) {
  var i = 64;
  while (i--) {
    nextMoveArr.push('1');
  }
}
function nextMoveBishop(selectedCell) {
  var i = 64;
  while (i--) {
    nextMoveArr.push('1');
  }
}
function nextMoveQueen(selectedCell) {
  var i = 64;
  while (i--) {
    nextMoveArr.push('1');
  }
}
function nextMoveKing(selectedCell) {
  var i = 64;
  while (i--) {
    nextMoveArr.push('1');
  }
}




































// Если сделан клик по клетке:
// если 
//   (выбранной фигуры нет) И (в кликнутой клетке есть фигура)
//   делаем кликнутую клетку выбранной фигурой
//   добавляем этой клетке класс .active
// иначе если
//   (выбранная фигура есть) И (кликнутая клетка не равна выбранной фигуре)
//     если (цвет фигуры кликнутой клетки равен цвету фигуры выбранной клетки)
//       убираем у выбранной класс .active
//       обнуляем выбарнную фигуру
//       останавливаем выполнение (return)
//    увеличиваем счетчик хода
//    вызываем функцию записи лога
//    записываем в кликнутую клетку дата-атрибуты выбранной клетки (фигура, цвет, иконка)
//    записываем в кликнутую клетку innerHTML выбранной клетки
//    добавляем кликнутой клетке класс .figure
//    Вписываем на место выбранной фигуры номер этой клетки
//    Убираем временные классы и дата-атрибуты на выбранной фигуре
//    Обнуляем выбранную фигуру

// Если ход нечетный - ходят белые, иначе - черные
// Пешка:
// Если белая, то -8 из номера текущей клетки, если на -7 или на -9 есть черная фигура - можно делать ход на ее место (взять)
// Если черная, то +8 к номеру текущей клетки, если на +7 или на +9 есть белая фигура - можно делать ход на ее место (взять)
// Если пешка еще не делала ход - она может сходить на -16 (белая) или +16 (черная)
