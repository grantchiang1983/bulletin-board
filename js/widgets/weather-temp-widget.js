import { WeatherService } from '../services/weather-service.js';

export const WeatherTempWidget = {
  id: 'weather-temp',
  title: '氣象觀測 ‧ 全台各地氣溫與一週預報',
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
        case 'sun': return `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
        case 'sun-medium': return `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
        case 'cloud-rain': return `<svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
        case 'cloud-lightning': return `<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`;
        default: return `<svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- City Selector & Current Temperature -->
        <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div class="flex items-center space-x-3">
            <span class="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shadow-sm">
              ${getIconSvg(cityData.icon)}
            </span>
            <div>
              <div class="flex items-center space-x-2">
                <select id="weather-city-select" class="font-bold text-base bg-slate-50 border border-slate-300 text-[#0d346c] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#0284c7] cursor-pointer shadow-sm">
                  ${cities.map(c => `<option value="${c.id}" ${c.id === cityData.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                </select>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                  空氣 AQI ${cityData.aqi} ${cityData.aqiStatus}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-1 font-medium">${cityData.condition} ‧ 降雨機率 <span class="text-sky-600 font-bold">${cityData.rainProb}</span></p>
            </div>
          </div>
          
          <div class="text-right">
            <span class="text-3xl font-black tracking-tight text-[#0d346c]">${cityData.temp}°C</span>
            <div class="text-[11px] text-slate-500 font-medium">最高 <b class="text-rose-600">${cityData.high}°</b> ‧ 最低 <b class="text-sky-600">${cityData.low}°</b></div>
          </div>
        </div>

        <!-- Weather Stats Grid -->
        <div class="grid grid-cols-3 gap-2 my-2 text-center">
          <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <div class="text-[11px] text-slate-500 font-medium">體感溫度</div>
            <div class="font-bold text-sm mt-0.5 text-slate-800">${cityData.temp + 2}°C</div>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <div class="text-[11px] text-slate-500 font-medium">相對濕度</div>
            <div class="font-bold text-sm mt-0.5 text-slate-800">${cityData.humidity}%</div>
          </div>
          <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
            <div class="text-[11px] text-slate-500 font-medium">紫外線指數</div>
            <div class="font-bold text-sm mt-0.5 text-amber-600">${cityData.uv} (中量級)</div>
          </div>
        </div>

        <!-- 24-Hour Forecast Timeline -->
        <div class="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
          <span>未來 24 小時逐時天氣與降雨機率</span>
          <span class="text-sky-700 text-[10px]">交通部中央氣象署觀測網</span>
        </div>
        <div class="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
          ${cityData.hourly.map(h => `
            <div class="flex flex-col items-center flex-shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200/80 min-w-[54px] text-center shadow-sm">
              <span class="text-[10px] text-slate-500 font-medium">${h.time}</span>
              <div class="my-0.5 scale-75">${getIconSvg(h.icon)}</div>
              <span class="font-extrabold text-xs text-[#0d346c]">${h.temp}°</span>
              <span class="text-[10px] text-sky-600 font-bold mt-0.5">${h.rainProb}</span>
            </div>
          `).join('')}
        </div>

        <!-- Quick Taiwan Cities Bar -->
        <div class="pt-2 border-t border-slate-200">
          <div class="grid grid-cols-4 gap-1.5 text-xs">
            ${cities.slice(0, 8).map(c => `
              <div class="p-1.5 rounded-lg bg-sky-50/70 border border-sky-200/60 flex items-center justify-between cursor-pointer hover:bg-sky-100 hover:border-sky-400 transition-colors shadow-sm" data-city="${c.id}">
                <span class="font-bold text-[#0d346c] text-[11px]">${c.name.slice(0,2)}</span>
                <span class="font-black text-sky-700 text-[11px]">${c.temp}°</span>
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
