const { ipcRenderer } = require('electron');

const keyDownListener = (e) => {
  if (e.ctrlKey && e.key === 't') {
    ipcRenderer.sendToHost('ctrl+t');
  }
};

document.addEventListener(
  'DOMContentLoaded',
  () => {
    window.addEventListener('click', () => {
      ipcRenderer.sendToHost('clickOnPage');
    });
    window.addEventListener('keydown', keyDownListener, false);
  },
  false
);
