const { ipcRenderer } = require('electron');

const keyDownListener = (e) => {
  if (e.ctrlKey && e.key === 't') {
    ipcRenderer.sendToHost('ctrl+t');
  }

  if (e.ctrlKey && e.key === 'w') {
    ipcRenderer.sendToHost('ctrl+w');
  }
};

ipcRenderer.on('created-webcontents', (e, args) => {
  ipcRenderer.sendToHost('created-webcontents', args);
});

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
