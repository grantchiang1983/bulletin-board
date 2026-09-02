export const StockMarketWidget = {
  id: 'stock-market',
  title: 'Broadcom Inc. (AVGO) ‧ Yahoo Finance 美股即時行情',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container) {
    const yahooAvgoUrl = 'https://finance.yahoo.com/quote/AVGO/';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-rose-100 text-rose-800 text-xs font-bold">📈 美股行情</span>
            <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">
              Broadcom Inc. (AVGO) ‧ NASDAQ ↗
            </a>
          </div>

          <div class="flex items-center space-x-1.5">
            <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 hidden sm:inline flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block"></span>
              <span>NASDAQ 官方即時連線</span>
            </span>

            <button id="avgo-refresh-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理 AVGO 即時走勢與成交量">
              🔄 刷新
            </button>

            <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Yahoo Finance AVGO 官方即時行情頁面 (https://finance.yahoo.com/quote/AVGO/)">
              <span>📊</span>
              <span>Yahoo Finance</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Broadcom Info & Key Metrics Header -->
        <div class="grid grid-cols-4 gap-2 px-3.5 py-2 bg-slate-50 border-b border-slate-200 text-center text-xs flex-shrink-0">
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">股票代碼 / 交易所</div>
            <div class="font-black text-[#0d346c] text-xs mt-0.5">AVGO (NASDAQ)</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">總市值 (Market Cap)</div>
            <div class="font-black text-slate-800 text-xs mt-0.5">~1.76 兆美元</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">本益比 (PE TTM)</div>
            <div class="font-black text-slate-800 text-xs mt-0.5">~61.5</div>
          </div>
          <div class="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">產業板塊</div>
            <div class="font-black text-[#0284c7] text-xs mt-0.5">AI ASIC / 網通晶片</div>
          </div>
        </div>

        <!-- Official Live Chart & Real-Time Volume Embed Container -->
        <div class="relative flex-1 w-full h-full min-h-[260px] overflow-hidden bg-white">
          <iframe id="avgo-tradingview-live-widget" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_stock&symbol=NASDAQ%3AAVGO&interval=1&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f8fafc&studies=%5B%5D&theme=light&style=1&timezone=America%2FNew_York&locale=zh_TW" class="w-full h-full border-0 bg-white" title="Broadcom Inc. (AVGO) Yahoo Finance / NASDAQ 即時行情與成交量" loading="lazy" allowfullscreen></iframe>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>官方行情來源：Yahoo Finance</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">Broadcom Inc. (AVGO)</span>
          </div>

          <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://finance.yahoo.com/quote/AVGO/ ↗
          </a>
        </div>
      </div>
    `;

    const refreshBtn = container.querySelector('#avgo-refresh-btn');
    const iframe = container.querySelector('#avgo-tradingview-live-widget');
    if (refreshBtn && iframe) {
      refreshBtn.addEventListener('click', () => {
        iframe.src = iframe.src.split('&t=')[0] + '&t=' + Date.now();
      });
    }
  }
};
