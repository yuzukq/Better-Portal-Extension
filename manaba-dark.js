// manaba-dark.js
(() => {
  const defaults = { manabaDark: false };

  const applyTheme = (dark) => {
    const el = document.body || document.documentElement;
    if (!el) return;
    el.setAttribute('theme', dark ? 'dark' : 'light');
  };

  // 初期適用
  chrome.storage.sync.get(defaults, (items) => {
    applyTheme(!!items.manabaDark);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      chrome.storage.sync.get(defaults, (items) => applyTheme(!!items.manabaDark));
    });
  }

  // 即時反映のため
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes.manabaDark) return;
    applyTheme(!!changes.manabaDark.newValue);
  });
})();
