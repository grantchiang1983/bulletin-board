import { WeatherService } from '../services/weather-service.js';

export const TyphoonWidget = {
  id: 'typhoon-tracker',
  title: '中央氣象署 颱風消息與動態',
  icon: 'tornado',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container) {
    const typhoon = WeatherService.getTyphoonInfo();
    const cwaTyphoonUrl = 'https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- Header with Direct CWA Typhoon News Link Button -->
        <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div class="flex items-center space-x-2.5">
            <div class="p-2 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 shadow-sm">
              <svg class="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <a href="${cwaTyphoonUrl}" target="_blank" rel="noopener noreferrer" class="font-black text-base text-[#0d346c] hover:text-[#0284c7] flex items-center space-x-1 transition-colors" title="前往中央氣象署颱風消息官方專頁">
                  <span>${typhoon.nameZh}</span>
                  <span class="text-xs text-sky-600 font-normal">↗</span>
                </a>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  ${typhoon.intensity}
                </span>
              </div>
              <p class="text-xs text-slate-500 font-mono">${typhoon.number}</p>
            </div>
          </div>

          <!-- Direct Link to CWA Typhoon News Portal -->
          <div class="flex items-center space-x-1.5">
            <a href="${cwaTyphoonUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all group/btn" title="在新分頁開啟 交通部中央氣象署 颱風消息 (https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html)">
              <span>🌀</span>
              <span>氣象署颱風消息</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Position & Movement Grid -->
        <div class="grid grid-cols-2 gap-2 my-2">
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <span class="text-[10px] text-slate-500 font-medium">目前中心位置</span>
            <div class="font-bold text-xs text-[#0d346c] mt-0.5 truncate">${typhoon.centerLocation}</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <span class="text-[10px] text-slate-500 font-medium">進行方向與速度</span>
            <div class="font-bold text-xs text-sky-700 mt-0.5">${typhoon.movementSpeed}</div>
          </div>
        </div>

        <!-- Meteorological Metrics -->
        <div class="grid grid-cols-3 gap-2 text-center mb-2">
          <div class="p-2 rounded-lg bg-sky-50/60 border border-sky-100 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">中心氣壓</div>
            <div class="font-black text-xs text-slate-800 mt-0.5">${typhoon.centralPressure}</div>
          </div>
          <div class="p-2 rounded-lg bg-sky-50/60 border border-sky-100 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">最大風速</div>
            <div class="font-black text-xs text-amber-600 mt-0.5">${typhoon.maxWindSpeed.split('(')[0]}</div>
          </div>
          <div class="p-2 rounded-lg bg-sky-50/60 border border-sky-100 shadow-sm">
            <div class="text-[10px] text-slate-500 font-medium">7級風暴風半徑</div>
            <div class="font-black text-xs text-[#0284c7] mt-0.5">${typhoon.radius7.split('(')[0]}</div>
          </div>
        </div>

        <!-- Path Timeline & Warning Areas -->
        <div class="bg-slate-50 rounded-xl p-2.5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div class="flex items-center justify-between text-[11px] text-slate-600 mb-1.5 font-medium">
            <span>預測路徑時間軸</span>
            <span class="text-[#0284c7] font-semibold">警戒海域：${typhoon.alertAreas.join('、')}</span>
          </div>

          <div class="flex items-center justify-between px-1 py-1 overflow-x-auto scrollbar-thin">
            ${typhoon.pathPoints.map((pt) => `
              <div class="flex flex-col items-center flex-shrink-0 min-w-[54px]">
                <span class="text-[10px] text-slate-500 mb-0.5 font-medium">${pt.time}</span>
                <div class="w-4 h-4 rounded-full flex items-center justify-center ${pt.current ? 'bg-rose-600 text-white ring-4 ring-rose-200' : pt.past ? 'bg-slate-400' : 'bg-[#0284c7]'}"></div>
                <span class="text-[10px] font-bold mt-1 ${pt.current ? 'text-rose-700' : pt.forecast ? 'text-sky-700' : 'text-slate-400'}">
                  ${pt.status.split(' ')[0]}
                </span>
              </div>
            `).join('<div class="h-0.5 w-5 bg-slate-300 flex-shrink-0 -mt-2.5"></div>')}
          </div>

          <!-- Alert Notice Banner -->
          <div class="text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg p-2 mt-2 flex items-start space-x-1.5 shadow-sm">
            <span class="text-base text-amber-500">📢</span>
            <span class="leading-tight font-medium">${typhoon.impactNotice}</span>
          </div>
        </div>

        <!-- Direct CWA Official Links Footer -->
        <div class="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
          <div class="flex items-center space-x-2">
            <a href="https://app.cwa.gov.tw/web/obsmap/typhoon.html" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-semibold underline flex items-center space-x-0.5">
              <span>颱風消息 GIS 版 ↗</span>
            </a>
            <span>‧</span>
            <a href="https://www.dgpa.gov.tw/typh/daily/nds.html?" target="_blank" rel="noopener noreferrer" class="text-rose-600 hover:text-rose-800 font-semibold underline flex items-center space-x-0.5">
              <span>停班停課查詢 ↗</span>
            </a>
          </div>

          <a href="${cwaTyphoonUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline flex items-center space-x-0.5">
            <span>氣象署颱風專頁 ↗</span>
          </a>
        </div>
      </div>
    `;
  }
};
