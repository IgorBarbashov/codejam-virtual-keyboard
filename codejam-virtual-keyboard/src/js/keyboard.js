export const ENTER = 'Enter';
export const BACKSPACE = 'Backspace';
export const CAPSLOCK = 'CapsLock';
export const CONTROL_LEFT = 'ControlLeft';
export const SHIFT_LEFT = 'ShiftLeft';
export const TAB = 'Tab';
export const ALT_LEFT = 'AltLeft';
export const ARROWS = ['▲', '◄', '▼', '►'];

class Keyboard {
  constructor() {
    this.language = localStorage.getItem('lang') || 'eng';
    this.shifting = 'unshift';
    this.caps = false;
    this.activeKeys = new Set();
    this.pressedLangSwitches = [];
  }
}

export default new Keyboard();
