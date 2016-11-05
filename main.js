const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');

const iconPath = path.join(__dirname, 'icon.png');
let tray = null;
let win = null;

app.on('ready', function(){
  // win = new BrowserWindow({show: false});
  win = new BrowserWindow({width: 400, height: 300, frame: false, show: false});
  win.loadURL('file://' + __dirname + '/window.html');

  tray = new Tray(iconPath);
  const positioner = new Positioner(win);
  positioner.move('trayCenter', tray.getBounds());

  tray.on('click', function() {
    win.isVisible() ? win.hide() : win.show()
  })
  tray.setToolTip('Heroku CI Menubar');
});
