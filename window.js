var path = require('path');

function notifyTestResult() {
  new Notification('Test Passed', { body: "ohh yes it passed" });
}

// setInterval(notifyTestResult, 10000); // every 3 seconds
