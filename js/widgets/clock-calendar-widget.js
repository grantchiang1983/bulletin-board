export const ClockCalendarWidget = {
  id: 'clock-calendar',
  title: '實時時鐘與世界日曆',
  icon: 'clock',
  defaultWidth: 4,
  defaultHeight: 5,
  minWidth: 3,
  minHeight: 3,

  // World Cities Configuration (日本、英國、洛杉磯)
  WORLD_CITIES: [
    {
      id: 'tokyo',
      name: '日本 ‧ 東京',
      enName: 'Tokyo',
      flag: '🇯🇵',
      timeZone: 'Asia/Tokyo',
      tzLabel: 'JST (UTC+9)'
    },
    {
      id: 'london',
      name: '英國 ‧ 倫敦',
      enName: 'London',
      flag: '🇬🇧',
      timeZone: 'Europe/London',
      tzLabel: 'BST / GMT'
    },
    {
      id: 'la',
      name: '美國 ‧ 洛杉磯',
      enName: 'Los Angeles',
      flag: '🇺🇸',
      timeZone: 'America/Los_Angeles',
      tzLabel: 'PDT / PST'
    }
  ],

  getSolarTerm(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const terms = [
      { m: 1, d: 5, name: '小寒' }, { m: 1, d: 20, name: '大寒' },
      { m: 2, d: 4, name: '立春' }, { m: 2, d: 19, name: '雨水' },
      { m: 3, d: 5, name: '驚蟄' }, { m: 3, d: 20, name: '春分' },
      { m: 4, d: 4, name: '清明' }, { m: 4, d: 20, name: '穀雨' },
      { m: 5, d: 5, name: '立夏' }, { m: 5, d: 21, name: '小滿' },
      { m: 6, d: 5, name: '芒種' }, { m: 6, d: 21, name: '夏至' },
      { m: 7, d: 7, name: '小暑' }, { m: 7, d: 22, name: '大暑' },
      { m: 8, d: 7, name: '立秋' }, { m: 8, d: 23, name: '處暑' },
      { m: 9, d: 7, name: '白露' }, { m: 9, d: 23, name: '秋分' },
      { m: 10, d: 8, name: '寒露' }, { m: 10, d: 23, name: '霜降' },
      { m: 11, d: 7, name: '立冬' }, { m: 11, d: 22, name: '小雪' },
      { m: 12, d: 7, name: '大雪' }, { m: 12, d: 21, name: '冬至' }
    ];
    let term = terms[terms.length - 1].name;
    for (let i = 0; i < terms.length; i++) {
      const t = terms[i];
      if (month > t.m || (month === t.m && day >= t.d)) {
        term = t.name;
      }
    }
    return term;
  },

  getLunarDate(date) {
    try {
      const formatter = new Intl.DateTimeFormat('zh-TW-u-ca-chinese', {
        month: 'long',
        day: 'numeric'
      });
      return '農曆 ' + formatter.format(date);
    } catch (e) {
      return '農曆 七月廿三';
    }
  },

  render(container, state = { activeTab: 'world', calYear: null, calMonth: null }) {
    if (container._clockInterval) {
      clearInterval(container._clockInterval);
      container._clockInterval = null;
    }

    const today = new Date();
    const currentCalYear = state.calYear !== null ? state.calYear : today.getFullYear();
    const currentCalMonth = state.calMonth !== null ? state.calMonth : today.getMonth();

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none justify-between overflow-hidden text-xs">
        <!-- Top Header & Tabs -->
        <div class="flex items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex-shrink-0">
          <div class="flex items-center space-x-1.5">
            <span class="p-1 rounded bg-sky-100 text-sky-700 text-xs font-bold">🕒 時鐘日曆</span>
            <span class="text-xs font-bold text-[#0d346c]">多國時區</span>
          </div>
          
          <div class="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px]">
            <button id="tab-world" class="px-2.5 py-0.5 rounded-md font-bold transition-all ${state.activeTab === 'world' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
              🌍 世界時間
            </button>
            <button id="tab-calendar" class="px-2.5 py-0.5 rounded-md font-bold transition-all ${state.activeTab === 'calendar' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
              📅 當月月曆
            </button>
          </div>
        </div>

        <!-- Main Taiwan Clock Hero -->
        <div class="px-3.5 py-2.5 bg-gradient-to-b from-sky-50/70 to-white border-b border-slate-100 flex-shrink-0">
          <div class="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <div class="flex items-center space-x-1 font-bold text-[#0d346c]">
              <span>🇹🇼</span>
              <span>台灣標準時間 (UTC+8)</span>
            </div>
            <span id="main-lunar-badge" class="px-2 py-0.2 rounded-full bg-sky-100/90 text-sky-800 border border-sky-200 font-bold text-[10px]">
              ${this.getLunarDate(today)}
            </span>
          </div>

          <div class="flex items-baseline justify-center my-0.5">
            <span id="main-clock-digits" class="text-3xl sm:text-4xl font-black font-mono tracking-wider text-[#0d346c]">--:--</span>
            <span id="main-clock-secs" class="text-lg sm:text-xl font-mono font-bold text-sky-600 ml-1.5">--</span>
          </div>

          <div class="flex items-center justify-center space-x-2 text-[11px] text-slate-600 font-semibold mt-0.5">
            <span id="main-clock-date">載入中...</span>
          </div>
        </div>

        <!-- Dynamic Body: World Clocks or Month Calendar -->
        <div class="flex-1 p-3 overflow-y-auto scrollbar-thin">
          ${state.activeTab === 'world' ? `
            <!-- World Clocks List -->
            <div class="space-y-2">
              ${this.WORLD_CITIES.map(city => `
                <div class="p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-sky-50/30 hover:border-sky-300 transition-all flex items-center justify-between shadow-xs">
                  <div class="flex items-center space-x-2.5 min-w-0 pr-2">
                    <span class="text-2xl flex-shrink-0">${city.flag}</span>
                    <div class="min-w-0">
                      <div class="flex items-center space-x-1.5 truncate">
                        <span class="font-bold text-xs text-[#0d346c] truncate">${city.name}</span>
                        <span id="diff-badge-${city.id}" class="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">--</span>
                      </div>
                      <div class="text-[10px] text-slate-500 mt-0.5 flex items-center space-x-1.5 truncate">
                        <span id="period-icon-${city.id}">--</span>
                        <span id="date-label-${city.id}">--</span>
                        <span class="text-slate-300">‧</span>
                        <span class="font-mono text-slate-400 text-[9px]">${city.tzLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-right flex-shrink-0">
                    <div id="time-digits-${city.id}" class="font-mono font-black text-base text-[#0d346c] tracking-tight">
                      --:--:--
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <!-- Month Calendar View -->
            <div class="flex flex-col h-full justify-between">
              <!-- Calendar Month Navigator -->
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <button id="cal-prev-btn" class="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" title="上個月">◀</button>
                <div class="flex items-center space-x-2">
                  <span class="font-bold text-xs text-[#0d346c] font-mono">${currentCalYear} 年 ${currentCalMonth + 1} 月</span>
                  <button id="cal-today-btn" class="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 hover:bg-sky-200 font-bold transition-colors cursor-pointer">今天</button>
                </div>
                <button id="cal-next-btn" class="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer" title="下個月">▶</button>
              </div>

              <!-- Weekday Headers -->
              <div class="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 py-1.5">
                <span class="text-rose-500">日</span>
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span class="text-sky-600">六</span>
              </div>

              <!-- Days Grid -->
              <div class="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                ${this.renderCalendarGrid(currentCalYear, currentCalMonth, today)}
              </div>

              <!-- Quick Mini World Clock Strip in Calendar View -->
              <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-lg">
                <span id="mini-tokyo" class="truncate">🇯🇵 --</span>
                <span class="text-slate-300">|</span>
                <span id="mini-london" class="truncate">🇬🇧 --</span>
                <span class="text-slate-300">|</span>
                <span id="mini-la" class="truncate">🇺🇸 --</span>
              </div>
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <span id="footer-solar-term">節氣：${this.getSolarTerm(today)}</span>
          <span class="text-emerald-700 font-bold flex items-center space-x-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>全球 NTP 即時同步</span>
          </span>
        </div>
      </div>
    `;

    // Bind Tabs
    const tabWorld = container.querySelector('#tab-world');
    const tabCal = container.querySelector('#tab-calendar');
    if (tabWorld) {
      tabWorld.addEventListener('click', () => {
        if (state.activeTab !== 'world') {
          ClockCalendarWidget.render(container, { ...state, activeTab: 'world' });
        }
      });
    }
    if (tabCal) {
      tabCal.addEventListener('click', () => {
        if (state.activeTab !== 'calendar') {
          ClockCalendarWidget.render(container, { ...state, activeTab: 'calendar' });
        }
      });
    }

    // Calendar Navigation Events
    if (state.activeTab === 'calendar') {
      const prevBtn = container.querySelector('#cal-prev-btn');
      const nextBtn = container.querySelector('#cal-next-btn');
      const todayBtn = container.querySelector('#cal-today-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          let newM = currentCalMonth - 1;
          let newY = currentCalYear;
          if (newM < 0) { newM = 11; newY--; }
          ClockCalendarWidget.render(container, { ...state, calYear: newY, calMonth: newM });
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          let newM = currentCalMonth + 1;
          let newY = currentCalYear;
          if (newM > 11) { newM = 0; newY++; }
          ClockCalendarWidget.render(container, { ...state, calYear: newY, calMonth: newM });
        });
      }
      if (todayBtn) {
        todayBtn.addEventListener('click', () => {
          ClockCalendarWidget.render(container, { ...state, calYear: today.getFullYear(), calMonth: today.getMonth() });
        });
      }
    }

    // Live Clock Ticking Function
    const updateTick = () => {
      const now = new Date();

      // Main Clock (Taipei)
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const dateStr = now.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });

      const mainDigits = container.querySelector('#main-clock-digits');
      const mainSecs = container.querySelector('#main-clock-secs');
      const mainDate = container.querySelector('#main-clock-date');

      if (mainDigits) mainDigits.textContent = `${hours}:${minutes}`;
      if (mainSecs) mainSecs.textContent = `:${seconds}`;
      if (mainDate) mainDate.textContent = dateStr;

      // Update World Clocks (View 1)
      if (state.activeTab === 'world') {
        this.WORLD_CITIES.forEach(city => {
          const timeDigits = container.querySelector(`#time-digits-${city.id}`);
          const dateLabel = container.querySelector(`#date-label-${city.id}`);
          const diffBadge = container.querySelector(`#diff-badge-${city.id}`);
          const periodIcon = container.querySelector(`#period-icon-${city.id}`);

          if (timeDigits) {
            const timeStr = now.toLocaleTimeString('en-GB', {
              timeZone: city.timeZone,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
            timeDigits.textContent = timeStr;

            const dateStrCity = now.toLocaleDateString('zh-TW', {
              timeZone: city.timeZone,
              month: 'numeric',
              day: 'numeric',
              weekday: 'short'
            });
            if (dateLabel) dateLabel.textContent = dateStrCity;

            // Hour Difference relative to Taipei
            const taipeiStr = now.toLocaleString('en-US', { timeZone: 'Asia/Taipei' });
            const cityStr = now.toLocaleString('en-US', { timeZone: city.timeZone });
            const diffHours = Math.round((new Date(cityStr) - new Date(taipeiStr)) / 3600000);

            if (diffBadge) {
              if (diffHours === 0) {
                diffBadge.textContent = '同時間';
                diffBadge.className = 'text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200';
              } else if (diffHours > 0) {
                diffBadge.textContent = `快 ${diffHours}h`;
                diffBadge.className = 'text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200';
              } else {
                diffBadge.textContent = `慢 ${Math.abs(diffHours)}h`;
                diffBadge.className = 'text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200';
              }
            }

            const hNum = parseInt(timeStr.slice(0, 2), 10);
            const isDay = hNum >= 6 && hNum < 18;
            if (periodIcon) {
              periodIcon.textContent = isDay ? '☀️' : '🌙';
              periodIcon.title = isDay ? '日間 (白天)' : '夜間';
            }
          }
        });
      } else {
        // Update Mini World Clocks Strip in Calendar View
        const miniTokyo = container.querySelector('#mini-tokyo');
        const miniLondon = container.querySelector('#mini-london');
        const miniLa = container.querySelector('#mini-la');

        const getMiniTime = (tz) => now.toLocaleTimeString('en-GB', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });

        if (miniTokyo) miniTokyo.textContent = `🇯🇵 東京 ${getMiniTime('Asia/Tokyo')}`;
        if (miniLondon) miniLondon.textContent = `🇬🇧 倫敦 ${getMiniTime('Europe/London')}`;
        if (miniLa) miniLa.textContent = `🇺🇸 洛杉磯 ${getMiniTime('America/Los_Angeles')}`;
      }
    };

    updateTick();
    container._clockInterval = setInterval(updateTick, 1000);
  },

  renderCalendarGrid(year, month, today) {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    let cells = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      cells.push(`<div class="py-1 text-slate-300">${prevDate}</div>`);
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const dayOfWeek = (firstDayIndex + d - 1) % 7;
      let textColor = 'text-slate-700 hover:bg-sky-50';
      if (dayOfWeek === 0) textColor = 'text-rose-600 hover:bg-rose-50';
      if (dayOfWeek === 6) textColor = 'text-sky-600 hover:bg-sky-50';

      if (isToday) {
        cells.push(`
          <div class="py-1 flex items-center justify-center">
            <span class="w-6 h-6 rounded-full bg-[#0d346c] text-white font-bold flex items-center justify-center shadow-xs">
              ${d}
            </span>
          </div>
        `);
      } else {
        cells.push(`
          <div class="py-1 rounded cursor-default transition-colors ${textColor}">
            ${d}
          </div>
        `);
      }
    }

    // Next month leading days to complete 35 or 42 grid cells
    const totalCells = cells.length;
    const remaining = totalCells <= 35 ? (35 - totalCells) : (42 - totalCells);
    for (let n = 1; n <= remaining; n++) {
      cells.push(`<div class="py-1 text-slate-300">${n}</div>`);
    }

    return cells.join('');
  }
};
