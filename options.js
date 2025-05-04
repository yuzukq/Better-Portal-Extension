// options.js
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('iconSize');
  chrome.storage.sync.get('iconSize', (data) => {
    select.value = data.iconSize || "36";
  });

  select.addEventListener('change', (e) => {
    const size = e.target.value;
    chrome.storage.sync.set({ iconSize: size });
  });
});
