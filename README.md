# Minesweeper

This is a simple implementation of the classic game Minesweeper using JavaScript.

## Features

- Customizable board size
- Customizable number of mines
- Flagging and questioning of squares

## How to Use

1. Clone this repository.
2. Open `index.html` in your browser.
3. Enter the desired board size and number of mines.
4. Click the "Submit" button to start the game.

## Code Overview

The main JavaScript file is `minesweeper.js`. Here's a brief overview of what the code does:

- `board`, `submitButton`, `numberMinesInput`, `messageElement`, and `messageValidations` are all selectors for different elements in the HTML.
- `unopenedClass`, `flaggedClass`, and `questionClass` are CSS classes used to style the squares on the board.
- `boardInfo` is an array that stores information about the state of the game board.
- `numberMines` is the number of mines on the board.
- `readInput` is a function that reads the user's input for the board size and number of mines.
- `isValid` is a function that checks if the user's input is valid.
- `isInputValid` is a function that displays a message if the user's input is invalid.

## Screenshot

https://github.com/GoldieCrystal/Minesweeper/assets/142741980/a53f0e2a-596f-4d22-a2c3-0d979438af07

## Author

Julia Kleber (github.com/GoldieCrystal)
