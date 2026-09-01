export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】新竹市東區 ‧ 樂居實價登錄 (community_list)',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container) {
    const lejuUrl = 'https://www.leju.com.tw/community_list?city=O&area=O390&oid=L4dc10240794b2d';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居社區清單</span>
            <span class="text-xs font-black text-[#0d346c]">【惠宇雲品】新竹市東區 (oid=L4dc10240794b2d)</span>
          </div>

          <div class="flex items-center space-x-1.5">
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300 hidden sm:inline">
              162 筆交易
            </span>

            <button id="leju-reload-iframe-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理惠宇雲品社區清單資料">
              🔄 重新整理
            </button>

            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟樂居【惠宇雲品】社區清單與實價登錄頁面 (https://www.leju.com.tw/community_list?city=O&area=O390&oid=L4dc10240794b2d)">
              <span>🏡</span>
              <span>樂居【惠宇雲品】</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Community Header Info Card -->
        <div class="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-slate-200">
          <div>
            <div class="flex items-center space-x-2">
              <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-base font-black text-[#0d346c] hover:text-[#0284c7] flex items-center space-x-1 transition-colors" title="前往樂居查看完整社區清單與實價登錄">
                <span>【惠宇雲品】</span>
                <span class="text-xs text-sky-600 font-normal">↗</span>
              </a>
              <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold border border-sky-300">新竹市東區 ‧ 關埔重劃區</span>
            </div>
            <div class="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5 font-medium">
              <span>📍 新竹市東區世傑路 288 號</span>
              <span>‧</span>
              <span>屋齡 <b class="text-slate-800">11 年</b></span>
              <span>‧</span>
              <span>總戶數 <b class="text-slate-800">119 戶</b></span>
              <span>‧</span>
              <span>樓高 <b class="text-slate-800">21 樓</b></span>
              <span>‧</span>
              <span>建商 <b class="text-[#0d346c]">惠宇建設</b></span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-[11px] text-slate-500 font-medium">近一年成交均價</div>
            <div class="text-2xl font-black font-mono text-[#0d346c] tracking-tight">
              71.27 <span class="text-xs font-bold text-slate-600">萬/坪</span>
            </div>
          </div>
        </div>

        <!-- Community Metrics & Key Highlights Grid -->
        <div class="grid grid-cols-4 gap-2 px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-center text-xs">
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">一年成交均價</div>
            <div class="font-black text-[#0d346c] text-sm mt-0.5">71.27 萬/坪</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">歷史成交筆數</div>
            <div class="font-black text-emerald-700 text-sm mt-0.5">162 筆交易</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">主力格局規劃</div>
            <div class="font-black text-slate-800 text-sm mt-0.5">3 ~ 4 房 (48-65坪)</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">優質學區環境</div>
            <div class="font-black text-amber-700 text-sm mt-0.5">關埔國小 / 光武國中</div>
          </div>
        </div>

        <!-- Embedded Leju Community Iframe Viewer -->
        <div class="relative flex-1 w-full h-full min-h-[220px] overflow-hidden bg-slate-100">
          <iframe id="leju-community-iframe" src="${lejuUrl}" class="w-full h-full border-0 bg-white" title="樂居 惠宇雲品 社區清單與實價登錄" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：樂居 (LEJU.com.tw)</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">【惠宇雲品】社區清單與行情</span>
          </div>

          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://www.leju.com.tw/community_list?city=O&area=O390&oid=L4dc10240794b2d ↗
          </a>
        </div>
      </div>
    `;

    const reloadBtn = container.querySelector('#leju-reload-iframe-btn');
    const iframe = container.querySelector('#leju-community-iframe');

    if (reloadBtn && iframe) {
      reloadBtn.addEventListener('click', () => {
        iframe.src = lejuUrl + '&t=' + Date.now();
      });
    }
  }
};
