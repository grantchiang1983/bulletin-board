export const WindyWidget = {
  id: 'windy-weather',
  title: 'Windy 全球即時氣溫與動態氣象圖 (24.370, 125.321)',
  icon: 'globe',
  defaultWidth: 12,
  defaultHeight: 5,
  minWidth: 6,
  minHeight: 4,

  render(container, state = { overlay: 'temp', zoom: 4 }) {
    const lat = '24.370';
    const lon = '125.321';
    const zoom = state.zoom || 4;
    const overlay = state.overlay || 'temp';

    const windyDirectUrl = `https://www.windy.com/?${lat},${lon},${zoom},p:${overlay}`;
    const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=${zoom}&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0C&radarRange=-1`;

    const layers = [
      { id: 'temp', name: '🌡️ 氣溫分佈 (Temp)' },
      { id: 'wind', name: '💨 風速流場 (Wind)' },
      { id: 'rain', name: '🌧️ 降雨累積 (Rain)' },
      { id: 'radar', name: '📡 氣象雷達 (Radar)' },
      { id: 'clouds', name: '☁️ 雲層分佈 (Clouds)' },
      { id: 'waves', name: '🌊 浪高海象 (Waves)' }
    ];

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <!-- Layer Selectors -->
          <div class="flex items-center space-x-1 overflow-x-auto scrollbar-thin">
            ${layers.map(l => `
              <button class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${l.id === overlay ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'}" data-windy-overlay="${l.id}">
                ${l.name}
              </button>
            `).join('')}
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <span class="text-xs text-slate-500 font-mono hidden sm:inline">📍 24.370°N, 125.321°E (Zoom 4)</span>
            
            <button id="windy-refresh-btn" class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#0d346c] text-xs font-bold border border-slate-300 shadow-sm transition-colors" title="重新載入 Windy 氣象圖">
              🔄 刷新
            </button>

            <!-- Direct Link to Windy.com -->
            <a href="${windyDirectUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Windy.com 完整全螢幕氣象圖">
              <span>🌍</span>
              <span>Windy.com 官網</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Embedded Interactive Windy Map -->
        <div class="relative flex-1 w-full h-full min-h-[300px] overflow-hidden bg-slate-900">
          <iframe id="windy-embed-iframe" src="${embedUrl}" class="w-full h-full border-0 bg-slate-900" title="Windy 即時氣象與氣溫圖" loading="lazy" allowfullscreen></iframe>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-[#0d346c]">ECMWF 歐洲中期天氣預報數值模式</span>
            <span>‧</span>
            <span>即時溫度流場視覺化</span>
          </div>

          <a href="${windyDirectUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline flex items-center space-x-0.5">
            <span>https://www.windy.com/?24.370,125.321,4,p:temp ↗</span>
          </a>
        </div>
      </div>
    `;

    // Layer switch event
    container.querySelectorAll('[data-windy-overlay]').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-windy-overlay');
        WindyWidget.render(container, { ...state, overlay: selected });
      });
    });

    const refreshBtn = container.querySelector('#windy-refresh-btn');
    const iframe = container.querySelector('#windy-embed-iframe');
    if (refreshBtn && iframe) {
      refreshBtn.addEventListener('click', () => {
        iframe.src = embedUrl + '&t=' + Date.now();
      });
    }
  }
};
