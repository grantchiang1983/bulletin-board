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
    const currentItem = [...StockService.indices, ...StockService.stocks].find(s => s.symbol === state.selectedSymbol) || StockService.indices[0];
    
    const isUp = currentItem.change >= 0;
    const sign = isUp ? '+' : '';
    const colorClass = isUp ? 'text-red-400' : 'text-emerald-400';
    const bgBadgeClass = isUp ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none justify-between overflow-hidden">
        <!-- Top Controls -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <!-- Market Category Tabs -->
          <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg">
            <button id="stock-tab-indices" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'indices' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              主要指數
            </button>
            <button id="stock-tab-stocks" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'stocks' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
              熱門個股
            </button>
          </div>

          <!-- Chart Mode Switcher (Intraday vs K-Line) -->
          <div class="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            <button id="stock-mode-intraday" class="px-2 py-0.5 text-[11px] font-medium rounded transition-all ${state.chartType === 'intraday' ? 'bg-blue-500/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'}">
              分時走勢
            </button>
            <button id="stock-mode-kline" class="px-2 py-0.5 text-[11px] font-medium rounded transition-all ${state.chartType === 'kline' ? 'bg-blue-500/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'}">
              日K線圖
            </button>
          </div>

          <!-- Live Indicator -->
          <div class="flex items-center space-x-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 live-pulse"></span>
              撮合中
            </span>
          </div>
        </div>

        <!-- Stock Price Header Stats -->
        <div class="flex items-center justify-between my-1.5 px-1">
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-base font-black text-white">${currentItem.name}</h2>
              <span class="text-xs px-1.5 py-0.2 font-mono rounded bg-slate-800 text-slate-300">${currentItem.symbol}</span>
            </div>
            <div class="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
              <span>開: <b class="text-slate-200">${currentItem.open?.toLocaleString() || currentItem.price}</b></span>
              <span>高: <b class="text-red-400">${currentItem.high?.toLocaleString() || currentItem.price}</b></span>
              <span>低: <b class="text-emerald-400">${currentItem.low?.toLocaleString() || currentItem.price}</b></span>
              <span>量: <b class="text-slate-200">${currentItem.volume}</b></span>
            </div>
          </div>

          <div class="text-right">
            <div class="text-xl font-black font-mono tracking-tight ${colorClass}">
              ${currentItem.price.toLocaleString()}
            </div>
            <div class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold font-mono border ${bgBadgeClass} mt-0.5">
              ${sign}${currentItem.change.toFixed(2)} (${sign}${currentItem.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <!-- Main Professional Canvas Chart Container -->
        <div class="relative flex-1 min-h-[140px] bg-slate-950/90 rounded-xl p-1.5 border border-slate-800/90 flex flex-col justify-between overflow-hidden">
          <canvas id="stock-chart-canvas" class="w-full h-full cursor-crosshair"></canvas>
          
          <!-- Chart Legend Overlay -->
          <div id="chart-legend-overlay" class="absolute top-1.5 left-2 text-[9px] text-slate-400 font-mono pointer-events-none flex items-center space-x-2 bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur">
            ${state.chartType === 'intraday' ? `
              <span><span class="text-blue-400">●</span> 即時走勢</span>
              <span><span class="text-yellow-400">●</span> 均價線</span>
              <span><span class="text-slate-500">┄</span> 昨收平盤 (${(currentItem.prevClose || (currentItem.price - currentItem.change)).toLocaleString()})</span>
            ` : `
              <span><span class="text-yellow-400">●</span> MA5</span>
              <span><span class="text-cyan-400">●</span> MA10</span>
              <span><span class="text-purple-400">●</span> MA20</span>
            `}
          </div>

          <!-- Interactive Tooltip Overlay -->
          <div id="chart-hover-tooltip" class="absolute top-1.5 right-2 text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 pointer-events-none hidden">
            --
          </div>
        </div>

        <!-- Stock Selector Carousel -->
        <div class="flex space-x-1.5 overflow-x-auto pt-1.5 pb-0.5 scrollbar-thin">
          ${list.map(item => {
            const itemUp = item.change >= 0;
            const textCol = itemUp ? 'text-red-400' : 'text-emerald-400';
            const isSelected = item.symbol === currentItem.symbol;
            return `
              <div class="flex-shrink-0 px-2 py-1 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-950/70 border-blue-500 shadow-sm' : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800'}" data-stock-symbol="${item.symbol}">
                <div class="flex items-center justify-between text-[11px] font-semibold space-x-2">
                  <span class="text-slate-200">${item.name}</span>
                  <span class="${textCol} font-mono">${item.price.toLocaleString()}</span>
                </div>
                <div class="text-[9px] ${textCol} font-mono text-right mt-0.5">
                  ${itemUp ? '+' : ''}${item.changePercent.toFixed(2)}%
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Render Canvas with High DPI & Professional Taiwan Layout
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

      // Draw Professional Taiwan Intraday Chart (走勢圖 + 均價線 + 成交量)
      const drawIntraday = (w, h) => {
        const data = StockService.getIntradayHistory(currentItem.symbol);
        const prices = data.prices;
        const vwap = data.vwap;
        const volumes = data.volumes;
        const prevClose = data.prevClose;

        // Split height: Price Chart (72%), Volume Chart (28%)
        const priceH = h * 0.70;
        const volH = h * 0.24;
        const volTop = h * 0.76;
        const paddingLeft = 10;
        const paddingRight = 48; // For Y-axis price/percent labels
        const chartW = w - paddingLeft - paddingRight;

        // Symmetrical price scale centered on prevClose
        let maxDiff = Math.max(...prices.map(p => Math.abs(p - prevClose)), prevClose * 0.008);
        const maxPrice = prevClose + maxDiff * 1.05;
        const minPrice = prevClose - maxDiff * 1.05;
        const priceRange = maxPrice - minPrice || 1;

        const getY = (p) => priceH - ((p - minPrice) / priceRange) * (priceH - 12) - 6;
        const getX = (idx) => paddingLeft + (idx / (prices.length - 1)) * chartW;

        // Draw horizontal grid lines & Y-axis labels
        const gridSteps = [-maxDiff, -maxDiff * 0.5, 0, maxDiff * 0.5, maxDiff];
        gridSteps.forEach(diff => {
          const p = prevClose + diff;
          const y = getY(p);
          const pct = ((diff / prevClose) * 100).toFixed(2);
          
          ctx.beginPath();
          ctx.moveTo(paddingLeft, y);
          ctx.lineTo(w - paddingRight, y);
          if (diff === 0) {
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
            ctx.setLineDash([4, 4]); // Flat baseline dotted
          } else {
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
            ctx.setLineDash([2, 2]);
          }
          ctx.stroke();
          ctx.setLineDash([]);

          // Right Y-axis text labels
          ctx.font = '9px monospace';
          ctx.fillStyle = diff > 0 ? '#f87171' : diff < 0 ? '#34d399' : '#94a3b8';
          ctx.textAlign = 'left';
          ctx.fillText(`${diff > 0 ? '+' : ''}${pct}%`, w - paddingRight + 4, y + 3);
        });

        // Left Y-axis Price Labels (High, Prev, Low)
        ctx.textAlign = 'left';
        ctx.fillStyle = '#f87171';
        ctx.fillText(maxPrice.toFixed(1), paddingLeft + 2, 10);
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(prevClose.toFixed(1), paddingLeft + 2, getY(prevClose) - 3);
        ctx.fillStyle = '#34d399';
        ctx.fillText(minPrice.toFixed(1), paddingLeft + 2, priceH - 3);

        // Draw Intraday Gradient Fill
        const isUp = currentItem.change >= 0;
        const grad = ctx.createLinearGradient(0, 0, 0, priceH);
        grad.addColorStop(0, isUp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

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

        // Draw VWAP (均價線 - Yellow Line)
        ctx.beginPath();
        vwap.forEach((v, idx) => {
          const x = getX(idx);
          const y = getY(v);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Draw Main Price Line (Red / Green)
        ctx.beginPath();
        prices.forEach((p, idx) => {
          const x = getX(idx);
          const y = getY(p);
          if (idx === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = isUp ? '#f87171' : '#34d399';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Volume Sub-chart (成交量柱狀圖)
        const maxVol = Math.max(...volumes) || 1;
        const volBarW = Math.max(2, (chartW / volumes.length) - 1.5);

        volumes.forEach((vol, idx) => {
          const x = getX(idx) - volBarW / 2;
          const barH = (vol / maxVol) * (volH - 6);
          const y = h - barH;
          const isBarUp = idx === 0 ? isUp : prices[idx] >= prices[idx - 1];

          ctx.fillStyle = isBarUp ? 'rgba(239, 68, 68, 0.65)' : 'rgba(34, 197, 94, 0.65)';
          ctx.fillRect(x, y, volBarW, barH);
        });

        // Time X-Axis Ticks (09:00, 10:00, 11:00, 12:00, 13:00, 13:30)
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

        // Draw Interactive Hover Crosshair
        if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
          const hoveredIdx = Math.min(prices.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (prices.length - 1))));
          const hX = getX(hoveredIdx);
          const hY = getY(prices[hoveredIdx]);

          // Vertical crosshair
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.setLineDash([2, 2]);
          ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
          // Horizontal crosshair
          ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
          ctx.setLineDash([]);

          // Hover Dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath(); ctx.arc(hX, hY, 3.5, 0, Math.PI * 2); ctx.fill();

          // Tooltip update
          const curP = prices[hoveredIdx];
          const diffP = curP - prevClose;
          const diffPct = ((diffP / prevClose) * 100).toFixed(2);
          tooltip.classList.remove('hidden');
          tooltip.innerHTML = `🕒 ${data.timeLabels[hoveredIdx]} | <b>${curP.toFixed(2)}</b> (${diffP >= 0 ? '+' : ''}${diffPct}%) | 量: ${volumes[hoveredIdx]}`;
        } else {
          tooltip.classList.add('hidden');
        }
      };

      // Draw Professional Taiwan Candlestick K-Line Chart (日K棒 + MA5/10/20 + 成交量)
      const drawKline = (w, h) => {
        const data = StockService.getDailyKLines(currentItem.symbol);
        const klines = data.klines;
        const ma5 = data.ma5;
        const ma10 = data.ma10;
        const ma20 = data.ma20;

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

        // Grid lines
        for (let i = 0; i <= 3; i++) {
          const y = (priceH / 3) * i;
          const p = maxPrice - (i / 3) * priceRange;
          ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
          ctx.beginPath(); ctx.moveTo(paddingLeft, y); ctx.lineTo(w - paddingRight, y); ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px monospace';
          ctx.textAlign = 'left';
          ctx.fillText(p.toFixed(1), w - paddingRight + 4, y + 3);
        }

        const candleW = Math.max(3, (chartW / klines.length) * 0.65);

        // Draw Candlesticks
        klines.forEach((k, idx) => {
          const x = getX(idx);
          const yOpen = getY(k.open);
          const yClose = getY(k.close);
          const yHigh = getY(k.high);
          const yLow = getY(k.low);

          const isUpCandle = k.close >= k.open;
          const color = isUpCandle ? '#ef4444' : '#22c55e';

          // Wick (影線)
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, yHigh);
          ctx.lineTo(x, yLow);
          ctx.stroke();

          // Body (K棒實體)
          const topY = Math.min(yOpen, yClose);
          const bodyH = Math.max(2, Math.abs(yClose - yOpen));
          ctx.fillStyle = color;
          ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);

          // Volume Bar
          const maxVol = Math.max(...klines.map(item => item.volume)) || 1;
          const vH = (k.volume / maxVol) * (volH - 6);
          ctx.fillStyle = isUpCandle ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)';
          ctx.fillRect(x - candleW / 2, h - vH, candleW, vH);
        });

        // Draw MA Lines (MA5: Yellow, MA10: Cyan, MA20: Purple)
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

        drawMALine(ma5, '#eab308');
        drawMALine(ma10, '#06b6d4');
        drawMALine(ma20, '#a855f7');

        // Date X-axis labels
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        [0, 10, 20, 29].forEach(idx => {
          if (klines[idx]) {
            const x = getX(idx);
            ctx.textAlign = idx === 0 ? 'left' : idx === 29 ? 'right' : 'center';
            ctx.fillText(klines[idx].date, x, priceH + 12);
          }
        });

        // Tooltip Crosshair
        if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
          const hoveredIdx = Math.min(klines.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (klines.length - 1))));
          const k = klines[hoveredIdx];
          const hX = getX(hoveredIdx);
          const hY = getY(k.close);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.setLineDash([2, 2]);
          ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
          ctx.setLineDash([]);

          tooltip.classList.remove('hidden');
          tooltip.innerHTML = `📅 ${k.date} | 開:${k.open} 高:${k.high} 低:${k.low} 收:<b>${k.close}</b>`;
        } else {
          tooltip.classList.add('hidden');
        }
      };

      // Mouse interactive crosshair
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

    // Event Handlers
    const btnIndices = container.querySelector('#stock-tab-indices');
    const btnStocks = container.querySelector('#stock-tab-stocks');
    const btnIntraday = container.querySelector('#stock-mode-intraday');
    const btnKline = container.querySelector('#stock-mode-kline');

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

    container.querySelectorAll('[data-stock-symbol]').forEach(el => {
      el.addEventListener('click', () => {
        const symbol = el.getAttribute('data-stock-symbol');
        StockMarketWidget.render(container, { ...state, selectedSymbol: symbol });
      });
    });
  }
};
