import { WeatherService } from '../services/weather-service.js';

export const TyphoonWidget = {
  id: 'typhoon-tracker',
  title: '颱風動態與路徑資訊',
  icon: 'tornado',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container) {
    const typhoon = WeatherService.getTyphoonInfo();

    container.innerHTML = `
      <div class="flex flex-col h-full bg-stone-900 text-stone-100 p-4 select-none justify-between">
        <!-- Header -->
        <div class="flex items-center justify-between pb-2.5 border-b border-stone-800">
          <div class="flex items-center space-x-2">
            <div class="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <svg class="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-base text-amber-200">${typhoon.nameZh}</h3>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ${typhoon.intensity}
                </span>
              </div>
              <p class="text-xs text-stone-400 font-mono">${typhoon.number}</p>
            </div>
          </div>

          <div class="text-right">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              ⚠️ ${typhoon.status}
            </span>
          </div>
        </div>

        <!-- Position Grid -->
        <div class="grid grid-cols-2 gap-2 my-2">
          <div class="p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <span class="text-[10px] text-stone-400">目前中心位置</span>
            <div class="font-semibold text-xs text-amber-300 mt-0.5 truncate">${typhoon.centerLocation}</div>
          </div>
          <div class="p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <span class="text-[10px] text-stone-400">進行方向與速度</span>
            <div class="font-semibold text-xs text-orange-300 mt-0.5">${typhoon.movementSpeed}</div>
          </div>
        </div>

        <!-- Parameter Metrics -->
        <div class="grid grid-cols-3 gap-2 text-center mb-2">
          <div class="p-1.5 rounded-lg bg-stone-800/50 border border-stone-700/40">
            <div class="text-[9px] text-stone-400">中心氣壓</div>
            <div class="font-bold text-xs text-stone-100 mt-0.5">${typhoon.centralPressure}</div>
          </div>
          <div class="p-1.5 rounded-lg bg-stone-800/50 border border-stone-700/40">
            <div class="text-[9px] text-stone-400">最大風速</div>
            <div class="font-bold text-xs text-amber-400 mt-0.5">${typhoon.maxWindSpeed.split('(')[0]}</div>
          </div>
          <div class="p-1.5 rounded-lg bg-stone-800/50 border border-stone-700/40">
            <div class="text-[9px] text-stone-400">7級風半徑</div>
            <div class="font-bold text-xs text-orange-400 mt-0.5">${typhoon.radius7.split('(')[0]}</div>
          </div>
        </div>

        <!-- Path Timeline -->
        <div class="bg-stone-950/80 rounded-xl p-2 border border-stone-800 flex flex-col justify-between">
          <div class="flex items-center justify-between text-[10px] text-stone-400 mb-1">
            <span>預測路徑時間軸</span>
            <span class="text-amber-400">警戒海域：${typhoon.alertAreas.join('、')}</span>
          </div>

          <div class="flex items-center justify-between px-1 py-1 overflow-x-auto scrollbar-thin">
            ${typhoon.pathPoints.map((pt) => `
              <div class="flex flex-col items-center flex-shrink-0 min-w-[52px]">
                <span class="text-[9px] text-stone-400 mb-0.5">${pt.time}</span>
                <div class="w-3.5 h-3.5 rounded-full flex items-center justify-center ${pt.current ? 'bg-rose-500 text-white ring-2 ring-rose-500/30' : pt.past ? 'bg-stone-600' : 'bg-amber-500'}"></div>
                <span class="text-[9px] font-medium mt-0.5 ${pt.current ? 'text-rose-400 font-bold' : pt.forecast ? 'text-amber-300' : 'text-stone-500'}">
                  ${pt.status.split(' ')[0]}
                </span>
              </div>
            `).join('<div class="h-0.5 w-4 bg-stone-700 flex-shrink-0 -mt-2"></div>')}
          </div>

          <!-- Alert Notice Banner -->
          <div class="text-[10px] text-amber-200 bg-amber-950/40 border border-amber-800/40 rounded p-1 mt-1.5 flex items-start space-x-1">
            <span>📢</span>
            <span class="leading-tight">${typhoon.impactNotice}</span>
          </div>
        </div>
      </div>
    `;
  }
};
