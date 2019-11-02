import keyboardLayout from '../assets/keyboard.json';

const state = {
  language: 'eng',
  shifting: 'unshift'
};

// ff.getSVGDocument().querySelector("text").textContent = 99
// document.body.addEventListener('keydown', e => {
//   console.log(`${e.key} - ${e.code}`);
// });

// window.body

const keyboardElement = document.createElement('div');
keyboardElement.classList.add('keyboard');

keyboardLayout.forEach((row, i) => {
  const keyboardRow = document.createElement('div');
  keyboardRow.classList.add('keyboard-row');

  row.forEach((el, j) => {
    const keyboardKey = document.createElement('div');
    keyboardKey.setAttribute('id', el.id);
    keyboardKey.classList.add('keyboard-key');
    el.class && keyboardKey.classList.add(el.class);
    keyboardKey.textContent = el.label ? el.label : el[`${state.language}-${state.shifting}`];
    keyboardRow.appendChild(keyboardKey);
  });

  keyboardElement.appendChild(keyboardRow);
});

document.body.appendChild(keyboardElement);
