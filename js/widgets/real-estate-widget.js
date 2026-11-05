export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】待售物件',
  icon: 'home',
  defaultWidth: 12,
  defaultHeight: 1,
  minWidth: 3,
  minHeight: 1,

  LEJU_BUY_URL: 'https://www.leju.com.tw/community/L4dc10240794b2d?mode=buy',

  render(container) {
    const lejuUrl = this.LEJU_BUY_URL;

    container.innerHTML = `
      <div class="flex items-center justify-between h-full px-3.5 py-2 bg-white text-slate-800 text-xs sm:text-sm">
        <div class="flex items-center space-x-2 truncate min-w-0">
          <span class="text-base flex-shrink-0">🏡</span>
          <span class="font-bold text-[#0d346c] flex-shrink-0">樂居【惠宇雲品】待售物件（銷售中）：</span>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:text-sky-800 font-mono underline truncate" title="點擊在樂居開啟【惠宇雲品】待售物件">
            ${lejuUrl} ↗
          </a>
        </div>
        <div class="flex items-center space-x-1.5 flex-shrink-0 ml-2">
          <button id="yunpin-copy-url-btn" class="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-300 transition-colors cursor-pointer" title="複製樂居網址">
            📋 複製
          </button>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-0.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-colors">
            開啟 ↗
          </a>
        </div>
      </div>
    `;

    const copyBtn = container.querySelector('#yunpin-copy-url-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(lejuUrl);
          copyBtn.textContent = '✓ 已複製';
          setTimeout(() => {
            copyBtn.textContent = '📋 複製';
          }, 2000);
        } catch (e) {
          copyBtn.textContent = '請手動複製';
        }
      });
    }
  }
};
