const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');
const socket = require('socket.io-client')('https://simi.heroku.com/pipelines/123/pipeline-couplings');

const iconPath = path.join(__dirname, 'icon.png');
let tray = null;
let win = null;

app.on('ready', function(){
  // Window Setup
  // win = new BrowserWindow({show: true}); // for debugging
  win = new BrowserWindow({width: 400, height: 300, frame: false, show: false});
  win.loadURL('file://' + __dirname + '/window.html');


  // Tray setup
  tray = new Tray(iconPath);
  const positioner = new Positioner(win);
  positioner.move('trayCenter', tray.getBounds());

  tray.on('click', function() {
    win.isVisible() ? win.hide() : win.show()
  })
  tray.setToolTip('Heroku CI Menubar');
  function setTrayIcon(someData) {
    tray.setImage(iconPath);
    tray.setPressedImage(iconPath);
  }

  // Data Message Sending
  const someData = {
    state: 'passed',
    buildNumber: 1,
    url: 'http://www.heroku.com'
  };
  function dispatchEventForSomeData(someData) {
    win.webContents.send('someDataHasArrived', someData);
    setTrayIcon(someData);
  }
  setTimeout(dispatchEventForSomeData, 1000, someData);



socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
  "969872eb-4e0d-42b8-87f1-cca4dad8c1f7"
});
