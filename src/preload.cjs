const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vrmApp', {
  chooseModel: () => ipcRenderer.invoke('model:choose'),
  getOptions: () => ipcRenderer.invoke('options:get'),
  setOptions: (options) => ipcRenderer.invoke('options:set', options),
  moveWindow: (dx, dy) => ipcRenderer.send('avatar:move', { dx, dy }),
  sendCamera: (state) => ipcRenderer.send('avatar:camera', state),
  onOptions: (callback) => ipcRenderer.on('avatar:options', (_event, data) => callback(data)),
  onLoadModel: (callback) => ipcRenderer.on('avatar:load-model', (_event, fileUrl) => callback(fileUrl)),
  onCamera: (callback) => ipcRenderer.on('avatar:camera', (_event, state) => callback(state))
});
