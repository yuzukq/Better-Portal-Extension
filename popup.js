let currentLayer = 'shortcut';

// レイヤー切り替えメソッド
const switchLayer = (direction) => {
  const iconLayer = document.getElementById('icon-select-mode');
  const shortcutLayer = document.getElementById('shortcut-select-mode');
  
  if (direction === 'left') {
    if (currentLayer === 'icon') {
      iconLayer.style.display = 'none';
      shortcutLayer.style.display = 'block';
      currentLayer = 'shortcut';
    } else {
      shortcutLayer.style.display = 'none';
      iconLayer.style.display = 'block';
      currentLayer = 'icon';
    }
  } else if (direction === 'right') {
    if (currentLayer === 'shortcut') {
      shortcutLayer.style.display = 'none';
      iconLayer.style.display = 'block';
      currentLayer = 'icon';
    } else {
      iconLayer.style.display = 'none';
      shortcutLayer.style.display = 'block';
      currentLayer = 'shortcut';
    }
  }
}

// イベント駆動関連
document.addEventListener('DOMContentLoaded', () => {
  const leftButton = document.getElementById('switch-left');
  const rightButton = document.getElementById('switch-right');
  const gakunenrekiButton = document.getElementById('btn-gakunenreki');
  const gakubasuButton = document.getElementById('btn-gakubasu');
  
  leftButton.addEventListener('click', () => switchLayer('left'));
  rightButton.addEventListener('click', () => switchLayer('right'));


  let windowPosition = 'width=500,height=1000,left=200,top=200';
  gakunenrekiButton.addEventListener('click', () => window.open("https://kmsk.is.it-chiba.ac.jp/portal/whole/gakubu/gakunenreki.pdf",'newWindow' ,windowPosition));
  gakubasuButton.addEventListener('click', () => window.open("https://kmsk.is.it-chiba.ac.jp/portal/whole/gakubu/bus_schedule.pdf",'newWindow' ,windowPosition));

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
