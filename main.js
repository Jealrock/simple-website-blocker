const input = document.querySelector("#input");

function save(e) {
  e.preventDefault();
  let allowedPages = input.value.split("\n");

  try {
    allowedPages.map(page => new URL(page))
    browser.storage.local.set({ allowedPages });
  } catch (e) {
    console.error(e);
  }
}

function updateUI(store) {
  input.value = store.allowedPages ? store.allowedPages.join("\n") : "";
}

browser.storage.local.get("allowedPages").then(updateUI);
document.querySelector("form").addEventListener("submit", save);
