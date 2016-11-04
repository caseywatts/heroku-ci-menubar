var path = require('path');

function notifyTestResult() {
  new Notification('Test Passed', { body: "ohh yes it passed" });
}

setInterval(notifyTestResult, 3000); // every 3 seconds
