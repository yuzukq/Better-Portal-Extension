// Manaba 時間割タイムスタンプ機能
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
