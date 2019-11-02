import keyboardLayout from '../assets/keyboard.json';

const allKeys = keyboardLayout
  .map(el => el.map(el => el.id))
  .reduce((acc, el) => [...acc, ...el], []);

const state = {
  language: 'eng',
  shifting: 'unshift',
  activeKeys: [],
  pressedLangSwitches: []
};

const keyboardElement = document.createElement('div');
keyboardElement.classList.add('keyboard');
document.body.appendChild(keyboardElement);

function renderKeyboard() {
  keyboardElement.innerHTML = null;
  keyboardLayout.forEach((row, i) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard-row');
    row.forEach((el, j) => {
      const keyboardKey = document.createElement('div');
      keyboardKey.setAttribute('id', el.id);
      keyboardKey.classList.add('keyboard-key');
      el.class && keyboardKey.classList.add(el.class);
      state.activeKeys.includes(el.id) && keyboardKey.classList.add('active');
      keyboardKey.textContent = el.label ? el.label : el[`${state.language}-unshift`];
      keyboardRow.appendChild(keyboardKey);
    });
    keyboardElement.appendChild(keyboardRow);
  });
}

window.addEventListener('keydown', e => {
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  if (e.repeat) {
    return;
  }
  if (e.code === 'ShiftLeft' || e.code === 'ControlLeft') {
    state.pressedLangSwitches.push(e.code);
  }
  if (e.code === 'ShiftLeft') {
    state.shifting = state.shifting === 'unshift' ? 'shift' : 'unshift';
  }
  state.activeKeys.push(e.code);
  renderKeyboard();
});

window.addEventListener('keyup', e => {
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  const wasPressed = state.pressedLangSwitches.length;
  if (e.code === 'ShiftLeft' || e.code === 'ControlLeft') {
    state.pressedLangSwitches = state.pressedLangSwitches.filter(el => el !== e.code);
  }
  if (wasPressed === 2) {
    state.language = state.language === 'eng' ? 'rus' : 'eng';
  }
  if (e.code === 'ShiftLeft') {
    state.shifting = 'unshift';
  }
  state.activeKeys = state.activeKeys.filter(el => el !== e.code);
  renderKeyboard();
});

renderKeyboard();
