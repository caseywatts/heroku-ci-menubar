const {app, Tray, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Positioner = require('electron-positioner');
const socket = require('socket.io-client').connect('https://simi.heroku.com/', {
  transports: ['websocket']
});
const storage = require('electron-json-storage');
// require('electron-debug')({showDevTools: true}); // for debugging

let tray = null;
let win = null;

app.on('ready', function(){
  app.dock.hide(); // don't show icon in dock or app switcher

  // Window Setup
  // win = new BrowserWindow({show: true}); // for debugging
  win = new BrowserWindow({width: 400, height: 300, frame: false, show: false});
  win.loadURL('file://' + __dirname + '/window.html');
  win.on('blur', win.hide);


  // Tray setup
  tray = new Tray(iconPath('default'));
  const positioner = new Positioner(win);
  positioner.move('trayCenter', tray.getBounds());

  tray.on('click', function() {
    win.isVisible() ? win.hide() : win.show()
  })
  tray.setToolTip('Heroku CI Menubar');
});

function setTrayIcon(buildStatus) {
  tray.setImage(iconPath(buildStatus));
  tray.setPressedImage(iconPath(buildStatus));
}

function iconState(buildStatus) {
  const iconStateForBuildStatus = {
    'pending': 'progress',
    'creating': 'progress',
    'building': 'progress',
    'running': 'progress',
    'failed': 'fail',
    'succeeded': 'pass',
    'errored': 'error'
  };
  return iconStateForBuildStatus[buildStatus] || 'default';
}

function iconPath(buildStatus) {
  const iconPathForIconState = {
    'default': path.join(__dirname, 'icons/MenubarStateIcons/IconDefault.png'),
    'error': path.join(__dirname, 'icons/MenubarStateIcons/IconError.png'),
    'fail': path.join(__dirname, 'icons/MenubarStateIcons/IconFail.png'),
    'pass': path.join(__dirname, 'icons/MenubarStateIcons/IconPass.png'),
    'progress': path.join(__dirname, 'icons/MenubarStateIcons/IconProgress.png')
  };
  return iconPathForIconState[iconState(buildStatus)];
}

function notificationIcon(buildStatus) {
  const notificationIconForIconState = {
    'fail': path.join(__dirname, 'icons/NotificationIcons/Fail.png'),
    'pass': path.join(__dirname, 'icons/NotificationIcons/Pass.png'),
    'error': path.join(__dirname, 'icons/NotificationIcons/Error.png')
  }
  return notificationIconForIconState[iconState(buildStatus)];
}

function iconState(buildStatus) {
  const iconStateForBuildStatus = {
    'pending': 'progress',
    'creating': 'progress',
    'building': 'progress',
    'running': 'progress',
    'failed': 'fail',
    'succeeded': 'pass',
    'errored': 'error'
  };
  return iconStateForBuildStatus[buildStatus] || 'default';
}


// data parsing & message sending
// const sampleData = ["update",{"action":"update","actor":{"email":null,"id":"acb9cd09-53fa-4bf6-8ae5-10f4b393e3e3"},"created_at":"2016-11-07T20:39:13+00:00","data":{"actor_email":"matt.graham@heroku.com","app_setup":{"id":"c22d5c12-d786-4983-abeb-5dad6ed68699"},"commit_branch":"pr-branch","commit_message":"empty commit to trigger ci","commit_sha":"95e7f85645693f6b6322887e3a63b6f87b28f00f","created_at":"2016-11-07T20:39:11+00:00","error_status":null,"exit_code":null,"id":"0815abf1-90e1-451e-ac7a-99bd7dd9b5e6","message":null,"number":16,"organization":null,"output_stream_url":"https://test-output.herokuapp.com/streams/0815/test-runs/0815abf1-90e1-451e-ac7a-99bd7dd9b5e6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJEMZYC6PHTXF6TLQ%2F20161107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20161107T203913Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=3071d7841f289f2a6a0a77f15211ab21fdaf636694dabee360376eaac00bc9d0","pipeline":{"id":"26fe90c9-20d7-47ed-816d-466cb4c64bb7"},"setup_stream_url":"https://test-output.herokuapp.com/streams/0815/test-setups/0815abf1-90e1-451e-ac7a-99bd7dd9b5e6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJEMZYC6PHTXF6TLQ%2F20161107%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20161107T203913Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=454656f5a43c661fcfee644e1d1f21514a660c2224cf00040e28e6412efdbfd2","source_blob_url":"https://s3-external-1.amazonaws.com/heroku-sources-production/80df1fe1-34d4-4ee3-a5a2-ebfded765418?AWSAccessKeyId=AKIAJURUZ6XB34ESX54A&Signature=t4HCNbxRP1AnKb%2FgL1oDPookgAw%3D&Expires=1478554750","status":"creating","updated_at":"2016-11-07T20:39:13+00:00","user":{"id":"acb9cd09-53fa-4bf6-8ae5-10f4b393e3e3"}},"id":"3cb47816-9f9b-4a6f-a1b8-f6707ac14352","partition_key":"0815abf1-90e1-451e-ac7a-99bd7dd9b5e6","published_at":"2016-11-07T20:39:13+00:00","resource":"test-run","version":"application/vnd.heroku+json; version=3.ci"},"pipelines/26fe90c9-20d7-47ed-816d-466cb4c64bb7/test-runs"];
function parseBuildData(sampleData) {
  return {
    status: sampleData.data['status'],
    actorEmail: sampleData.data['actor_email'],
    commitBranch: sampleData.data['commit_branch'],
    number: sampleData.data['number'],
    url: 'http://google.com/'
  };
}
// const importantBits = parseBuildData(sampleData);
// importantBits.status = 'succeeded';

function dispatchEventForSomeData(buildData) {
  win.webContents.send('someDataHasArrived', {
    buildData: buildData,
    notificationIconPath: notificationIcon(buildData.status)
  });
  setTrayIcon(buildData.status);
}
// setTimeout(dispatchEventForSomeData, 1000, importantBits);


// on new key or pipeline etc

function connectToRooms() {
  console.log('connecting to rooms');
  storage.get('pipeline-id', (error, pipelineId) => {
    // if (error) throw error;
    storage.get('token', (error, token) => {
      // if (error) throw error;

      let testRuns = `pipelines/${pipelineId}/test-runs`;
      let pipelineCouplings = `pipelines/${pipelineId}/pipeline-couplings`;

      socket.emit('joinRoom', { room: testRuns, token });
      socket.emit('joinRoom', { room: pipelineCouplings, token });
    });
  })
}

socket.on('connect', function(){
  console.log('connect');
  connectToRooms();
});

socket.on('update', function(data){
  console.log('update');
  console.log(data);
  // data.forEach((data) => {
  dispatchEventForSomeData(parseBuildData(data));
  // })
});

socket.on('create', function(data){
  console.log('create');
  console.log(data);
  dispatchEventForSomeData(parseBuildData(data));
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

ipcMain.on('reconnect', () => {
  connectToRooms();
})

ipcMain.on('quit', () => {
  app.quit();
})
