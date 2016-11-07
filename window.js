var path = require('path');
const { shell } = require('electron');
const Mustache = require('mustache');

function notifyTestResult() {
  const notification = new Notification('Test Passed', { body: "ohh yes it passed" });
  notification.onclick = function() {
    shell.openExternal('http://www.heroku.com');
  }
  setTimeout(notification.close.bind(notification), 5000); // close after 5 seconds
}

notifyTestResult();
// setInterval(notifyTestResult, 3000); // every 3 seconds


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

document.addEventListener("DOMContentLoaded", function(event) {
  const someData = {
    state: 'passed',
    buildNumber: 1
  };
  renderBuildTemplate(someData);
});
