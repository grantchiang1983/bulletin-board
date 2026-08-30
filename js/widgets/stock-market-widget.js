import { StockService } from '../services/stock-service.js';

export const StockMarketWidget = {
  id: 'stock-market',
  title: '股市即時行情與專業線型圖',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { selectedSymbol: '^TWII', tab: 'indices', chartType: 'intraday' }) {
    const list = state.tab === 'indices' ? StockService.indices : StockService.stocks;
    let currentItem = [...StockService.indices, ...StockService.stocks].find(s => s.symbol === state.selectedSymbol) || StockService.indices[0];
    
    if (StockService.cache[state.selectedSymbol]) {
      const c = StockService.cache[state.selectedSymbol];
      currentItem = { ...currentItem, price: c.price, change: c.change, changePercent: c.changePercent, open: c.open, high: c.high, low: c.low, volume: c.volume };
    }

    const isUp = currentItem.change >= 0;
    const sign = isUp ? '+' : '';
    const colorClass = isUp ? 'text-rose-600' : 'text-emerald-600';
    const bgBadgeClass = isUp ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
    const isIndex = currentItem.symbol.startsWith('^') || currentItem.symbol === 'TAIEX' || currentItem.symbol === 'TWOII';
    const volLabel = isIndex ? '成交金額' : '成交量';

    let yahooUrl = 'https://tw.stock.yahoo.com/t/idx.php';
    if (currentItem.symbol === '^TWII' || currentItem.symbol === 'TAIEX') {
      yahooUrl = 'https://tw.stock.yahoo.com/t/idx.php';
    } else if (currentItem.symbol === '^TWOII' || currentItem.symbol === 'TWOII') {
      yahooUrl = 'https://tw.stock.yahoo.com/quote/%5ETWOII/technical-analysis';
    } else if (/^\d{4}$/.test(currentItem.symbol)) {
      yahooUrl = `https://tw.stock.yahoo.com/quote/${currentItem.symbol}.TW/technical-analysis`;
    } else {
      yahooUrl = `https://tw.stock.yahoo.com/quote/${currentItem.symbol}`;
    }

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-3 select-none justify-between overflow-hidden">
        <!-- Top Controls (CWA Style) -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <!-- Market Category Tabs -->
          <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button id="stock-tab-indices" class="px-2.5 py-1 text-xs font-bold rounded-md transition-all ${state.tab === 'indices' ? 'bg-[#0d346c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              主要指數
            </button>
            <button id="stock-tab-stocks" class="px-2.5 py-1 text-xs font-bold rounded-md transition-all ${state.tab === 'stocks' ? 'bg-[#0d346c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
              熱門個股
            </button>
          </div>

          <!-- Chart Mode Switcher (Intraday vs K-Line) -->
          <div class="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button id="stock-mode-intraday" class="px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${state.chartType === 'intraday' ? 'bg-white text-sky-700 shadow-sm border border-slate-300' : 'text-slate-500 hover:text-slate-800'}">
              分時走勢
            </button>
            <button id="stock-mode-kline" class="px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${state.chartType === 'kline' ? 'bg-white text-sky-700 shadow-sm border border-slate-300' : 'text-slate-500 hover:text-slate-800'}">
              日K線圖
            </button>
          </div>

          <!-- Direct Link to Yahoo Finance Index Analysis -->
          <div class="flex items-center space-x-1.5">
            <a href="https://tw.stock.yahoo.com/t/idx.php" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁直接開啟 Yahoo股市 上市指數技術分析 (https://tw.stock.yahoo.com/t/idx.php)">
              <span>📊</span>
              <span>上市指數技術分析</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            <button id="stock-refresh-api-btn" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0d346c] text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-300" title="更新即時行情">
              <span>🔄</span>
            </button>
          </div>
        </div>

        <!-- Stock Price Header Stats -->
        <div class="flex items-center justify-between my-1 px-1">
          <div>
            <div class="flex items-center space-x-2">
              <a href="${yahooUrl}" target="_blank" rel="noopener noreferrer" class="text-base font-black text-[#0d346c] hover:text-[#0284c7] flex items-center space-x-1 transition-colors" title="前往 Yahoo 股市查看完整技術分析">
                <span>${currentItem.name}</span>
                <span class="text-xs text-sky-600 font-normal">↗</span>
              </a>
              <span class="text-xs px-1.5 py-0.5 font-mono font-bold rounded bg-slate-100 text-slate-700 border border-slate-300">${currentItem.symbol}</span>
            </div>
            <div class="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5 font-medium">
              <span>開盤: <b class="text-slate-800">${currentItem.open?.toLocaleString() || currentItem.price}</b></span>
              <span>最高: <b class="text-rose-600">${currentItem.high?.toLocaleString() || currentItem.price}</b></span>
              <span>最低: <b class="text-emerald-600">${currentItem.low?.toLocaleString() || currentItem.price}</b></span>
              <span>${volLabel}: <b class="text-[#0d346c] font-black">${currentItem.volume}</b></span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-2xl font-black font-mono tracking-tight ${colorClass}">
              ${currentItem.price.toLocaleString()}
            </div>
            <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black font-mono border ${bgBadgeClass} mt-0.5 shadow-sm">
              ${sign}${currentItem.change.toFixed(2)} (${sign}${currentItem.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <!-- Main Professional Canvas Chart Container (Clean CWA White/Slate Canvas) -->
        <div class="relative flex-1 min-h-[140px] bg-slate-50 rounded-xl p-1.5 border border-slate-200 flex flex-col justify-between overflow-hidden shadow-inner">
          <canvas id="stock-chart-canvas" class="w-full h-full cursor-crosshair"></canvas>
          
          <!-- Chart Legend Overlay -->
          <div id="chart-legend-overlay" class="absolute top-1.5 left-2 text-[10px] text-slate-600 font-mono font-semibold pointer-events-none flex items-center space-x-2 bg-white/90 px-2 py-0.5 rounded-lg border border-slate-300 shadow-sm">
            ${state.chartType === 'intraday' ? `
              <span><span class="text-rose-600">●</span> 走勢線</span>
              <span><span class="text-amber-600">●</span> 均價線 (VWAP)</span>
              <span><span class="text-slate-400">┄</span> 昨收 (${(currentItem.prevClose || (currentItem.price - currentItem.change)).toLocaleString()})</span>
            ` : `
              <span><span class="text-amber-600">●</span> MA5</span>
              <span><span class="text-sky-600">●</span> MA10</span>
              <span><span class="text-indigo-600">●</span> MA20</span>
            `}
          </div>

          <!-- Interactive Tooltip Overlay -->
          <div id="chart-hover-tooltip" class="absolute top-1.5 right-2 text-[11px] font-mono font-bold text-slate-800 bg-white/95 px-2.5 py-0.5 rounded-lg border border-slate-300 pointer-events-none hidden shadow-md">
            --
          </div>
        </div>

        <!-- Stock Selector Carousel with Direct Yahoo Links -->
        <div class="flex items-center justify-between pt-1 pb-0.5">
          <div class="flex space-x-1.5 overflow-x-auto flex-1 scrollbar-thin mr-2">
            ${list.map(item => {
              const itemUp = item.change >= 0;
              const textCol = itemUp ? 'text-rose-600' : 'text-emerald-600';
              const isSelected = item.symbol === currentItem.symbol;
              return `
                <div class="flex-shrink-0 px-2.5 py-1 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-sky-50 border-[#0284c7] shadow-sm font-bold ring-1 ring-[#0284c7]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}" data-stock-symbol="${item.symbol}">
                  <div class="flex items-center justify-between text-[11px] font-bold space-x-2">
                    <span class="text-slate-800">${item.name}</span>
                    <span class="${textCol} font-mono font-black">${item.price.toLocaleString()}</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] mt-0.5">
                    <span class="text-slate-500 font-mono">${item.volume}</span>
                    <span class="${textCol} font-mono font-bold">${itemUp ? '+' : ''}${item.changePercent.toFixed(2)}%</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <a href="https://tw.stock.yahoo.com/t/idx.php" target="_blank" rel="noopener noreferrer" class="flex-shrink-0 text-sky-700 hover:text-sky-900 text-[11px] font-bold underline flex items-center space-x-0.5 bg-slate-100 border border-slate-300 px-2 py-1 rounded-lg shadow-sm" title="Yahoo 股市上市指數技術分析">
            <span>Yahoo 股市</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    `;

    // Canvas Chart Rendering
    const canvas = container.querySelector('#stock-chart-canvas');
    const tooltip = container.querySelector('#chart-hover-tooltip');

    if (canvas) {
      const ctx = canvas.getContext('2d');
      let mouseX = -1;

      const draw = () => {
        if (!canvas.parentElement) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        if (state.chartType === 'intraday') {
          drawIntraday(w, h);
        } else {
          drawKline(w, h);
        }
      };

      // Draw Deterministic Intraday Chart (Clean Light Palette)
      const drawIntraday = (w, h) => {
        const data = StockService.getIntradayHistory(currentItem.symbol);
        const prices = data.prices;
        const vwap = data.vwap;
        const volumes = data.volumes;
        const prevClose = data.prevClose;
        const unit = data.volUnit || '張';

        const priceH = h * 0.70;
        const volH = h * 0.24;
        const volTop = h * 0.76;
        const paddingLeft = 10;
        const paddingRight = 48;
        const chartW = w - paddingLeft - paddingRight;

        let maxDiff = Math.max(...prices.map(p => Math.abs(p - prevClose)), prevClose * 0.005);
        const maxPrice = prevClose + maxDiff * 1.05;
        const minPrice = prevClose - maxDiff * 1.05;
        const priceRange = maxPrice - minPrice || 1;

        const getY = (p) => priceH - ((p - minPrice) / priceRange) * (priceH - 12) - 6;
        const getX = (idx) => paddingLeft + (idx / (prices.length - 1)) * chartW;

        const gridSteps = [-maxDiff, -maxDiff * 0.5, 0, maxDiff * 0.5, maxDiff];
        gridSteps.forEach(diff => {
          const p = prevClose + diff;
          const y = getY(p);
          const pct = ((diff / prevClose) * 100).toFixed(2);
          
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(w - paddingRight, y);
          if (diff === 0) {
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([4, 4]);
          } else {
            ctx.strokeStyle = '#e2e8f0';
            ctx.setLineDash([2, 2]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = diff > 0 ? '#dc2626' : diff < 0 ? '#16a34a' : '#64748b';
          ctx.textAlign = 'left';
          ctx.fillText(`${diff > 0 ? '+' : ''}${pct}%`, w - paddingRight + 4, y + 3);
        });

        ctx.textAlign = 'left';
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#dc2626';
        ctx.fillText(maxPrice.toFixed(1), paddingLeft + 2, 10);
        ctx.fillStyle = '#475569';
        ctx.fillText(prevClose.toFixed(1), paddingLeft + 2, getY(prevClose) - 3);
        ctx.fillStyle = '#16a34a';
        ctx.fillText(minPrice.toFixed(1), paddingLeft + 2, priceH - 3);

        const isUp = currentItem.change >= 0;
        const grad = ctx.createLinearGradient(0, 0, 0, priceH);
        grad.addColorStop(0, isUp ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        prices.forEach((p, idx) => {
          const x = getX(idx);
          const y = getY(p);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.lineTo(paddingLeft + chartW, priceH);
        ctx.lineTo(paddingLeft, priceH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // VWAP Curve
        ctx.beginPath();
        vwap.forEach((v, idx) => {
          const x = getX(idx);
          const y = getY(v);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Price Line
        ctx.beginPath();
        prices.forEach((p, idx) => {
          const x = getX(idx);
          const y = getY(p);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = isUp ? '#dc2626' : '#16a34a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Volume Bars
        const maxVol = Math.max(...volumes) || 1;
        const volBarW = Math.max(2, (chartW / volumes.length) - 1.2);

        volumes.forEach((vol, idx) => {
          const x = getX(idx) - volBarW / 2;
          const barH = (vol / maxVol) * (volH - 6);
          const y = h - barH;
          const isBarUp = idx === 0 ? (prices[0] >= prevClose) : (prices[idx] >= prices[idx - 1]);

          ctx.fillStyle = isBarUp ? 'rgba(220, 38, 38, 0.75)' : 'rgba(22, 163, 74, 0.75)';
          ctx.fillRect(x, y, volBarW, barH);
        });

        const timeTicks = [
          { label: '09:00', idx: 0 },
          { label: '10:30', idx: 18 },
          { label: '12:00', idx: 36 },
          { label: '13:30', idx: 54 }
        ];
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        timeTicks.forEach(t => {
          const x = getX(t.idx);
          ctx.textAlign = t.idx === 0 ? 'left' : t.idx === 54 ? 'right' : 'center';
          ctx.fillText(t.label, x, volTop - 3);
        });

        if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
          const hoveredIdx = Math.min(prices.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (prices.length - 1))));
          const hX = getX(hoveredIdx);
          const hY = getY(prices[hoveredIdx]);

          ctx.strokeStyle = '#0284c7';
          ctx.setLineDash([2, 2]);
          ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#0284c7';
          ctx.beginPath(); ctx.arc(hX, hY, 4, 0, Math.PI * 2); ctx.fill();

          const curP = prices[hoveredIdx];
          const diffP = curP - prevClose;
          const diffPct = ((diffP / prevClose) * 100).toFixed(2);
          tooltip.classList.remove('hidden');
          tooltip.innerHTML = `🕒 ${data.timeLabels[hoveredIdx]} | <b>${curP.toFixed(2)}</b> (${diffP >= 0 ? '+' : ''}${diffPct}%) | 量: <b>${volumes[hoveredIdx]} ${unit}</b>`;
        } else {
          tooltip.classList.add('hidden');
        }
      };

      // Draw Candlestick K-Line Chart (Clean Light Palette)
      const drawKline = (w, h) => {
        const data = StockService.getDailyKLines(currentItem.symbol);
        const klines = data.klines;
        const ma5 = data.ma5;
        const ma10 = data.ma10;
        const ma20 = data.ma20;
        const unit = data.volUnit || '張';

        const priceH = h * 0.70;
        const volH = h * 0.24;
        const paddingLeft = 10;
        const paddingRight = 45;
        const chartW = w - paddingLeft - paddingRight;

        const allL = klines.map(k => k.low);
        const allH = klines.map(k => k.high);
        const minPrice = Math.min(...allL) * 0.99;
        const maxPrice = Math.max(...allH) * 1.01;
        const priceRange = maxPrice - minPrice || 1;

        const getY = (p) => priceH - ((p - minPrice) / priceRange) * (priceH - 12) - 6;
        const getX = (idx) => paddingLeft + (idx / (klines.length - 1)) * chartW;

        for (let i = 0; i <= 3; i++) {
          const y = (priceH / 3) * i;
          const p = maxPrice - (i / 3) * priceRange;
          ctx.strokeStyle = '#e2e8f0';
          ctx.beginPath(); ctx.moveTo(paddingLeft, y); ctx.lineTo(w - paddingRight, y); ctx.stroke();

          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(p.toFixed(1), w - paddingRight + 4, y + 3);
        }

        const candleW = Math.max(3, (chartW / klines.length) * 0.65);

        klines.forEach((k, idx) => {
          const x = getX(idx);
          const yOpen = getY(k.open);
          const yClose = getY(k.close);
          const yHigh = getY(k.high);
          const yLow = getY(k.low);

          const isUpCandle = k.close >= k.open;
          const color = isUpCandle ? '#dc2626' : '#16a34a';

          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, yHigh);
          ctx.lineTo(x, yLow);
          ctx.stroke();

          const topY = Math.min(yOpen, yClose);
          const bodyH = Math.max(2, Math.abs(yClose - yOpen));
          ctx.fillStyle = color;
          ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);

          const maxVol = Math.max(...klines.map(item => item.volume)) || 1;
          const vH = (k.volume / maxVol) * (volH - 6);
          ctx.fillStyle = isUpCandle ? 'rgba(220, 38, 38, 0.7)' : 'rgba(22, 163, 74, 0.7)';
          ctx.fillRect(x - candleW / 2, h - vH, candleW, vH);
        });

        const drawMALine = (maArray, color) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          let started = false;
          maArray.forEach((val, idx) => {
            if (val !== null) {
              const x = getX(idx);
              const y = getY(val);
              if (!started) { ctx.moveTo(x, y); started = true; }
              else ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
        };

        drawMALine(ma5, '#d97706');
        drawMALine(ma10, '#0284c7');
        drawMALine(ma20, '#4f46e5');

        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        const kLen = klines.length;
        [0, Math.floor(kLen * 0.33), Math.floor(kLen * 0.66), kLen - 1].forEach(idx => {
          if (klines[idx]) {
            const x = getX(idx);
            ctx.textAlign = idx === 0 ? 'left' : idx === kLen - 1 ? 'right' : 'center';
            ctx.fillText(klines[idx].date, x, priceH + 12);
          }
        });

        if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
          const hoveredIdx = Math.min(klines.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (klines.length - 1))));
          const k = klines[hoveredIdx];
          const hX = getX(hoveredIdx);
          const hY = getY(k.close);

          ctx.strokeStyle = '#0284c7';
          ctx.setLineDash([2, 2]);
          ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
          ctx.setLineDash([]);

          tooltip.classList.remove('hidden');
          tooltip.innerHTML = `📅 ${k.date} | 開:${k.open} 高:${k.high} 低:${k.low} 收:<b>${k.close}</b> | 量: <b>${k.volume} ${unit}</b>`;
        } else {
          tooltip.classList.add('hidden');
        }
      };

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        draw();
      });
      canvas.addEventListener('mouseleave', () => {
        mouseX = -1;
        draw();
      });

      setTimeout(draw, 40);
      window.addEventListener('resize', draw);
    }

    StockService.fetchLiveStockData(state.selectedSymbol).then(res => {
      if (res && canvas) {
        window.dispatchEvent(new Event('resize'));
      }
    });

    const btnIndices = container.querySelector('#stock-tab-indices');
    const btnStocks = container.querySelector('#stock-tab-stocks');
    const btnIntraday = container.querySelector('#stock-mode-intraday');
    const btnKline = container.querySelector('#stock-mode-kline');
    const btnRefresh = container.querySelector('#stock-refresh-api-btn');

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
    if (btnIntraday) {
      btnIntraday.addEventListener('click', () => {
        StockMarketWidget.render(container, { ...state, chartType: 'intraday' });
      });
    }
    if (btnKline) {
      btnKline.addEventListener('click', () => {
        StockMarketWidget.render(container, { ...state, chartType: 'kline' });
      });
    }
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        StockService.fetchLiveStockData(state.selectedSymbol).then(() => {
          StockMarketWidget.render(container, state);
        });
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
