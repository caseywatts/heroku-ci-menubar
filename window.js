var path = require('path');
const { shell, ipcRenderer } = require('electron');
const Mustache = require('mustache');
const storage = require('electron-json-storage');
const AutoLaunch = require('auto-launch');

function notifyTestResult(buildData, notificationIconPath) {
  const notification = new Notification(
    `Build ${buildData.number} ${buildData.status}`,{
      body: `${buildData.commitMessage} (${buildData.commitSha})`,
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
  <li class="status--details" id="build-{{ number }}">
    <div class="status--copy {{ status }}">
      <div class="state">
        <i class="icon icon-{{ status }}"></i>
      </div>
      <div class="info">
        <div class="title">{{ commitBranch }}</div>
        <div class="commit"><code>{{ commitSha }}</code> {{ commitMessage }}</div>
        <div class="build"><b>Build #{{ number }}</b> by {{ actorEmail }} {{ status }}</div>
      </div>
    </div>
  </li>
  `;
  Mustache.parse(buildTemplate);   // optional, speeds up future uses
  return Mustache.render(buildTemplate, someData);
}

ipcRenderer.on('someDataHasArrived', (event, { buildData, notificationIconPath }) => {
  if (buildData.status === 'failed' || buildData.status === 'succeeded' || buildData.status === 'errored') {
    notifyTestResult(buildData, notificationIconPath);
  }
  const rendered = renderBuildTemplate(buildData);
  if (document.getElementById(`build-${buildData.number}`)) {
    document.getElementById(`build-${buildData.number}`).outerHTML = rendered

  } else {
    document.getElementById('content').insertAdjacentHTML('afterbegin', rendered);
  }
}, false);


function showToken() {
  storage.get('token', (error, token) => {
    document.getElementsByName('token')[0].value = token;
  })
}

function saveToken() {
  const token = document.getElementsByName('token')[0].value;
  storage.set('token', token);
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
  showPipelineId();
}

function showContributorEmail() {
  storage.get('contributor-email', (error, contributorEmail) => {
    document.getElementsByName('contributor-email')[0].value = contributorEmail;
  })
}

function saveContributorEmail() {
  const contributorEmail = document.getElementsByName('contributor-email')[0].value;
  storage.set('contributor-email', contributorEmail);
  showContributorEmail();
}

function showAutoLaunch() {
  storage.get('auto-launch', (error, autoLaunch) => {
    document.getElementsByName('auto-launch')[0].checked = autoLaunch;
  })
}

function saveAutoLaunch() {
  const autoLaunch = document.getElementsByName('auto-launch')[0].checked;
  storage.set('auto-launch', autoLaunch);
  if (autoLaunch) {
    enableAutoLauncher();
  } else {
    disableAutoLauncher();
  }
}

function saveForm() {
  savePipelineId();
  saveToken();
  saveContributorEmail();
  ipcRenderer.send('reconnect', 'please');
}

showToken();
showPipelineId();
showContributorEmail();
showAutoLaunch();

function quit() {
  ipcRenderer.send('quit', 'please');
}

function showMain() {
  document.getElementById('settings').style.display = 'none';
  document.getElementById('settings-nav').classList.remove('active')

  document.getElementById('main').style.display = 'block';
  document.getElementById('main-nav').classList.add('active')
}

function showSettings() {
  document.getElementById('settings').style.display = 'block';
  document.getElementById('settings-nav').classList.add('active')

  document.getElementById('main').style.display = 'none';
  document.getElementById('main-nav').classList.remove('active')
}

function createAutoLauncher() {
  return new AutoLaunch({
    name: 'Heroku CI Menubar',
    path: '/Applications/heroku-ci-menubar.app',
  });
}

function enableAutoLauncher() {
  createAutoLauncher().enable();
}

function disableAutoLauncher() {
  createAutoLauncher().disable();
}
