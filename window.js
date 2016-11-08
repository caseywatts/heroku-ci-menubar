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
  setTimeout(notification.close.bind(notification), 10000); // close after 5 seconds
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
