// レイヤー切り替え関連
const layers = ['shortcut', 'icon', 'manaba'];
let currentIndex = 0;

const switchLayer = (direction) => {
  const layerElements = layers.map(id => document.getElementById(`${id}-select-mode`));
  layerElements[currentIndex].style.display = 'none';
  
  if (direction === 'left' || direction === 'right') {
    currentIndex = (currentIndex + (direction === 'right' ? 1 : layers.length - 1)) % layers.length;
  }
  layerElements[currentIndex].style.display = 'block';
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

  // manaba ダークモード トグルの初期化と保存
  const manabaToggle = document.getElementById('toggle-manaba-dark');
  if (manabaToggle) {
    chrome.storage.sync.get({ manabaDark: false }, (data) => {
      manabaToggle.checked = !!data.manabaDark;
    });
    manabaToggle.addEventListener('change', () => {
      chrome.storage.sync.set({ manabaDark: manabaToggle.checked });
    });
  }

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
