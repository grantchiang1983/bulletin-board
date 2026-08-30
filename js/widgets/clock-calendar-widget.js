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
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-200">
          <span class="text-xs font-bold text-[#0d346c]">🕒 台灣標準時間 (UTC+8)</span>
          <span class="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">農曆 七月十九</span>
        </div>

        <!-- Clock Face -->
        <div class="my-auto py-2 text-center">
          <div class="flex items-baseline justify-center">
            <span id="clock-time-display" class="text-4xl font-black font-mono tracking-wider text-[#0d346c]">--:--</span>
            <span id="clock-sec-display" class="text-xl font-mono font-bold text-sky-600 ml-1">--</span>
          </div>
          <div id="clock-date-display" class="text-xs font-bold text-slate-600 mt-2">載入中...</div>
        </div>

        <!-- Footer Information -->
        <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>節氣：處暑</span>
          <span class="text-sky-700 font-bold">國家標準時間即時同步</span>
        </div>
      </div>
    `;

    updateTime();
    setInterval(updateTime, 1000);
  }
};
