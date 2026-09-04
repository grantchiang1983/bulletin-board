export const GmailAiClassifierWidget = {
  id: 'gmail-ai-classifier',
  title: 'AI 智慧信件分類與摘要 ‧ Gemini + GAS (方法三)',
  icon: 'cpu',
  defaultWidth: 6,
  defaultHeight: 5,
  minWidth: 4,
  minHeight: 4,

  render(container, state = { isAnalyzing: false, showScriptModal: false, activeFilter: 'all' }) {
    const emails = [
      {
        id: 1,
        sender: 'Alex Wang (Tech Lead)',
        subject: '[PR Review] Bulletin-board 儀表板新功能整合與效能調校',
        time: '10 分鐘前',
        category: 'work',
        categoryName: '💼 專案工作',
        categoryColor: 'bg-blue-100 text-blue-800 border-blue-200',
        priority: '🔥 高優先度',
        priorityColor: 'text-rose-600 bg-rose-50 border-rose-200',
        aiSummary: '詢問週五部署上線進度，需確認 24H 走勢與標籤模組是否已完成驗收。',
        suggestion: '建議今日 18:00 前審閱 PR 並回覆進度'
      },
      {
        id: 2,
        sender: 'notice@taipower.com.tw',
        subject: '【台灣電力公司】115年9月份電子收據與繳費成功通知',
        time: '今日 09:15',
        category: 'finance',
        categoryName: '💳 財務帳單',
        categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        priority: '☕ 僅供參考',
        priorityColor: 'text-slate-600 bg-slate-100 border-slate-200',
        aiSummary: '本期水電帳單 NT$ 1,320 已由約定帳戶扣款成功，無須手動繳納。',
        suggestion: '已自動歸檔至 [財務/水電帳單] 標籤並略過收件匣'
      },
      {
        id: 3,
        sender: 'no-reply-aws@amazon.com',
        subject: '【AWS Billing】Invoice Available for Account 8920-***',
        time: '昨日 22:30',
        category: 'finance',
        categoryName: '💳 財務帳單',
        categoryColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        priority: '⚡ 中優先度',
        priorityColor: 'text-amber-700 bg-amber-50 border-amber-200',
        aiSummary: '8 月份雲端主機費用 $24.80 USD，包含 EC2 與 CloudFront 流量費用。',
        suggestion: '建議月底前列印 PDF 收據供報帳核銷'
      },
      {
        id: 4,
        sender: 'notifications@github.com',
        subject: '【GitHub Security】Dependabot alert: Update tailwindcss in bulletin-board',
        time: '昨日 14:10',
        category: 'security',
        categoryName: '🚨 系統資安',
        categoryColor: 'bg-purple-100 text-purple-800 border-purple-200',
        priority: '⚡ 中優先度',
        priorityColor: 'text-amber-700 bg-amber-50 border-amber-200',
        aiSummary: '檢測到相依性套件版本安全修正通知，目前不影響線上運作。',
        suggestion: '可於下週定期維護排程中更新 package.json'
      }
    ];

    const filteredEmails = state.activeFilter === 'all' 
      ? emails 
      : emails.filter(e => e.category === state.activeFilter);

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between text-xs">
        <!-- Top Toolbar -->
        <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <span class="p-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold">🤖 Gemini AI</span>
            <span class="text-xs font-bold text-[#0d346c]">信件智慧研判與摘要</span>
          </div>

          <div class="flex items-center space-x-1.5">
            <button id="ai-analyze-btn" class="px-2.5 py-1 rounded bg-gradient-to-r from-indigo-500 to-sky-600 hover:from-indigo-600 hover:to-sky-700 text-white font-bold text-[11px] flex items-center space-x-1 shadow-sm transition-all ${state.isAnalyzing ? 'opacity-70 cursor-wait' : ''}" ${state.isAnalyzing ? 'disabled' : ''}>
              <span>${state.isAnalyzing ? '⏳ 分析中...' : '⚡ 一鍵 AI 分類'}</span>
            </button>
            <button id="ai-script-modal-btn" class="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm text-[11px]" title="查看 Apps Script + Gemini API 部署腳本">
              📋 部署指南
            </button>
          </div>
        </div>

        <!-- Filter & Stats Bar -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-100/70 border-b border-slate-200 text-[11px] flex-shrink-0">
          <div class="flex space-x-1">
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'all' ? 'bg-white text-[#0d346c] shadow-xs' : 'text-slate-500 hover:text-slate-800'}" data-filter="all">
              全部 (4)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'work' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}" data-filter="work">
              工作 (1)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'finance' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}" data-filter="finance">
              帳單 (2)
            </button>
            <button class="px-2 py-0.5 rounded font-bold transition-colors ${state.activeFilter === 'security' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}" data-filter="security">
              資安 (1)
            </button>
          </div>
          <span class="text-[10px] text-emerald-700 font-bold hidden sm:inline">● Gemini 1.5 連線就緒</span>
        </div>

        <!-- Script Drawer Modal (Toggleable) -->
        <div id="ai-script-drawer" class="${state.showScriptModal ? 'block' : 'hidden'} p-3 bg-slate-900 text-slate-200 border-b border-slate-700 flex-shrink-0 overflow-y-auto max-h-[160px] scrollbar-thin">
          <div class="flex items-center justify-between mb-1">
            <span class="font-bold text-xs text-amber-400">💡 Google Apps Script + Gemini API 自動讀信腳本</span>
            <button id="ai-script-close" class="text-slate-400 hover:text-white font-bold">✕</button>
          </div>
          <p class="text-[10px] text-slate-400 mb-2 leading-relaxed">
            在 <a href="https://script.google.com" target="_blank" class="text-sky-400 underline">script.google.com</a> 建立新專案，設定每小時定時觸發器，即可實現自動閱讀未讀郵件並貼上標籤：
          </p>
          <pre class="p-2 bg-black/50 text-emerald-300 rounded text-[9px] font-mono leading-tight overflow-x-auto">
function classifyEmailsWithGemini() {
  const apiKey = 'YOUR_GEMINI_API_KEY';
  const threads = GmailApp.search('is:unread label:INBOX', 0, 5);
  threads.forEach(t => {
    const msg = t.getMessages()[0];
    const subject = msg.getSubject();
    const content = msg.getPlainBody().slice(0, 300);
    // 呼叫 Gemini REST API 判斷類別後自動貼上標籤:
    // GmailApp.getUserLabelByName(resultCategory).addToThread(t);
  });
}</pre>
        </div>

        <!-- Email Cards Stream -->
        <div class="flex-1 p-3 overflow-y-auto space-y-2.5 bg-slate-50 scrollbar-thin">
          ${filteredEmails.map(e => `
            <div class="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-sky-400 transition-all">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center space-x-1.5 truncate pr-2">
                  <span class="px-1.5 py-0.5 rounded border text-[10px] font-black ${e.categoryColor}">
                    ${e.categoryName}
                  </span>
                  <span class="px-1.5 py-0.5 rounded border text-[10px] font-bold ${e.priorityColor}">
                    ${e.priority}
                  </span>
                  <span class="text-[11px] font-bold text-slate-700 truncate">${e.sender}</span>
                </div>
                <span class="text-[10px] text-slate-400 font-medium flex-shrink-0">${e.time}</span>
              </div>

              <div class="font-black text-xs text-[#0d346c] mb-1 leading-snug">
                ${e.subject}
              </div>

              <!-- AI Analysis Bubble -->
              <div class="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100/80 text-[11px] space-y-1">
                <div class="flex items-start space-x-1.5 text-slate-700">
                  <span class="font-bold text-indigo-700 flex-shrink-0">🤖 摘要:</span>
                  <span class="leading-relaxed">${e.aiSummary}</span>
                </div>
                <div class="flex items-start space-x-1.5 text-slate-600 pt-0.5 border-t border-indigo-100">
                  <span class="font-bold text-amber-600 flex-shrink-0">💡 建議:</span>
                  <span class="font-medium text-slate-700">${e.suggestion}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white border-t border-slate-200 text-[10px] text-slate-500 flex-shrink-0">
          <span>AI 智慧決策模型：Gemini 1.5 Flash</span>
          <span class="text-indigo-600 font-bold">自動打標籤 ‧ 零人工手動</span>
        </div>
      </div>
    `;

    // Filter Buttons
    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        GmailAiClassifierWidget.render(container, { ...state, activeFilter: filter });
      });
    });

    // Analyze Button with Simulated Animation
    const analyzeBtn = container.querySelector('#ai-analyze-btn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        GmailAiClassifierWidget.render(container, { ...state, isAnalyzing: true });
        setTimeout(() => {
          GmailAiClassifierWidget.render(container, { ...state, isAnalyzing: false });
        }, 1000);
      });
    }

    // Modal Drawer Toggle
    const scriptModalBtn = container.querySelector('#ai-script-modal-btn');
    const scriptClose = container.querySelector('#ai-script-close');
    if (scriptModalBtn) {
      scriptModalBtn.addEventListener('click', () => {
        GmailAiClassifierWidget.render(container, { ...state, showScriptModal: !state.showScriptModal });
      });
    }
    if (scriptClose) {
      scriptClose.addEventListener('click', () => {
        GmailAiClassifierWidget.render(container, { ...state, showScriptModal: false });
      });
    }
  }
};
