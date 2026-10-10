'use strict';
const api = window.eclipse;
const $ = (id) => document.getElementById(id);

const state = { settings: null, info: null, profile: null, busy: false, running: false };

/* ---------- helpers ---------- */

function cleanError(err) {
  const message = (err && err.message) || String(err);
  return message.replace(/^Error invoking remote method '[^']+': (Error: )?/, '');
}

function setStatus(text, kind = '') {
  const el = $('status');
  el.textContent = text;
  el.className = `status ${kind}`.trim();
}

function setProgress(current, total) {
  const wrap = $('progress');
  const bar = $('bar');
  wrap.hidden = false;
  if (total > 0) {
    bar.classList.remove('indeterminate');
    bar.style.width = `${Math.min(100, Math.round((current / total) * 100))}%`;
  } else {
    bar.classList.add('indeterminate');
    bar.style.width = '';
  }
}

function hideProgress() {
  $('progress').hidden = true;
}

const gb = (mb) => `${(mb / 1024).toFixed(1).replace(/\.0$/, '')} GB`;

/* ---------- navigation & window ---------- */

document.querySelectorAll('.nav').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav').forEach((b) => b.classList.toggle('active', b === button));
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${button.dataset.view}`));
  });
});
$('win-min').addEventListener('click', () => api.minimize());
$('win-max').addEventListener('click', () => api.maximize());
$('win-close').addEventListener('click', () => api.close());

/* ---------- console ---------- */

const consoleLines = [];
let consoleQueued = false;
function logLine(line) {
  consoleLines.push(line);
  if (consoleLines.length > 2000) consoleLines.splice(0, consoleLines.length - 2000);
  if (consoleQueued) return;
  consoleQueued = true;
  requestAnimationFrame(() => {
    consoleQueued = false;
    const out = $('console');
    const stick = out.scrollTop + out.clientHeight >= out.scrollHeight - 30;
    out.textContent = consoleLines.join('\n');
    if (stick) out.scrollTop = out.scrollHeight;
  });
}

/* ---------- account & play button ---------- */

function renderPlay() {
  const play = $('play-btn');
  const locked = state.busy || state.running;
  play.classList.toggle('stop', state.running);
  if (state.running) {
    play.textContent = 'STOP GAME';
    play.disabled = false;
  } else if (state.busy) {
    play.textContent = 'PLEASE WAIT…';
    play.disabled = true;
  } else if (!state.profile) {
    play.textContent = 'Sign in with Microsoft';
    play.disabled = false;
  } else {
    play.textContent = 'PLAY';
    play.disabled = !state.settings.version;
  }
  $('version-select').disabled = locked;
  document.querySelectorAll('#loader-seg button').forEach((b) => (b.disabled = locked));
  $('account-action').disabled = locked;
}

function renderAccount() {
  const profile = state.profile;
  $('avatar').textContent = profile ? profile.name.charAt(0).toUpperCase() : '?';
  $('account-name').textContent = profile ? profile.name : 'Not signed in';
  $('account-action').textContent = profile ? 'Sign out' : 'Sign in with Microsoft';
  renderPlay();
}

async function signIn() {
  state.busy = true;
  renderPlay();
  setStatus('Waiting for Microsoft sign-in…');
  try {
    state.profile = await api.login();
    setStatus(`Signed in as ${state.profile.name}.`, 'ok');
  } catch (err) {
    setStatus(cleanError(err), 'error');
  } finally {
    state.busy = false;
    renderAccount();
  }
}

$('account-action').addEventListener('click', async () => {
  if (state.profile) {
    await api.logout();
    state.profile = null;
    setStatus('Signed out.');
    renderAccount();
  } else {
    signIn();
  }
});

$('play-btn').addEventListener('click', async () => {
  if (state.running) return api.stop();
  if (!state.profile) return signIn();

  state.busy = true;
  renderPlay();
  setProgress(0, 0);
  try {
    await api.launch();
  } catch (err) {
    setStatus(cleanError(err), 'error');
    hideProgress();
  } finally {
    state.busy = false;
    renderPlay();
  }
});

/* ---------- game events from the main process ---------- */

api.onGameEvent((event) => {
  switch (event.type) {
    case 'status':
      state.running = event.state === 'running';
      if (event.state === 'preparing') {
        setProgress(0, 0);
        setStatus(event.message);
      } else {
        hideProgress();
        setStatus(event.message, event.state === 'error' ? 'error' : event.state === 'running' ? 'ok' : '');
      }
      renderPlay();
      break;
    case 'progress':
      setProgress(event.current, event.total);
      setStatus(event.total ? `${event.label} (${event.current}/${event.total})` : event.label);
      break;
    case 'log':
      logLine(event.line);
      break;
    case 'account':
      state.profile = event.profile;
      renderAccount();
      break;
  }
});

/* ---------- versions & loader ---------- */

async function loadVersions() {
  const select = $('version-select');
  select.replaceChildren();
  let versions = [];
  try {
    versions = await api.listVersions(state.settings.loader);
  } catch (err) {
    setStatus(`Could not load the version list: ${cleanError(err)}`, 'error');
  }
  for (const id of versions) {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = id;
    select.appendChild(option);
  }
  if (versions.length && !versions.includes(state.settings.version)) {
    state.settings = await api.setSettings({ version: versions[0] });
  }
  select.value = state.settings.version || '';
  renderPlay();
}

$('version-select').addEventListener('change', async (e) => {
  state.settings = await api.setSettings({ version: e.target.value });
});

function renderLoader() {
  document.querySelectorAll('#loader-seg button').forEach((b) => b.classList.toggle('active', b.dataset.loader === state.settings.loader));
  $('opt-mods').disabled = state.settings.loader !== 'fabric';
}

document.querySelectorAll('#loader-seg button').forEach((button) => {
  button.addEventListener('click', async () => {
    state.settings = await api.setSettings({ loader: button.dataset.loader });
    renderLoader();
    loadVersions();
  });
});

/* ---------- settings ---------- */

function renderRam() {
  const ram = Number($('ram').value);
  const risky = ram > state.info.totalMemMb * 0.75;
  $('ram-value').textContent = gb(ram);
  $('ram-value').parentElement.classList.toggle('warn', risky);
  $('ram-hint').textContent = risky ? 'This is more than 75% of your memory — the system may become unstable.' : '';
  $('ram-hint').classList.toggle('warn', risky);
}

$('ram').addEventListener('input', renderRam);
$('ram').addEventListener('change', async () => {
  state.settings = await api.setSettings({ ramMb: Number($('ram').value) });
});
$('opt-jvm').addEventListener('change', async (e) => {
  state.settings = await api.setSettings({ jvmFlags: e.target.checked });
});
$('opt-mods').addEventListener('change', async (e) => {
  state.settings = await api.setSettings({ optimize: e.target.checked });
});
$('open-folder').addEventListener('click', () => api.openGameFolder());

/* ---------- startup ---------- */

(async function init() {
  state.info = await api.info();
  state.settings = await api.getSettings();

  $('app-version').textContent = `CLIENT v${state.info.version}`;
  $('ram-total').textContent = `of ${gb(state.info.totalMemMb)} detected`;
  $('ram').max = String(state.info.maxRamMb);
  $('ram').value = String(state.settings.ramMb);
  $('opt-jvm').checked = state.settings.jvmFlags;
  $('opt-mods').checked = state.settings.optimize;
  for (const flag of state.info.jvmFlags) {
    const code = document.createElement('code');
    code.textContent = flag;
    $('flags').appendChild(code);
  }

  renderRam();
  renderLoader();
  state.profile = await api.authStatus();
  renderAccount();
  await loadVersions();
})();
