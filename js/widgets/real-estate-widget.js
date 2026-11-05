export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】待售物件 ‧ 樂居官方頁面',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 3,

  LEJU_BUY_URL: 'https://www.leju.com.tw/community/L4dc10240794b2d?mode=buy',

  render(container) {
    const lejuUrl = this.LEJU_BUY_URL;

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居官方</span>
            <span class="text-xs font-bold text-[#0d346c]">【惠宇雲品】待售物件（銷售中）</span>
          </div>
          <div class="flex items-center space-x-1.5">
            <button id="yunpin-copy-url-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-xs cursor-pointer" title="複製樂居網址">
              📋 複製網址
            </button>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all" title="在新分頁開啟樂居【惠宇雲品】待售物件頁面">
              <span>開啟樂居頁面 ↗</span>
            </a>
          </div>
        </div>

        <!-- Main Card Body -->
        <div class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-sky-50/40 via-white to-slate-50/50">
          <div class="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-800 flex items-center justify-center text-3xl shadow-xs border border-amber-200">
            🏡
          </div>

          <div class="space-y-1.5 max-w-md">
            <h3 class="text-base font-extrabold text-[#0d346c]">
              【惠宇雲品】待售物件 ‧ 樂居實價登錄
            </h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              點擊下方連結直達樂居官方頁面，即時查看最新「銷售中」刊登物件與開價資訊：
            </p>
          </div>

          <!-- URL Box -->
          <div class="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5">
            <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>樂居官方網址</span>
              <span class="text-emerald-600 font-medium">● 官方即時資料</span>
            </div>
            <div class="flex items-center bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-[#0d346c] select-all break-all text-left">
              ${lejuUrl}
            </div>
            <div class="flex items-center justify-center pt-0.5">
              <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="w-full py-2 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all">
                <span>前往查看【惠宇雲品】銷售中待售物件</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <span>新竹市東區世傑路288號 ‧ 樂居 LEJU</span>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline">
            ${lejuUrl} ↗
          </a>
        </div>
      </div>
    `;

    const copyBtn = container.querySelector('#yunpin-copy-url-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(lejuUrl);
          copyBtn.textContent = '✓ 已複製！';
          setTimeout(() => {
            copyBtn.textContent = '📋 複製網址';
          }, 2000);
        } catch (e) {
          copyBtn.textContent = '請手動複製';
        }
      });
    }
  }
};
