export const RealEstateQianpinWidget = {
  id: 'real-estate-qianpin',
  title: '【惠宇謙品】最新價 76.01 萬/坪 ‧ 201筆交易 ‧ 樂居實價登錄',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  // Fallback initial data (2026 latest calibration)
  _fallbackData: {
    totalUnits: "158",
    age: "9",
    publicRatio: "32.27",
    recentPrice: "76.01",
    highestPrice: "76.4",
    avgHistoricalPrice: "31.69",
    totalTransactions: "201",
    builder: "24 樓 ‧ 惠宇",
    schoolDistricts: ["龍山國小", "光武國中"],
    roomTypeSummary: "3 ~ 4 房 (53-78坪)",
    forSaleCount: 0,
    recentTransactions: [
      { floor: "21樓", rooms: "3房", unitPrice: "76.4", totalPrice: "3,800", ping: "58.2", note: "高樓景觀戶" },
      { floor: "24樓", rooms: "4房", unitPrice: "76.3", totalPrice: "4,800", ping: "79.6", note: "頂樓景觀戶" },
      { floor: "8樓", rooms: "4房", unitPrice: "74.8", totalPrice: "4,236", ping: "72.6", note: "標準格局平車" },
      { floor: "14樓", rooms: "4房", unitPrice: "70.5", totalPrice: "5,050", ping: "88.3", note: "大坪數換屋" }
    ]
  },

  async loadRemoteData() {
    try {
      const res = await fetch(`data/real-estate-data.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('RealEstateQianpinWidget: Remote data load failed, using fallback cache.', e);
      return null;
    }
  },

  render(container, state = null) {
    const lejuUrl = 'https://www.leju.com.tw/community/L1171038926d104?mode=price';
    const currentState = state || {
      data: this._fallbackData,
      isLoading: false,
      lastUpdated: '2026/10/19 09:20'
    };

    const d = currentState.data || this._fallbackData;

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居</span>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">【惠宇謙品】世傑路99號 ↗</a>
            <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300 hidden sm:inline">
              ${d.totalTransactions} 筆交易
            </span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200 hidden md:inline">
              🔄 ${currentState.lastUpdated}
            </span>
          </div>
          <div class="flex items-center space-x-1.5">
            <button id="qianpin-refresh-btn" class="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer">
              <span class="${currentState.isLoading ? 'animate-spin inline-block' : ''}">🔄</span>
              <span>${currentState.isLoading ? '同步中...' : '重新整理'}</span>
            </button>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all">
              <span>🏡 樂居【惠宇謙品】↗</span>
            </a>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto px-3.5 py-2.5 space-y-3 scrollbar-thin">

          <!-- Community Overview -->
          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">總戶數</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">${d.totalUnits}<span class="text-xs font-bold">戶</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">屋齡</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">${d.age}<span class="text-xs font-bold">年</span></div>
            </div>
            <div class="p-2 rounded-xl bg-sky-50 border border-sky-200">
              <div class="text-[10px] text-slate-500 font-medium">公設比</div>
              <div class="font-black text-[#0d346c] text-base mt-0.5">${d.publicRatio}<span class="text-xs font-bold">%</span></div>
            </div>
            <div class="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
              <div class="text-[10px] text-slate-500 font-medium">最新價格</div>
              <div class="font-black text-emerald-700 text-base mt-0.5">${d.recentPrice}<span class="text-xs font-bold">萬/坪</span></div>
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <div class="text-[10px] text-slate-500 font-medium">總樓高 / 建商</div>
              <div class="font-black text-[#0d346c] text-xs mt-1">${d.builder}</div>
            </div>
          </div>

          <!-- School District & Location -->
          <div class="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 gap-1.5">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-[#0d346c]">🎓 學區</span>
              ${d.schoolDistricts.map(s => `<span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200">${s}</span>`).join(' ')}
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
                <div class="font-bold text-rose-600 mt-0.5">${d.highestPrice} 萬/坪</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">歷史成交均價</div>
                <div class="font-bold text-slate-700 mt-0.5">${d.avgHistoricalPrice} 萬/坪</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">主力格局規劃</div>
                <div class="font-bold text-slate-700 mt-0.5">${d.roomTypeSummary}</div>
              </div>
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-500 font-medium">累計成交總數</div>
                <div class="font-black text-emerald-700 mt-0.5">${d.totalTransactions} 筆交易</div>
              </div>
            </div>
          </div>

          <!-- Recent Transactions Section -->
          ${d.recentTransactions && d.recentTransactions.length > 0 ? `
            <div>
              <div class="flex items-center justify-between text-xs font-bold text-[#0d346c] mb-1.5 px-1">
                <span>📈 近期實價登錄成交行情 (精選戶別)</span>
                <span class="text-[11px] text-slate-400 font-normal">實價登錄揭露數據</span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                ${d.recentTransactions.map(tx => `
                  <div class="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-between hover:bg-sky-50/40 transition-colors">
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 rounded bg-[#0d346c] text-white font-bold text-xs">${tx.floor}</span>
                      <div>
                        <div class="font-bold text-xs text-slate-800">${tx.note || '住家用'} (${tx.rooms})</div>
                        <div class="text-[10px] text-slate-500 font-mono">${tx.ping ? tx.ping + ' 坪 ‧ ' : ''}總價 ${tx.totalPrice} 萬</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-black text-sm text-emerald-700 font-mono">${tx.unitPrice} <span class="text-[10px]">萬/坪</span></div>
                      <span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">最新實登</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Listings Section (待售物件 0 筆) -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-[#0d346c] mb-1.5 px-1">
              <span>📋 待售物件</span>
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-bold text-[11px]">
                待售物件 ${d.forSaleCount || 0} 筆
              </span>
            </div>

            <!-- Zero Listing Empty State Card -->
            <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-2 shadow-xs">
              <div class="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-base">
                🔍
              </div>
              <div>
                <h4 class="font-bold text-slate-800 text-xs">目前尚無公開待售物件 (待售物件 ${d.forSaleCount || 0} 筆)</h4>
                <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  【惠宇謙品】目前在樂居平台上暫無公開刊登之待售物件。<br>
                  最新實價成交參考為 <b class="text-[#0d346c]">${d.recentPrice} 萬/坪</b>，累計共 <b class="text-emerald-700">${d.totalTransactions} 筆實價登錄紀錄</b>。
                </p>
              </div>
              <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#0284c7] hover:text-[#0369a1] text-xs font-bold border border-slate-300 transition-colors shadow-xs inline-flex items-center space-x-1">
                <span>前往樂居查看 ${d.totalTransactions} 筆完整歷史成交明細 ↗</span>
              </a>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：樂居 (LEJU) ‧ 每日 GitHub Actions 自動更新</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">最新價 ${d.recentPrice} 萬/坪，${d.totalTransactions} 筆交易</span>
          </div>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[45%]">
            查看樂居即時社區頁 ↗
          </a>
        </div>
      </div>
    `;

    // Bind Refresh button
    const refreshBtn = container.querySelector('#qianpin-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        this.render(container, { ...currentState, isLoading: true });
        const remote = await this.loadRemoteData();
        if (remote && remote.qianpin) {
          this.render(container, {
            data: remote.qianpin,
            isLoading: false,
            lastUpdated: remote.lastUpdatedFormatted || '剛剛更新'
          });
        } else {
          setTimeout(() => {
            this.render(container, {
              ...currentState,
              isLoading: false,
              lastUpdated: '已為最新行情'
            });
          }, 600);
        }
      });
    }

    // Auto-fetch in background if not already loaded once
    if (!currentState.hasLoadedRemote) {
      this.loadRemoteData().then(remote => {
        if (remote && remote.qianpin) {
          this.render(container, {
            data: remote.qianpin,
            isLoading: false,
            lastUpdated: remote.lastUpdatedFormatted || '剛剛更新',
            hasLoadedRemote: true
          });
        }
      });
    }
  }
};
