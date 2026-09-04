export const GmailLabelsWidget = {
  id: 'gmail-labels',
  title: 'Gmail 信件標籤統整 ‧ 多帳號分類總覽 (方法二)',
  icon: 'mail',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { activeAccount: 'personal', showConfig: false }) {
    const accounts = {
      personal: {
        name: '個人信箱',
        email: 'grantchiang1983@gmail.com',
        unreadTotal: 18,
        labels: [
          { id: 'work', name: '💼 工作/專案A', count: 3, total: 42, color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', urlParam: '工作%2F專案A' },
          { id: 'finance', name: '💳 財務/水電帳單', count: 1, total: 19, color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', urlParam: '財務%2F水電帳單' },
          { id: 'system', name: '🔔 通知/GitHub', count: 12, total: 156, color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', urlParam: '通知%2FGitHub' },
          { id: 'travel', name: '✈️ 旅遊行程/預訂', count: 0, total: 8, color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', urlParam: '旅遊行程' },
          { id: 'important', name: '⭐ 重要追蹤/待回覆', count: 2, total: 15, color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', urlParam: '重要追蹤' }
        ]
      },
      work: {
        name: '工作企業信箱',
        email: 'grant@company.corp',
        unreadTotal: 7,
        labels: [
          { id: 'p1', name: '🔥 緊急待辦 (P1)', count: 2, total: 11, color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', urlParam: 'P1' },
          { id: 'clients', name: '👥 客戶回函', count: 3, total: 28, color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', urlParam: '客戶' },
          { id: 'devops', name: '⚙️ CI/CD 監控告警', count: 2, total: 64, color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', urlParam: 'DevOps' },
          { id: 'hr', name: '🏢 人資/內部公告', count: 0, total: 14, color: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500', urlParam: '公告' }
        ]
      }
    };

    const currentAcc = accounts[state.activeAccount] || accounts.personal;

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-xs">
        <!-- Header & Account Switcher -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-rose-100 text-rose-700 text-xs font-bold">📧 Gmail 統整</span>
            <div class="flex bg-slate-200/80 p-0.5 rounded-lg">
              <button class="px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${state.activeAccount === 'personal' ? 'bg-white text-[#0d346c] shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-acc="personal">
                個人信箱
              </button>
              <button class="px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${state.activeAccount === 'work' ? 'bg-white text-[#0d346c] shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-acc="work">
                工作信箱
              </button>
            </div>
          </div>

          <div class="flex items-center space-x-1.5">
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-black">
              ${currentAcc.unreadTotal} 未讀
            </span>
            <button id="gmail-config-btn" class="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="設定 Google Apps Script API 串接">
              ⚙️ 串接
            </button>
            <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="開啟 Gmail 收件匣">
              <span>Gmail ↗</span>
            </a>
          </div>
        </div>

        <!-- Account Info Banner -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-sky-50/50 border-b border-sky-100 text-[11px] text-slate-600 flex-shrink-0">
          <span class="font-mono text-slate-700 font-semibold truncate">帳號：${currentAcc.email}</span>
          <span class="text-sky-700 font-medium">標籤分類自動統計</span>
        </div>

        <!-- Config Panel (Toggleable) -->
        <div id="gmail-config-panel" class="${state.showConfig ? 'block' : 'hidden'} p-3 bg-slate-100 border-b border-slate-200 flex-shrink-0">
          <div class="font-bold text-xs text-[#0d346c] mb-1 flex items-center justify-between">
            <span>🔗 Google Apps Script (GAS) API 串接設定</span>
            <button id="gmail-config-close" class="text-slate-400 hover:text-slate-600 font-black">✕</button>
          </div>
          <p class="text-[10px] text-slate-500 mb-2 leading-relaxed">
            透過免費的 Google Apps Script 發布 Web App，即可讓儀表板即時抓取您的 Gmail 標籤與未讀統計（保證隱私，不需外流密碼）。
          </p>
          <div class="flex space-x-2 mb-1.5">
            <input type="text" id="gas-url-input" placeholder="貼上您的 Apps Script Web App 網址 (https://script.google.com/...)" class="flex-1 px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white focus:outline-none focus:border-sky-500" value="${localStorage.getItem('bulletin_gmail_gas_url') || ''}">
            <button id="gas-url-save" class="px-3 py-1 bg-[#0d346c] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm text-xs">儲存</button>
          </div>
          <details class="text-[10px] text-slate-600 cursor-pointer">
            <summary class="font-semibold text-sky-700 hover:underline">點此查看 3 行 Apps Script 範例程式碼</summary>
            <pre class="mt-1.5 p-2 bg-slate-900 text-emerald-400 rounded overflow-x-auto text-[9px] font-mono leading-tight">
function doGet() {
  const labels = GmailApp.getUserLabels().map(l => ({
    name: l.getName(),
    unread: l.getUnreadCount()
  }));
  return ContentService.createTextOutput(JSON.stringify(labels))
    .setMimeType(ContentService.MimeType.JSON);
}</pre>
          </details>
        </div>

        <!-- Label Cards Grid / List -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2 bg-white scrollbar-thin">
          ${currentAcc.labels.map(l => `
            <div class="p-2.5 rounded-xl border border-slate-200/90 hover:border-sky-400 hover:bg-sky-50/30 transition-all flex items-center justify-between group shadow-sm">
              <div class="flex items-center space-x-2.5 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full ${l.dot} flex-shrink-0"></span>
                <div class="truncate">
                  <div class="font-bold text-slate-800 text-xs truncate group-hover:text-sky-700 transition-colors">${l.name}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">總計 ${l.total} 封郵件</div>
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold ${l.count > 0 ? l.color : 'bg-slate-100 text-slate-400 border border-slate-200'}">
                  ${l.count > 0 ? `${l.count} 未讀` : '全讀'}
                </span>
                <a href="https://mail.google.com/mail/u/0/#label/${l.urlParam}" target="_blank" rel="noopener noreferrer" class="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-100 transition-colors" title="在 Gmail 中開啟此標籤">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                </a>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <div class="flex items-center space-x-1">
            <span>標籤分類總覽</span>
            <span>‧</span>
            <span class="text-emerald-700 font-bold">自動歸檔運作中</span>
          </div>
          <button id="gmail-refresh-btn" class="text-sky-700 hover:text-sky-900 font-bold flex items-center space-x-0.5">
            <span>🔄 重新整理標籤狀態</span>
          </button>
        </div>
      </div>
    `;

    // Account Switcher Events
    container.querySelectorAll('[data-acc]').forEach(btn => {
      btn.addEventListener('click', () => {
        const acc = btn.getAttribute('data-acc');
        GmailLabelsWidget.render(container, { ...state, activeAccount: acc });
      });
    });

    // Config Panel Toggle
    const configBtn = container.querySelector('#gmail-config-btn');
    const configClose = container.querySelector('#gmail-config-close');
    if (configBtn) {
      configBtn.addEventListener('click', () => {
        GmailLabelsWidget.render(container, { ...state, showConfig: !state.showConfig });
      });
    }
    if (configClose) {
      configClose.addEventListener('click', () => {
        GmailLabelsWidget.render(container, { ...state, showConfig: false });
      });
    }

    // Save GAS URL
    const saveBtn = container.querySelector('#gas-url-save');
    const urlInput = container.querySelector('#gas-url-input');
    if (saveBtn && urlInput) {
      saveBtn.addEventListener('click', () => {
        const val = urlInput.value.trim();
        localStorage.setItem('bulletin_gmail_gas_url', val);
        alert('GAS 串接網址已儲存！');
        GmailLabelsWidget.render(container, { ...state, showConfig: false });
      });
    }

    // Refresh Button
    const refreshBtn = container.querySelector('#gmail-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.innerHTML = '<span>⏳ 讀取中...</span>';
        setTimeout(() => {
          GmailLabelsWidget.render(container, state);
        }, 500);
      });
    }
  }
};
