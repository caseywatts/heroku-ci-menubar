const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');
require('electron-debug')({showDevTools: true});

const iconPath = path.join(__dirname, 'icon.png');
let tray = null;
let win = null;

app.on('ready', function(){
  // Window Setup
  win = new BrowserWindow({show: true});
  // win = new BrowserWindow({width: 400, height: 300, frame: false, show: false});
  win.loadURL('file://' + __dirname + '/window.html');


  // Tray setup
  tray = new Tray(iconPath);
  const positioner = new Positioner(win);
  positioner.move('trayCenter', tray.getBounds());

  tray.on('click', function() {
    win.isVisible() ? win.hide() : win.show()
  })
  tray.setToolTip('Heroku CI Menubar');


  // Data Message Sending
  const someData = {
    state: 'passed',
    buildNumber: 1,
    url: 'http://www.heroku.com'
  };
  function dispatchEventForSomeData(someData) {
    win.webContents.send('someDataHasArrived', someData);
  }
  setTimeout(dispatchEventForSomeData, 1000, someData);
});
