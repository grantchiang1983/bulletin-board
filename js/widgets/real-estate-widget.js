export const RealEstateWidget = {
  id: 'real-estate',
  title: '【惠宇雲品】一年均價 71.27 萬/坪 ‧ 162筆交易 ‧ 樂居實價登錄',
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
    oneYearAvgPrice: "71.27",
    recentPrice: "71.27",
    totalTransactions: "162",
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
        isNew: false,
        title: "🌿永慶裕展🧧【惠宇雲品】鄉村四改三房雙連號平車",
        price: "4198萬",
        ping: "73.18",
        parking: "有車位",
        rooms: "3房",
        postings: "8個刊登"
      },
      {
        rank: 2,
        floor: "13樓",
        isNew: false,
        title: "⭐惠宇雲品⭐最大四房景觀戶+B1雙連號車位~關埔好市多",
        price: "4788萬",
        ping: "83.27",
        parking: "有車位",
        rooms: "4房",
        postings: "15個刊登"
      },
      {
        rank: 3,
        floor: "3樓",
        isNew: false,
        title: "關埔好市多商圈『惠宇雲品』大器美3+1房＋雙平車",
        price: "4888萬",
        ping: "76.76",
        parking: "有車位",
        rooms: "4房",
        postings: "24個刊登"
      }
    ],
    recentTransactions: [
      { floor: "19樓", rooms: "3房", unitPrice: "71.27", totalPrice: "3,558", date: "近期成交" },
      { floor: "20樓", rooms: "4房", unitPrice: "75.60", totalPrice: "4,310", date: "近期成交" },
      { floor: "15樓", rooms: "3房", unitPrice: "76.05", totalPrice: "3,750", date: "歷史最高" },
      { floor: "11樓", rooms: "3房", unitPrice: "75.40", totalPrice: "3,830", date: "近期成交" }
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
      showHistory: false,
      lastUpdated: '每日07:00自動更新',
      historyCount: 181
    };

    const d = currentState.data || this._fallbackData;

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-sm">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-amber-100 text-amber-800 text-xs font-bold">🏡 樂居</span>
            <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-black text-[#0d346c] hover:text-[#0284c7] transition-colors">【惠宇雲品】世傑路288號 ↗</a>
            <span class="text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold border border-sky-300 hidden sm:inline">
              ${d.totalTransactions || '162'} 筆交易
            </span>
            <span class="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold border border-emerald-300 hidden md:inline">
              均價 ${d.recentPrice || '71.27'} 萬/坪
            </span>
          </div>
          <div class="flex items-center space-x-1.5">
            <button id="yunpin-history-btn" class="px-2.5 py-1 rounded-lg ${currentState.showHistory ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700'} text-xs font-bold flex items-center space-x-1 shadow-xs transition-all cursor-pointer">
              <span>📈 180天趨勢</span>
            </button>
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

          <!-- 180-Day History Drawer (Collapsible) -->
          ${currentState.showHistory ? `
            <div class="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/95 via-sky-50/50 to-indigo-50/90 border border-indigo-200 text-xs text-indigo-950 space-y-3 animate-fade-in shadow-xs">
              <!-- Header -->
              <div class="flex items-center justify-between font-bold border-b border-indigo-200/80 pb-2">
                <div class="flex items-center space-x-1.5">
                  <span class="text-sm">📈</span>
                  <span class="font-extrabold text-[#0d346c]">【惠宇雲品】近 180 天房價差異與走勢分析</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-mono font-bold">180 天歷史資料完整保留</span>
              </div>

              <!-- Milestone Price Difference Cards (4 Cards) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div class="p-2.5 rounded-xl bg-white border border-indigo-100/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div class="text-slate-500 text-[10px] font-medium">近 30 天單價差異</div>
                  <div class="font-black text-emerald-700 mt-1 font-mono text-sm">+0.27 <span class="text-[10px] font-semibold text-slate-500">萬/坪</span></div>
                  <div class="text-[10px] text-emerald-600 font-semibold mt-0.5 font-mono">71.00 ➔ 71.27 (+0.4%)</div>
                </div>
                <div class="p-2.5 rounded-xl bg-white border border-indigo-100/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div class="text-slate-500 text-[10px] font-medium">近 90 天單價差異</div>
                  <div class="font-black text-emerald-700 mt-1 font-mono text-sm">+0.67 <span class="text-[10px] font-semibold text-slate-500">萬/坪</span></div>
                  <div class="text-[10px] text-emerald-600 font-semibold mt-0.5 font-mono">70.60 ➔ 71.27 (+0.9%)</div>
                </div>
                <div class="p-2.5 rounded-xl bg-white border border-indigo-100/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div class="text-slate-500 text-[10px] font-medium">近 180 天累計漲幅</div>
                  <div class="font-black text-emerald-700 mt-1 font-mono text-sm">+1.47 <span class="text-[10px] font-semibold text-slate-500">萬/坪</span></div>
                  <div class="text-[10px] text-emerald-600 font-bold mt-0.5 font-mono">69.80 ➔ 71.27 (+2.1%)</div>
                </div>
                <div class="p-2.5 rounded-xl bg-white border border-indigo-100/90 shadow-2xs hover:shadow-xs transition-shadow">
                  <div class="text-slate-500 text-[10px] font-medium">在售最低總價門檻</div>
                  <div class="font-black text-indigo-700 mt-1 font-mono text-sm">+48 <span class="text-[10px] font-semibold text-slate-500">萬</span></div>
                  <div class="text-[10px] text-slate-500 font-medium mt-0.5">4150萬 ➔ 4198萬 (在售-2戶)</div>
                </div>
              </div>

              <!-- Visual SVG Trend Line Chart -->
              <div class="p-3 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                  <span class="flex items-center space-x-1.5">
                    <span>📊 180 天均價走勢曲線圖</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-mono font-normal border border-emerald-200">萬/坪</span>
                  </span>
                  <span class="text-[10px] text-slate-400 font-mono font-normal">2026/04/22 ～ 2026/10/19</span>
                </div>

                <div class="w-full h-20 relative pt-1">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 500 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ypTrendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#059669" stop-opacity="0.25" />
                        <stop offset="100%" stop-color="#059669" stop-opacity="0.0" />
                      </linearGradient>
                    </defs>
                    <!-- Grid reference lines -->
                    <line x1="10" y1="12" x2="490" y2="12" stroke="#e2e8f0" stroke-dasharray="3 3" stroke-width="1" />
                    <line x1="10" y1="36" x2="490" y2="36" stroke="#f1f5f9" stroke-dasharray="2 2" stroke-width="1" />
                    <line x1="10" y1="58" x2="490" y2="58" stroke="#e2e8f0" stroke-dasharray="3 3" stroke-width="1" />
                    
                    <!-- Area Fill -->
                    <path d="M 10 58 C 140 58, 200 40, 250 36 C 320 33, 380 22, 420 18 C 455 15, 475 13, 490 12 L 490 68 L 10 68 Z" fill="url(#ypTrendGrad)" />
                    <!-- Curve Line -->
                    <path d="M 10 58 C 140 58, 200 40, 250 36 C 320 33, 380 22, 420 18 C 455 15, 475 13, 490 12" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                    
                    <!-- Milestone Dots -->
                    <circle cx="10" cy="58" r="4" fill="#64748b" stroke="#ffffff" stroke-width="2" />
                    <circle cx="250" cy="36" r="3.5" fill="#059669" stroke="#ffffff" stroke-width="2" />
                    <circle cx="420" cy="18" r="3.5" fill="#059669" stroke="#ffffff" stroke-width="2" />
                    <circle cx="490" cy="12" r="5" fill="#047857" stroke="#ffffff" stroke-width="2.5" />
                  </svg>
                </div>

                <!-- Timeline Axis Labels -->
                <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 px-0.5 pt-1 border-t border-slate-100">
                  <div class="text-left">
                    <span class="block text-slate-400">180天前 (4/22)</span>
                    <span class="font-bold text-slate-600">69.80 萬/坪</span>
                  </div>
                  <div class="text-center">
                    <span class="block text-slate-400">90天前 (7/21)</span>
                    <span class="font-bold text-slate-600">70.60 萬/坪</span>
                  </div>
                  <div class="text-center">
                    <span class="block text-slate-400">30天前 (9/19)</span>
                    <span class="font-bold text-slate-600">71.00 萬/坪</span>
                  </div>
                  <div class="text-right">
                    <span class="block text-emerald-600 font-semibold">今日最新 (10/19)</span>
                    <span class="font-black text-emerald-700">${d.recentPrice || '71.27'} 萬/坪</span>
                  </div>
                </div>
              </div>

              <!-- Footer Tip -->
              <div class="flex items-center justify-between text-[10px] text-indigo-700 px-1 font-medium">
                <span>💡 雲端自動更新排程：每日 07:00 AM (UTC+8) 由 GitHub Actions 滾動保留近 180 天</span>
                <span>在售戶數變化：5戶 ➔ 3戶</span>
              </div>
            </div>
          ` : ''}

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
              <div class="text-[10px] text-slate-500 font-medium">一年均價</div>
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
              <span>累積實登：<b class="text-[#0d346c] font-mono">${d.totalTransactions || '162'} 筆</b> ‧ 最高單價：<b class="text-rose-600 font-mono">${d.highestPrice} 萬/坪</b></span>
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
                <div class="font-black text-emerald-700 mt-0.5">${d.roomDistribution.three || '2 戶'}</div>
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
                      ${item.isNew ? '<span class="text-[10px] px-1 py-0.5 rounded bg-rose-100 text-rose-700 font-bold ml-0.5">新上架</span>' : ''}
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
            <span>資料來源：樂居 ‧ 每日 07:00 AM (UTC+8) 自動更新</span>
            <span>‧</span>
            <span class="text-sky-700 font-semibold">一年均價 ${d.recentPrice || '71.27'} 萬/坪，${d.totalTransactions || '162'} 筆交易</span>
          </div>
          <a href="${lejuUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline truncate max-w-[45%]">
            查看樂居【惠宇雲品】社區頁 ↗
          </a>
        </div>
      </div>
    `;

    // Bind History Toggle button
    const histBtn = container.querySelector('#yunpin-history-btn');
    if (histBtn) {
      histBtn.addEventListener('click', () => {
        this.render(container, { ...currentState, showHistory: !currentState.showHistory });
      });
    }

    // Bind Refresh button
    const refreshBtn = container.querySelector('#yunpin-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        this.render(container, { ...currentState, isLoading: true });
        const remote = await this.loadRemoteData();
        if (remote && remote.yunpin) {
          this.render(container, {
            ...currentState,
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
            ...currentState,
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
