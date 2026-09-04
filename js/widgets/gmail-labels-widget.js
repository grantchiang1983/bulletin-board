export const GmailLabelsWidget = {
  id: 'gmail-labels',
  title: 'Gmail 信件標籤統整 ‧ 多帳號分類總覽 (方法二)',
  icon: 'mail',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  // Cache fetched data in memory
  liveData: null,
  isLoading: false,

  render(container, state = { activeAccount: 'personal', showConfig: false }) {
    const gasUrl = localStorage.getItem('bulletin_gmail_gas_url');

    const defaultAccounts = {
      personal: {
        name: '個人信箱',
        email: 'grantchiang1983@gmail.com',
        unreadTotal: 18,
        isLive: false,
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
        isLive: false,
        labels: [
          { id: 'p1', name: '🔥 緊急待辦 (P1)', count: 2, total: 11, color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', urlParam: 'P1' },
          { id: 'clients', name: '👥 客戶回函', count: 3, total: 28, color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', urlParam: '客戶' },
          { id: 'devops', name: '⚙️ CI/CD 監控告警', count: 2, total: 64, color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', urlParam: 'DevOps' },
          { id: 'hr', name: '🏢 人資/內部公告', count: 0, total: 14, color: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500', urlParam: '公告' }
        ]
      }
    };

    let currentAcc = defaultAccounts[state.activeAccount] || defaultAccounts.personal;

    // If live data from GAS exists and activeAccount is personal, map it
    if (this.liveData && state.activeAccount === 'personal') {
      const palette = [
        { color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
        { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
        { color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
        { color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
        { color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
        { color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500' }
      ];

      const rawLabels = Array.isArray(this.liveData.labels) ? this.liveData.labels : [];
      let totalUnread = this.liveData.unreadInbox || 0;

      const dynamicLabels = rawLabels.map((l, idx) => {
        const theme = palette[idx % palette.length];
        const unread = l.unread || 0;
        totalUnread += unread;
        return {
          id: 'live_' + idx,
          name: l.name,
          count: unread,
          total: unread > 0 ? `${unread}+` : '已讀',
          color: theme.color,
          dot: theme.dot,
          urlParam: encodeURIComponent(l.name)
        };
      });

      currentAcc = {
        name: '真實 Gmail (GAS 連線)',
        email: this.liveData.email || '已授權 Google 帳號',
        unreadTotal: totalUnread,
        isLive: true,
        labels: dynamicLabels.length > 0 ? dynamicLabels : [
          { id: 'inbox', name: '📥 收件匣 (Inbox)', count: this.liveData.unreadInbox || 0, total: '即時', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', urlParam: 'inbox' }
        ]
      };
    }

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-xs">
        <!-- Header & Account Switcher -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-rose-100 text-rose-700 text-xs font-bold">📧 Gmail 統整</span>
            <div class="flex bg-slate-200/80 p-0.5 rounded-lg">
              <button class="px-2 py-0.5 rounded-md font-bold text-[11px] transition-all ${state.activeAccount === 'personal' ? 'bg-white text-[#0d346c] shadow-sm' : 'text-slate-600 hover:text-slate-900'}" data-acc="personal">
                ${currentAcc.isLive ? '🟢 我的真實信箱' : '個人信箱'}
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
            <button id="gmail-config-btn" class="px-2 py-1 rounded ${gasUrl ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-white text-slate-700 border-slate-300'} hover:bg-slate-100 border font-medium transition-colors shadow-sm" title="設定 Google Apps Script API 串接">
              ⚙️ 串接 ${gasUrl ? '✓' : ''}
            </button>
            <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="開啟 Gmail 收件匣">
              <span>Gmail ↗</span>
            </a>
          </div>
        </div>

        <!-- Account Info Banner -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-sky-50/50 border-b border-sky-100 text-[11px] text-slate-600 flex-shrink-0">
          <div class="flex items-center space-x-1 truncate mr-2">
            <span class="font-mono text-slate-700 font-semibold truncate">${currentAcc.email}</span>
            ${currentAcc.isLive ? '<span class="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">即時連線中</span>' : '<span class="text-slate-400 text-[10px]">(示範資料)</span>'}
          </div>
          <span class="text-sky-700 font-medium flex-shrink-0">${currentAcc.labels.length} 個標籤</span>
        </div>

        <!-- Config Panel (Toggleable) -->
        <div id="gmail-config-panel" class="${state.showConfig ? 'block' : 'hidden'} p-3 bg-slate-100 border-b border-slate-200 flex-shrink-0">
          <div class="font-bold text-xs text-[#0d346c] mb-1 flex items-center justify-between">
            <span>🔗 串接您的真實 Gmail 標籤 (Google Apps Script)</span>
            <button id="gmail-config-close" class="text-slate-400 hover:text-slate-600 font-black">✕</button>
          </div>
          <p class="text-[10px] text-slate-600 mb-2 leading-relaxed">
            按照說明在您的 Google 帳號部署 Web App 後，將網址貼在下方，即可即時呈現您信箱的真實標籤：
          </p>
          <div class="flex space-x-2 mb-1.5">
            <input type="text" id="gas-url-input" placeholder="貼上 Apps Script 網址 (https://script.google.com/macros/s/.../exec)" class="flex-1 px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white focus:outline-none focus:border-sky-500" value="${gasUrl || ''}">
            <button id="gas-url-save" class="px-3 py-1 bg-[#0d346c] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm text-xs">儲存並連線</button>
          </div>
          ${gasUrl ? '<button id="gas-url-clear" class="text-[10px] text-rose-600 hover:underline">清除已儲存的網址，恢復為預設示範</button>' : ''}
        </div>

        <!-- Label Cards Grid / List -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2 bg-white scrollbar-thin">
          ${this.isLoading ? `
            <div class="py-12 text-center text-slate-400">
              <div class="inline-block animate-spin text-2xl mb-2">⏳</div>
              <p class="text-xs">正在從您的 Gmail 同步最新標籤與未讀數...</p>
            </div>
          ` : currentAcc.labels.map(l => `
            <div class="p-2.5 rounded-xl border border-slate-200/90 hover:border-sky-400 hover:bg-sky-50/30 transition-all flex items-center justify-between group shadow-sm">
              <div class="flex items-center space-x-2.5 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full ${l.dot} flex-shrink-0"></span>
                <div class="truncate">
                  <div class="font-bold text-slate-800 text-xs truncate group-hover:text-sky-700 transition-colors">${l.name}</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">狀態：${l.total}</div>
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
            <span class="${currentAcc.isLive ? 'text-emerald-700 font-bold' : 'text-slate-400'}">${currentAcc.isLive ? '✓ 真實帳號已同步' : '點擊 ⚙️ 串接連線真實標籤'}</span>
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

    // Save GAS URL & Trigger Fetch
    const saveBtn = container.querySelector('#gas-url-save');
    const urlInput = container.querySelector('#gas-url-input');
    if (saveBtn && urlInput) {
      saveBtn.addEventListener('click', async () => {
        const val = urlInput.value.trim();
        if (!val) return;
        localStorage.setItem('bulletin_gmail_gas_url', val);
        await this.fetchLiveData(val, container, state);
      });
    }

    // Clear GAS URL
    const clearBtn = container.querySelector('#gas-url-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem('bulletin_gmail_gas_url');
        this.liveData = null;
        GmailLabelsWidget.render(container, { ...state, showConfig: false });
      });
    }

    // Refresh Button
    const refreshBtn = container.querySelector('#gmail-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        const url = localStorage.getItem('bulletin_gmail_gas_url');
        if (url) {
          await this.fetchLiveData(url, container, state);
        } else {
          refreshBtn.innerHTML = '<span>⏳ 讀取中...</span>';
          setTimeout(() => {
            GmailLabelsWidget.render(container, state);
          }, 500);
        }
      });
    }

    // Auto-fetch if gasUrl exists and not yet loaded
    if (gasUrl && !this.liveData && !this.isLoading) {
      this.fetchLiveData(gasUrl, container, state);
    }
  },

  async fetchLiveData(url, container, state) {
    this.isLoading = true;
    GmailLabelsWidget.render(container, { ...state, showConfig: false });

    try {
      const res = await fetch(url, { method: 'GET', redirect: 'follow' });
      const data = await res.json();
      if (Array.isArray(data)) {
        this.liveData = { labels: data };
      } else if (data && (data.labels || data.status === 'success')) {
        this.liveData = data;
      } else {
        alert('連線成功，但回傳格式未包含標籤列表。請確認 Apps Script 程式碼是否回傳陣列或包含 labels 屬性。');
      }
    } catch (err) {
      console.warn('GAS Fetch Error:', err);
      alert('無法連線至 Google Apps Script 網址，請確認「誰可以存取」已設為「所有人 (Anyone)」。');
    } finally {
      this.isLoading = false;
      GmailLabelsWidget.render(container, { ...state, showConfig: false });
    }
  }
};
