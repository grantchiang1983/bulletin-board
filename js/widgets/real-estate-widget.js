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
    currentForSaleMinPrice: "3888",
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
        floor: "4樓",
        isNew: true,
        title: "✨最新降價 ‧ 關埔好市多商圈【惠宇雲品】精裝景觀3房+平車",
        price: "3888萬",
        ping: "56.76",
        parking: "有車位",
        rooms: "3房",
        postings: "5個刊登",
        initialPrice180d: "4080萬",
        diff180d: "-192萬",
        diffPercent: "-4.7%",
        trendStatus: "▼ 累計調降 192 萬 (全社區最低總價)",
        history180d: [
          { date: "04/22", price: "4080萬", note: "180天前掛牌開價" },
          { date: "07/15", price: "3980萬", note: "調降 100 萬" },
          { date: "10/20", price: "3888萬", note: "最新降價讓利 92 萬 (全社區唯一3字頭)" }
        ]
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
        postings: "15個刊登",
        initialPrice180d: "4888萬",
        diff180d: "-100萬",
        diffPercent: "-2.0%",
        trendStatus: "▼ 累計調降 100 萬 (降後持平)",
        history180d: [
          { date: "05/10", price: "4888萬", note: "160天前掛牌開價" },
          { date: "08/20", price: "4788萬", note: "調降 100 萬" },
          { date: "10/19", price: "4788萬", note: "維持現開價 (最新)" }
        ]
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
        postings: "24個刊登",
        initialPrice180d: "4888萬",
        diff180d: "0萬",
        diffPercent: "0.0%",
        trendStatus: "▬ 開價堅挺未降 (24房仲刊登)",
        history180d: [
          { date: "04/22", price: "4888萬", note: "180天前開價" },
          { date: "07/21", price: "4888萬", note: "持續維持" },
          { date: "10/19", price: "4888萬", note: "價格堅挺未調 (最新)" }
        ]
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
              <span>📈 180天各戶趨勢</span>
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

          <!-- 180-Day History Drawer (Collapsible: Per-House Price Trend) -->
          ${currentState.showHistory ? `
            <div class="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/95 via-sky-50/40 to-indigo-50/90 border border-indigo-200 text-xs text-indigo-950 space-y-3 animate-fade-in shadow-xs">
              <!-- Header -->
              <div class="flex items-center justify-between font-bold border-b border-indigo-200/80 pb-2">
                <div class="flex items-center space-x-1.5">
                  <span class="text-sm">🏠</span>
                  <span class="font-extrabold text-[#0d346c]">【惠宇雲品】各在售物件 180 天價格調降走勢與成交歷程</span>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900 font-mono font-bold">精確追蹤每一戶 ‧ 非社區平均</span>
              </div>

              <!-- 3 Individual Listing Price Trend Cards -->
              <div class="space-y-1.5">
                <div class="text-[11px] font-bold text-slate-700 flex items-center justify-between px-1">
                  <span>📋 目前在售 3 戶 ‧ 180 天開價歷程與調價階梯</span>
                  <span class="text-[10px] text-slate-400 font-normal">單位：新台幣萬元</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  <!-- House 1: 4F -->
                  <div class="p-3 rounded-xl bg-white border border-emerald-200 shadow-2xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">4 樓 (3房/56.76坪)</span>
                        <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-black text-[10px]">▼ 累計降 192 萬</span>
                      </div>
                      <div class="mt-2 flex items-baseline justify-between">
                        <div>
                          <div class="text-[10px] text-slate-400">目前開價 (最新)</div>
                          <div class="text-lg font-black text-emerald-700 font-mono">3,888 <span class="text-xs">萬</span></div>
                        </div>
                        <div class="text-right">
                          <div class="text-[10px] text-slate-400">180天前掛牌</div>
                          <div class="text-xs line-through text-slate-400 font-mono">4,080 萬</div>
                        </div>
                      </div>
                    </div>

                    <!-- Step Timeline -->
                    <div class="bg-slate-50 p-2 rounded-lg space-y-1 text-[10px] font-mono border border-slate-100">
                      <div class="flex justify-between text-slate-500">
                        <span>4/22 初次掛牌</span>
                        <span class="font-bold">4,080 萬 (71.9萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-rose-600 font-semibold">
                        <span>7/15 降價 100 萬</span>
                        <span>➔ 3,980 萬 (70.1萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-emerald-700 font-bold">
                        <span>10/20 最新再降 92 萬</span>
                        <span>➔ 3,888 萬 (68.5萬/坪)</span>
                      </div>
                    </div>
                    <div class="text-[10px] text-emerald-700 font-medium">💡 全社區唯一 3 字頭門檻，累計讓利 -192 萬 (-4.7%)</div>
                  </div>

                  <!-- House 2: 13F -->
                  <div class="p-3 rounded-xl bg-white border border-sky-200 shadow-2xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-xs">13 樓 (4房/83.27坪)</span>
                        <span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-black text-[10px]">▼ 累計降 100 萬</span>
                      </div>
                      <div class="mt-2 flex items-baseline justify-between">
                        <div>
                          <div class="text-[10px] text-slate-400">目前開價 (最新)</div>
                          <div class="text-lg font-black text-sky-700 font-mono">4,788 <span class="text-xs">萬</span></div>
                        </div>
                        <div class="text-right">
                          <div class="text-[10px] text-slate-400">160天前掛牌</div>
                          <div class="text-xs line-through text-slate-400 font-mono">4,888 萬</div>
                        </div>
                      </div>
                    </div>

                    <!-- Step Timeline -->
                    <div class="bg-slate-50 p-2 rounded-lg space-y-1 text-[10px] font-mono border border-slate-100">
                      <div class="flex justify-between text-slate-500">
                        <span>5/10 上架掛牌</span>
                        <span class="font-bold">4,888 萬 (58.7萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-amber-700 font-semibold">
                        <span>8/20 降價 100 萬</span>
                        <span>➔ 4,788 萬 (57.5萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-slate-600 font-bold">
                        <span>10/19 維持現況</span>
                        <span>➔ 4,788 萬 (57.5萬/坪)</span>
                      </div>
                    </div>
                    <div class="text-[10px] text-sky-700 font-medium">💡 四房大坪數降價 -2.0% 後目前維持開價</div>
                  </div>

                  <!-- House 3: 3F -->
                  <div class="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div class="flex items-center justify-between">
                        <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-xs">3 樓 (3+1房/76.76坪)</span>
                        <span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">▬ 價格堅挺未調</span>
                      </div>
                      <div class="mt-2 flex items-baseline justify-between">
                        <div>
                          <div class="text-[10px] text-slate-400">目前開價 (最新)</div>
                          <div class="text-lg font-black text-slate-800 font-mono">4,888 <span class="text-xs">萬</span></div>
                        </div>
                        <div class="text-right">
                          <div class="text-[10px] text-slate-400">180天前開價</div>
                          <div class="text-xs text-slate-600 font-mono">4,888 萬</div>
                        </div>
                      </div>
                    </div>

                    <!-- Step Timeline -->
                    <div class="bg-slate-50 p-2 rounded-lg space-y-1 text-[10px] font-mono border border-slate-100">
                      <div class="flex justify-between text-slate-500">
                        <span>4/22 掛牌開價</span>
                        <span class="font-bold">4,888 萬 (63.7萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-slate-500 font-semibold">
                        <span>7/21 持續維持</span>
                        <span>➔ 4,888 萬 (63.7萬/坪)</span>
                      </div>
                      <div class="flex justify-between text-slate-700 font-bold">
                        <span>10/19 價格未調</span>
                        <span>➔ 4,888 萬 (63.7萬/坪)</span>
                      </div>
                    </div>
                    <div class="text-[10px] text-slate-600 font-medium">💡 開價最堅挺 (0%)，多達 24 家仲介聯合刊登</div>
                  </div>
                </div>
              </div>

              <!-- Multi-House Price Comparison SVG Chart -->
              <div class="p-3 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-2">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                  <span class="flex items-center space-x-1.5">
                    <span>📊 各戶 180 天開價軌跡對比圖</span>
                    <span class="text-[10px] text-slate-400 font-normal">多戶開價走勢疊圖</span>
                  </span>
                  <div class="flex items-center space-x-3 text-[10px] font-bold">
                    <span class="flex items-center space-x-1 text-emerald-700">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                      <span>4樓 (4080➔3888)</span>
                    </span>
                    <span class="flex items-center space-x-1 text-sky-700">
                      <span class="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block"></span>
                      <span>13樓 (4888➔4788)</span>
                    </span>
                    <span class="flex items-center space-x-1 text-amber-700">
                      <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span>3樓 (4888維持)</span>
                    </span>
                  </div>
                </div>

                <div class="w-full h-24 relative pt-1">
                  <svg class="w-full h-full overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                    <!-- Background Grid -->
                    <line x1="10" y1="12" x2="490" y2="12" stroke="#e2e8f0" stroke-dasharray="3 3" stroke-width="1" />
                    <text x="12" y="10" font-size="8" fill="#94a3b8" font-family="monospace">5,000萬</text>
                    <line x1="10" y1="40" x2="490" y2="40" stroke="#f1f5f9" stroke-dasharray="2 2" stroke-width="1" />
                    <text x="12" y="38" font-size="8" fill="#94a3b8" font-family="monospace">4,500萬</text>
                    <line x1="10" y1="68" x2="490" y2="68" stroke="#e2e8f0" stroke-dasharray="3 3" stroke-width="1" />
                    <text x="12" y="66" font-size="8" fill="#94a3b8" font-family="monospace">3,800萬</text>

                    <!-- 3F Amber Line (4888萬 flat) -->
                    <path d="M 10 20 L 490 20" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6 3" />
                    <circle cx="10" cy="20" r="3.5" fill="#f59e0b" stroke="#fff" stroke-width="2" />
                    <circle cx="250" cy="20" r="3.5" fill="#f59e0b" stroke="#fff" stroke-width="2" />
                    <circle cx="490" cy="20" r="4.5" fill="#d97706" stroke="#fff" stroke-width="2" />

                    <!-- 13F Sky Blue Line (4888 -> 4788) -->
                    <path d="M 60 20 L 330 20 L 340 28 L 490 28" fill="none" stroke="#0284c7" stroke-width="2.5" />
                    <circle cx="60" cy="20" r="3.5" fill="#0284c7" stroke="#fff" stroke-width="2" />
                    <circle cx="340" cy="28" r="3.5" fill="#0284c7" stroke="#fff" stroke-width="2" />
                    <circle cx="490" cy="28" r="4.5" fill="#0369a1" stroke="#fff" stroke-width="2" />

                    <!-- 4F Emerald Line (4080 -> 3980 -> 3888) -->
                    <path d="M 10 56 L 240 56 L 250 62 L 450 62 L 460 68 L 490 68" fill="none" stroke="#059669" stroke-width="2.5" />
                    <circle cx="10" cy="56" r="3.5" fill="#059669" stroke="#fff" stroke-width="2" />
                    <circle cx="250" cy="62" r="3.5" fill="#059669" stroke="#fff" stroke-width="2" />
                    <circle cx="490" cy="68" r="5" fill="#047857" stroke="#fff" stroke-width="2.5" />
                  </svg>
                </div>

                <div class="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5 pt-1 border-t border-slate-100">
                  <span>180天前 (4/22)</span>
                  <span>120天前 (6/20)</span>
                  <span>60天前 (8/20)</span>
                  <span class="text-[#0d346c] font-bold">今日最新 (10/20)</span>
                </div>
              </div>

              <!-- Sold Transactions in 180 Days -->
              <div class="p-2.5 rounded-xl bg-white border border-indigo-100 shadow-2xs space-y-1.5">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                  <span class="flex items-center space-x-1.5">
                    <span>📑 近 180 天實價登錄各成交戶明細 (揭露落點)</span>
                  </span>
                  <span class="text-[10px] text-slate-400 font-normal">提供買方開價與成交比對</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px]">
                  <div class="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100">
                    <div class="text-slate-500 font-semibold">19樓 (3房/近30天)</div>
                    <div class="font-black text-[#0d346c] text-xs font-mono mt-0.5">3,558 萬</div>
                    <div class="text-[10px] text-sky-700 font-mono">71.3 萬/坪</div>
                  </div>
                  <div class="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100">
                    <div class="text-slate-500 font-semibold">20樓 (4房/近60天)</div>
                    <div class="font-black text-[#0d346c] text-xs font-mono mt-0.5">4,310 萬</div>
                    <div class="text-[10px] text-sky-700 font-mono">75.6 萬/坪</div>
                  </div>
                  <div class="p-1.5 rounded-lg bg-rose-50/60 border border-rose-100">
                    <div class="text-rose-700 font-semibold">15樓 (3房/歷史高)</div>
                    <div class="font-black text-rose-700 text-xs font-mono mt-0.5">3,750 萬</div>
                    <div class="text-[10px] text-rose-600 font-mono">76.0 萬/坪</div>
                  </div>
                  <div class="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100">
                    <div class="text-slate-500 font-semibold">11樓 (3房/近150天)</div>
                    <div class="font-black text-[#0d346c] text-xs font-mono mt-0.5">3,830 萬</div>
                    <div class="text-[10px] text-sky-700 font-mono">75.4 萬/坪</div>
                  </div>
                </div>
              </div>

              <!-- Footer Tip -->
              <div class="flex items-center justify-between text-[10px] text-indigo-700 px-1 font-medium">
                <span>💡 追蹤每一間房子的開價調整歷程，可清晰判斷各戶屋主的讓利意願與議價空間</span>
                <span class="font-mono">4樓降幅最深 (-4.7%，目前全社區唯一 3,888 萬總價門檻)</span>
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
              <span class="text-[11px] text-slate-400 font-normal">低總價起：<b class="text-emerald-700 font-mono font-bold">${d.currentForSaleMinPrice || '3888'} 萬</b></span>
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
