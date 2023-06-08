// Reposition HTTP server button to the right
const rightToolbar = document.querySelector("#head .r");
if (rightToolbar) {
  const httpServerButton = document.querySelector(".cp__server-indicator");
  if (httpServerButton) {
    rightToolbar.insertAdjacentElement("afterbegin", httpServerButton);
  }
}
