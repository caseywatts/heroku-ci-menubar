var path = require('path');
const { shell } = require('electron')

function notifyTestResult() {
  const notification = new Notification('Test Passed', { body: "ohh yes it passed" });
  notification.onclick = function() {
    shell.openExternal('http://www.heroku.com');
  }
  setTimeout(notification.close.bind(notification), 5000); // close after 5 seconds
}

notifyTestResult();
// setInterval(notifyTestResult, 3000); // every 3 seconds
