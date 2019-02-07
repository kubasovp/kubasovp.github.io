var board = document.getElementById('board');
var stat = document.getElementById('stat');
var cells = [[], [], [], [], [], [], [], []]; // Основной массив
var selected = -1; // Выбранная клетка/фигура
var moveArr = []; // Расчитанные ходы (расчитываются при выборе фигуры)
cellsUnderAttack = []; // Расчитанные ходы всех фигур - для обнаружения шаха (расчитываются после каждого хода)
var stepNum = 1; // номер хода
var kingUnderAttack = 0;
var сheckmate = 0;
var bRookL = { title: 'Тёмная ладья', name: 'bRookL', firstMove: 0 };
var bRookR = { title: 'Тёмная ладья', name: 'bRookR', firstMove: 0 };
var bKnight = { title: 'Тёмный конь', name: 'bKnight' };
var bBishop = { title: 'Тёмный слон', name: 'bBishop' };
var bQueen = { title: 'Тёмная королева', name: 'bQueen' };
var bKing = { title: 'Тёмный король', name: 'bKing', firstMove: 0 };
var bPawn = { title: 'Тёмная пешка', name: 'bPawn' };

var wRookL = { title: 'Светлая ладья', name: 'wRookL', firstMove: 0 };
var wRookR = { title: 'Светлая ладья', name: 'wRookR', firstMove: 0 };
var wKnight = { title: 'Светлый конь', name: 'wKnight' };
var wBishop = { title: 'Светлый слон', name: 'wBishop' };
var wQueen = { title: 'Светлая королева', name: 'wQueen' };
var wKing = { title: 'Светлый король', name: 'wKing', firstMove: 0 };
var wPawn = { title: 'Светлая пешка', name: 'wPawn' };

// ________________________________________________________________________________________________

function createCells() {
  for (var i = 0; i < 64; i++) {
    if (window.CP.shouldStopExecution(0)) break;
    var cell = document.createElement('div');
    var cellColor = (Math.floor(i / 8) + i % 8) % 2 == 0 ? "white" : "black";

    cell.classList.add('cell');
    cell.classList.add(cellColor);
    cell.setAttribute('tabindex', '0');
    cell.y = Math.floor(i / 8);
    cell.x = i % 8;
    cell.setAttribute('title', i);

    cell.onclick = function (event) {
      var target = event.currentTarget;
      isClick(target);
    };

    cell.onkeydown = function (event) {// Управление с клавиатуры
      var target = event.currentTarget;
      if (event.keyCode == 32) {// клавиша "пробел"
        isClick(target);
      }
      if (event.keyCode == 37 && cells[target.y][target.x - 1]) {// влево
        cells[target.y][target.x - 1].focus();
      }
      if (event.keyCode == 39 && cells[target.y][target.x + 1]) {// вправо
        cells[target.y][target.x + 1].focus();
      }
      if (event.keyCode == 38 && cells[target.y - 1]) {// вверх
        cells[target.y - 1][target.x].focus();
      }
      if (event.keyCode == 40 && cells[target.y + 1]) {// вниз
        cells[target.y + 1][target.x].focus();
      }
    };

    if (i === 0) cell.figure = bRookL;
    if (i === 7) cell.figure = bRookR;
    if (i === 1 || i === 6) cell.figure = bKnight;
    if (i === 2 || i === 5) cell.figure = bBishop;
    if (i === 3) cell.figure = bQueen;
    if (i === 4) cell.figure = bKing;
    if (i > 7 && i < 16) cell.figure = bPawn; // Тёмные пешки
    if (i > 47 && i < 56) cell.figure = wPawn; // Светлые пешки
    if (i === 56) cell.figure = wRookL;
    if (i === 63) cell.figure = wRookR;
    if (i === 57 || i === 62) cell.figure = wKnight;
    if (i === 58 || i === 61) cell.figure = wBishop;
    if (i === 59) cell.figure = wQueen;
    if (i === 60) cell.figure = wKing;
    if (i < 16) {
      cell.figure.color = 'black';
      magic(cell);
    }
    if (i > 47) {
      cell.figure.color = 'white';
      magic(cell);
    }

    cells[Math.floor(i / 8)].push(cell);

    board.appendChild(cell);
  } window.CP.exitedLoop(0);
}

var go = start();
function start() {
  board.innerHTML = '';
  cellsArrYX = [[], [], [], [], [], [], [], []];
  moveArr = [];
  selected = -1;
  stepNum = 1;
  kingUnderAttack = 0;
  сheckmate = 0;
  createCells();
  cellsUnderAttack = [];
  stat.innerHTML = '';
  // board.classList.remove('rotate');
}

function magic(cell) {
  cell.setAttribute('data-type', 'figure');
  cell.setAttribute('data-name', cell.figure.name);
}

// ________________________________________________________________________________________________

function isClick(target) {
  console.log(kingUnderAttack); // клетка с королем
  // если шах
  //   делаем ход
  //   запускаем проверку на шах
  //   если шах - мат
  // if ((kingUnderAttack) && (stepNum % 2 === 0)) {
  //   getCellsUnderAttack('white');
  //   if (kingUnderAttack) console.log('Белые выиграли');
  // } else if ((kingUnderAttack) && (stepNum % 2 === 0)) {
  //   getCellsUnderAttack('black');
  // }
  // Если еще нет выбраной фигуры
  if (selected === -1 && сheckmate === 0) {
    // Если клик был по фигуре - проверяем очередность, выбираем её и просчитываем возможные ходы
    if (target.figure) {
      if (stepNum % 2 !== 0 && target.figure.color === 'black') return console.log('Ход светлых'); // нечетный ход (светлые)
      if (stepNum % 2 === 0 && target.figure.color === 'white') return console.log('Ход тёмных'); // четный ход (тёмные)
      console.log('Клик по фигуре ' + target.figure.title);
      selected = target;
      getMoveArr(selected);
      selected.setAttribute('data-status', 'active');
    }
    // Если фигура уже выбрана
  } else {
    // Если клик по этой же фигуре - снимаем выбор, снимаем выделение и очищаем расчитанные ходы
    if (selected === target) {
      selected.removeAttribute('data-status', 'active');
      clearMoveArr();
      selected = -1;
      // Если клик по фигуре такого же цвета - перевыбираем фигуру и пересчитываем возможные ходы:
    } else if (target.figure && selected.figure.color === target.figure.color) {
      selected.removeAttribute('data-status', 'active');
      clearMoveArr(); // Очищаем
      selected = target;
      getMoveArr(selected);
      selected.setAttribute('data-status', 'active');
      // Если можно сходить - пишем лог, переносим фигуры и обнуляем выбранную фигуру:
      // если король и есть некст и есть вайт атак - ретурн
    } else if (selected.figure.name === 'bKing' && target.getAttribute('data-status') === 'next-move' && target.getAttribute('data-attack') === 'under-white-attack' || selected.figure.name === 'wKing' && target.getAttribute('data-status') === 'next-move' && target.getAttribute('data-attack') === 'under-black-attack') {
      return;
    } else if (!kingUnderAttack && target.getAttribute('data-status') === 'next-move') {
      stepNum++;
      writeStat(selected, target);
      move(selected, target);
      getCellsUnderAttack(target.figure.color);
      selected = -1;
      // board.classList.toggle('rotate');
    } else if (kingUnderAttack && target.getAttribute('data-status') === 'next-move') {
      var kingUnderAttackColor = kingUnderAttack.figure.color;
      stepNum++;
      writeStat(selected, target);
      move(selected, target);

      switch (kingUnderAttackColor) {
        case 'black':
          getCellsUnderAttack('white');
          break;
        case 'white':
          getCellsUnderAttack('black');
          break;
      }

      selected = -1;
      if (kingUnderAttack) {
        alert('Мат: ' + kingUnderAttack.figure.color);
        сheckmate = 1;
      }
    }
  }
}

function getCellsUnderAttack(color) {
  var _ref;
  clearCellsUnderAttack();
  kingUnderAttack = 0;
  cellsOne = (_ref = []).concat.apply(_ref, cells);
  for (var i = 0; i < 64; i++) {
    if (window.CP.shouldStopExecution(1)) break;
    if (cellsOne[i].figure && cellsOne[i].figure.color === color) {
      getMoveArr(cellsOne[i], 1);
      moveArr.forEach(function (item, i, arr) {
        cellsUnderAttack.push(moveArr[i]);
      });
      clearMoveArr();
      cellsUnderAttack.forEach(function (item, i, arr) {
        if (color === 'white') {
          cellsUnderAttack[i].setAttribute('data-attack', 'under-white-attack');
        } else {
          cellsUnderAttack[i].setAttribute('data-attack', 'under-black-attack');
        }

        // если фигура, если ее цвет не равен color
        if (cellsUnderAttack[i].figure && cellsUnderAttack[i].figure.color !== color && (cellsUnderAttack[i].figure.name == 'bKing' || cellsUnderAttack[i].figure.name == 'wKing')) {
          cellsUnderAttack[i].setAttribute('data-attack', 'king-under-attack');
          kingUnderAttack = cellsUnderAttack[i];
        }
      });
      // clearMoveArr();
      // console.log(moveArr);
    }
  }
  // cellsUnderAttack.push(cell);
  window.CP.exitedLoop(1);
}

function getMoveArr(selected, attack) {
  switch (selected.figure.name) {
    case 'wPawn':
    case 'bPawn':
      moveArrPawn(selected, attack);
      break;
    case 'bRookL':
    case 'bRookR':
    case 'wRookL':
    case 'wRookR':
      moveArrRook(selected);
      break;
    case 'bKnight':
    case 'wKnight':
      moveArrKnight(selected);
      break;
    case 'bBishop':
    case 'wBishop':
      moveArrBishop(selected);
      break;
    case 'bQueen':
    case 'wQueen':
      moveArrRook(selected);
      moveArrBishop(selected);
      break;
    case 'bKing':
    case 'wKing':
      moveArrKing(selected);
      break;
    default:
      break;
  }

  if (!attack) {
    moveArr.forEach(function (item, i, arr) {
      moveArr[i].setAttribute('data-status', 'next-move');
    });
  }
}

function move(selected, target) {

  target.figure = selected.figure;
  selected.figure = null;
  magic(target);

  // Пешка становится королевой
  if (target.figure.name === 'wPawn' && target.y === 0) {
    alert('Ферзь');
    target.figure = wQueen;
    magic(target);
  }
  if (target.figure.name === 'bPawn' && target.y === 7) {
    alert('Ферзь');
    target.figure = bQueen;
    magic(target);
  }
  // Король сделал первый ход
  if (target.figure.name === 'wKing') {
    target.figure.firstMove = 1;
  }
  if (target.figure.name === 'bKing') {
    target.figure.firstMove = 1;
  }

  // Ладья сделала первый ход
  if (target.figure.name === 'bRookL' || target.figure.name === 'bRookR') {
    target.figure.firstMove = 1;
  }
  if (target.figure.name === 'wRookL' || target.figure.name === 'wRookR') {
    target.figure.firstMove = 1;
  }

  // Рокировака справа
  if (target.getAttribute('data-roque') === 'right') {
    var y = target.y;
    var x = target.x; // 6
    // target.figure = selected.figure;
    cells[y][x - 1].figure = cells[y][x + 1].figure;
    magic(cells[y][x - 1]);
    cells[y][x + 1].figure = null;
    clearCell(cells[y][x + 1]);
  }
  // Рокировака слева
  if (target.getAttribute('data-roque') === 'left') {
    var _y = target.y;
    var _x = target.x;
    cells[_y][_x + 1].figure = cells[_y][_x - 2].figure;
    magic(cells[_y][_x + 1]);
    cells[_y][_x - 2].figure = null;
    clearCell(cells[_y][_x - 2]);
  }
  clearCell(selected); // Убираем временные классы и дата-атрибуты
}

function moveArrPawn(selected, attack) {// Пешки
  var y = selected.y; // строка
  var x = selected.x; // ячейка в строке

  if (selected.figure.color === 'white') {
    // ход
    if (cells[y - 1][x] && !cells[y - 1][x].figure && !attack) {
      // cells[y - 1][x].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y - 1][x]);
      if (selected.y === 6 && !cells[y - 2][x].figure) {
        // cells[y - 2][x].setAttribute('data-status', 'next-move');
        moveArr.push(cells[y - 2][x]);
      }
    }
    // отака
    if (cells[y - 1][x - 1] && cells[y - 1][x - 1].figure && cells[y - 1][x - 1].figure.color === 'black' || cells[y - 1][x - 1] && attack) {
      // cells[y - 1][x - 1].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y - 1][x - 1]);
    }
    if (cells[y - 1][x + 1] && cells[y - 1][x + 1].figure && cells[y - 1][x + 1].figure.color === 'black' || cells[y - 1][x + 1] && attack) {
      // cells[y - 1][x + 1].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y - 1][x + 1]);
    }
  }

  if (selected.figure.color === 'black') {
    // ход
    if (cells[y + 1][x] && !cells[y + 1][x].figure && !attack) {
      // cells[y + 1][x].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y + 1][x]);
      if (selected.y === 1 && !cells[y + 2][x].figure) {
        // cells[y + 2][x].setAttribute('data-status', 'next-move');
        moveArr.push(cells[y + 2][x]);
      }
    }
    // отака
    if (cells[y + 1][x - 1] && cells[y + 1][x - 1].figure && cells[y + 1][x - 1].figure.color === 'white' || cells[y + 1][x - 1] && attack) {
      // cells[y + 1][x - 1].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y + 1][x - 1]);
    }
    if (cells[y + 1][x + 1] && cells[y + 1][x + 1].figure && cells[y + 1][x + 1].figure.color === 'white' || cells[y + 1][x + 1] && attack) {
      // cells[y + 1][x + 1].setAttribute('data-status', 'next-move');
      moveArr.push(cells[y + 1][x + 1]);
    }
  }
}

function moveArrRook(selected) {// Ладья и королева
  var y = selected.y; // строка
  var x = selected.x; // ячейка в строке
  for (var i = 1; i < 8; i++) {
    if (window.CP.shouldStopExecution(2)) break;
    var checkedCell = cells[y - i];
    if (checkedCell) {
      if (checkedCell[x].figure && checkedCell[x].figure.color === selected.figure.color) {
        break;
      } else if (checkedCell[x].figure && checkedCell[x].figure.color !== selected.figure.color) {
        // checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
        break;
      } else {
        // checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell[x]);
      }
    }
  }
  // движение вниз
  window.CP.exitedLoop(2); for (var _i = 1; _i < 8; _i++) {
    if (window.CP.shouldStopExecution(3)) break;
    var _checkedCell = cells[y + _i];
    if (_checkedCell) {
      if (_checkedCell[x].figure && _checkedCell[x].figure.color === selected.figure.color) {
        break;
      } else if (_checkedCell[x].figure && _checkedCell[x].figure.color !== selected.figure.color) {
        // checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell[x]);
        break;
      } else {
        // checkedCell[x].setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell[x]);
      }
    }
  }
  // движение влево
  window.CP.exitedLoop(3); for (var _i2 = 1; _i2 < 8; _i2++) {
    if (window.CP.shouldStopExecution(4)) break;
    var _checkedCell2 = cells[y][x - _i2];
    if (_checkedCell2) {
      if (_checkedCell2.figure && _checkedCell2.figure.color === selected.figure.color) {
        break;
      } else if (_checkedCell2.figure && _checkedCell2.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell2);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell2);
      }
    }
  }
  // движение вправо
  window.CP.exitedLoop(4); for (var _i3 = 1; _i3 < 8; _i3++) {
    if (window.CP.shouldStopExecution(5)) break;
    var _checkedCell3 = cells[y][x + _i3];
    if (_checkedCell3) {
      if (_checkedCell3.figure && _checkedCell3.figure.color === selected.figure.color) {
        break;
      } else if (_checkedCell3.figure && _checkedCell3.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell3);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell3);
      }
    }
  } window.CP.exitedLoop(5);
}

function moveArrKnight(selected) {// Конь
  var formula = [[+2, -1], [+2, +1], [+1, +2], [-1, +2], [-2, +1], [-2, -1], [-1, -2], [+1, -2]];
  for (var i = 0; i < 8; i++) {
    if (window.CP.shouldStopExecution(6)) break;
    var y = selected.y; // строка
    var x = selected.x; // ячейка в строке
    y = y + formula[i][0];
    x = x + formula[i][1];
    if (cells[y]) {
      if (cells[x]) {
        if (cells[y][x].figure && cells[y][x].figure.color === selected.figure.color) {
          continue;
        } else {
          // cells[y][x].setAttribute('data-status', 'next-move');
          moveArr.push(cells[y][x]);
        }
      }
    }
  } window.CP.exitedLoop(6);
}

function moveArrBishop(selected) {// Слон и королева
  // Влево вверх
  for (var i = 1; i < 8; i++) {
    if (window.CP.shouldStopExecution(7)) break;
    var y = selected.y - i;
    var x = selected.x - i;
    if (cells[y] && cells[y][x]) {
      var checkedCell = cells[y][x];
      if (cells[y][x].figure && checkedCell.figure.color === selected.figure.color) {
        break;
      } else if (cells[y][x].figure && checkedCell.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(checkedCell);
      }
    }
  }
  // Вправо вниз
  window.CP.exitedLoop(7); for (var _i4 = 1; _i4 < 8; _i4++) {
    if (window.CP.shouldStopExecution(8)) break;
    var _y2 = selected.y + _i4;
    var _x2 = selected.x + _i4;
    if (cells[_y2] && cells[_y2][_x2]) {
      var _checkedCell4 = cells[_y2][_x2];
      if (cells[_y2][_x2].figure && _checkedCell4.figure.color === selected.figure.color) {
        break;
      } else if (cells[_y2][_x2].figure && _checkedCell4.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell4);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell4);
      }
    }
  }
  // Влево вниз
  window.CP.exitedLoop(8); for (var _i5 = 1; _i5 < 8; _i5++) {
    if (window.CP.shouldStopExecution(9)) break;
    var _y3 = selected.y + _i5;
    var _x3 = selected.x - _i5;
    if (cells[_y3] && cells[_y3][_x3]) {
      var _checkedCell5 = cells[_y3][_x3];
      if (cells[_y3][_x3].figure && _checkedCell5.figure.color === selected.figure.color) {
        break;
      } else if (cells[_y3][_x3].figure && _checkedCell5.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell5);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell5);
      }
    }
  }
  // Вправо вверх
  window.CP.exitedLoop(9); for (var _i6 = 1; _i6 < 8; _i6++) {
    if (window.CP.shouldStopExecution(10)) break;
    var _y4 = selected.y - _i6;
    var _x4 = selected.x + _i6;
    if (cells[_y4] && cells[_y4][_x4]) {
      var _checkedCell6 = cells[_y4][_x4];
      if (cells[_y4][_x4].figure && _checkedCell6.figure.color === selected.figure.color) {
        break;
      } else if (cells[_y4][_x4].figure && _checkedCell6.figure.color !== selected.figure.color) {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell6);
        break;
      } else {
        // checkedCell.setAttribute('data-status', 'next-move');
        moveArr.push(_checkedCell6);
      }
    }
  } window.CP.exitedLoop(10);
}

function moveArrKing(selected) {// Король
  // console.log(selected.figure.firstMove === 0);
  var formula = [[-1, -1], [-1, 0], [-1, +1], [0, -1], [0, +1], [+1, -1], [+1, 0], [+1, +1]];
  for (var i = 0; i < 8; i++) {
    if (window.CP.shouldStopExecution(11)) break;
    var y = selected.y; // строка
    var x = selected.x; // ячейка в строке
    y = y + formula[i][0];
    x = x + formula[i][1];
    if (cells[y]) {
      if (cells[x]) {
        if (cells[y][x].figure && cells[y][x].figure.color === selected.figure.color) {
          continue;
        } else {
          // cells[y][x].setAttribute('data-status', 'next-move');
          moveArr.push(cells[y][x]);
        }
      }
    }
  }
  // Рокировка
  window.CP.exitedLoop(11); if (selected.figure.firstMove === 0) {
    console.log(selected.figure.firstMove === 0);
    console.log(selected.figure.firstMove === 0);
    var _y5 = selected.y;
    var _x5 = selected.x;
    if (!cells[_y5][_x5 + 1].figure && !cells[_y5][_x5 + 2].figure) {// Проверка ладьи:
      if (selected.figure.color === 'white' && wRookR.firstMove === 0 || selected.figure.color === 'black' && bRookR.firstMove === 0) {
        console.log(selected.figure.firstMove === 0);
        // cells[y][x + 2].setAttribute('data-status', 'next-move');
        cells[_y5][_x5 + 2].setAttribute('data-roque', 'right');
        moveArr.push(cells[_y5][_x5 + 2]);
      }
    }
    if (!cells[_y5][_x5 - 1].figure && !cells[_y5][_x5 - 2].figure && !cells[_y5][_x5 - 3].figure) {// Проверка ладьи:
      if (selected.figure.color === 'white' && wRookL.firstMove === 0 || selected.figure.color === 'black' && bRookL.firstMove === 0) {
        // cells[y][x - 2].setAttribute('data-status', 'next-move');
        cells[_y5][_x5 - 2].setAttribute('data-roque', 'left');
        moveArr.push(cells[_y5][_x5 - 2]);
      }
    }
  }
}

// ________________________________________________________________________________________________

function clearCell(cell) {
  cell.removeAttribute('data-status');
  cell.removeAttribute('data-type');
  cell.removeAttribute('data-name');
  clearMoveArr();
}

function clearMoveArr() {
  for (var i = 0; i < moveArr.length; i++) {
    if (window.CP.shouldStopExecution(12)) break;
    moveArr[i].removeAttribute('data-status');
    moveArr[i].removeAttribute('data-roque');
  } window.CP.exitedLoop(12);
  moveArr = [];
}
function clearCellsUnderAttack() {
  for (var i = 0; i < cellsUnderAttack.length; i++) {
    if (window.CP.shouldStopExecution(13)) break;
    cellsUnderAttack[i].removeAttribute('data-attack');
  } window.CP.exitedLoop(13);
  cellsUnderAttack = [];
}
// ________________________________________________________________________________________________

function writeStat(selected, target) {
  var newP = document.createElement('p');
  if (!target.figure) {
    newP.innerHTML += '\u0425\u043E\u0434 ' + stepNum + '. ' + selected.figure.title + ' \u0441 ' + selected.y + ':' + selected.x + ' \u043D\u0430 ' + target.y + ':' + target.x + '.';
  } else {
    newP.innerHTML += '\u0425\u043E\u0434 ' + stepNum + '. ' + selected.figure.title + ' c ' + selected.y + ':' + selected.x + ' \u0437\u043E\u0445\u0430\u0432\u0430\u043B ' + target.figure.title + ' \u043D\u0430 ' + target.y + ':' + target.x + '.';
  }
  stat.insertBefore(newP, stat.firstChild);
}
// 605


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