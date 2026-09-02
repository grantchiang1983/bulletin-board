export const RealEstateQianpinWidget = {
  id: 'real-estate-qianpin',
  title: '【惠宇謙品】最新價 76.01 萬/坪 ‧ 201筆交易 ‧ 樂居實價登錄',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container) {
    const lejuUrl = 'https://www.leju.com.tw/community/L1171038926d104?mode=price';

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居</span>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">【惠宇謙品】世傑路99號 ↗</a>
            <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300 hidden sm:inline">
              201 筆交易
            </span>
          </div>
          <div class="flex items-center space-x-1.5">
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all">
              <span>🏡 樂居【惠宇謙品】↗</span>
            </a>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-3">

          <!-- Community Overview -->
          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">總戶數</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">158<span class="text-xs font-bold">戶</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">屋齡</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">9<span class="text-xs font-bold">年</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">公設比</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">32.27<span class="text-xs font-bold">%</span></div>
            </div>
            <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <div class="text-[10px] text-slate-500 font-medium">最新價格</div>
              <div class="font-black text-emerald-700 text-base mt-0.5">76.01<span class="text-xs font-bold">萬/坪</span></div>
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-[10px] text-slate-500 font-medium">總樓高 / 建商</div>
              <div class="font-black text-[#0d346c] text-xs mt-1">24 樓 ‧ 惠宇</div>
            </div>
          </div>

          <!-- School District & Location -->
          <div class="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 gap-1.5">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-[#0d346c]">🎓 學區</span>
              <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">龍山國小</span>
              <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">光武國中</span>
            </div>
            <div class="text-[11px] text-slate-500 font-medium">
              <span>📍 新竹市東區世傑路 99 號 ‧ 關埔重劃區</span>
            </div>
          </div>

          <!-- Unit Type Distribution -->
          <div>
            <div class="text-xs font-bold text-[#0d346c] mb-1.5 px-1">🏠 房型分佈與行情概況</div>
            <div class="grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">歷史最高價</div>
                <div class="font-bold text-[#0d346c] mt-0.5">76.02 萬/坪</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">歷史成交均價</div>
                <div class="font-bold text-slate-700 mt-0.5">31.69 萬/坪</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">主力格局規劃</div>
                <div class="font-bold text-slate-700 mt-0.5">3 ~ 4 房 (53-78坪)</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">累計成交總數</div>
                <div class="font-black text-emerald-700 mt-0.5">201 筆交易</div>
              </div>
            </div>
          </div>

          <!-- Listings Section (待售物件 0 筆) -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-[#0d346c] mb-1.5 px-1">
              <span>📋 待售物件</span>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px]">
                待售物件 0 筆
              </span>
            </div>

            <!-- Zero Listing Empty State Card -->
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 shadow-sm">
              <div class="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-lg">
                🔍
              </div>
              <div>
                <h4 class="font-bold text-slate-800 text-sm">目前尚無待售刊登物件 (待售物件 0 筆)</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  【惠宇謙品】目前在樂居平台上暫無屋主或房仲公開刊登之待售物件。<br>
                  最新實價成交參考為 <b class="text-[#0d346c]">76.01 萬/坪</b>，累計共 <b class="text-emerald-700">201 筆實價登錄紀錄</b>。
                </p>
              </div>
              <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="mt-1 px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#0284c7] hover:text-[#0369a1] text-xs font-bold border border-slate-300 transition-colors shadow-sm inline-flex items-center space-x-1">
                <span>前往樂居查看 201 筆歷史成交明細 ↗</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：樂居 (LEJU.com.tw)</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">【惠宇謙品】最新價 76.01 萬/坪，201 筆交易</span>
          </div>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[50%]">
            https://www.leju.com.tw/community/L1171038926d104?mode=price ↗
          </a>
        </div>
      </div>
    `;
  }
};
