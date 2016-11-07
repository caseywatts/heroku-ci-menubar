var path = require('path');
const { shell } = require('electron');
const Mustache = require('mustache');

function notifyTestResult(someData) {
  const notification = new Notification(`Build ${someData.buildNumber} ${someData.state}`, { body: "oh my" });
  notification.onclick = function() {
    shell.openExternal(someData.url);
  }
  setTimeout(notification.close.bind(notification), 5000); // close after 5 seconds
}

function renderBuildTemplate(someData) {
  const buildTemplate = `
  This build number {{ buildNumber }}
  <br />
  {{ state }}!
  `;
  Mustache.parse(buildTemplate);   // optional, speeds up future uses
  var rendered = Mustache.render(buildTemplate, someData);
  document.getElementById('content').innerHTML = rendered;
}


function dispatchEventForSomeData(someData) {
  document.dispatchEvent(new CustomEvent('someDataHasArrived', {detail: someData}));
}

document.addEventListener('someDataHasArrived', function (e) {
  renderBuildTemplate(e.detail);
  notifyTestResult(e.detail);
  // change Icon
}, false);

document.addEventListener("DOMContentLoaded", function(event) {
  const someData = {
    state: 'passed',
    buildNumber: 1,
    url: 'http://www.heroku.com'
  };

  setTimeout(dispatchEventForSomeData, 1000, someData);
});
