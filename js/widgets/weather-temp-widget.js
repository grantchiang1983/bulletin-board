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
        case 'sun': return `<svg class="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
        case 'sun-medium': return `<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
        case 'cloud-rain': return `<svg class="w-7 h-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
        case 'cloud-lightning': return `<svg class="w-7 h-7 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`;
        default: return `<svg class="w-7 h-7 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-stone-900 text-stone-100 p-4 select-none justify-between">
        <!-- City Selector & Current Temperature -->
        <div class="flex items-center justify-between pb-2.5 border-b border-stone-800">
          <div class="flex items-center space-x-2.5">
            <span class="p-2 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400">
              ${getIconSvg(cityData.icon)}
            </span>
            <div>
              <div class="flex items-center space-x-2">
                <select id="weather-city-select" class="font-bold text-base bg-stone-800 border border-stone-700 text-amber-100 rounded px-2 py-0.5 focus:outline-none focus:border-amber-500 cursor-pointer">
                  ${cities.map(c => `<option value="${c.id}" ${c.id === cityData.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  AQI ${cityData.aqi} ${cityData.aqiStatus}
                </span>
              </div>
              <p class="text-xs text-stone-400 mt-0.5">${cityData.condition} ‧ 降雨機率 ${cityData.rainProb}</p>
            </div>
          </div>
          
          <div class="text-right">
            <span class="text-3xl font-extrabold tracking-tight text-amber-200">${cityData.temp}°C</span>
            <div class="text-[11px] text-stone-400">最高 ${cityData.high}° ‧ 最低 ${cityData.low}°</div>
          </div>
        </div>

        <!-- Weather Stats Grid -->
        <div class="grid grid-cols-3 gap-2 my-2 text-center">
          <div class="p-2 rounded-lg bg-stone-800/60 border border-stone-700/50">
            <div class="text-[10px] text-stone-400">體感溫度</div>
            <div class="font-bold text-xs mt-0.5 text-stone-200">${cityData.temp + 2}°C</div>
          </div>
          <div class="p-2 rounded-lg bg-stone-800/60 border border-stone-700/50">
            <div class="text-[10px] text-stone-400">相對濕度</div>
            <div class="font-bold text-xs mt-0.5 text-stone-200">${cityData.humidity}%</div>
          </div>
          <div class="p-2 rounded-lg bg-stone-800/60 border border-stone-700/50">
            <div class="text-[10px] text-stone-400">紫外線指數</div>
            <div class="font-bold text-xs mt-0.5 text-amber-400">${cityData.uv} (中高)</div>
          </div>
        </div>

        <!-- 24-Hour Forecast Timeline -->
        <div class="text-[11px] font-medium text-stone-400 mb-1">未來 24 小時氣溫與降雨趨勢</div>
        <div class="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
          ${cityData.hourly.map(h => `
            <div class="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg bg-stone-800/40 border border-stone-700/40 min-w-[50px] text-center">
              <span class="text-[10px] text-stone-400">${h.time}</span>
              <div class="my-0.5 scale-75">${getIconSvg(h.icon)}</div>
              <span class="font-bold text-xs text-amber-100">${h.temp}°</span>
              <span class="text-[9px] text-sky-400 mt-0.5">${h.rainProb}</span>
            </div>
          `).join('')}
        </div>

        <!-- Quick Taiwan Cities Bar -->
        <div class="pt-2 border-t border-stone-800/80">
          <div class="grid grid-cols-4 gap-1.5 text-xs">
            ${cities.slice(0, 8).map(c => `
              <div class="p-1 rounded bg-stone-800/70 border border-stone-700/40 flex items-center justify-between cursor-pointer hover:bg-amber-950/40 hover:border-amber-700/60 transition-colors" data-city="${c.id}">
                <span class="font-medium text-stone-300 text-[11px]">${c.name.slice(0,2)}</span>
                <span class="font-bold text-amber-200 text-[11px]">${c.temp}°</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

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
  }
};
