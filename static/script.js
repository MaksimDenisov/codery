function getMenuItems() {
  return document.querySelectorAll("#menu>a.nav-link");
}

function deactivateTabs() {
  let items = getMenuItems();
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
}

function onLoad() {
  let items = getMenuItems();
  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener("click", function (event) {
      deactivateTabs();
      items[i].classList.add("active");
      event.preventDefault()
    });
  }
}
