import keyboardLayout from '../assets/keyboard.json';

const allKeys = keyboardLayout
  .map((el) => el.map((key) => key.id))
  .reduce((acc, el) => [...acc, ...el], []);

const state = {
  language: localStorage.getItem('lang') || 'eng',
  shifting: 'unshift',
  caps: false,
  activeKeys: [],
  pressedLangSwitches: [],
};

const xor = (a, b) => (a && b) || (!a && !b);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
document.body.appendChild(textarea);

const keyboardElement = document.createElement('div');
keyboardElement.classList.add('keyboard');
document.body.appendChild(keyboardElement);

function setAnimation(el) {
  const animationKey = document.createElement('input');
  animationKey.setAttribute('type', 'button');
  animationKey.classList.add('keyboard-key', 'animation-key');
  animationKey.setAttribute('style', `top: ${el.getBoundingClientRect().y}px; left: ${el.getBoundingClientRect().x}px;`);
  document.body.insertBefore(animationKey, keyboardElement);
  setTimeout(() => {
    animationKey.parentNode.removeChild(animationKey);
  }, 300);
}

function onClick(e) {
  e.preventDefault();
  const addSymbol = e.target.dataset.letter;
  if (addSymbol.length === 1) {
    textarea.value += addSymbol;
    setAnimation(e.target);
  } else if (addSymbol === 'Backspace') {
    textarea.value = textarea.value.slice(0, -1);
    setAnimation(e.target);
  } else if (addSymbol === 'CapsLock') {
    state.caps = !state.caps;
    /* eslint-disable-next-line */
    renderKeyboard();
  }
}

function renderKeyboard() {
  keyboardElement.innerHTML = null;
  keyboardLayout.forEach((row) => {
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard-row');

    row.forEach((el) => {
      const keyboardKey = document.createElement('input');
      keyboardKey.setAttribute('type', 'button');
      keyboardKey.setAttribute('id', el.id);
      keyboardKey.classList.add('keyboard-key');
      if (el.class) {
        keyboardKey.classList.add(el.class);
      }
      if (state.activeKeys.includes(el.id)) {
        keyboardKey.classList.add('active');
      }

      const keySymbol = !xor(state.caps, state.shifting === 'shift')
        ? el[`${state.language}-shift`]
        : el[`${state.language}-unshift`];
      const realSymbol = el.label ? el.label : keySymbol;

      keyboardKey.setAttribute('data-letter', realSymbol);
      keyboardKey.value = realSymbol;

      keyboardKey.addEventListener('click', onClick);
      keyboardRow.appendChild(keyboardKey);
    });

    keyboardElement.appendChild(keyboardRow);
  });
}

window.addEventListener('keydown', (e) => {
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  if (e.repeat) {
    return;
  }
  if (e.code === 'ShiftLeft' || e.code === 'ControlLeft') {
    state.pressedLangSwitches.push(e.code);
  }
  if (e.code === 'CapsLock') {
    state.caps = !state.caps;
  }
  if (e.code === 'ShiftLeft') {
    state.shifting = state.shifting === 'unshift' ? 'shift' : 'unshift';
  }
  state.activeKeys.push(e.code);
  renderKeyboard();
});

window.addEventListener('keyup', (e) => {
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  const wasPressed = state.pressedLangSwitches.length;
  if (e.code === 'ShiftLeft' || e.code === 'ControlLeft') {
    state.pressedLangSwitches = state.pressedLangSwitches.filter((el) => el !== e.code);
  }
  if (wasPressed === 2) {
    state.language = state.language === 'eng' ? 'rus' : 'eng';
    localStorage.setItem('lang', state.language);
  }
  if (e.code === 'ShiftLeft') {
    state.shifting = 'unshift';
  }
  state.activeKeys = state.activeKeys.filter((el) => el !== e.code);
  renderKeyboard();
});

renderKeyboard();
