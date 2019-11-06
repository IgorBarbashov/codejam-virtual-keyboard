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
