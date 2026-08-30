export const StockMarketWidget = {
  id: 'stock-market',
  title: '美股即時行情與成交量 ‧ AVGO 博通 (Yahoo Finance / NASDAQ)',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { symbol: 'NASDAQ:AVGO' }) {
    const symbolMap = {
      'NASDAQ:AVGO': { name: '博通 Broadcom (AVGO)', yahooUrl: 'https://finance.yahoo.com/quote/AVGO/' },
      'NASDAQ:NVDA': { name: '輝達 NVIDIA (NVDA)', yahooUrl: 'https://finance.yahoo.com/quote/NVDA/' },
      'NYSE:TSM': { name: '台積電 ADR (TSM)', yahooUrl: 'https://finance.yahoo.com/quote/TSM/' },
      'TWSE:TAIEX': { name: '台股加權指數 (TAIEX)', yahooUrl: 'https://tw.stock.yahoo.com/t/idx.php' }
    };

    const currentSymbol = state.symbol || 'NASDAQ:AVGO';
    const currentInfo = symbolMap[currentSymbol] || symbolMap['NASDAQ:AVGO'];

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <!-- Symbol Switches -->
          <div class="flex items-center space-x-1 overflow-x-auto scrollbar-thin">
            ${Object.keys(symbolMap).map(sym => `
              <button class="px-2.5 py-1 text-xs font-bold rounded-md transition-all flex-shrink-0 ${sym === currentSymbol ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'}" data-stock-symbol="${sym}">
                ${sym === 'NASDAQ:AVGO' ? '★ AVGO (博通)' : sym.split(':')[1]}
              </button>
            `).join('')}
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-1.5">
            <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 hidden sm:inline flex items-center space-x-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse inline-block"></span>
              <span>交易所官方即時成交量</span>
            </span>

            <button id="stock-refresh-iframe-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理交易所走勢與成交量">
              🔄 刷新
            </button>

            <a href="${currentInfo.yahooUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Yahoo Finance 官方即時成交資訊 (${currentInfo.yahooUrl})">
              <span>📊</span>
              <span>Yahoo Finance</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Official Live Chart & Real-Time Volume Embed Container -->
        <div class="relative flex-1 w-full h-full min-h-[300px] overflow-hidden bg-white">
          <iframe id="tradingview-live-widget" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_stock&symbol=${encodeURIComponent(currentSymbol)}&interval=5&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f8fafc&studies=%5B%5D&theme=light&style=1&timezone=Asia%2FTaipei&locale=zh_TW" class="w-full h-full border-0 bg-white" title="${currentInfo.name} 即時行情與成交量" loading="lazy" allowfullscreen></iframe>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>官方行情來源：Yahoo Finance ‧ NASDAQ / NYSE 交易所</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">${currentInfo.name}</span>
          </div>

          <a href="${currentInfo.yahooUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            ${currentInfo.yahooUrl} ↗
          </a>
        </div>
      </div>
    `;

    // Switch symbols
    container.querySelectorAll('[data-stock-symbol]').forEach(btn => {
      btn.addEventListener('click', () => {
        const symbol = btn.getAttribute('data-stock-symbol');
        StockMarketWidget.render(container, { symbol });
      });
    });

    const refreshBtn = container.querySelector('#stock-refresh-iframe-btn');
    const iframe = container.querySelector('#tradingview-live-widget');
    if (refreshBtn && iframe) {
      refreshBtn.addEventListener('click', () => {
        iframe.src = iframe.src + '&t=' + Date.now();
      });
    }
  }
};
