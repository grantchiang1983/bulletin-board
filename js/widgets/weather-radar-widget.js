import { WeatherService } from '../services/weather-service.js';

export const WeatherRadarWidget = {
  id: 'weather-radar',
  title: '中央氣象署即時雷達回波與衛星雲圖',
  icon: 'radar',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { activeLayer: 'cwa_radar_standard' }) {
    const layers = WeatherService.getRadarLayers();
    const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];
    const nowTimeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none overflow-hidden relative justify-between">
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-800">
          <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg overflow-x-auto max-w-[70%] scrollbar-thin">
            ${layers.map(l => `
              <button class="px-2.5 py-1 text-xs font-medium rounded-md transition-all flex-shrink-0 ${l.id === currentLayer.id ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'}" data-layer="${l.id}">
                ${l.name.replace('中央氣象署', '').replace('向日葵', '')}
              </button>
            `).join('')}
          </div>
          
          <div class="flex items-center space-x-1.5">
            <button id="radar-refresh-btn" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center space-x-1" title="立即自中央氣象署重新抓取最新衛星與雷達影像">
              <span>🔄</span>
              <span>刷新</span>
            </button>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
              CWA 官方即時連線
            </span>
          </div>
        </div>

        <!-- Main Real CWA Image Container -->
        <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[140px] group">
          <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
            <img id="cwa-live-radar-img" src="${currentLayer.url}" alt="${currentLayer.name}" class="w-full h-full object-contain transition-transform duration-300 transform scale-100 hover:scale-105 cursor-zoom-in" title="點擊在新分頁開啟全解析度原圖">
            
            <!-- Source Tag Badge -->
            <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none shadow">
              <span class="text-cyan-400 font-bold">📡 ${currentLayer.source}</span>
              <span class="text-slate-400">‧ ${currentLayer.unit}</span>
            </div>

            <!-- Timestamp & HD Button -->
            <div class="absolute top-2 right-2 flex items-center space-x-1">
              <div class="bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 shadow">
                🕒 ${nowTimeStr} 同步
              </div>
              ${currentLayer.hdUrl ? `
                <a href="${currentLayer.hdUrl}" target="_blank" class="bg-blue-600 hover:bg-blue-500 px-2 py-0.5 rounded text-[10px] text-white font-bold transition-colors shadow" title="開啟超高清大圖">
                  🔍 3600HD 原圖
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Footer Info -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center space-x-2">
            <span class="text-slate-300 text-[11px] font-medium">${currentLayer.name}</span>
            <span class="text-slate-500 text-[10px]">每 10 分鐘自動同步氣象署觀測 ‧ 點擊圖面可放大</span>
          </div>

          <div class="flex items-center space-x-1.5 text-slate-400">
            <span class="text-[10px] text-cyan-400">${currentLayer.description}</span>
          </div>
        </div>
      </div>
    `;

    // Click on image to open in new tab
    const liveImg = container.querySelector('#cwa-live-radar-img');
    if (liveImg) {
      liveImg.addEventListener('click', () => {
        window.open(currentLayer.hdUrl || liveImg.src, '_blank');
      });
    }

    // Layer selection
    container.querySelectorAll('[data-layer]').forEach(btn => {
      btn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, { ...state, activeLayer: btn.getAttribute('data-layer') });
      });
    });

    // Refresh button
    const refreshBtn = container.querySelector('#radar-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, state);
      });
    }
  }
};
