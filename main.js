const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');

const iconPath = path.join(__dirname, 'icon.png');
let appIcon = null;
let win = null;

app.on('ready', function(){
  win = new BrowserWindow({show: false});
  win.loadURL('file://' + __dirname + '/window.html');
  appIcon = new Tray(iconPath);
  // appIcon.setToolTip('This is my application.');
});
