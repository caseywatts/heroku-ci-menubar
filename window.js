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

function loadUser() {
  var template = document.getElementById('template').innerHTML;
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, {name: "Luke"});
  document.getElementById('target').innerHTML = rendered;
  console.log(rendered);
}

document.addEventListener("DOMContentLoaded", function(event) {
  loadUser();
});
