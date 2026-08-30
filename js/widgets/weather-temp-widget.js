import { WeatherService } from '../services/weather-service.js';

export const WeatherTempWidget = {
  id: 'weather-temp',
  title: '天氣各地氣溫與預報',
  icon: 'cloud-sun',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 3,
  minHeight: 3,

  render(container, state = { selectedCity: 'taipei' }) {
    const cities = WeatherService.getAllCities();
    const cityData = WeatherService.getCityDetail(state.selectedCity || 'taipei');

    const getIconSvg = (iconName) => {
      switch(iconName) {
        case 'sun': return `<svg class="w-8 h-8 text-amber-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
        case 'sun-medium': return `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
        case 'cloud-rain': return `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
        case 'cloud-lightning': return `<svg class="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`;
        default: return `<svg class="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 p-4 select-none">
        <!-- Header Controls -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              ${getIconSvg(cityData.icon)}
            </span>
            <div>
              <div class="flex items-center space-x-2">
                <select id="weather-city-select" class="font-bold text-lg bg-transparent border-b border-dashed border-slate-400 dark:border-slate-600 focus:outline-none cursor-pointer">
                  ${cities.map(c => `<option value="${c.id}" class="dark:bg-slate-800" ${c.id === cityData.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  AQI ${cityData.aqi} ${cityData.aqiStatus}
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">${cityData.condition} ‧ 降雨機率 ${cityData.rainProb}</p>
            </div>
          </div>
          
          <div class="text-right">
            <span class="text-3xl font-extrabold tracking-tight">${cityData.temp}°C</span>
            <div class="text-xs text-slate-500 dark:text-slate-400">
              最高 ${cityData.high}° ‧ 最低 ${cityData.low}°
            </div>
          </div>
        </div>

        <!-- Quick Metrics -->
        <div class="grid grid-cols-3 gap-2 my-3 text-center">
          <div class="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div class="text-[11px] text-slate-400">體感溫度</div>
            <div class="font-semibold text-sm mt-0.5">${cityData.temp + 2}°C</div>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div class="text-[11px] text-slate-400">相對濕度</div>
            <div class="font-semibold text-sm mt-0.5">${cityData.humidity}%</div>
          </div>
          <div class="p-2 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div class="text-[11px] text-slate-400">紫外線指數</div>
            <div class="font-semibold text-sm mt-0.5 text-amber-500">${cityData.uv} (中高)</div>
          </div>
        </div>

        <!-- Hourly Forecast Scrollable -->
        <div class="text-xs font-medium text-slate-400 mb-1">未來 24 小時氣溫趨勢</div>
        <div class="flex space-x-3 overflow-x-auto pb-2 mb-2 scrollbar-thin">
          ${cityData.hourly.map(h => `
            <div class="flex flex-col items-center flex-shrink-0 p-2 rounded-lg bg-white/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 min-w-[54px] text-center">
              <span class="text-[11px] text-slate-400">${h.time}</span>
              <div class="my-1 scale-75">${getIconSvg(h.icon)}</div>
              <span class="font-bold text-xs">${h.temp}°</span>
              <span class="text-[10px] text-blue-500 mt-0.5">${h.rainProb}</span>
            </div>
          `).join('')}
        </div>

        <!-- 7-Day Outlook (collapsed/scrollable) -->
        <div class="mt-auto pt-2 border-t border-slate-200/70 dark:border-slate-800">
          <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>全台主要縣市即時氣溫速覽</span>
            <span class="text-[10px] text-blue-500 cursor-pointer hover:underline" id="weather-refresh-btn">🔄 即時刷新</span>
          </div>
          <div class="grid grid-cols-4 gap-1.5 text-xs">
            ${cities.slice(0, 8).map(c => `
              <div class="p-1.5 rounded bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors" data-city="${c.id}">
                <span class="font-medium text-slate-600 dark:text-slate-300 text-[11px]">${c.name.slice(0,2)}</span>
                <span class="font-bold text-slate-800 dark:text-slate-100 text-[11px]">${c.temp}°</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind events
    const select = container.querySelector('#weather-city-select');
    if (select) {
      select.addEventListener('change', (e) => {
        WeatherTempWidget.render(container, { selectedCity: e.target.value });
      });
    }

    container.querySelectorAll('[data-city]').forEach(el => {
      el.addEventListener('click', () => {
        const cityId = el.getAttribute('data-city');
        WeatherTempWidget.render(container, { selectedCity: cityId });
      });
    });

    const refreshBtn = container.querySelector('#weather-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        WeatherTempWidget.render(container, state);
      });
    }
  }
};
