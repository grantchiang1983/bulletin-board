export const StockMarketWidget = {
  id: 'stock-market',
  title: 'Broadcom Inc. (AVGO) ‧ Yahoo Finance 走勢 (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, All)',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { range: '1D' }) {
    const yahooAvgoUrl = 'https://finance.yahoo.com/quote/AVGO/';
    const currentRange = state.range || '1D';

    const ranges = [
      { id: '1D', name: '1D', interval: '1', desc: '1日即時走勢' },
      { id: '5D', name: '5D', interval: '5', desc: '5日走勢' },
      { id: '1M', name: '1M', interval: '30', desc: '1個月走勢' },
      { id: '6M', name: '6M', interval: 'D', desc: '6個月走勢' },
      { id: 'YTD', name: 'YTD', interval: 'D', desc: '今年以來 (YTD)' },
      { id: '1Y', name: '1Y', interval: 'D', desc: '1年走勢' },
      { id: '5Y', name: '5Y', interval: 'W', desc: '5年長期走勢' },
      { id: 'All', name: 'All', interval: 'M', desc: '全部歷史走勢' }
    ];

    const activeConfig = ranges.find(r => r.id === currentRange) || ranges[0];
    const embedChartUrl = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_avgo_${currentRange}&symbol=NASDAQ%3AAVGO&interval=${activeConfig.interval}&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f8fafc&studies=%5B%5D&theme=light&style=1&timezone=America%2FNew_York&withdateranges=1&range=${currentRange === 'All' ? 'ALL' : currentRange}&locale=zh_TW`;

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar & Yahoo Stock Header -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-rose-100 text-rose-800 text-xs font-bold">📈 Yahoo 股市</span>
            <div>
              <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">
                Broadcom Inc. (AVGO)
              </a>
              <span class="text-[10px] text-slate-500 font-medium ml-1 hidden sm:inline">NasdaqGS ‧ Real Time Price</span>
            </div>
          </div>

          <div class="flex items-center space-x-1.5">
            <button id="avgo-refresh-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理 AVGO 即時行情圖表">
              🔄 刷新
            </button>

            <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Yahoo Finance AVGO 官方即時行情 (https://finance.yahoo.com/quote/AVGO/)">
              <span>📊</span>
              <span>Yahoo Finance</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Yahoo Finance Range Selector Bar (1D, 5D, 1M, 6M, YTD, 1Y, 5Y, All) -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-[#0d346c] text-white border-b border-slate-200 z-10 overflow-x-auto scrollbar-thin">
          <div class="flex items-center space-x-1">
            <span class="text-[11px] font-bold text-sky-200 mr-1.5 flex-shrink-0">週期切換:</span>
            ${ranges.map(r => `
              <button class="px-2.5 py-0.5 text-xs font-bold rounded-md transition-all flex-shrink-0 ${r.id === currentRange ? 'bg-white text-[#0d346c] shadow font-black scale-105' : 'text-slate-200 hover:text-white hover:bg-white/15'}" data-avgo-range="${r.id}" title="${r.desc}">
                ${r.name}
              </button>
            `).join('')}
          </div>

          <div class="text-[11px] text-sky-200 font-mono hidden md:inline font-bold">
            ${activeConfig.desc}
          </div>
        </div>

        <!-- Official Live Chart & Real-Time Volume Embed Container -->
        <div class="relative flex-1 w-full h-full min-h-[260px] overflow-hidden bg-white">
          <iframe id="avgo-tradingview-live-widget" src="${embedChartUrl}" class="w-full h-full border-0 bg-white" title="Broadcom Inc. (AVGO) Yahoo Finance ${currentRange} 即時走勢與成交量" loading="lazy" allowfullscreen></iframe>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>官方行情來源：Yahoo Finance ‧ NASDAQ</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">Broadcom Inc. (AVGO) [${currentRange}]</span>
          </div>

          <a href="${yahooAvgoUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://finance.yahoo.com/quote/AVGO/ ↗
          </a>
        </div>
      </div>
    `;

    // Bind range tab buttons
    container.querySelectorAll('[data-avgo-range]').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedRange = btn.getAttribute('data-avgo-range');
        StockMarketWidget.render(container, { range: selectedRange });
      });
    });

    const refreshBtn = container.querySelector('#avgo-refresh-btn');
    const iframe = container.querySelector('#avgo-tradingview-live-widget');
    if (refreshBtn && iframe) {
      refreshBtn.addEventListener('click', () => {
        iframe.src = embedChartUrl + '&t=' + Date.now();
      });
    }
  }
};
