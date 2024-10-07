/**
 * @jest-environment jsdom
 */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
const script = fs.readFileSync(path.resolve(__dirname, '../script.js'), 'utf8');

jest.dontMock('fs');

describe('Tic-Tac-Toe Game', () => {
  beforeEach(() => {
    // Set up the DOM and run the script
    document.documentElement.innerHTML = html.toString();
    eval(script);
  });

  test('board exists', () => {
    expect(document.querySelector('.board')).toBeTruthy();
  });

  test('initial game state', () => {
    const buttons = document.querySelectorAll('button');
    const turnInfo = document.getElementById('turnInfo');

    buttons.forEach((button) => {
      expect(button.textContent).toBe('');
    });
    expect(turnInfo.textContent).toBe("X's Turn");
  });

  test('player can make a move', () => {
    const firstButton = document.querySelector('.board__button');
    firstButton.click();
    expect(firstButton.innerText).toBe('X');
  });

  test('players alternate turns', () => {
    const buttons = document.querySelectorAll('.board__button');
    const turnInfo = document.getElementById('turnInfo');

    buttons[0].click();
    expect(turnInfo.innerText).toBe("O's Turn");

    buttons[1].click();
    expect(turnInfo.innerText).toBe("X's Turn");
  });

  test('detects a winning combination', () => {
    const buttons = document.querySelectorAll('.board__button');
    const turnInfo = document.getElementById('turnInfo');

    // X wins with top row
    buttons[0].click(); // X
    buttons[3].click(); // O
    buttons[1].click(); // X
    buttons[4].click(); // O
    buttons[2].click(); // X

    expect(turnInfo.innerText).toBe('X wins!');
  });

  test('prevents moves after a win', () => {
    const buttons = document.querySelectorAll('.board__button');

    // X wins with top row
    buttons[0].click(); // X
    buttons[3].click(); // O
    buttons[1].click(); // X
    buttons[4].click(); // O
    buttons[2].click(); // X wins

    buttons[5].click(); // Attempt move after win
    expect(buttons[5].textContent).toBe('');
  });
});
