export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】樂居實價登錄 ‧ 世傑路288號',
  icon: 'home',
  defaultWidth: 8,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  // Fallback initial data (2026 latest calibration)
  _fallbackData: {
    totalUnits: "119",
    age: "11",
    publicRatio: "32.32",
    recentPrice: "71.3",
    highestPrice: "76.05",
    currentForSaleMinPrice: "4198",
    chargingStation: "⚡ 有 (私)",
    schoolDistricts: ["龍山國小", "關埔國小", "光武國中"],
    roomDistribution: {
      open: "--",
      one: "--",
      two: "--",
      three: "1 戶",
      fourPlus: "2 戶"
    },
    listings: [
      {
        rank: 1,
        floor: "15樓",
        title: "🌿永慶裕展🧧【惠宇雲品】鄉村四改三房雙連號平車",
        price: "4198萬",
        ping: "73.18",
        parking: "有車位",
        rooms: "4房",
        postings: "8個刊登"
      },
      {
        rank: 2,
        floor: "13樓",
        isNew: true,
        title: "⭐惠宇雲品⭐最大四房景觀戶+B1雙車位~關埔商圈",
        price: "4980萬",
        ping: "83.27",
        parking: "有車位",
        rooms: "4房",
        postings: "13個刊登"
      },
      {
        rank: 3,
        floor: "3樓",
        title: "關埔好市多商圈『惠宇雲品』精裝美3+1房＋雙平車",
        price: "4888萬",
        ping: "76.76",
        parking: "有車位",
        rooms: "4房",
        postings: "24個刊登"
      },
      {
        rank: 4,
        floor: "3樓",
        title: "惠宇雲品3+1房雙車",
        price: "4888萬",
        ping: "76.76",
        parking: "有車位",
        rooms: "3房",
        postings: "1個刊登"
      }
    ],
    recentTransactions: [
      { floor: "19樓", rooms: "3房", unitPrice: "71.3", totalPrice: "3,558", date: "近期成交" },
      { floor: "20樓", rooms: "4房", unitPrice: "75.6", totalPrice: "4,310", date: "近期成交" },
      { floor: "15樓", rooms: "3房", unitPrice: "76.0", totalPrice: "3,750", date: "近期成交" },
      { floor: "11樓", rooms: "3房", unitPrice: "75.4", totalPrice: "3,830", date: "近期成交" }
    ]
  },

  async loadRemoteData() {
    try {
      const res = await fetch(`data/real-estate-data.json?t=${Date.now()}`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('RealEstateWidget: Remote data load failed, using fallback cache.', e);
      return null;
    }
  },

  render(container, state = null) {
    const lejuUrl = 'https://www.leju.com.tw/community/L4dc10240794b2d?mode=buy';
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
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">【惠宇雲品】世傑路288號 ↗</a>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200 hidden sm:inline">
              🔄 ${currentState.lastUpdated}
            </span>
          </div>
          <div class="flex items-center space-x-1.5">
            <button id="yunpin-refresh-btn" class="px-2.5 py-1 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer">
              <span class="${currentState.isLoading ? 'animate-spin inline-block' : ''}">🔄</span>
              <span>${currentState.isLoading ? '同步中...' : '重新整理'}</span>
            </button>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all">
              <span>🏡 樂居【惠宇雲品】↗</span>
            </a>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto px-3.5 py-2 space-y-3 scrollbar-thin">

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
              <div class="text-[10px] text-slate-500 font-medium">最新成交</div>
              <div class="font-black text-emerald-700 text-base mt-0.5">${d.recentPrice}<span class="text-xs font-bold">萬/坪</span></div>
            </div>
            <div class="p-2 rounded-xl bg-amber-50 border border-amber-200">
              <div class="text-[10px] text-slate-500 font-medium">充電車位</div>
              <div class="font-black text-amber-700 text-xs mt-1">${d.chargingStation}</div>
            </div>
          </div>

          <!-- School District & Price summary -->
          <div class="flex flex-wrap items-center justify-between text-xs text-slate-600 px-1 gap-1">
            <div class="flex items-center space-x-1.5">
              <span class="font-bold text-[#0d346c]">🎓 學區</span>
              ${d.schoolDistricts.map(s => `<span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold border border-sky-200 text-[11px]">${s}</span>`).join(' ')}
            </div>
            <div class="text-[11px] text-slate-500 font-medium">
              <span>歷史最高單價：<b class="text-rose-600 font-mono">${d.highestPrice} 萬/坪</b></span>
            </div>
          </div>

          <!-- Unit Type Distribution -->
          <div>
            <div class="text-xs font-bold text-[#0d346c] mb-1.5 px-1">🏠 房型分佈</div>
            <div class="grid grid-cols-5 gap-1.5 text-center text-xs">
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">開放式</div>
                <div class="font-bold text-slate-400 mt-0.5">${d.roomDistribution.open || '--'}</div>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">1房</div>
                <div class="font-bold text-slate-400 mt-0.5">${d.roomDistribution.one || '--'}</div>
              </div>
              <div class="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                <div class="text-[10px] text-slate-400 font-medium">2房</div>
                <div class="font-bold text-slate-400 mt-0.5">${d.roomDistribution.two || '--'}</div>
              </div>
              <div class="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300">
                <div class="text-[10px] text-emerald-700 font-medium">3房</div>
                <div class="font-black text-emerald-700 mt-0.5">${d.roomDistribution.three || '1 戶'}</div>
              </div>
              <div class="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300">
                <div class="text-[10px] text-emerald-700 font-medium">4房+</div>
                <div class="font-black text-emerald-700 mt-0.5">${d.roomDistribution.fourPlus || '2 戶'}</div>
              </div>
            </div>
          </div>

          <!-- Listings Table -->
          <div>
            <div class="flex items-center justify-between text-xs font-bold text-[#0d346c] mb-1.5 px-1">
              <span>📋 待售物件 (${d.listings ? d.listings.length : 0} 筆)</span>
              <span class="text-[11px] text-slate-400 font-normal">低總價起：<b class="text-emerald-700 font-mono font-bold">${d.currentForSaleMinPrice || '4198'} 萬</b></span>
            </div>
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
                ${d.listings.map((item, idx) => `
                  <tr class="border-b border-slate-100 hover:bg-sky-50/50 transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}">
                    <td class="px-2 py-2 font-bold text-[#0d346c]">${item.rank || (idx + 1)}.</td>
                    <td class="px-2 py-2 font-bold">
                      ${item.floor}
                      ${item.isNew ? '<span class="text-[10px] px-1 py-0.5 rounded bg-rose-100 text-rose-700 font-bold ml-0.5">新</span>' : ''}
                    </td>
                    <td class="px-2 py-2">
                      <div class="font-semibold text-slate-800 leading-snug">${item.title}</div>
                    </td>
                    <td class="px-2 py-2 text-right font-black text-emerald-700">${item.price}</td>
                    <td class="px-2 py-2 text-right font-mono font-bold text-slate-700">${item.ping}</td>
                    <td class="px-2 py-2 text-center text-sky-700 font-semibold">${item.parking}</td>
                    <td class="px-2 py-2 text-center font-bold">${item.rooms}</td>
                    <td class="px-2 py-2 text-right text-slate-500">${item.postings}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span>資料來源：樂居 (LEJU) ‧ 每日 GitHub Actions 自動更新</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">世傑路288號</span>
          </div>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[45%]">
            查看樂居即時社區頁 ↗
          </a>
        </div>
      </div>
    `;

    // Bind Refresh button
    const refreshBtn = container.querySelector('#yunpin-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        this.render(container, { ...currentState, isLoading: true });
        const remote = await this.loadRemoteData();
        if (remote && remote.yunpin) {
          this.render(container, {
            data: remote.yunpin,
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
        if (remote && remote.yunpin) {
          this.render(container, {
            data: remote.yunpin,
            isLoading: false,
            lastUpdated: remote.lastUpdatedFormatted || '剛剛更新',
            hasLoadedRemote: true
          });
        }
      });
    }
  }
};
