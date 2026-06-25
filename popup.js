const COMMUNITY_URL = 'https://variant.com/community';

const statusPill = document.getElementById('status-pill');
const statusLabel = document.getElementById('status-label');
const statusDetail = document.getElementById('status-detail');
const version = document.getElementById('version');

function setState(state, label, detail) {
  statusPill.dataset.state = state;
  statusLabel.textContent = label;
  statusDetail.textContent = detail;
}

function setVersion() {
  const manifest = globalThis.chrome?.runtime?.getManifest?.();
  version.textContent = manifest ? `Version v${manifest.version}` : 'Version v0.1.0';
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0] || null;
}

async function getContentStatus(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, { type: 'variant-copy:get-status' });
  } catch {
    return null;
  }
}

async function render() {
  if (!globalThis.chrome?.tabs) {
    setState('ready', 'Preview', 'Open this panel from the extension toolbar.');
    setVersion();
    return;
  }

  setVersion();

  const tab = await getActiveTab();
  const url = tab?.url || '';

  if (!url.startsWith(COMMUNITY_URL)) {
    setState('idle', 'Inactive', 'Open variant.com/community to use card copy buttons.');
    return;
  }

  const status = await getContentStatus(tab.id);
  if (!status?.active) {
    setState('warn', 'Reload needed', 'Reload the Variant community tab to activate the content script.');
    return;
  }

  const cards = status.cardCount || 0;
  const buttons = status.copyButtonCount || 0;
  setState('ready', 'Ready', `${buttons} copy buttons active across ${cards} cards.`);
}

render().catch((error) => {
  console.error('[Variant Copy] Popup failed.', error);
  setState('warn', 'Unavailable', 'Could not read the active tab status.');
  setVersion();
});
