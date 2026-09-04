export const ThreadsWebEmbedWidget = {
  id: 'threads-web-embed',
  title: 'Threads 官方網頁內嵌與直達視窗',
  icon: 'globe',
  defaultWidth: 12,
  defaultHeight: 6,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { activeTab: 'iframe', currentUrl: 'https://www.threads.com/' }) {
    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none justify-between overflow-hidden text-xs">
        <!-- Header Bar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-black text-white text-xs font-black">🧵 內嵌測試</span>
            <span class="text-xs font-bold text-[#0d346c]">Threads.com 網頁整合視窗</span>
            <span class="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono font-bold hidden sm:inline truncate max-w-[220px]">
              ${state.currentUrl}
            </span>
          </div>

          <!-- View Tabs & Direct Launch -->
          <div class="flex items-center space-x-2">
            <div class="flex bg-slate-200/80 p-0.5 rounded-lg text-[11px]">
              <button id="tab-embed-iframe" class="px-2.5 py-0.5 rounded-md font-bold transition-all ${state.activeTab === 'iframe' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
                🌐 網頁 Iframe 內嵌
              </button>
              <button id="tab-embed-feed" class="px-2.5 py-0.5 rounded-md font-bold transition-all ${state.activeTab === 'feed' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
                📱 精選串文串流
              </button>
              <button id="tab-embed-security" class="px-2.5 py-0.5 rounded-md font-bold transition-all ${state.activeTab === 'security' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-600 hover:text-slate-900'} cursor-pointer">
                🛡️ 安全防護解析
              </button>
            </div>

            <a href="${state.currentUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-black hover:bg-slate-800 text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs transition-all cursor-pointer">
              <span>🚀 直接開啟 Threads ↗</span>
            </a>
          </div>
        </div>

        <!-- Dynamic Body -->
        <div class="flex-1 relative overflow-hidden bg-slate-100 flex flex-col">
          ${state.activeTab === 'iframe' ? `
            <!-- Tab 1: Iframe Attempt with Explanatory Notice -->
            <div class="flex flex-col h-full w-full">
              <!-- Security Banner Notice -->
              <div class="bg-amber-50 border-b border-amber-200 p-2.5 px-4 text-[11px] text-amber-900 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center space-x-2">
                  <span class="text-base flex-shrink-0">⚠️</span>
                  <div class="leading-tight">
                    <span class="font-bold">瀏覽器安全機制說明：</span>
                    <span>Meta 伺服器針對全站啟用 <code class="bg-amber-100 px-1 py-0.2 rounded font-mono text-amber-950 font-bold">X-Frame-Options: DENY</code>，部分瀏覽器若顯示拒絕連線，可點擊右方按鈕直達或切換上方「精選串流」。</span>
                  </div>
                </div>
                <a href="${state.currentUrl}" target="_blank" rel="noopener noreferrer" class="ml-3 px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] flex-shrink-0 shadow-xs">
                  在新分頁開啟 ↗
                </a>
              </div>

              <!-- Iframe Container -->
              <div class="flex-1 w-full relative bg-slate-900">
                <iframe 
                  id="threads-iframe-element" 
                  src="${state.currentUrl}" 
                  class="w-full h-full border-0 absolute inset-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  referrerpolicy="no-referrer"
                  title="Threads.com Embed"
                ></iframe>
              </div>
            </div>
          ` : state.activeTab === 'feed' ? `
            <!-- Tab 2: Simulated Live Threads Feed -->
            <div class="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/70 scrollbar-thin">
              <div class="max-w-2xl mx-auto space-y-3">
                <!-- Post 1 -->
                <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black text-sm">
                        T
                      </div>
                      <div>
                        <div class="font-bold text-xs text-slate-900 flex items-center space-x-1">
                          <span>台灣科技生活圈</span>
                          <span class="text-[10px] text-sky-500 font-bold">✓</span>
                        </div>
                        <div class="text-[10px] text-slate-400 font-mono">@tech_life_tw ‧ 15分鐘前</div>
                      </div>
                    </div>
                    <a href="https://www.threads.com/@tech_life_tw" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-[10px]">
                      追蹤
                    </a>
                  </div>
                  <p class="text-xs text-slate-800 leading-relaxed mb-3">
                    大家有沒有發現今天 Threads 演算法又更新了？現在只要串文內有包含問答或兩難選擇題，互動率直接暴增 300%！大家最近被推播最多的是哪種類型？
                  </p>
                  <div class="flex items-center space-x-4 text-slate-500 text-[11px] pt-2 border-t border-slate-100 font-mono">
                    <span class="flex items-center space-x-1 hover:text-rose-600 cursor-pointer"><span>❤️</span><span>1,482</span></span>
                    <span class="flex items-center space-x-1 hover:text-sky-600 cursor-pointer"><span>💬</span><span>349</span></span>
                    <span class="flex items-center space-x-1 hover:text-emerald-600 cursor-pointer"><span>🔁</span><span>120</span></span>
                    <span class="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer"><span>↗</span><span>分享</span></span>
                  </div>
                </div>

                <!-- Post 2 -->
                <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2.5">
                      <div class="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                        M
                      </div>
                      <div>
                        <div class="font-bold text-xs text-slate-900 flex items-center space-x-1">
                          <span>市場動向筆記</span>
                          <span class="text-[10px] text-sky-500 font-bold">✓</span>
                        </div>
                        <div class="text-[10px] text-slate-400 font-mono">@market_notes ‧ 1小時前</div>
                      </div>
                    </div>
                    <a href="https://www.threads.com/@market_notes" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-[10px]">
                      追蹤
                    </a>
                  </div>
                  <p class="text-xs text-slate-800 leading-relaxed mb-3">
                    【央行管制後續追蹤】今天去跑了三間公股行庫，房貸主管表示非首購名額排到明年Q2，首購雖然有額度但利率全面向 2.6% 看齊。剛需自住客建議先把自備款拉高到 3.5 成比較保險！
                  </p>
                  <div class="flex items-center space-x-4 text-slate-500 text-[11px] pt-2 border-t border-slate-100 font-mono">
                    <span class="flex items-center space-x-1 hover:text-rose-600 cursor-pointer"><span>❤️</span><span>3,890</span></span>
                    <span class="flex items-center space-x-1 hover:text-sky-600 cursor-pointer"><span>💬</span><span>612</span></span>
                    <span class="flex items-center space-x-1 hover:text-emerald-600 cursor-pointer"><span>🔁</span><span>485</span></span>
                    <span class="flex items-center space-x-1 hover:text-indigo-600 cursor-pointer"><span>↗</span><span>分享</span></span>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <!-- Tab 3: Security & Tech Analysis -->
            <div class="flex-1 p-5 overflow-y-auto bg-slate-50 scrollbar-thin">
              <div class="max-w-2xl mx-auto space-y-4">
                <div class="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 class="font-bold text-sm text-[#0d346c] mb-2 flex items-center space-x-1.5">
                    <span>🛡️ 為什麼各大社群平台（Threads、IG、FB）預設禁止 iframe 內嵌？</span>
                  </h4>
                  <p class="text-xs text-slate-600 leading-relaxed mb-3">
                    當您在任何網站嘗試以 <code class="bg-slate-100 px-1 py-0.5 rounded font-mono">&lt;iframe src="https://www.threads.com"&gt;</code> 載入時，瀏覽器會收到 Meta 伺服器傳送的強制安全防護標頭：
                  </p>
                  <div class="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] space-y-1">
                    <div>X-Frame-Options: DENY</div>
                    <div>Content-Security-Policy: frame-ancestors 'none';</div>
                    <div>Cross-Origin-Opener-Policy: same-origin-allow-popups</div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div class="font-bold text-xs text-rose-700 mb-1">🚫 1. 防範點擊劫持 (Clickjacking)</div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      若允許 iframe 嵌入，惡意網站可將 Threads 設為透明層，誘騙已登入的使用者在不知情下點擊按讚、發文或轉發。
                    </p>
                  </div>
                  <div class="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <div class="font-bold text-xs text-blue-700 mb-1">🔐 2. 登入憑證與 Cookie 隔離</div>
                    <p class="text-[11px] text-slate-600 leading-relaxed">
                      第三方框架無法共享您的 Instagram / Threads 登入 Session，確保個人帳號憑證絕不外流。
                    </p>
                  </div>
                </div>

                <div class="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-[11px] text-sky-900 leading-relaxed">
                  <span class="font-bold">💡 最佳實踐建議：</span>
                  搭配上方為您實作的「途徑一（原生爬蟲趨勢）」與「途徑三（Google Trends 聯動）」，既能安全合法獲取最新熱門話題與 AI 摘要，又可一鍵點擊無縫跳轉至 Threads 完整互動！
                </div>
              </div>
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-slate-700">目標網址：</span>
            <a href="https://www.threads.com/" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:underline font-mono">https://www.threads.com/</a>
          </div>
          <div class="flex items-center space-x-2">
            <a href="https://www.threads.com/search" target="_blank" rel="noopener noreferrer" class="hover:text-slate-900">🔍 搜尋趨勢</a>
            <span>‧</span>
            <a href="https://www.threads.com/" target="_blank" rel="noopener noreferrer" class="hover:text-slate-900">👤 個人主頁</a>
            <span>‧</span>
            <a href="https://www.threads.com/activity" target="_blank" rel="noopener noreferrer" class="hover:text-slate-900">🔔 即時動態</a>
          </div>
        </div>
      </div>
    `;

    // Tab Events
    const tabIframe = container.querySelector('#tab-embed-iframe');
    const tabFeed = container.querySelector('#tab-embed-feed');
    const tabSec = container.querySelector('#tab-embed-security');

    if (tabIframe) {
      tabIframe.addEventListener('click', () => {
        ThreadsWebEmbedWidget.render(container, { ...state, activeTab: 'iframe' });
      });
    }
    if (tabFeed) {
      tabFeed.addEventListener('click', () => {
        ThreadsWebEmbedWidget.render(container, { ...state, activeTab: 'feed' });
      });
    }
    if (tabSec) {
      tabSec.addEventListener('click', () => {
        ThreadsWebEmbedWidget.render(container, { ...state, activeTab: 'security' });
      });
    }
  }
};