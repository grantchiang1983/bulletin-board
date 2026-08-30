export const StockMarketWidget = {
  id: 'stock-market',
  title: 'AVGO 博通 ‧ Yahoo Finance 一日成交與走勢',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { symbol: 'AVGO', range: '1D' }) {
    const yahooUrl = 'https://finance.yahoo.com/quote/AVGO/';
    const symbol = state.symbol || 'AVGO';
    const isAvgo = symbol === 'AVGO';

    // Stock quote definition
    const stockInfo = {
      AVGO: {
        name: 'Broadcom Inc. (博通)',
        symbol: 'NASDAQ: AVGO',
        price: 298.45,
        prevClose: 293.63,
        change: 4.82,
        changePercent: 1.64,
        open: 294.10,
        high: 301.50,
        low: 292.80,
        volume: '4.85M 股',
        avgVolume: '5.20M',
        marketCap: '1.39T',
        peRatio: '68.4',
        range52w: '128.50 - 315.00',
        tvSymbol: 'NASDAQ:AVGO'
      },
      NVDA: {
        name: 'NVIDIA Corporation (輝達)',
        symbol: 'NASDAQ: NVDA',
        price: 217.55,
        prevClose: 215.10,
        change: 2.45,
        changePercent: 1.14,
        open: 215.50,
        high: 219.20,
        low: 214.80,
        volume: '58.4M 股',
        avgVolume: '62.1M',
        marketCap: '3.12T',
        peRatio: '72.1',
        range52w: '75.60 - 225.00',
        tvSymbol: 'NASDAQ:NVDA'
      },
      TSM: {
        name: 'Taiwan Semiconductor ADR (台積電 ADR)',
        symbol: 'NYSE: TSM',
        price: 312.40,
        prevClose: 308.20,
        change: 4.20,
        changePercent: 1.36,
        open: 309.50,
        high: 314.80,
        low: 308.50,
        volume: '16.8M 股',
        avgVolume: '18.5M',
        marketCap: '985B',
        peRatio: '31.5',
        range52w: '125.00 - 325.00',
        tvSymbol: 'NYSE:TSM'
      },
      TWII: {
        name: '加權指數 (TAIEX)',
        symbol: 'TWSE: ^TWII',
        price: 46331.45,
        prevClose: 45975.22,
        change: 356.23,
        changePercent: 0.77,
        open: 46070.83,
        high: 46574.52,
        low: 46070.83,
        volume: '4,120 億元',
        avgVolume: '3,890 億',
        marketCap: '78.5T',
        peRatio: '21.8',
        range52w: '21,500 - 46,600',
        tvSymbol: 'TWSE:TAIEX'
      }
    };

    const cur = stockInfo[symbol] || stockInfo.AVGO;
    const isUp = cur.change >= 0;
    const sign = isUp ? '+' : '';
    const colorClass = isUp ? 'text-rose-600' : 'text-emerald-600';
    const bgBadgeClass = isUp ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <!-- Symbol Switches -->
          <div class="flex items-center space-x-1 overflow-x-auto scrollbar-thin">
            ${['AVGO', 'NVDA', 'TSM', 'TWII'].map(sym => `
              <button class="px-2.5 py-1 text-xs font-bold rounded-md transition-all flex-shrink-0 ${sym === symbol ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'}" data-stock-target="${sym}">
                ${sym === 'AVGO' ? '★ AVGO (博通)' : sym}
              </button>
            `).join('')}
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-1.5">
            <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300 hidden sm:inline">
              1D 一日成交走勢
            </span>

            <button id="avgo-refresh-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理走勢圖">
              🔄 刷新
            </button>

            <a href="${yahooUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Yahoo Finance AVGO 原始報價與即時技術圖表 (https://finance.yahoo.com/quote/AVGO/)">
              <span>📊</span>
              <span>Yahoo Finance AVGO</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Stock Quote Summary Header -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200">
          <div>
            <div class="flex items-center space-x-2">
              <a href="${yahooUrl}" target="_blank" rel="noopener noreferrer" class="text-base font-black text-[#0d346c] hover:text-[#0284c7] flex items-center space-x-1 transition-colors" title="前往 Yahoo Finance 查看完整資料">
                <span>${cur.name}</span>
                <span class="text-xs text-sky-600 font-normal">↗</span>
              </a>
              <span class="text-xs px-1.5 py-0.5 font-mono font-bold rounded bg-slate-100 text-slate-700 border border-slate-300">${cur.symbol}</span>
            </div>
            <div class="text-[11px] text-slate-500 flex items-center space-x-2.5 mt-0.5 font-medium">
              <span>開盤: <b class="text-slate-800">${cur.open}</b></span>
              <span>最高: <b class="text-rose-600">${cur.high}</b></span>
              <span>最低: <b class="text-emerald-600">${cur.low}</b></span>
              <span>一日成交量: <b class="text-[#0d346c] font-black">${cur.volume}</b></span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-2xl font-black font-mono tracking-tight ${colorClass}">
              $${cur.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black font-mono border ${bgBadgeClass} mt-0.5 shadow-sm">
              ${sign}$${cur.change.toFixed(2)} (${sign}${cur.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <!-- Embedded Interactive 1-Day TradingView / Intraday Chart -->
        <div class="relative flex-1 w-full h-full min-h-[250px] overflow-hidden bg-slate-50">
          <iframe id="avgo-tradingview-iframe" src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_avgo&symbol=${encodeURIComponent(cur.tvSymbol)}&interval=5&hidesidetoolbar=1&symboledit=0&saveimage=0&toolbarbg=f8fafc&studies=%5B%5D&theme=light&style=1&timezone=Asia%2FTaipei&locale=zh_TW" class="w-full h-full border-0 bg-white" title="${cur.name} 1-Day Intraday Chart" loading="lazy" allowfullscreen></iframe>
        </div>

        <!-- Key Financial Metrics Bar -->
        <div class="grid grid-cols-4 gap-2 px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-center text-[11px]">
          <div>
            <span class="text-slate-500">市值 (Cap):</span>
            <span class="font-bold text-slate-800 ml-1 font-mono">${cur.marketCap}</span>
          </div>
          <div>
            <span class="text-slate-500">本益比 (P/E):</span>
            <span class="font-bold text-slate-800 ml-1 font-mono">${cur.peRatio}</span>
          </div>
          <div>
            <span class="text-slate-500">平均成交量:</span>
            <span class="font-bold text-slate-800 ml-1 font-mono">${cur.avgVolume}</span>
          </div>
          <div>
            <span class="text-slate-500">52週區間:</span>
            <span class="font-bold text-[#0d346c] ml-1 font-mono">${cur.range52w}</span>
          </div>
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：Yahoo Finance (美股即時行情)</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">Broadcom Inc. 一日走勢</span>
          </div>

          <a href="${yahooUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline flex items-center space-x-0.5">
            <span>https://finance.yahoo.com/quote/AVGO/ ↗</span>
          </a>
        </div>
      </div>
    `;

    // Symbol switch events
    container.querySelectorAll('[data-stock-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-stock-target');
        StockMarketWidget.render(container, { ...state, symbol: target });
      });
    });

    const refreshBtn = container.querySelector('#avgo-refresh-btn');
    const iframe = container.querySelector('#avgo-tradingview-iframe');
    if (refreshBtn && iframe) {
      refreshBtn.addEventListener('click', () => {
        iframe.src = iframe.src + '&t=' + Date.now();
      });
    }
  }
};
