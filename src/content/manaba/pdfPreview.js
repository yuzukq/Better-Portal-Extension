// Manaba PDF プレビュー機能

(() => {
  'use strict';

  const blobUrlCache = new Map();

  const fetchPdfAsBlob = async (pdfUrl) => {
    // キャッシュをチェック
    if (blobUrlCache.has(pdfUrl)) {
      return blobUrlCache.get(pdfUrl);
    }

    const response = await fetch(pdfUrl, {
      credentials: 'include' // Cookieを送信してログイン状態を維持
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    blobUrlCache.set(pdfUrl, blobUrl);
    
    return blobUrl;
  };

  // PDFプレビューモーダルを表示
  const showPdfPreview = async (pdfUrl, fileName) => {
   
    const existingModal = document.querySelector('.bpe-pdf-modal-overlay');
    if (existingModal) {
      existingModal.remove();
    }

    const overlay = document.createElement('div');
    overlay.className = 'bpe-pdf-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'bpe-pdf-modal';

    const header = document.createElement('div');
    header.className = 'bpe-pdf-modal-header';

    const title = document.createElement('h3');
    title.className = 'bpe-pdf-modal-title';
    title.textContent = fileName || 'PDF プレビュー';

    const actions = document.createElement('div');
    actions.className = 'bpe-pdf-modal-actions';

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'bpe-pdf-modal-btn';
    downloadBtn.innerHTML = '⬇ダウンロード';
    downloadBtn.onclick = (e) => {
      e.stopPropagation();
      // ダウンロード用のリンクを作成
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = fileName || 'document.pdf';
      a.click();
    };

    const newTabBtn = document.createElement('button');
    newTabBtn.className = 'bpe-pdf-modal-btn';
    newTabBtn.innerHTML = '新しいタブで開く';
    newTabBtn.onclick = async (e) => {
      e.stopPropagation();
      try {
        const blobUrl = await fetchPdfAsBlob(pdfUrl);
        window.open(blobUrl, '_blank');
      } catch (error) {
        // 元のURLで開く
        window.open(pdfUrl, '_blank');
      }
    };

    const closeBtn = document.createElement('button');
    closeBtn.className = 'bpe-pdf-modal-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => overlay.remove();

    actions.appendChild(downloadBtn);
    actions.appendChild(newTabBtn);
    actions.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(actions);

    const loading = document.createElement('div');
    loading.className = 'bpe-pdf-loading';
    loading.innerHTML = `
      <div class="bpe-pdf-spinner"></div>
      <span>PDFを読み込み中...</span>
    `;

    const viewerContainer = document.createElement('div');
    viewerContainer.style.cssText = 'flex: 1; width: 100%; position: relative; background: #525659;';

    viewerContainer.appendChild(loading);

    modal.appendChild(header);
    modal.appendChild(viewerContainer);
    overlay.appendChild(modal);

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    document.body.appendChild(overlay);

    // PDFをfetchしてBlobURL表示
    try {
      const blobUrl = await fetchPdfAsBlob(pdfUrl);
      
      // embed要素でPDFを表示
      const viewer = document.createElement('embed');
      viewer.className = 'bpe-pdf-viewer';
      viewer.src = blobUrl;
      viewer.type = 'application/pdf';
      viewer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';

      loading.style.display = 'none';
      viewerContainer.appendChild(viewer);
    } catch (error) {
      console.error('PDF読み込みエラー:', error);
      loading.innerHTML = `
        <div class="bpe-pdf-error">
          <div class="bpe-pdf-error-icon">⚠️</div>
          <div class="bpe-pdf-error-message">PDFの読み込みに失敗しました</div>
        </div>
      `;
      
      // エラーハンドリング
      const errorBtn = document.createElement('button');
      errorBtn.className = 'bpe-pdf-modal-btn';
      errorBtn.style.cssText = 'margin-top: 15px; background: #4a90d9; color: white;';
      errorBtn.textContent = 'ダウンロードして開く';
      errorBtn.onclick = () => window.open(pdfUrl, '_blank');
      loading.querySelector('.bpe-pdf-error').appendChild(errorBtn);
    }
  };

  // PDFリンクを探索してプレビューボタンを表示
  const addPreviewButtons = () => {
    
    const pdfContainers = document.querySelectorAll('.inlineattachment.cst-pdf');

    pdfContainers.forEach(container => {

      if (container.dataset.bpePreviewAdded) return;

      const descriptionDiv = container.querySelector('.inlineaf-description');
      const pdfLink = descriptionDiv?.querySelector('a[href*=".pdf"]');

      if (!pdfLink) return;

      const pdfUrl = pdfLink.href;
      
      // ファイル名の取得
      const linkText = pdfLink.textContent.trim();
      const fileNameMatch = linkText.match(/([^\n]+\.pdf)/i);
      const fileName = fileNameMatch ? fileNameMatch[1] : 'PDF';

      const previewBtn = document.createElement('button');
      previewBtn.className = 'bpe-pdf-preview-btn';
      previewBtn.textContent = 'プレビュー';
      previewBtn.title = 'ブラウザ内でPDFをプレビュー表示';

      previewBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showPdfPreview(pdfUrl, fileName);
      };

      descriptionDiv.appendChild(previewBtn);

      container.dataset.bpePreviewAdded = 'true';
    });
  };

  // 初期化
  const init = () => {
    addPreviewButtons();

    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });
      if (shouldUpdate) {
        addPreviewButtons();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // ページ読み込み完了後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
