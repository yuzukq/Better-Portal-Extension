// content.js
chrome.storage.sync.get('iconSize', (data) => {
  applyStyle(data.iconSize || "36");
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.iconSize) {
    applyStyle(changes.iconSize.newValue);
  }
});

function applyStyle(size) {
  const existingStyle = document.getElementById("custom-close-style");
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = "custom-close-style";
  style.textContent = `
    .ui-dialog-titlebar-close .ui-icon-closethick {
      width: ${size}px !important;
      height: ${size}px !important;
      background-image: url("${chrome.runtime.getURL("images/close-icon.png")}") !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
    }

    .ui-dialog-titlebar-maximize .ui-icon-extlink {
      width: ${size}px !important;
      height: ${size}px !important;
      background-image: url("${chrome.runtime.getURL("images/expansion-icon.png")}") !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
    }

    .ui-dialog-titlebar-maximize .ui-icon-newwin {
      width: ${size}px !important;
      height: ${size}px !important;
      background-image: url("${chrome.runtime.getURL("images/minimize-icon.png")}") !important;
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center center !important;
    }
  `;
  document.head.appendChild(style);
}
