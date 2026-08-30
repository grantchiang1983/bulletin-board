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
      <div class="flex flex-col h-full bg-white text-slate-800 p-3 select-none overflow-hidden relative justify-between">
        <!-- Top Toolbar (CWA Official Style) -->
        <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-200">
          <!-- Layer Selectors -->
          <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-[60%] scrollbar-thin border border-slate-200">
            ${layers.map(l => `
              <button class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex-shrink-0 ${l.id === currentLayer.id ? 'bg-[#0d346c] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}" data-layer="${l.id}">
                ${l.name.replace('中央氣象署', '').replace('向日葵', '')}
              </button>
            `).join('')}
          </div>
          
          <!-- Actions: Direct CWA Link & Refresh -->
          <div class="flex items-center space-x-1.5">
            <button id="radar-refresh-btn" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0d346c] text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-300" title="重新載入最新雷達圖">
              <span>🔄</span>
              <span>刷新</span>
            </button>

            <!-- Direct Link to Central Weather Administration Website -->
            <a href="https://www.cwa.gov.tw/" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm group/btn" title="在新分頁開啟交通部中央氣象署官方網站 (https://www.cwa.gov.tw/)">
              <span>🌐</span>
              <span>中央氣象署官網</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Main Real CWA Image Container -->
        <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 flex items-center justify-center min-h-[140px] group shadow-inner">
          <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
            <img id="cwa-live-radar-img" src="${currentLayer.url}" alt="${currentLayer.name}" class="w-full h-full object-contain transition-transform duration-300 transform scale-100 hover:scale-105 cursor-zoom-in" title="點擊在新分頁開啟全解析度圖檔">
            
            <!-- Source Tag Link -->
            <a href="https://www.cwa.gov.tw/V8/C/W/OBS_Radar.html" target="_blank" rel="noopener noreferrer" class="absolute bottom-2 left-2 bg-slate-900/85 hover:bg-[#0d346c] text-white backdrop-blur border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1.5 shadow transition-colors" title="前往氣象署雷達觀測專頁">
              <span class="text-sky-300 font-bold">📡 中央氣象署 (cwa.gov.tw)</span>
              <span class="text-slate-300">‧ ${currentLayer.unit}</span>
              <span class="text-sky-300">↗</span>
            </a>

            <!-- Timestamp & HD Button -->
            <div class="absolute top-2 right-2 flex items-center space-x-1.5">
              <div class="bg-slate-900/85 text-sky-200 backdrop-blur border border-slate-700 px-2.5 py-0.5 rounded-lg text-[10px] font-mono shadow">
                🕒 ${nowTimeStr} 同步
              </div>
              ${currentLayer.hdUrl ? `
                <a href="${currentLayer.hdUrl}" target="_blank" class="bg-[#0284c7] hover:bg-[#0369a1] px-2.5 py-0.5 rounded-lg text-[10px] text-white font-bold transition-colors shadow" title="開啟 3600x3600 超高清大圖">
                  🔍 3600HD
                </a>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Footer Info & Direct Official Portal Links -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center space-x-2">
            <span class="text-[#0d346c] text-[11px] font-bold">${currentLayer.name}</span>
            <span class="text-slate-500 text-[10px]">觀測來源：交通部中央氣象署</span>
          </div>

          <div class="flex items-center space-x-2 text-slate-500">
            <a href="https://www.cwa.gov.tw/" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold text-[11px] flex items-center space-x-0.5 underline">
              <span>https://www.cwa.gov.tw/</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const liveImg = container.querySelector('#cwa-live-radar-img');
    if (liveImg) {
      liveImg.addEventListener('click', () => {
        window.open(currentLayer.hdUrl || liveImg.src, '_blank');
      });
    }

    container.querySelectorAll('[data-layer]').forEach(btn => {
      btn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, { ...state, activeLayer: btn.getAttribute('data-layer') });
      });
    });

    const refreshBtn = container.querySelector('#radar-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        WeatherRadarWidget.render(container, state);
      });
    }
  }
};
