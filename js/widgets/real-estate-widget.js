export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】樂居實價登錄 ‧ 世傑路288號',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container) {
    const lejuUrl = 'https://www.leju.com.tw/community/L4dc10240794b2d?mode=buy';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居</span>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">【惠宇雲品】世傑路288號 ↗</a>
          </div>
          <div class="flex items-center space-x-1.5">
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all">
              <span>🏡 樂居【惠宇雲品】↗</span>
            </a>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto px-3.5 py-2 space-y-3">

          <!-- Community Overview -->
          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">總戶數</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">119<span class="text-xs font-bold">戶</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">屋齡</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">11<span class="text-xs font-bold">年</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">公設比</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">32.32<span class="text-xs font-bold">%</span></div>
            </div>
            <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <div class="text-[10px] text-slate-500 font-medium">價格</div>
              <div class="font-black text-emerald-700 text-base mt-0.5">4888<span class="text-xs font-bold">萬</span></div>
            </div>
            <div class="p-2 rounded-xl bg-amber-50 border border-amber-200">
              <div class="text-[10px] text-slate-500 font-medium">充電車位</div>
              <div class="font-black text-amber-700 text-xs mt-1">⚡ 有 (私)</div>
            </div>
          </div>

          <!-- School District -->
          <div class="flex items-center space-x-2 text-xs text-slate-600 px-1">
            <span class="font-bold text-[#0d346c]">🎓 學區</span>
            <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">龍山國小</span>
            <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">關埔國小</span>
            <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">光武國中</span>
          </div>

          <!-- Unit Type Distribution -->
          <div>
            <div class="text-xs font-bold text-[#0d346c] mb-1.5 px-1">🏠 房型分佈</div>
            <div class="grid grid-cols-5 gap-1.5 text-center text-xs">
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">開放式</div>
                <div class="font-bold text-slate-400 mt-0.5">--</div>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">1房</div>
                <div class="font-bold text-slate-400 mt-0.5">--</div>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">2房</div>
                <div class="font-bold text-slate-400 mt-0.5">--</div>
              </div>
              <div class="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300">
                <div class="text-[10px] text-emerald-700 font-medium">3房</div>
                <div class="font-black text-emerald-700 mt-0.5">1 戶</div>
              </div>
              <div class="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300">
                <div class="text-[10px] text-emerald-700 font-medium">4房+</div>
                <div class="font-black text-emerald-700 mt-0.5">2 戶</div>
              </div>
            </div>
          </div>

          <!-- Listings Table -->
          <div>
            <div class="text-xs font-bold text-[#0d346c] mb-1.5 px-1">📋 待售物件</div>
            <table class="w-full text-xs border-collapse">
              <thead>
                <tr class="bg-[#0d346c] text-white text-[11px]">
                  <th class="px-2 py-1.5 text-left rounded-tl-lg font-semibold">#</th>
                  <th class="px-2 py-1.5 text-left font-semibold">樓層</th>
                  <th class="px-2 py-1.5 text-left font-semibold">物件名稱</th>
                  <th class="px-2 py-1.5 text-right font-semibold">總價</th>
                  <th class="px-2 py-1.5 text-right font-semibold">總坪數</th>
                  <th class="px-2 py-1.5 text-center font-semibold">車位</th>
                  <th class="px-2 py-1.5 text-center font-semibold">房型</th>
                  <th class="px-2 py-1.5 text-right rounded-tr-lg font-semibold">刊登</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                  <td class="px-2 py-2 font-bold text-[#0d346c]">1.</td>
                  <td class="px-2 py-2 font-bold">15樓</td>
                  <td class="px-2 py-2">
                    <div class="font-semibold text-slate-800 leading-snug">🌿永慶裕展🧧【惠宇雲品】鄉村四改三房雙連號平車</div>
                  </td>
                  <td class="px-2 py-2 text-right font-black text-emerald-700">4198萬</td>
                  <td class="px-2 py-2 text-right font-mono font-bold text-slate-700">73.18</td>
                  <td class="px-2 py-2 text-center text-sky-700 font-semibold">有車位</td>
                  <td class="px-2 py-2 text-center font-bold">4房</td>
                  <td class="px-2 py-2 text-right text-slate-500">8個刊登</td>
                </tr>
                <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition-colors bg-slate-50/30">
                  <td class="px-2 py-2 font-bold text-[#0d346c]">2.</td>
                  <td class="px-2 py-2 font-bold">13樓 <span class="text-[10px] px-1 py-0.5 rounded bg-rose-100 text-rose-700 font-bold ml-0.5">新</span></td>
                  <td class="px-2 py-2">
                    <div class="font-semibold text-slate-800 leading-snug">⭐惠宇雲品⭐最大四房景觀戶+B1雙車位~關埔商圈</div>
                  </td>
                  <td class="px-2 py-2 text-right font-black text-emerald-700">4980萬</td>
                  <td class="px-2 py-2 text-right font-mono font-bold text-slate-700">83.27</td>
                  <td class="px-2 py-2 text-center text-sky-700 font-semibold">有車位</td>
                  <td class="px-2 py-2 text-center font-bold">4房</td>
                  <td class="px-2 py-2 text-right text-slate-500">13個刊登</td>
                </tr>
                <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition-colors">
                  <td class="px-2 py-2 font-bold text-[#0d346c]">3.</td>
                  <td class="px-2 py-2 font-bold">3樓</td>
                  <td class="px-2 py-2">
                    <div class="font-semibold text-slate-800 leading-snug">關埔好市多商圈『惠宇雲品』精裝美3+1房＋雙平車</div>
                  </td>
                  <td class="px-2 py-2 text-right font-black text-emerald-700">4888萬</td>
                  <td class="px-2 py-2 text-right font-mono font-bold text-slate-700">76.76</td>
                  <td class="px-2 py-2 text-center text-sky-700 font-semibold">有車位</td>
                  <td class="px-2 py-2 text-center font-bold">4房</td>
                  <td class="px-2 py-2 text-right text-slate-500">24個刊登</td>
                </tr>
                <tr class="hover:bg-sky-50/50 transition-colors bg-slate-50/30">
                  <td class="px-2 py-2 font-bold text-[#0d346c]">4.</td>
                  <td class="px-2 py-2 font-bold">3樓</td>
                  <td class="px-2 py-2">
                    <div class="font-semibold text-slate-800 leading-snug">惠宇雲品3+1房雙車</div>
                  </td>
                  <td class="px-2 py-2 text-right font-black text-emerald-700">4888萬</td>
                  <td class="px-2 py-2 text-right font-mono font-bold text-slate-700">76.76</td>
                  <td class="px-2 py-2 text-center text-sky-700 font-semibold">有車位</td>
                  <td class="px-2 py-2 text-center font-bold">3房</td>
                  <td class="px-2 py-2 text-right text-slate-500">1個刊登</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：樂居 (LEJU.com.tw)</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">【惠宇雲品】世傑路288號</span>
          </div>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://www.leju.com.tw/community/L4dc10240794b2d?mode=buy ↗
          </a>
        </div>
      </div>
    `;
  }
};
