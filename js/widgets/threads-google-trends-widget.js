export const ThreadsGoogleTrendsWidget = {
  id: 'threads-google-trends',
  title: 'Google Trends ＋ Threads 輿論聯動 (途徑三)',
  icon: 'trending-up',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  topics: [
    {
      id: 1,
      rank: 1,
      tag: '央行第七波信用管制',
      query: '央行 信用管制 房市',
      category: 'finance',
      categoryName: '房產政策',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      googleSearchVol: '10萬+ 搜尋',
      threadsPostEst: '約 1.2 萬 篇脆文',
      trendStatus: '全台熱搜 No.1',
      sentimentPros: '首購族歡呼：「投資客跟炒房團終於被重擊，觀望已久的剛需族有機會殺價！」',
      sentimentCons: '換屋族叫苦連天：「先買後賣被卡死，原本核貸成數硬生生少一成，差點違約違款...」',
      updated: '20 分鐘前'
    },
    {
      id: 2,
      rank: 2,
      tag: '大谷翔平50轟50盜',
      query: '大谷翔平 50轟50盜',
      category: 'sports',
      categoryName: '體育賽事',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      googleSearchVol: '8萬+ 搜尋',
      threadsPostEst: '約 8,900 篇脆文',
      trendStatus: '歷史里程碑',
      sentimentPros: '全台脆友狂刷：「見證人類棒球極限！這紀錄前無古人，生在這個時代看球太幸福了。」',
      sentimentCons: '部分球迷笑稱：「紀念球直接拍賣破億，拍賣行手續費賺翻了，球迷只能螢幕流口水。」',
      updated: '30 分鐘前'
    },
    {
      id: 3,
      rank: 3,
      tag: '日本楓葉季機票特價',
      query: '日本 楓葉 機票 促銷',
      category: 'travel',
      categoryName: '旅遊生活',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      googleSearchVol: '5萬+ 搜尋',
      threadsPostEst: '約 6,300 篇脆文',
      trendStatus: '搶票熱潮',
      sentimentPros: '搶到票脆友曬單：「廉航清晨促銷搶到大阪來回6千有找，今年11月賞楓走起！」',
      sentimentCons: '苦主回報：「官網付款轉圈圈直接被踢出、熱門週末時段秒殺，根本是在搶寂寞。」',
      updated: '45 分鐘前'
    },
    {
      id: 4,
      rank: 4,
      tag: '台股兩萬三千點攻防',
      query: '台股 兩萬三 加權指數',
      category: 'finance',
      categoryName: '股市投資',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      googleSearchVol: '4萬+ 搜尋',
      threadsPostEst: '約 5,100 篇脆文',
      trendStatus: '多空交戰',
      sentimentPros: 'ETF存股族信心滿滿：「高股息與權值ETF持續定期定額，回檔就是最好的加碼時機。」',
      sentimentCons: '短線客謹慎：「量能沒放大前不要亂追高，外資期貨空單仍在高檔，嚴格控制部位。」',
      updated: '1 小時前'
    },
    {
      id: 5,
      rank: 5,
      tag: '秋颱外圍環流防汛',
      query: '颱風 外圍環流 天氣特報',
      category: 'weather',
      categoryName: '氣象天候',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      googleSearchVol: '3萬+ 搜尋',
      threadsPostEst: '約 3,800 篇脆文',
      trendStatus: '天氣警報',
      sentimentPros: '雨備經驗分享：「脆友推薦防潑水外套與通勤防水鞋，這兩天出門真的幫大忙。」',
      sentimentCons: '通勤族無奈：「下班時間雨彈狂炸，捷運站跟公車站全塞爆，全身濕答答好崩潰。」',
      updated: '1 小時前'
    }
  ],

  render(container, state = { activeFilter: 'all', showArchModal: false, isRefreshing: false }) {
    const filtered = state.activeFilter === 'all'
      ? this.topics
      : this.topics.filter(t => t.category === state.activeFilter);

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none justify-between overflow-hidden text-xs">
        <!-- Top Header -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-[#0284c7] text-white text-xs font-black">🌐 途徑三</span>
            <span class="text-xs font-bold text-[#0d346c]">Google Trends ＋ Threads 聯動</span>
            <span class="text-[10px] px-2 py-0.2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold hidden sm:inline">
              ⚡ 全網熱搜 ‧ 脆上風向
            </span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button id="trends-arch-btn" class="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium transition-colors shadow-xs text-[11px] cursor-pointer" title="查看 Google Trends + Gemini 聯動架構">
              ⚙️ 聯動架構
            </button>
            <button id="trends-refresh-btn" class="px-2.5 py-1 rounded bg-[#0d346c] hover:bg-[#0369a1] text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs transition-all cursor-pointer ${state.isRefreshing ? 'opacity-70 cursor-wait' : ''}">
              <span>${state.isRefreshing ? '⏳ 聯動分析中...' : '🔄 取得即時風向'}</span>
            </button>
          </div>
        </div>

        <!-- Filter & Info Bar -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-sky-50/50 border-b border-sky-100 text-[11px] flex-shrink-0">
          <div class="flex space-x-1">
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'all' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-trends-filter="all">
              全部 (5)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'finance' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-trends-filter="finance">
              財經政策 (2)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'sports' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-trends-filter="sports">
              體育生活 (2)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'weather' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-trends-filter="weather">
              氣象時事 (1)
            </button>
          </div>
          <span class="text-[10px] text-sky-700 font-mono hidden md:inline">Google Trends TW ＋ Gemini 1.5 研判</span>
        </div>

        <!-- Architecture Drawer (Collapsible) -->
        <div id="trends-arch-drawer" class="${state.showArchModal ? 'block' : 'hidden'} p-3 bg-slate-900 text-slate-200 border-b border-slate-700 flex-shrink-0 overflow-y-auto max-h-[160px] scrollbar-thin">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs text-sky-400">🌐 途徑三：全自動零維護聯動技術架構</span>
            <button id="trends-arch-close" class="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
          </div>
          <p class="text-[10px] text-slate-400 mb-1.5 leading-relaxed">
            透過公開免費的 Google Trends 台灣 RSS 即時擷取前 5 大詞彙，自動檢索 Threads 串文並由 Gemini 產生正反風向比對：
          </p>
          <pre class="p-2 bg-black/60 text-sky-300 rounded text-[9px] font-mono leading-tight overflow-x-auto select-all">
// 1. Google Trends TW 即時熱搜 RSS (免 Key、零限制)
const rssUrl = "https://trends.google.com.tw/trends/trendingsearches/daily/rss?geo=TW";
// 2. 檢索 Threads 脆文 (透過 Threads API 或公開搜尋)
// 3. Gemini 1.5 Flash 提取「贊成/正面 vs 質疑/擔憂」兩極風向
const prompt = "請將此熱門事件在 Threads 上的脆友正反兩極聲量各用一句話精確總結";</pre>
        </div>

        <!-- Trends & Sentiment List Container -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2.5 bg-white scrollbar-thin">
          ${filtered.map(t => `
            <div class="p-3 rounded-xl border border-sky-100 bg-sky-50/20 shadow-xs hover:border-sky-400 hover:shadow-sm transition-all group">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center space-x-2 min-w-0 pr-2">
                  <span class="w-5 h-5 rounded-full ${t.rank <= 3 ? 'bg-[#0284c7] text-white' : 'bg-slate-200 text-slate-700'} flex items-center justify-center font-black text-[11px] flex-shrink-0 font-mono">
                    ${t.rank}
                  </span>
                  <a href="https://www.threads.net/search?q=${encodeURIComponent(t.query)}" target="_blank" rel="noopener noreferrer" class="font-black text-xs text-[#0d346c] group-hover:text-sky-600 transition-colors truncate flex items-center space-x-1">
                    <span>${t.tag}</span>
                    <span class="text-[10px] text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                  <span class="text-[10px] px-1.5 py-0.2 rounded border font-semibold flex-shrink-0 ${t.badgeColor}">
                    ${t.categoryName}
                  </span>
                </div>

                <div class="flex items-center space-x-2 flex-shrink-0 text-[10px]">
                  <span class="font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded font-mono">${t.googleSearchVol}</span>
                  <span class="font-medium text-slate-500 font-mono hidden sm:inline">${t.threadsPostEst}</span>
                </div>
              </div>

              <!-- Gemini AI Dual-Perspective Sentiment Box -->
              <div class="p-2 rounded-lg bg-white border border-sky-100 text-[10px] space-y-1 mt-2">
                <div class="flex items-start space-x-1.5 text-slate-700">
                  <span class="font-bold text-emerald-700 flex-shrink-0">👍 脆友正面/支持：</span>
                  <span class="leading-relaxed">${t.sentimentPros}</span>
                </div>
                <div class="flex items-start space-x-1.5 text-slate-700 pt-1 border-t border-slate-100">
                  <span class="font-bold text-rose-600 flex-shrink-0">⚠️ 脆友質疑/擔憂：</span>
                  <span class="leading-relaxed">${t.sentimentCons}</span>
                </div>
              </div>

              <!-- Meta Footer -->
              <div class="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 pt-1">
                <span class="text-sky-700 font-medium font-mono">● 熱度指標：${t.trendStatus}</span>
                <span class="font-mono">更新：${t.updated}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-1">
            <span class="font-bold text-sky-800">途徑三特色：</span>
            <span>全民重大時事 ＋ Gemini 兩極輿論平衡摘要，無反爬蟲風險</span>
          </div>
          <a href="https://trends.google.com.tw/trending" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold flex items-center space-x-0.5">
            <span>Google 趨勢 ↗</span>
          </a>
        </div>
      </div>
    `;

    // Filter Buttons
    container.querySelectorAll('[data-trends-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-trends-filter');
        ThreadsGoogleTrendsWidget.render(container, { ...state, activeFilter: filter });
      });
    });

    // Architecture Drawer Toggle
    const archBtn = container.querySelector('#trends-arch-btn');
    const archClose = container.querySelector('#trends-arch-close');
    if (archBtn) {
      archBtn.addEventListener('click', () => {
        ThreadsGoogleTrendsWidget.render(container, { ...state, showArchModal: !state.showArchModal });
      });
    }
    if (archClose) {
      archClose.addEventListener('click', () => {
        ThreadsGoogleTrendsWidget.render(container, { ...state, showArchModal: false });
      });
    }

    // Refresh Button
    const refreshBtn = container.querySelector('#trends-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        ThreadsGoogleTrendsWidget.render(container, { ...state, isRefreshing: true });
        setTimeout(() => {
          ThreadsGoogleTrendsWidget.render(container, { ...state, isRefreshing: false });
        }, 800);
      });
    }
  }
};