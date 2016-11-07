const {app, Tray, Menu, BrowserWindow} = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');
const socket = require('socket.io-client').connect('https://simi.heroku.com/', {
  transports: ['websocket']
});

const iconPath = path.join(__dirname, 'icon.png');
let tray = null;
let win = null;

app.on('ready', function(){
  // Window Setup
  // win = new BrowserWindow({show: true}); // for debugging
  win = new BrowserWindow({width: 400, height: 300, frame: false, show: false});
  win.loadURL('file://' + __dirname + '/window.html');


  // Tray setup
  tray = new Tray(iconPath('default'));
  const positioner = new Positioner(win);
  positioner.move('trayCenter', tray.getBounds());

  tray.on('click', function() {
    win.isVisible() ? win.hide() : win.show()
  })
  tray.setToolTip('Heroku CI Menubar');
  function setTrayIcon(state) {
    tray.setImage(iconPath(state));
    tray.setPressedImage(iconPath(state));
  }

  function iconPath(state) {
    const iconForStatus = {
      'default': path.join(__dirname, 'icons/MenubarStateIcons/IconDefault.png'),
      'error': path.join(__dirname, 'icons/MenubarStateIcons/IconError.png'),
      'fail': path.join(__dirname, 'icons/MenubarStateIcons/IconFail.png'),
      'pass': path.join(__dirname, 'icons/MenubarStateIcons/IconPass.png'),
      'progress': path.join(__dirname, 'icons/MenubarStateIcons/IconProgress.png')
    };
    return iconForStatus[state];
  }

  // Data Message Sending
  const someData = {
    state: 'pass',
    buildNumber: 1,
    url: 'http://www.heroku.com'
  };
  function dispatchEventForSomeData(someData) {
    win.webContents.send('someDataHasArrived', someData);
    setTrayIcon(someData.state);
  }
  setTimeout(dispatchEventForSomeData, 1000, someData);



  socket.on('connect', function(){
    console.log('connect');

    let pipelineId = '26fe90c9-20d7-47ed-816d-466cb4c64bb7';
    let testRuns = `pipelines/${pipelineId}/test-runs`;
    let pipelineCouplings = `pipelines/${pipelineId}/pipeline-couplings`;

    let token = '_AUTHORIZATION_BEARER_TOKEN_';

    this.emit('joinRoom', { room: testRuns, token });
    this.emit('joinRoom', { room: pipelineCouplings, token });
  });

  socket.on('update', function(data){
    console.log('update');
    console.log(data);
  });

  socket.on('create', function(data){
    console.log('create');
    console.log(data);
  });

  socket.on('disconnect', function(){
    console.log('disconnected');
  });

  socket.on('connect_error', function(err) {
    console.log('connect_error: ', err);
  });

  socket.on('error', function(err) {
    console.log('err: ', err);
  });
});
