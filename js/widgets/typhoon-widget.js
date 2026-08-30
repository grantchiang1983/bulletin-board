import { WeatherService } from '../services/weather-service.js';

export const TyphoonWidget = {
  id: 'typhoon-tracker',
  title: '颱風動態與路徑資訊',
  icon: 'tornado',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = {}) {
    const typhoon = WeatherService.getTyphoonInfo();

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none">
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <div class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <svg class="w-6 h-6 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-bold text-base text-white">${typhoon.nameZh}</h3>
                <span class="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ${typhoon.intensity}
                </span>
              </div>
              <p class="text-xs text-slate-400 font-mono">${typhoon.number} ‧ ${typhoon.nameEn}</p>
            </div>
          </div>

          <div class="text-right">
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
              ⚠️ ${typhoon.status}
            </span>
          </div>
        </div>

        <!-- Center Coordinates & Motion -->
        <div class="grid grid-cols-2 gap-2 my-2.5">
          <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span class="text-[11px] text-slate-400">目前中心位置</span>
            <div class="font-semibold text-xs text-cyan-300 mt-1 truncate">${typhoon.centerLocation}</div>
          </div>
          <div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span class="text-[11px] text-slate-400">進行方向與速度</span>
            <div class="font-semibold text-xs text-emerald-300 mt-1">${typhoon.movementSpeed}</div>
          </div>
        </div>

        <!-- Metrics Grid -->
        <div class="grid grid-cols-3 gap-2 text-center mb-2.5">
          <div class="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
            <div class="text-[10px] text-slate-400">中心氣壓</div>
            <div class="font-bold text-xs text-white mt-0.5">${typhoon.centralPressure}</div>
          </div>
          <div class="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
            <div class="text-[10px] text-slate-400">最大風速</div>
            <div class="font-bold text-xs text-amber-400 mt-0.5">${typhoon.maxWindSpeed.split('(')[0]}</div>
          </div>
          <div class="p-2 rounded-lg bg-slate-800/50 border border-slate-700/40">
            <div class="text-[10px] text-slate-400">7級風半徑</div>
            <div class="font-bold text-xs text-cyan-400 mt-0.5">${typhoon.radius7.split('(')[0]}</div>
          </div>
        </div>

        <!-- Path Waypoint Timeline -->
        <div class="flex-1 bg-slate-950/80 rounded-xl p-2.5 border border-slate-800 flex flex-col justify-between overflow-hidden">
          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>路徑動態預報 (中央氣象署預測路徑)</span>
            <span class="text-amber-400">警戒海域：${typhoon.alertAreas.join('、')}</span>
          </div>

          <!-- Interactive Path Track SVG / Nodes -->
          <div class="flex items-center justify-between px-2 py-1.5 overflow-x-auto scrollbar-thin">
            ${typhoon.pathPoints.map((pt, i) => `
              <div class="flex flex-col items-center flex-shrink-0 min-w-[60px] relative">
                <span class="text-[10px] text-slate-400 mb-1">${pt.time}</span>
                <div class="w-4 h-4 rounded-full flex items-center justify-center ${pt.current ? 'bg-rose-500 text-white ring-4 ring-rose-500/30 scale-110' : pt.past ? 'bg-slate-600' : 'bg-amber-500/80'}">
                  ${pt.current ? '🌀' : ''}
                </div>
                <span class="text-[10px] font-medium mt-1 ${pt.current ? 'text-rose-400 font-bold' : pt.forecast ? 'text-amber-300' : 'text-slate-500'}">
                  ${pt.status.split(' ')[0]}
                </span>
              </div>
            `).join('<div class="h-0.5 w-6 bg-slate-700 flex-shrink-0 -mt-3"></div>')}
          </div>

          <!-- Impact warning footer -->
          <div class="text-[11px] text-rose-300/90 bg-rose-950/40 border border-rose-800/40 rounded-lg p-1.5 mt-2 flex items-start space-x-1.5">
            <span class="flex-shrink-0">📢</span>
            <span class="leading-tight">${typhoon.impactNotice}</span>
          </div>
        </div>
      </div>
    `;
  }
};
