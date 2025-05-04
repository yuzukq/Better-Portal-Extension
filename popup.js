document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('iconSize', (data) => {
    const size = data.iconSize || "36";
    document.querySelectorAll('input[name="size"]').forEach((radio) => {
      if (radio.value === size) {
        radio.checked = true;
      }
    });
  });

  document.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        chrome.storage.sync.set({ iconSize: radio.value });
      }
    });
  });
});
