const { app, BrowserWindow, ipcMain, dialog, screen } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

let settingsWindow = null;
let avatarWindow = null;
let currentModelUrl = null;
let avatarOptions = { background: 'transparent', chromaColor: '#00ff00', fps: 30, frame: false };

function createAvatarWindow(bounds) {
  const area = screen.getPrimaryDisplay().workArea;
  const transparent = avatarOptions.background === 'transparent';
  const win = new BrowserWindow({
    width: bounds?.width ?? 640,
    height: bounds?.height ?? 720,
    x: bounds?.x ?? area.x + Math.max(0, area.width - 680),
    y: bounds?.y ?? area.y + Math.max(0, area.height - 760),
    frame: avatarOptions.frame,
    transparent,
    backgroundColor: transparent ? '#00000000' : avatarOptions.chromaColor,
    hasShadow: false,
    resizable: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  avatarWindow = win;
  win.__transparent = transparent;
  win.__frame = avatarOptions.frame;
  win.loadFile(path.join(__dirname, 'avatar.html'));
  win.once('ready-to-show', () => {
    if (win.isDestroyed()) return;
    win.show();
    win.webContents.send('avatar:options', avatarOptions);
    if (currentModelUrl) win.webContents.send('avatar:load-model', currentModelUrl);
  });
  win.on('closed', () => {
    if (avatarWindow === win) avatarWindow = null;
  });
  return win;
}

function sendOptions() {
  if (!avatarWindow || avatarWindow.isDestroyed()) return;
  const transparent = avatarOptions.background === 'transparent';
  const needsRecreate = avatarWindow.__transparent !== transparent || avatarWindow.__frame !== avatarOptions.frame;
  if (needsRecreate) {
    const bounds = avatarWindow.getBounds();
    const oldWindow = avatarWindow;
    avatarWindow = null;
    oldWindow.close();
    createAvatarWindow(bounds);
    return;
  }
  avatarWindow.setBackgroundColor(transparent ? '#00000000' : avatarOptions.chromaColor);
  avatarWindow.webContents.send('avatar:options', avatarOptions);
}

function createSettingsWindow() {
  settingsWindow = new BrowserWindow({
    width: 430, height: 640, minWidth: 390, minHeight: 560,
    title: 'VRM Stream App — Settings',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  settingsWindow.loadFile(path.join(__dirname, 'settings.html'));
  settingsWindow.on('closed', () => { settingsWindow = null; });
}

app.whenReady().then(() => {
  createAvatarWindow();
  createSettingsWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAvatarWindow();
      createSettingsWindow();
    }
  });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('model:choose', async () => {
  const result = await dialog.showOpenDialog(settingsWindow, {
    title: 'VRMモデルを選択', properties: ['openFile'],
    filters: [{ name: 'VRM model', extensions: ['vrm'] }]
  });
  if (result.canceled || !result.filePaths[0]) return null;
  currentModelUrl = pathToFileURL(result.filePaths[0]).href;
  avatarWindow?.webContents.send('avatar:load-model', currentModelUrl);
  return path.basename(result.filePaths[0]);
});

ipcMain.handle('options:get', () => ({ ...avatarOptions }));
ipcMain.handle('options:set', (_event, next) => {
  if (!next || typeof next !== 'object') return { ...avatarOptions };
  if (['transparent', 'chroma'].includes(next.background)) avatarOptions.background = next.background;
  if (typeof next.chromaColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(next.chromaColor)) avatarOptions.chromaColor = next.chromaColor;
  if ([15, 24, 30, 60].includes(Number(next.fps))) avatarOptions.fps = Number(next.fps);
  if (typeof next.frame === 'boolean') avatarOptions.frame = next.frame;
  sendOptions();
  return { ...avatarOptions };
});

ipcMain.on('avatar:move', (_event, delta) => {
  if (!avatarWindow || avatarWindow.isDestroyed() || !delta) return;
  const { dx, dy } = delta;
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
  const b = avatarWindow.getBounds();
  avatarWindow.setPosition(b.x + Math.round(dx), b.y + Math.round(dy));
});
ipcMain.on('avatar:camera', (_event, state) => {
  if (!state || ![state.rotateX, state.rotateY, state.panX, state.panY].every(Number.isFinite)) return;
  avatarWindow?.webContents.send('avatar:camera', state);
});
