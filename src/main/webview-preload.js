const { ipcRenderer } = require('electron');

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.body.addEventListener('click', () => {
      ipcRenderer.sendToHost('clickOnPage');
    });
  },
  false
);
