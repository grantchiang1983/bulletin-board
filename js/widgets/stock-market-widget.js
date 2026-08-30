import { StockService } from '../services/stock-service.js';

export const StockMarketWidget = {
  id: 'stock-market',
  title: '股市即時行情與大盤走勢',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { selectedSymbol: '^TWII', tab: 'indices', colorScheme: 'tw' }) {
    const list = state.tab === 'indices' ? StockService.indices : StockService.stocks;
    const currentItem = [...StockService.indices, ...StockService.stocks].find(s => s.symbol === state.selectedSymbol) || StockService.indices[0];
    const history = StockService.getIntradayHistory(currentItem.symbol);

    // Color conventions: Taiwan: Red Up, Green Down.
    const isUp = currentItem.change >= 0;
    const upColorClass = state.colorScheme === 'tw' ? 'text-red-500 bg-red-500/10 border-red-500/30' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    const downColorClass = state.colorScheme === 'tw' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' : 'text-red-500 bg-red-500/10 border-red-500/30';
    const badgeClass = isUp ? upColorClass : downColorClass;
    const sign = isUp ? '+' : '';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none">
        <!-- Header Controls -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-1.5 bg-slate-800/90 p-1 rounded-xl">
            <button id="stock-tab-indices" class="px-3 py-1 text-xs font-semibold rounded-lg transition-all ${state.tab === 'indices' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              主要指數
            </button>
            <button id="stock-tab-stocks" class="px-3 py-1 text-xs font-semibold rounded-lg transition-all ${state.tab === 'stocks' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              熱門個股
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-[10px] text-slate-400 font-mono">台股標準: <b class="text-red-400">紅漲</b> / <b class="text-emerald-400">綠跌</b></span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
              即時撮合
            </span>
          </div>
        </div>

        <!-- Main Selected Stock Info -->
        <div class="flex items-center justify-between my-3">
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-xl font-extrabold text-white">${currentItem.name}</h2>
              <span class="text-xs px-2 py-0.5 font-mono rounded bg-slate-800 text-slate-300">${currentItem.symbol}</span>
            </div>
            <p class="text-xs text-slate-400 mt-0.5">成交量：${currentItem.volume} ‧ 最高：${currentItem.high} ‧ 最低：${currentItem.low}</p>
          </div>

          <div class="text-right">
            <div class="text-2xl font-black font-mono tracking-tight ${isUp ? 'text-red-400' : 'text-emerald-400'}">
              ${currentItem.price.toLocaleString()}
            </div>
            <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${badgeClass} mt-0.5">
              ${sign}${currentItem.change} (${sign}${currentItem.changePercent}%)
            </div>
          </div>
        </div>

        <!-- Intraday Chart Canvas -->
        <div class="relative flex-1 min-h-[110px] bg-slate-950/70 rounded-xl p-2 border border-slate-800/80 mb-3">
          <canvas id="stock-chart-canvas" class="w-full h-full"></canvas>
          <div class="absolute top-2 left-3 text-[10px] text-slate-500 font-mono pointer-events-none">
            分時走勢 (09:00 - 13:30) ‧ 平盤線: ${history.basePrice.toLocaleString()}
          </div>
        </div>

        <!-- Stock Selector Carousel / Badges -->
        <div class="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          ${list.map(item => {
            const itemUp = item.change >= 0;
            const textCol = itemUp ? 'text-red-400' : 'text-emerald-400';
            const isSelected = item.symbol === currentItem.symbol;
            return `
              <div class="flex-shrink-0 p-2 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-950/60 border-blue-500/80 shadow-md' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}" data-stock-symbol="${item.symbol}">
                <div class="flex items-center justify-between text-xs font-semibold space-x-3">
                  <span class="text-slate-200">${item.name}</span>
                  <span class="${textCol} font-mono">${item.price.toLocaleString()}</span>
                </div>
                <div class="text-[10px] ${textCol} font-mono mt-0.5 text-right">
                  ${itemUp ? '+' : ''}${item.changePercent}%
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Render Intraday Chart with Canvas
    const canvas = container.querySelector('#stock-chart-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const resize = () => {
        if (!canvas.parentElement) return;
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        drawChart();
      };

      const drawChart = () => {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const prices = history.prices;
        const min = Math.min(...prices, history.basePrice * 0.995);
        const max = Math.max(...prices, history.basePrice * 1.005);
        const range = max - min || 1;

        // Draw baseline (flat price)
        const baseY = h - ((history.basePrice - min) / range) * (h - 20) - 10;
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.lineTo(w, baseY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw price curve
        const strokeColor = isUp ? '#f87171' : '#34d399';
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, isUp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        prices.forEach((p, idx) => {
          const x = (idx / (prices.length - 1)) * w;
          const y = h - ((p - min) / range) * (h - 20) - 10;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        // Fill area
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Stroke line
        ctx.beginPath();
        prices.forEach((p, idx) => {
          const x = (idx / (prices.length - 1)) * w;
          const y = h - ((p - min) / range) * (h - 20) - 10;
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      setTimeout(resize, 50);
      window.addEventListener('resize', resize);
    }

    // Event handlers
    const btnIndices = container.querySelector('#stock-tab-indices');
    const btnStocks = container.querySelector('#stock-tab-stocks');

    if (btnIndices) {
      btnIndices.addEventListener('click', () => {
        StockMarketWidget.render(container, { ...state, tab: 'indices', selectedSymbol: StockService.indices[0].symbol });
      });
    }
    if (btnStocks) {
      btnStocks.addEventListener('click', () => {
        StockMarketWidget.render(container, { ...state, tab: 'stocks', selectedSymbol: StockService.stocks[0].symbol });
      });
    }

    container.querySelectorAll('[data-stock-symbol]').forEach(el => {
      el.addEventListener('click', () => {
        const symbol = el.getAttribute('data-stock-symbol');
        StockMarketWidget.render(container, { ...state, selectedSymbol: symbol });
      });
    });
  }
};
