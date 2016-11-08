var path = require('path');
const { shell, ipcRenderer } = require('electron');
const Mustache = require('mustache');
const storage = require('electron-json-storage');

function notifyTestResult(buildData, notificationIconPath) {
  const notification = new Notification(
    `Build ${buildData.number} ${buildData.status}`,{
      body: "oh my",
      icon: notificationIconPath
    }
  );
  notification.onclick = function() {
    shell.openExternal(buildData.url);
  }
  setTimeout(notification.close.bind(notification), 15000); // close after 5 seconds
}

function renderBuildTemplate(someData) {
  const buildTemplate = `
  This build number {{ number }}
  <br />
  {{ status }}!
  `;
  Mustache.parse(buildTemplate);   // optional, speeds up future uses
  var rendered = Mustache.render(buildTemplate, someData);
  document.getElementById('content').innerHTML = rendered;
}

ipcRenderer.on('someDataHasArrived', (event, { buildData, notificationIconPath }) => {
  if (buildData.status === 'failed' || buildData.status === 'succeeded' || buildData.status === 'errored') {
    notifyTestResult(buildData, notificationIconPath);
  }
  renderBuildTemplate(buildData);
}, false);


function showToken() {
  storage.get('token', (error, token) => {
    document.getElementsByName('token')[0].value = token;
  })
}

function saveToken() {
  const token = document.getElementsByName('token')[0].value;
  storage.set('token', token);
  ipcRenderer.send('reconnect', 'please');
  showToken();
}

function showPipelineId() {
  storage.get('pipeline-id', (error, pipelineId) => {
    document.getElementsByName('pipeline-id')[0].value = pipelineId;
  })
}

function savePipelineId() {
  const pipelineId = document.getElementsByName('pipeline-id')[0].value;
  storage.set('pipeline-id', pipelineId);
  ipcRenderer.send('reconnect', 'please');
  showPipelineId();
}

showToken();
showPipelineId();
