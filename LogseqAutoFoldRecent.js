// auto fold recent list in the left sidebar
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === "class" &&
      mutation.target.classList.contains("is-open")) {
      document.querySelector(".nav-content-item + .recent")
        .classList.remove("is-expand");
    }
  }
});
observer.observe(document.querySelector("#left-sidebar"), { attributes: true });
document.querySelector(".nav-content-item + .recent").classList.remove("is-expand");
