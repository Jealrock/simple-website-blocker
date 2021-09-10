function printInputValue(e) {
  console.log(document.querySelector("#input").value);
  e.preventDefault();
}

document.querySelector("form").addEventListener("submit", printInputValue);
