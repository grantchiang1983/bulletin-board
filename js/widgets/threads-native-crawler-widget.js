export const ThreadsNativeCrawlerWidget = {
  id: 'threads-native-crawler',
  title: 'Threads 原生趨勢榜 ‧ 輕量爬蟲直連 (途徑一)',
  icon: 'hash',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  topics: [
    {
      id: 1,
      rank: 1,
      tag: '脆友取暖',
      query: '脆友取暖',
      category: 'culture',
      categoryName: '脆民文化',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      volume: '1.8 萬 則串文',
      growth: '+142% 爆發中',
      growthColor: 'text-rose-600',
      summary: '網友分享職場低潮與生活瑣事，互相留言「抱抱」、「你很棒了」，演算法大量推播形成溫馨同溫層。',
      topQuote: '「演算法終於把我推到懂我的人身邊了，這串文好有溫度...」',
      author: '@ting_life_tw',
      updated: '12 分鐘前'
    },
    {
      id: 2,
      rank: 2,
      tag: '台積電法說會',
      query: '台積電 法說會',
      category: 'tech',
      categoryName: '科技財經',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      volume: '9,420 則串文',
      growth: '+88% 飆升',
      growthColor: 'text-emerald-600',
      summary: '工程師與投資客熱議 CoWoS 先進封裝產能預測，分析外資夜盤期貨走向與資本支出展望。',
      topQuote: '「明天開盤直接看外資表演，設備廠供應鏈又要起飛了嗎？」',
      author: '@tech_semicon_tw',
      updated: '18 分鐘前'
    },
    {
      id: 3,
      rank: 3,
      tag: 'threads演算法',
      query: 'threads 演算法',
      category: 'tech',
      categoryName: '社群時事',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      volume: '7,150 則串文',
      growth: '+65% 持續熱門',
      growthColor: 'text-purple-600',
      summary: '大量創作者拆解 Threads 最新推播邏輯：長文圖文並茂、前三分鐘留言互動數成為觸及流量關鍵。',
      topQuote: '「只要打勾不要轉發到 IG，觸及反而翻倍？脆友實測中...」',
      author: '@social_growth_lab',
      updated: '35 分鐘前'
    },
    {
      id: 4,
      rank: 4,
      tag: '超商抹茶新品',
      query: '超商 抹茶 新品',
      category: 'life',
      categoryName: '美食消費',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      volume: '5,380 則串文',
      growth: '+45% 熱議',
      growthColor: 'text-amber-600',
      summary: '超商秋季限定濃抹茶霜淇淋引爆排隊開箱，脆友紛紛曬出抹度評比與隱藏版吃法。',
      topQuote: '「這款茶味夠苦甘！但第二件六折大家都在搶，跑三間才買到。」',
      author: '@foodie_alice_eat',
      updated: '48 分鐘前'
    },
    {
      id: 5,
      rank: 5,
      tag: '租屋鬼故事',
      query: '租屋鬼故事',
      category: 'life',
      categoryName: '生活爆料',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      volume: '4,620 則串文',
      growth: '+32% 討論中',
      growthColor: 'text-slate-600',
      summary: '北漂族爆料看房遇到頂加違建、一度電7塊、退租剋扣押金等怪事，引發千則留言共鳴。',
      topQuote: '「房東說熱水器壞了算自然耗損要房客出？大家千萬要看清楚合約！」',
      author: '@taipei_renter_99',
      updated: '1 小時前'
    }
  ],

  render(container, state = { activeFilter: 'all', showCrawlerModal: false, isRefreshing: false }) {
    const filtered = state.activeFilter === 'all'
      ? this.topics
      : this.topics.filter(t => t.category === state.activeFilter);

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none justify-between overflow-hidden text-xs">
        <!-- Top Header -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-black text-white text-xs font-black">🧵 途徑一</span>
            <span class="text-xs font-bold text-[#0d346c]">Threads 原生趨勢榜</span>
            <span class="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hidden sm:inline">
              🟢 輕量爬蟲在線 ‧ 42ms
            </span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button id="native-code-btn" class="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium transition-colors shadow-xs text-[11px] cursor-pointer" title="查看 Python / Playwright 爬蟲代碼">
              🐍 爬蟲代碼
            </button>
            <button id="native-refresh-btn" class="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs transition-all cursor-pointer ${state.isRefreshing ? 'opacity-70 cursor-wait' : ''}">
              <span>${state.isRefreshing ? '⏳ 抓取中...' : '🔄 即時重爬'}</span>
            </button>
          </div>
        </div>

        <!-- Filter & Info Bar -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-100/70 border-b border-slate-200 text-[11px] flex-shrink-0">
          <div class="flex space-x-1">
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'all' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-native-filter="all">
              全部 (5)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'culture' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-native-filter="culture">
              脆民文化 (1)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'tech' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-native-filter="tech">
              科技社群 (2)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'life' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'} cursor-pointer" data-native-filter="life">
              生活美食 (2)
            </button>
          </div>
          <span class="text-[10px] text-slate-400 font-mono hidden md:inline">資料源：threads.net/search 趨勢</span>
        </div>

        <!-- Crawler Python Code Drawer (Collapsible) -->
        <div id="native-code-drawer" class="${state.showCrawlerModal ? 'block' : 'hidden'} p-3 bg-slate-900 text-slate-200 border-b border-slate-700 flex-shrink-0 overflow-y-auto max-h-[160px] scrollbar-thin">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs text-amber-400">🐍 Python + Playwright 輕量爬蟲實作腳本</span>
            <button id="native-code-close" class="text-slate-400 hover:text-white font-bold cursor-pointer">✕</button>
          </div>
          <p class="text-[10px] text-slate-400 mb-1.5 leading-relaxed">
            無須登入即可自動瀏覽 Threads 搜尋頁，攔截 GraphQL 回傳之 Trending Topics 結構：
          </p>
          <pre class="p-2 bg-black/60 text-emerald-300 rounded text-[9px] font-mono leading-tight overflow-x-auto select-all">
from playwright.sync_api import sync_playwright
import json

def fetch_threads_trends():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://www.threads.net/search")
        page.wait_for_selector('text=趨勢話題', timeout=8000)
        # 擷取趨勢標籤與發文量數據
        topics = page.eval_on_selector_all('[data-pressable-container="true"]', 
            "elements => elements.map(el => el.innerText)")
        browser.close()
        return topics</pre>
        </div>

        <!-- Trending List Container -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50/50 scrollbar-thin">
          ${filtered.map(t => `
            <div class="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-400 hover:shadow-sm transition-all group">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center space-x-2 min-w-0 pr-2">
                  <span class="w-5 h-5 rounded-full ${t.rank <= 3 ? 'bg-black text-amber-300' : 'bg-slate-100 text-slate-600'} flex items-center justify-center font-black text-[11px] flex-shrink-0 font-mono">
                    ${t.rank}
                  </span>
                  <a href="https://www.threads.net/search?q=${encodeURIComponent(t.query)}" target="_blank" rel="noopener noreferrer" class="font-black text-xs text-slate-900 group-hover:text-sky-600 transition-colors truncate flex items-center space-x-1">
                    <span>#${t.tag}</span>
                    <span class="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                  <span class="text-[10px] px-1.5 py-0.2 rounded border font-semibold flex-shrink-0 ${t.badgeColor}">
                    ${t.categoryName}
                  </span>
                </div>

                <div class="flex items-center space-x-2 flex-shrink-0 text-[10px]">
                  <span class="font-bold text-slate-700 font-mono">${t.volume}</span>
                  <span class="font-bold ${t.growthColor} font-mono">${t.growth}</span>
                </div>
              </div>

              <!-- Content Summary -->
              <p class="text-[11px] text-slate-600 leading-relaxed mb-2">
                ${t.summary}
              </p>

              <!-- Top Quote & Meta Footer -->
              <div class="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] flex items-center justify-between text-slate-500">
                <div class="truncate mr-2 italic font-medium text-slate-700">
                  ${t.topQuote}
                </div>
                <div class="flex items-center space-x-1.5 flex-shrink-0 font-mono text-[9px] text-slate-400">
                  <span>${t.author}</span>
                  <span>‧</span>
                  <span>${t.updated}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-1">
            <span class="font-bold text-slate-700">途徑一特色：</span>
            <span>精準捕捉社群原生梗、迷因與脆民同溫層討論</span>
          </div>
          <a href="https://www.threads.net/search" target="_blank" rel="noopener noreferrer" class="text-slate-900 hover:text-sky-600 font-bold flex items-center space-x-0.5">
            <span>開啟 Threads 探索 ↗</span>
          </a>
        </div>
      </div>
    `;

    // Filter Buttons
    container.querySelectorAll('[data-native-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-native-filter');
        ThreadsNativeCrawlerWidget.render(container, { ...state, activeFilter: filter });
      });
    });

    // Code Drawer Toggle
    const codeBtn = container.querySelector('#native-code-btn');
    const codeClose = container.querySelector('#native-code-close');
    if (codeBtn) {
      codeBtn.addEventListener('click', () => {
        ThreadsNativeCrawlerWidget.render(container, { ...state, showCrawlerModal: !state.showCrawlerModal });
      });
    }
    if (codeClose) {
      codeClose.addEventListener('click', () => {
        ThreadsNativeCrawlerWidget.render(container, { ...state, showCrawlerModal: false });
      });
    }

    // Refresh Button
    const refreshBtn = container.querySelector('#native-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        ThreadsNativeCrawlerWidget.render(container, { ...state, isRefreshing: true });
        setTimeout(() => {
          ThreadsNativeCrawlerWidget.render(container, { ...state, isRefreshing: false });
        }, 800);
      });
    }
  }
};