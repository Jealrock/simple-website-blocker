let blockedHosts = [];
let allowedPages = [];

function buildBlockedHosts(pages) {
  return [...new Set(pages.map(page => new URL(page).host))];
}

function onStorageGet(data) {
  if (!data.allowedPages) return;

  allowedPages = data.allowedPages;
  blockedHosts = buildBlockedHosts(allowedPages);
}

function onStorageUpdate(data) {
  if (!data.allowedPages) return;

  allowedPages = data.allowedPages.newValue;
  blockedHosts = buildBlockedHosts(allowedPages);
}

function onTabUpdate(tabId, changeInfo, tabInfo) {
  if (!tabInfo.url) return;

  const url = new URL(tabInfo.url);
  if (blockedHosts.indexOf(url.hostname) == -1) return;
  if (allowedPages.indexOf(tabInfo.url) != -1) return;

  browser.tabs.update({ url: browser.runtime.getURL("main.html") })
}

browser.storage.local.get(onStorageGet);
browser.storage.onChanged.addListener(onStorageUpdate);
browser.tabs.onUpdated.addListener(onTabUpdate, { properties: ["url"] });
