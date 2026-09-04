export const GmailLabelsWidget = {
  id: 'gmail-labels',
  title: 'Gmail 信件標籤統整 ‧ 多帳號分類總覽 (方法二)',
  icon: 'mail',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  // Default GAS endpoint (cross-device sync)
  DEFAULT_GAS_URL: 'https://script.google.com/macros/s/AKfycbxmUFN_g6nQHdeHppxc3vMGfRtM17lgJOrTnac0zcuM9HWpju8byC0UvZfs3MLW5q6P/exec',

  // Cache fetched data in memory
  liveData: null,
  isLoading: false,

  render(container, state = { activeAccount: 'personal', showConfig: false }) {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const gasUrl = hashParams.get('gas') || localStorage.getItem('bulletin_gmail_gas_url') || this.DEFAULT_GAS_URL;

    const defaultAccounts = {
      personal: {
        name: '個人信箱 (grantchiang1983@gmail.com)',
        email: 'grantchiang1983@gmail.com',
        unreadTotal: 24129,
        isLive: true,
        labels: [
          { id: 'hinet_mail', name: '📧 heaven.seventh@msa.hinet.net', count: 3097, total: '3,097 封未讀', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', urlParam: 'heaven.seventh%40msa.hinet.net' },
          { id: 'japan_travel', name: '✈️ 2026_Japen_Travel', count: 0, total: '全部已讀', color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500', urlParam: '2026_Japen_Travel' },
          { id: 'daily_credit', name: '💳 信用卡每日消費', count: 2465, total: '2,465 封未讀', color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', urlParam: encodeURIComponent('信用卡每日消費') },
          { id: 'credit_bill', name: '🧾 信用卡帳單', count: 5, total: '5 封未讀', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', urlParam: encodeURIComponent('信用卡帳單') },
          { id: 'fubon_bill', name: '🏦 富邦信用卡帳單', count: 0, total: '全部已讀', color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', urlParam: encodeURIComponent('富邦信用卡帳單') },
          { id: 'hotel_voucher', name: '🏨 住宿券', count: 0, total: '全部已讀', color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', urlParam: encodeURIComponent('住宿券') },
          { id: 'hinet', name: '🌐 Hinet', count: 12782, total: '12,782 封未讀', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', urlParam: 'Hinet' },
          { id: 'paid', name: '✅ 已繳款', count: 0, total: '全部已讀', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', urlParam: encodeURIComponent('已繳款') }
        ]
      },
      work: {
        name: '工作企業信箱',
        email: 'grant@company.corp',
        unreadTotal: 7,
        isLive: false,
        labels: [
          { id: 'p1', name: '🔥 緊急待辦 (P1)', count: 2, total: '2 封未讀', color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500', urlParam: 'P1' },
          { id: 'clients', name: '👥 客戶回函', count: 3, total: '3 封未讀', color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500', urlParam: '客戶' },
          { id: 'devops', name: '⚙️ CI/CD 監控告警', count: 2, total: '2 封未讀', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500', urlParam: 'DevOps' },
          { id: 'hr', name: '🏢 人資/內部公告', count: 0, total: '全部已讀', color: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500', urlParam: '公告' }
        ]
      }
    };

    let currentAcc = defaultAccounts[state.activeAccount] || defaultAccounts.personal;

    // Smart emoji helper for user labels
    const formatLabelName = (rawName) => {
      if (/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(rawName)) return rawName;
      if (rawName.includes('heaven.seventh')) return '📧 ' + rawName;
      if (/travel|japan|trip|旅遊|行程/i.test(rawName)) return '✈️ ' + rawName;
      if (/富邦/i.test(rawName)) return '🏦 ' + rawName;
      if (/每日消費|消費/i.test(rawName)) return '💳 ' + rawName;
      if (/帳單|發票/i.test(rawName)) return '🧾 ' + rawName;
      if (/住宿|飯店|旅館/i.test(rawName)) return '🏨 ' + rawName;
      if (/hinet|net|網路/i.test(rawName)) return '🌐 ' + rawName;
      if (/繳款/i.test(rawName)) return '✅ ' + rawName;
      return '🏷️ ' + rawName;
    };

    // If live data from GAS exists and activeAccount is personal, map it
    if (this.liveData && state.activeAccount === 'personal') {
      const palette = [
        { color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
        { color: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
        { color: 'bg-rose-100 text-rose-800 border-rose-200', dot: 'bg-rose-500' },
        { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
        { color: 'bg-sky-100 text-sky-800 border-sky-200', dot: 'bg-sky-500' },
        { color: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' },
        { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' }
      ];

      const rawLabels = Array.isArray(this.liveData.labels) ? this.liveData.labels : [];
      let totalLabelUnread = 0;

      const dynamicLabels = rawLabels.map((l, idx) => {
        const theme = palette[idx % palette.length];
        const unread = typeof l.unread === 'number' ? l.unread : 0;
        totalLabelUnread += unread;
        const displayName = formatLabelName(l.name);
        return {
          id: 'live_' + idx,
          name: displayName,
          rawName: l.name,
          count: unread,
          total: unread > 0 ? `${unread.toLocaleString()} 封未讀` : '全部已讀',
          color: theme.color,
          dot: theme.dot,
          urlParam: encodeURIComponent(l.name)
        };
      });

      const inboxUnread = (this.liveData.unreadInbox !== undefined && this.liveData.unreadInbox !== null)
        ? this.liveData.unreadInbox
        : totalLabelUnread;

      currentAcc = {
        name: '真實 Gmail (GAS 連線)',
        email: this.liveData.email || 'grantchiang1983@gmail.com',
        unreadTotal: inboxUnread,
        isLive: true,
        labels: dynamicLabels.length > 0 ? dynamicLabels : defaultAccounts.personal.labels
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
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-black" title="收件匣未讀總數">
              ${(currentAcc.unreadTotal || 0).toLocaleString()} 未讀
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
          <span class="text-sky-700 font-medium flex-shrink-0">${currentAcc.labels.length} 個標籤分類</span>
        </div>

        <!-- Config Panel (Toggleable) -->
        <div id="gmail-config-panel" class="${state.showConfig ? 'block' : 'hidden'} p-3 bg-slate-100 border-b border-slate-200 flex-shrink-0">
          <div class="font-bold text-xs text-[#0d346c] mb-1 flex items-center justify-between">
            <span>🔗 串接您的真實 Gmail 標籤 (Google Apps Script)</span>
            <button id="gmail-config-close" class="text-slate-400 hover:text-slate-600 font-black">✕</button>
          </div>
          <p class="text-[10px] text-slate-600 mb-2 leading-relaxed">
            系統已為您內建設定專屬 GAS Web App 網址，任何裝置打開均可全自動同步。若有更換部署網址可在此更新：
          </p>
          <div class="flex space-x-2 mb-1.5">
            <input type="text" id="gas-url-input" placeholder="貼上 Apps Script 網址 (https://script.google.com/macros/s/.../exec)" class="flex-1 px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white focus:outline-none focus:border-sky-500 font-mono" value="${gasUrl || ''}">
            <button id="gas-url-save" class="px-3 py-1 bg-[#0d346c] hover:bg-[#0369a1] text-white font-bold rounded shadow-sm text-xs flex-shrink-0">儲存並連線</button>
          </div>
          <div class="flex items-center justify-between text-[10px]">
            <span class="text-emerald-700 font-medium">● 跨裝置自動同步已啟用</span>
            <button id="gas-url-clear" class="text-rose-600 hover:underline">重設為預設端點</button>
          </div>
        </div>

        <!-- Label Cards Grid / List -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2 bg-white scrollbar-thin">
          ${this.isLoading ? `
            <div class="py-12 text-center text-slate-400">
              <div class="inline-block animate-spin text-2xl mb-2">⏳</div>
              <p class="text-xs font-medium">正在從您的 Gmail 同步最新標籤與未讀數...</p>
            </div>
          ` : currentAcc.labels.map(l => `
            <div class="p-2.5 rounded-xl border border-slate-200/90 hover:border-sky-400 hover:bg-sky-50/30 transition-all flex items-center justify-between group shadow-sm">
              <div class="flex items-center space-x-2.5 min-w-0 pr-2">
                <span class="w-2.5 h-2.5 rounded-full ${l.dot} flex-shrink-0"></span>
                <div class="truncate">
                  <div class="font-bold text-slate-800 text-xs truncate group-hover:text-sky-700 transition-colors">${l.name}</div>
                  <div class="text-[10px] mt-0.5">${l.count > 0 ? `<span class="text-rose-600 font-semibold">${l.count.toLocaleString()} 封未讀</span>` : '<span class="text-slate-400">全部已讀</span>'}</div>
                </div>
              </div>

              <div class="flex items-center space-x-2 flex-shrink-0">
                <span class="px-2 py-0.5 rounded-full text-[11px] font-black ${l.count > 0 ? l.color : 'bg-slate-100 text-slate-400 border border-slate-200'}">
                  ${l.count > 0 ? `${l.count.toLocaleString()} 未讀` : '全讀'}
                </span>
                <a href="https://mail.google.com/mail/u/0/#search/label%3A${l.urlParam}" target="_blank" rel="noopener noreferrer" class="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-sky-100 transition-colors" title="在 Gmail 中開啟此標籤信件">
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
            <span class="${currentAcc.isLive ? 'text-emerald-700 font-bold' : 'text-slate-400'}">${currentAcc.isLive ? '✓ 真實帳號即時同步' : '點擊 ⚙️ 串接連線真實標籤'}</span>
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

    // Clear / Reset GAS URL
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
        const url = hashParams.get('gas') || localStorage.getItem('bulletin_gmail_gas_url') || this.DEFAULT_GAS_URL;
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
