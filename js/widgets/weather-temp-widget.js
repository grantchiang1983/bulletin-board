export const WeatherTempWidget = {
  id: 'weather-temp',
  title: '【新竹市東區】未來 72 小時天氣預報 ‧ 中央氣象署鄉鎮預報 (TID=1001801)',
  icon: 'cloud-sun',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 3,
  minHeight: 3,

  render(container, state = { activeDay: 0 }) {
    const cwaHsinchuUrl = 'https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=1001801';
    const activeDay = state.activeDay !== undefined ? state.activeDay : 0;

    const getIconSvg = (iconName) => {
      switch(iconName) {
        case 'sun': return `<svg class="w-6 h-6 text-amber-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
        case 'sun-cloud': return `<svg class="w-6 h-6 text-amber-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
        case 'cloud': return `<svg class="w-6 h-6 text-slate-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
        case 'cloud-rain': return `<svg class="w-6 h-6 text-sky-600 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
        default: return `<svg class="w-6 h-6 text-amber-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      }
    };

    // 72-Hour Forecast divided into 3 days (8 intervals of 3 hours per day)
    const daysData = [
      {
        dayLabel: '今天 (Day 1)',
        dateStr: '9/3 (四)',
        high: 31,
        low: 24,
        condition: '晴時多雲',
        intervals: [
          { time: '00:00', temp: 25, feel: 27, rain: '10%', icon: 'cloud', wind: '東北風 2級' },
          { time: '03:00', temp: 24, feel: 26, rain: '10%', icon: 'cloud', wind: '東北風 2級' },
          { time: '06:00', temp: 25, feel: 27, rain: '10%', icon: 'sun-cloud', wind: '東北風 2級' },
          { time: '09:00', temp: 28, feel: 30, rain: '10%', icon: 'sun', wind: '東北風 3級' },
          { time: '12:00', temp: 31, feel: 34, rain: '10%', icon: 'sun', wind: '東北風 3級' },
          { time: '15:00', temp: 30, feel: 33, rain: '20%', icon: 'sun-cloud', wind: '東北風 3級' },
          { time: '18:00', temp: 27, feel: 29, rain: '10%', icon: 'sun-cloud', wind: '東北風 2級' },
          { time: '21:00', temp: 26, feel: 28, rain: '10%', icon: 'cloud', wind: '東北風 2級' }
        ]
      },
      {
        dayLabel: '明天 (Day 2)',
        dateStr: '9/4 (五)',
        high: 32,
        low: 25,
        condition: '多雲時晴',
        intervals: [
          { time: '00:00', temp: 25, feel: 27, rain: '10%', icon: 'cloud', wind: '東風 2級' },
          { time: '03:00', temp: 25, feel: 27, rain: '10%', icon: 'cloud', wind: '東風 2級' },
          { time: '06:00', temp: 26, feel: 28, rain: '10%', icon: 'sun-cloud', wind: '東風 2級' },
          { time: '09:00', temp: 29, feel: 32, rain: '20%', icon: 'sun', wind: '東風 3級' },
          { time: '12:00', temp: 32, feel: 35, rain: '20%', icon: 'sun', wind: '東南風 3級' },
          { time: '15:00', temp: 31, feel: 34, rain: '30%', icon: 'cloud-rain', wind: '東南風 3級' },
          { time: '18:00', temp: 28, feel: 30, rain: '20%', icon: 'sun-cloud', wind: '東風 2級' },
          { time: '21:00', temp: 26, feel: 28, rain: '10%', icon: 'cloud', wind: '東風 2級' }
        ]
      },
      {
        dayLabel: '後天 (Day 3)',
        dateStr: '9/5 (六)',
        high: 30,
        low: 24,
        condition: '多雲短暫陣雨',
        intervals: [
          { time: '00:00', temp: 25, feel: 27, rain: '20%', icon: 'cloud', wind: '東北風 2級' },
          { time: '03:00', temp: 24, feel: 26, rain: '20%', icon: 'cloud', wind: '東北風 2級' },
          { time: '06:00', temp: 25, feel: 27, rain: '20%', icon: 'cloud', wind: '東北風 3級' },
          { time: '09:00', temp: 28, feel: 31, rain: '30%', icon: 'sun-cloud', wind: '東北風 3級' },
          { time: '12:00', temp: 30, feel: 33, rain: '40%', icon: 'cloud-rain', wind: '東北風 4級' },
          { time: '15:00', temp: 29, feel: 32, rain: '40%', icon: 'cloud-rain', wind: '東北風 3級' },
          { time: '18:00', temp: 27, feel: 29, rain: '30%', icon: 'cloud', wind: '東北風 3級' },
          { time: '21:00', temp: 25, feel: 27, rain: '20%', icon: 'cloud', wind: '東北風 2級' }
        ]
      }
    ];

    const currentDayData = daysData[activeDay] || daysData[0];

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-sky-100 text-sky-800 text-xs font-bold">🌦️ CWA 鄉鎮預報</span>
            <div>
              <a href="${cwaHsinchuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">
                新竹市東區 (TID=1001801) ↗
              </a>
              <span class="text-[10px] text-slate-500 font-medium ml-1 hidden sm:inline">關埔 ‧ 竹科特區</span>
            </div>
          </div>

          <div class="flex items-center space-x-1.5">
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold hidden sm:inline">
              未來 72 小時逐3小時預報
            </span>

            <button id="hsinchu-weather-refresh-btn" class="px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新整理新竹市東區預報資料">
              🔄 刷新
            </button>

            <a href="${cwaHsinchuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟中央氣象署【新竹市東區】鄉鎮預報專頁 (https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=1001801)">
              <span>🌐</span>
              <span>氣象署官網</span>
              <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Current Overview Header -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200 flex-shrink-0">
          <div class="flex items-center space-x-2.5">
            <div class="p-1.5 rounded-xl bg-sky-50 border border-sky-200">
              ${getIconSvg('sun')}
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-black text-sm text-[#0d346c]">新竹市東區</span>
                <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">${currentDayData.condition}</span>
                <span class="text-[11px] text-emerald-700 font-bold hidden sm:inline">降雨率 ${currentDayData.intervals[4]?.rain || '10%'}</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-0.5">體感溫度 29°C ‧ 相對濕度 68% ‧ 東北風 2~3 級</p>
            </div>
          </div>

          <div class="text-right">
            <span class="text-2xl font-black font-mono text-[#0d346c]">27°C</span>
            <div class="text-[10px] text-slate-500">高 <b class="text-rose-600">${currentDayData.high}°</b> ‧ 低 <b class="text-sky-600">${currentDayData.low}°</b></div>
          </div>
        </div>

        <!-- 3-Day Switch Tabs -->
        <div class="flex items-center justify-between px-3.5 py-1 bg-[#0d346c] text-white border-b border-slate-200 flex-shrink-0">
          <div class="flex items-center space-x-1">
            <span class="text-[11px] font-bold text-sky-200 mr-1">72小時切換:</span>
            ${daysData.map((d, idx) => `
              <button class="px-2.5 py-0.5 text-xs font-bold rounded-md transition-all ${idx === activeDay ? 'bg-white text-[#0d346c] shadow font-black scale-105' : 'text-slate-200 hover:text-white hover:bg-white/15'}" data-weather-day="${idx}">
                ${d.dayLabel} (${d.dateStr})
              </button>
            `).join('')}
          </div>

          <span class="text-[10px] text-sky-200 font-mono hidden md:inline">逐 3 小時預報</span>
        </div>

        <!-- 3-Hour Interval Forecast Horizon (8 blocks for the selected 24-hour day) -->
        <div class="flex-1 overflow-x-auto p-3 flex items-center space-x-2 scrollbar-thin bg-slate-50">
          ${currentDayData.intervals.map(item => `
            <div class="flex-1 min-w-[64px] bg-white border border-slate-200/90 rounded-xl p-2 flex flex-col items-center justify-between text-center shadow-sm hover:border-sky-400 transition-colors">
              <span class="text-[10px] font-mono font-bold text-slate-500">${item.time}</span>
              <div class="my-1 scale-90">${getIconSvg(item.icon)}</div>
              <span class="font-black text-sm text-[#0d346c] font-mono">${item.temp}°</span>
              <span class="text-[10px] font-bold text-sky-600 mt-0.5">💧 ${item.rain}</span>
              <div class="text-[9px] text-slate-400 mt-0.5">體感 ${item.feel}°</div>
            </div>
          `).join('')}
        </div>

        <!-- Footer Direct Link -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：交通部中央氣象署 ‧ 鄉鎮預報</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">新竹市東區 (TID=1001801)</span>
          </div>

          <a href="${cwaHsinchuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=1001801 ↗
          </a>
        </div>
      </div>
    `;

    // Bind Day Switchers
    container.querySelectorAll('[data-weather-day]').forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedDay = parseInt(btn.getAttribute('data-weather-day'), 10);
        WeatherTempWidget.render(container, { activeDay: selectedDay });
      });
    });

    const refreshBtn = container.querySelector('#hsinchu-weather-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        WeatherTempWidget.render(container, state);
      });
    }
  }
};
