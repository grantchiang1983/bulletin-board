import { WeatherService } from '../services/weather-service.js';

export const TyphoonWidget = {
  id: 'typhoon-tracker',
  title: '氣象署颱風動態與路徑資訊',
  icon: 'tornado',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container) {
    const typhoon = WeatherService.getTyphoonInfo();

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- Header -->
        <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div class="flex items-center space-x-2.5">
            <div class="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
              <svg class="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-black text-base text-[#0d346c]">${typhoon.nameZh}</h3>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                  ${typhoon.intensity}
                </span>
              </div>
              <p class="text-xs text-slate-500 font-mono">${typhoon.number}</p>
            </div>
          </div>

          <div class="text-right">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse shadow-sm">
              ⚠️ ${typhoon.status}
            </span>
          </div>
        </div>

        <!-- Position Grid -->
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

        <!-- Parameter Metrics -->
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
            <div class="text-[10px] text-slate-500 font-medium">7級風半徑</div>
            <div class="font-black text-xs text-[#0284c7] mt-0.5">${typhoon.radius7.split('(')[0]}</div>
          </div>
        </div>

        <!-- Path Timeline -->
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
          <div class="text-[11px] text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 flex items-start space-x-1.5 shadow-sm">
            <span class="text-base">📢</span>
            <span class="leading-tight font-medium">${typhoon.impactNotice}</span>
          </div>
        </div>
      </div>
    `;
  }
};
