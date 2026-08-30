import { WeatherService } from '../services/weather-service.js';

export const WeatherRadarWidget = {
  id: 'weather-radar',
  title: '中央氣象署即時雷達回波與雲圖',
  icon: 'radar',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { activeLayer: 'cwa_radar_standard', zoom: 1, isPlaying: true }) {
    const layers = WeatherService.getRadarLayers();
    const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];
    const isLiveImage = currentLayer.type === 'live_image';
    const nowTimeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none overflow-hidden relative justify-between">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-800">
          <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg overflow-x-auto max-w-[70%] scrollbar-thin">
            ${layers.map(l => `
              <button class="px-2 py-0.5 text-xs font-medium rounded-md transition-all flex-shrink-0 ${l.id === currentLayer.id ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'}" data-layer="${l.id}">
                ${l.name.replace('中央氣象署', '').replace('向日葵', '')}
              </button>
            `).join('')}
          </div>
          
          <div class="flex items-center space-x-1.5">
            <button id="radar-refresh-btn" class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors" title="立即自中央氣象署抓取最新雷達雲圖">
              🔄 刷新
            </button>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
              CWA 官方即時連線
            </span>
          </div>
        </div>

        <!-- Main Display Container (Direct Image or Canvas) -->
        <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[140px] group">
          ${isLiveImage ? `
            <!-- Direct CWA Official Satellite / Radar Image -->
            <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
              <img id="cwa-live-radar-img" src="${currentLayer.url}" alt="${currentLayer.name}" class="w-full h-full object-contain transition-transform duration-300 transform scale-100 hover:scale-105 cursor-zoom-in" title="點擊在新分頁開啟高解析度原圖">
              
              <!-- CWA Official Watermark Badge -->
              <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none">
                <span class="text-cyan-400 font-bold">📡 中央氣象署 (CWA)</span>
                <span class="text-slate-400">‧ ${currentLayer.unit}</span>
              </div>

              <!-- Timestamp & Zoom Button -->
              <div class="absolute top-2 right-2 flex items-center space-x-1">
                <div class="bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                  🕒 ${nowTimeStr} 抓取
                </div>
                ${currentLayer.hdUrl ? `
                  <a href="${currentLayer.hdUrl}" target="_blank" class="bg-blue-600/80 hover:bg-blue-600 px-1.5 py-0.5 rounded text-[10px] text-white transition-colors" title="開啟 3600x3600 超高解析度大圖">
                    🔍 3600HD
                  </a>
                ` : ''}
              </div>
            </div>
          ` : `
            <!-- Dynamic 60fps Canvas Simulator -->
            <canvas id="radar-canvas" class="w-full h-full object-cover"></canvas>
            
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="w-64 h-64 border border-emerald-500/20 rounded-full"></div>
              <div class="w-44 h-44 border border-emerald-500/25 rounded-full"></div>
              <div class="w-20 h-20 border border-emerald-500/30 rounded-full"></div>
              <div class="absolute w-full h-[1px] bg-emerald-500/20"></div>
              <div class="absolute h-full w-[1px] bg-emerald-500/20"></div>
            </div>

            <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none">
              <span class="text-slate-400">回波強度:</span>
              <div class="flex h-2 w-20 rounded overflow-hidden">
                <span class="flex-1 bg-cyan-400"></span>
                <span class="flex-1 bg-blue-500"></span>
                <span class="flex-1 bg-green-500"></span>
                <span class="flex-1 bg-yellow-400"></span>
                <span class="flex-1 bg-orange-500"></span>
                <span class="flex-1 bg-red-600"></span>
              </div>
              <span class="text-slate-300 font-mono text-[9px]">dBZ</span>
            </div>
          `}
        </div>

        <!-- Footer Info & Controls -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center space-x-2">
            <span class="text-slate-300 text-[11px] font-medium">${currentLayer.name}</span>
            <span class="text-slate-500 text-[10px]">每 10 分鐘自動同步中央氣象署最新觀測</span>
          </div>

          <div class="flex items-center space-x-1.5 text-slate-400">
            <span class="text-[10px] text-cyan-400">${currentLayer.source}</span>
          </div>
        </div>
      </div>
    `;

    // Canvas Simulator loop if selected
    if (!isLiveImage) {
      const canvas = container.querySelector('#radar-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let angle = 0;
        const echoes = [
          { x: 0.62, y: 0.35, r: 40, color: 'rgba(34, 197, 94, 0.65)' },
          { x: 0.65, y: 0.38, r: 25, color: 'rgba(234, 179, 8, 0.75)' },
          { x: 0.68, y: 0.40, r: 14, color: 'rgba(239, 68, 68, 0.85)' },
          { x: 0.55, y: 0.72, r: 35, color: 'rgba(59, 130, 246, 0.6)' },
          { x: 0.48, y: 0.65, r: 28, color: 'rgba(34, 197, 94, 0.5)' }
        ];

        const resizeCanvas = () => {
          if (!canvas.parentElement) return;
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        };
        resizeCanvas();

        const draw = () => {
          if (!canvas || !canvas.parentElement) return;
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
          }
          for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          }

          ctx.save();
          ctx.translate(w * 0.5, h * 0.5);
          ctx.fillStyle = 'rgba(51, 65, 85, 0.4)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, w * 0.12, h * 0.32, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          const pulse = Math.sin(Date.now() * 0.003) * 3;
          echoes.forEach(e => {
            ctx.save();
            const grad = ctx.createRadialGradient(w * e.x, h * e.y, 2, w * e.x, h * e.y, e.r + pulse);
            grad.addColorStop(0, e.color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(w * e.x, h * e.y, e.r + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          if (state.isPlaying) {
            angle += 0.025;
            ctx.save();
            ctx.translate(w * 0.5, h * 0.5);
            ctx.rotate(angle);
            
            const sweepGrad = ctx.createLinearGradient(0, 0, w * 0.5, 0);
            sweepGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
            sweepGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
            ctx.fillStyle = sweepGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, Math.max(w, h), 0, Math.PI / 4);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w * 0.6, 0);
            ctx.stroke();
            ctx.restore();
          }

          requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener('resize', resizeCanvas);
      }
    }

    // Direct Image click zoom
    const liveImg = container.querySelector('#cwa-live-radar-img');
    if (liveImg) {
      liveImg.addEventListener('click', () => {
        window.open(liveImg.src, '_blank');
      });
    }

    // Layer Switch
    container.querySelectorAll('[data-layer]').forEach(btn => {
      btn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, { ...state, activeLayer: btn.getAttribute('data-layer') });
      });
    });

    // Refresh Button
    const refreshBtn = container.querySelector('#radar-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, state);
      });
    }
  }
};
