export const ClockCalendarWidget = {
  id: 'clock-calendar',
  title: '實時時鐘與日曆',
  icon: 'clock',
  defaultWidth: 4,
  defaultHeight: 3,
  minWidth: 3,
  minHeight: 2,

  render(container) {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const dateStr = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
      
      const timeDisplay = container.querySelector('#clock-time-display');
      const secDisplay = container.querySelector('#clock-sec-display');
      const dateDisplay = container.querySelector('#clock-date-display');
      
      if (timeDisplay) timeDisplay.textContent = `${hours}:${minutes}`;
      if (secDisplay) secDisplay.textContent = `:${seconds}`;
      if (dateDisplay) dateDisplay.textContent = dateStr;
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <span class="text-xs font-semibold text-slate-400">🕒 台灣標準時間 (UTC+8)</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">農曆 七月十九</span>
        </div>

        <div class="my-auto py-2 text-center">
          <div class="flex items-baseline justify-center">
            <span id="clock-time-display" class="text-5xl font-black font-mono tracking-wider text-white">--:--</span>
            <span id="clock-sec-display" class="text-2xl font-mono font-bold text-blue-400 ml-1">--</span>
          </div>
          <div id="clock-date-display" class="text-xs font-medium text-slate-300 mt-2">載入中...</div>
        </div>

        <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>節氣：處暑</span>
          <span class="text-emerald-400">系統即時同步中</span>
        </div>
      </div>
    `;

    updateTime();
    const interval = setInterval(updateTime, 1000);
    container._clockInterval = interval;
  }
};
