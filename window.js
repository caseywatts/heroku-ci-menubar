var path = require('path');
const { shell, ipcRenderer } = require('electron');
const Mustache = require('mustache');

function notifyTestResult(someData) {
  const notification = new Notification(`Build ${someData.number} ${someData.status}`, { body: "oh my" });
  notification.onclick = function() {
    shell.openExternal(someData.url);
  }
  setTimeout(notification.close.bind(notification), 5000); // close after 5 seconds
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

ipcRenderer.on('someDataHasArrived', (event, someData) => {
  renderBuildTemplate(someData);
  notifyTestResult(someData);
}, false);
