// content.js
chrome.storage.sync.get('iconSize', (data) => {
  applyStyle(data.iconSize || "36");
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.iconSize) {
    applyStyle(changes.iconSize.newValue);
  }
});

const  applyStyle = (size) => {
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


// Manaba 時間割タイムスタンプ
const periodTimeMap = {
  '1': '9:00',
  '2': '10:00',
  '3': '11:00',
  '4': '12:00',
  '5': '13:00',
  '6': '14:00',
  '7': '15:00',
  '8': '16:00',
  '9': '17:00',
  '10': '18:00'
};

// 時間割表示ページかどうかの判定
const isManabaTimeTablePage = () => {
  const url = window.location.href;
  return url.includes('cit.manaba.jp') && 
         (url.includes('chglistformat=timetable') || url.includes('home_course'));
};


const addTimestampsToPeriods = () => {
  if (!isManabaTimeTablePage()) return;

  // 時限のセル
  const periodCells = document.querySelectorAll('td.period');

  periodCells.forEach(cell => {
    if (cell.dataset.timestampAdded) return;

    const periodNumber = cell.textContent.trim();
    const timeRange = periodTimeMap[periodNumber];

    // 時刻マップに存在する場合のみタイムスタンプを追加
    if (timeRange) {
      cell.textContent = periodNumber + '\n' + timeRange;
      cell.style.whiteSpace = 'pre-line';
    }

    cell.dataset.timestampAdded = 'true';
  });
};

if (isManabaTimeTablePage()) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addTimestampsToPeriods);
  } else {
    addTimestampsToPeriods();
  }
}
