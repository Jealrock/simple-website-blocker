let blockedHosts = [];
let allowedPages = [];
let isOn = true;

function buildBlockedHosts(pages) {
  return [...new Set(pages.map(page => new URL(page).host))];
}

function updateBrowserActionIcon() {
  browser.browserAction.setIcon({
    path: (isOn ? "on.svg" : "off.svg")
  });
}

function onStorageGet(data) {
  if (data.allowedPages) {
    allowedPages = data.allowedPages || [];
    blockedHosts = buildBlockedHosts(allowedPages);
  }

  if (data.isOn) {
    isOn = !!data.isOn;
    updateBrowserActionIcon();
  }
}

function onStorageUpdate(data) {
  if (data.allowedPages) {
    allowedPages = data.allowedPages.newValue || [];
    blockedHosts = buildBlockedHosts(allowedPages);
  }

  if (data.isOn) {
    isOn = !!data.isOn.newValue;
    updateBrowserActionIcon();
  }
}

function onTabUpdate(tabId, changeInfo, tabInfo) {
  if (!isOn || !tabInfo.url) return;

  const url = new URL(tabInfo.url);
  if (blockedHosts.indexOf(url.hostname) == -1) return;
  if (allowedPages.indexOf(tabInfo.url) != -1) return;

  browser.tabs.update({ url: browser.runtime.getURL("main.html") })
}

function onBrowserAction() {
  browser.storage.local.set({ isOn: !isOn });
}

browser.storage.local.get(onStorageGet);
browser.storage.onChanged.addListener(onStorageUpdate);
browser.tabs.onUpdated.addListener(onTabUpdate, { properties: ["url"] });
browser.browserAction.onClicked.addListener(onBrowserAction);
