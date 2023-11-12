const minesweeperGame = () => {
  const board = document.querySelector("#minesweeper");
  const submitButton = document.querySelector("#submit-btn");
  let boardInfo = [];
  let numberMines;

  const readInput = () => {
    const length = parseInt(document.querySelector("#length").value, 10);
    const width = parseInt(document.querySelector("#width").value, 10);
    const numberMines = parseInt(
      document.querySelector("#number-mines").value,
      10
    );
    return [length, width, numberMines];
  };

  const isValid = (parsedInput, condition, className) => {
    const isInvalid = isNaN(parsedInput) || parsedInput <= 0 || condition;
    if (isInvalid) {
      document.querySelector(className).classList.add("is-invalid");
      return false;
    } else {
      document.querySelector(className).classList.remove("is-invalid");
      return true;
    }
  };

  const isInputValid = () => {
    [length, width, numberMines] = readInput();
    const isLengthWithinBounds = isValid(length, length > 75, "#length");
    const isWidthWithinBounds = isValid(width, width > 100, "#width");
    const isNumberMinesValid = isValid(numberMines, numberMines >= (length * width), "#number-mines");
    return isLengthWithinBounds && isWidthWithinBounds && isNumberMinesValid;
  };

  const resetMessage = () => {
    document.querySelector("#message").textContent = "Good luck! Have fun! 😊";
  };

  const resetBoard = () => {
    board.textContent = "";
  };

  const createRowHTML = (length) => {
    let row = "";
    for (let i = 0; i < length; i++) {
      row += "<td class='unopened'></td>";
    }
    return row;
  };

  const createBoard = (length, width) => {
    let boardHTML = "";
    for (let i = 0; i < width; i++) {
      boardHTML += `<tr>${createRowHTML(length)}</tr>`;
    }
    board.insertAdjacentHTML("afterbegin", boardHTML);
  };

  const initializeBoard = (length, width) => {
    boardInfo = [];
    const emptyRow = Array(length).fill(0);
    for (let i = 0; i < width; i++) {
      boardInfo.push([...emptyRow]);
    }
  };

  const isTileNeighbour = (checkedRow, checkedColumn, row, column) => {
    const rowDiff = Math.abs(checkedRow - row);
    const columnDiff = Math.abs(checkedColumn - column);
    const isDiagonalNeighbour = rowDiff === 1 && columnDiff === 1;
    const isDirectRowNeighbour = rowDiff === 0 && columnDiff === 1;
    const isDirectColumnNeighbour = rowDiff === 1 && columnDiff === 0;
    return (
      isDiagonalNeighbour || isDirectRowNeighbour || isDirectColumnNeighbour
    );
  };

  const updateNeighbourCounts = (bombRowIndex, bombColumnIndex) => {
    boardInfo.forEach((row, rowIndex) => {
      row.forEach((tile, tileIndex) => {
        if (tile !== "mine" && isTileNeighbour(rowIndex, tileIndex, bombRowIndex, bombColumnIndex)) {
          boardInfo[rowIndex][tileIndex] += 1;
        }
      });
    });
  };

  const setMines = (length, width) => {
    let i = 0;
    let failedAttempts = 0;
    while (i < numberMines && failedAttempts < 1000) {
      const rowNumber = Math.floor(Math.random() * width);
      const columnNumber = Math.floor(Math.random() * length);
      if (boardInfo[rowNumber][columnNumber] !== "mine") {
        boardInfo[rowNumber][columnNumber] = "mine";
        updateNeighbourCounts(rowNumber, columnNumber);
        i += 1;
      } else {
        failedAttempts += 1;
      }
    }
    document.querySelector("#number-mines").value = i;
  };

  const tileIsNotOpen = (event) => {
    const classList = event.target.classList;
    return classList.contains("unopened") ||
      classList.contains("flagged") ||
      classList.contains("question");
  }

  const changeClassName = (event) => {
    const classMap = {
      unopened: "flagged",
      flagged: "question",
      question: "unopened",
    };
    const currentClassName = event.target.className;
    const nextClassName = classMap[currentClassName];
    event.target.classList.remove(currentClassName);
    event.target.classList.add(nextClassName);
  };

  const changeMinesCount = (event) => {
    const currentClassName = event.target.className;
    const minesCountField = document.querySelector("#number-mines")
    if (currentClassName === "flagged") {
      minesCountField.value = parseInt(minesCountField.value, 10) - 1;
    }
    if (currentClassName === "question") {
      minesCountField.value = parseInt(minesCountField.value, 10) + 1;
    }
  };

  const handleRightClick = (event) => {
    if (event.button === 2 && tileIsNotOpen(event)) {
      changeClassName(event);
      changeMinesCount(event);
    }
  };

  const openTile = (element, row, column) => {
    if (boardInfo[row][column] === 0) {
      element.classList.remove("unopened");
      element.classList.add("opened");
      const unopenedTileElements = document.querySelectorAll(".unopened");
      unopenedTileElements.forEach((tile) => {
        const tileRow = tile.parentNode.rowIndex;
        const tileColumn = tile.cellIndex;
        if (isTileNeighbour(tileRow, tileColumn, row, column)) {
          openTile(tile, tileRow, tileColumn);
        }
      });
    } else if (boardInfo[row][column] !== "mine") {
      element.classList.remove("unopened");
      element.classList.add(`mine-neighbour-${boardInfo[row][column]}`);
    }
  };

  const changeTileStates = (className) => {
    const unopenedTileElements = [...document.querySelectorAll(".unopened")].concat([...document.querySelectorAll(".question")]);
    unopenedTileElements.forEach((tile) => {
      tile.classList.remove("unopened");
      tile.classList.remove("question");
      tile.classList.add(className);
    });
  };

  const changeBombTileStates = (className) => {
    const unopenedTileElements = [...document.querySelectorAll(".unopened")].concat([...document.querySelectorAll(".question")]);
    unopenedTileElements.forEach((tile) => {
      const tileRow = tile.parentNode.rowIndex;
      const tileColumn = tile.cellIndex;
      if (boardInfo[tileRow][tileColumn] === "mine") {
        tile.classList.remove("unopened");
        tile.classList.remove("question");
        tile.classList.add(className);
      }
    });
  };

  const removeEventListeners = () => {
    board.removeEventListener("mouseup", handleRightClick);
    board.removeEventListener("click", handleLeftClick);
  };

  const handleGameLoss = () => {
    document.querySelector("#message").textContent = "You lost! 😟";
    document.querySelector("#number-mines").value = numberMines;
    changeBombTileStates("mine");
    removeEventListeners();
  };

  const handleGameWon = () => {
    document.querySelector("#message").textContent = "You won! 😎";
    document.querySelector("#number-mines").value = numberMines;
    changeTileStates("flagged");
    removeEventListeners();
  };

  const hasWon = () => {
    const tileStates = ["unopened", "flagged", "question"];
    let numberUnopenedTiles = 0;
    tileStates.forEach((className) => {
      numberUnopenedTiles += document.querySelectorAll(`.${className}`).length
    });
    return numberUnopenedTiles === numberMines;
  };

  const handleLeftClick = (event) => {
    if (event.target.classList.contains("unopened")) {
      const row = event.target.parentNode.rowIndex;
      const column = event.target.cellIndex;
      if (boardInfo[row][column] === "mine") {
        handleGameLoss();
      } else {
        openTile(event.target, row, column);
        if (hasWon()) {
          handleGameWon();
        }
      }
    }
  };

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (isInputValid()) {
      let length;
      let width;
      [length, width, numberMines] = readInput();
      resetMessage();
      resetBoard();
      createBoard(length, width);
      initializeBoard(length, width);
      setMines(length, width);
      board.addEventListener("contextmenu", rightClick => rightClick.preventDefault());
      board.addEventListener("mouseup", handleRightClick);
      board.addEventListener("click", handleLeftClick);
    }
  });
};

minesweeperGame();
