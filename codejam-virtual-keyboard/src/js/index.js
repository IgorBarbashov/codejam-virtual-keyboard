import keyboardLayout from '../assets/keyboard.json';
import state, {
  ARROWS,
  ENTER,
  BACKSPACE,
  CAPSLOCK,
  CONTROL_LEFT,
  SHIFT_LEFT,
  TAB,
  ALT_LEFT,
} from './keyboard';

const allKeys = keyboardLayout.map((el) => el.map((key) => key.id)).flat(1);

const xor = (a, b) => (a && b) || (!a && !b);
const isNotArrow = (key) => ARROWS.indexOf(key) === -1;

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
document.body.appendChild(textarea);

const keyboardElement = document.createElement('div');
keyboardElement.classList.add('keyboard');
document.body.appendChild(keyboardElement);

const tizer = document.createElement('div');
tizer.classList.add('tizer');
tizer.textContent = "LeftCtrl + LeftAlt for layout's switching";
document.body.appendChild(tizer);

function setAnimation(el) {
  if (el === null) {
    return;
  }
  const animationKey = document.createElement('input');
  animationKey.setAttribute('type', 'button');
  animationKey.classList.add('keyboard-key', 'animation-key');
  animationKey.setAttribute(
    'style',
    `top: ${el.getBoundingClientRect().y}px; left: ${el.getBoundingClientRect().x}px;`,
  );
  document.body.insertBefore(animationKey, keyboardElement);
  setTimeout(() => {
    animationKey.parentNode.removeChild(animationKey);
  }, 300);
}

function onClick(e) {
  e.preventDefault();
  const addSymbol = e.target.dataset.letter;
  if (addSymbol.length === 1 && isNotArrow(addSymbol)) {
    textarea.value += addSymbol;
  } else if (addSymbol === ENTER) {
    textarea.value += '\n';
  } else if (addSymbol === BACKSPACE) {
    textarea.value = textarea.value.slice(0, -1);
  } else if (addSymbol === 'Tab') {
    textarea.value += '\t';
  } else if (addSymbol === CAPSLOCK) {
    state.caps = !state.caps;
    /* eslint-disable-next-line */
    renderKeyboard();
  }
  setAnimation(e.target);
  textarea.focus();
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
      if (state.activeKeys.has(el.id)) {
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
  textarea.focus();
}

window.addEventListener('keydown', (e) => {
  if (state.pressedLangSwitches.length === 2) {
    return;
  }
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  if (!e.repeat) {
    if (e.code === ALT_LEFT || e.code === CONTROL_LEFT) {
      state.pressedLangSwitches.push(e.code);
    }
    if (e.code === CAPSLOCK) {
      state.caps = !state.caps;
    }
    if (e.code === SHIFT_LEFT) {
      state.shifting = state.shifting === 'unshift' ? 'shift' : 'unshift';
    }
  }

  const pressedLetter = document.getElementById(e.code)
    && document.getElementById(e.code).dataset.letter;
  if (e.code === TAB) {
    textarea.value += '\t';
  } else if (e.code === BACKSPACE) {
    textarea.value = textarea.value.slice(0, -1);
  } else if (e.code === ENTER) {
    textarea.value += '\n';
  } else if (pressedLetter && pressedLetter.length === 1 && isNotArrow(pressedLetter)) {
    textarea.value += pressedLetter;
  }
  state.activeKeys.add(e.code);
  setAnimation(document.getElementById(e.code));
  renderKeyboard();
});

window.addEventListener('keyup', (e) => {
  if (allKeys.includes(e.code)) {
    e.preventDefault();
  }
  const wasPressed = state.pressedLangSwitches.length;
  if (e.code === ALT_LEFT || e.code === CONTROL_LEFT) {
    state.pressedLangSwitches = state.pressedLangSwitches.filter((el) => el !== e.code);
    if (wasPressed === 2) {
      state.language = state.language === 'eng' ? 'rus' : 'eng';
      localStorage.setItem('lang', state.language);
    }
  }
  if (e.code === SHIFT_LEFT) {
    state.shifting = 'unshift';
  }
  state.activeKeys.delete(e.code);

  renderKeyboard();
});

renderKeyboard();
