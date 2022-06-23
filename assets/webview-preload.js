const { ipcRenderer } = require('electron');

const keyDownListener = (e) => {
  if (e.ctrlKey && !e.shiftKey && e.key === 't') {
    ipcRenderer.sendToHost('ctrl+t');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 'r') {
    ipcRenderer.sendToHost('ctrl+r');
  }

  if (e.ctrlKey && !e.shiftKey && e.key === 'w') {
    ipcRenderer.sendToHost('ctrl+w');
  }

  if (e.ctrlKey && e.shiftKey && e.key === 'W') {
    ipcRenderer.sendToHost('ctrl+shift+W');
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
