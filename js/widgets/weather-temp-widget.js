export const WeatherTempWidget = {
  id: 'weather-temp',
  title: '【新竹市東區】鄉鎮天氣預報 ‧ 交通部中央氣象署官方頁面 (TID=1001801)',
  icon: 'cloud-sun',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container) {
    const cwaHsinchuUrl = 'https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=1001801';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-sky-100 text-sky-700 text-xs font-bold">🌦️ CWA 官方</span>
            <span class="text-xs font-bold text-[#0d346c]">新竹市東區 鄉鎮預報 (TID=1001801)</span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button id="hsinchu-reload-iframe-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理中央氣象署官方預報頁面">
              🔄 重新整理
            </button>
            <a href="${cwaHsinchuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟中央氣象署【新竹市東區】官方預報頁面">
              <span>在新分頁開啟</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          </div>
        </div>

        <!-- Official CWA Embedded Live Page -->
        <div class="relative flex-1 w-full h-full min-h-[320px] overflow-hidden bg-slate-100">
          <iframe id="cwa-hsinchu-town-iframe" src="${cwaHsinchuUrl}" class="w-full h-full border-0 bg-white" title="交通部中央氣象署 新竹市東區 鄉鎮預報" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <span>資料來源：交通部中央氣象署官方網站</span>
          <a href="${cwaHsinchuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[60%]">
            https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=1001801 ↗
          </a>
        </div>
      </div>
    `;

    const reloadBtn = container.querySelector('#hsinchu-reload-iframe-btn');
    const iframe = container.querySelector('#cwa-hsinchu-town-iframe');
    if (reloadBtn && iframe) {
      reloadBtn.addEventListener('click', () => {
        iframe.src = cwaHsinchuUrl + (cwaHsinchuUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
      });
    }
  }
};
