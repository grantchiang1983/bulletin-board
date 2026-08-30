export const QuickNotesWidget = {
  id: 'quick-notes',
  title: '佈告欄便利貼與備忘錄',
  icon: 'clipboard-list',
  defaultWidth: 4,
  defaultHeight: 4,
  minWidth: 3,
  minHeight: 2,

  render(container) {
    let notes = [];
    try {
      notes = JSON.parse(localStorage.getItem('bulletin_notes') || '[]');
    } catch (e) {
      notes = [];
    }

    if (notes.length === 0) {
      notes = [
        { id: 'n-1', text: '📌 佈告欄操作指南：\n1. 點擊右上角「✏️ 自由佈局」開啟編輯模式。\n2. 可隨意拖曳卡片位置或拉動右下角縮放大小。\n3. 支援儲存與匯出專屬佈局設定！', color: 'yellow', date: '重要提醒' },
        { id: 'n-2', text: '🔔 今日待辦事項：\n- 關注台積電除息與大盤量能\n- 留意海神颱風路徑是否發布陸警\n- 預約板橋新板特區賞屋', color: 'blue', date: '今日待辦' }
      ];
    }

    const saveNotes = () => {
      localStorage.setItem('bulletin_notes', JSON.stringify(notes));
      this.render(container);
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-2">
            <span class="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">📝</span>
            <h3 class="font-bold text-sm text-white">自訂便簽與公告</h3>
          </div>
          <button id="add-note-btn" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1 transition-colors">
            <span>+ 新增便簽</span>
          </button>
        </div>

        <!-- Notes list -->
        <div class="flex-1 overflow-y-auto space-y-2.5 my-2.5 pr-1 scrollbar-thin">
          ${notes.map(note => {
            const bgMap = {
              yellow: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
              blue: 'bg-blue-950/40 border-blue-500/40 text-blue-200',
              green: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200',
              purple: 'bg-purple-950/40 border-purple-500/40 text-purple-200'
            };
            return `
              <div class="p-3 rounded-xl border ${bgMap[note.color] || bgMap.yellow} flex flex-col justify-between group transition-all">
                <textarea class="w-full bg-transparent border-0 focus:outline-none text-xs leading-relaxed resize-none text-slate-100 font-sans" rows="3" data-note-id="${note.id}">${note.text}</textarea>
                <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40 text-[10px]">
                  <span class="text-slate-400 font-mono">${note.date}</span>
                  <button class="text-rose-400 hover:text-rose-300 opacity-80 hover:opacity-100 transition-opacity" data-del-note="${note.id}">
                    🗑️ 刪除
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Bind add note
    const addBtn = container.querySelector('#add-note-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        notes.unshift({
          id: 'n-' + Date.now(),
          text: '新的自訂便簽內容...',
          color: ['yellow', 'blue', 'green', 'purple'][notes.length % 4],
          date: new Date().toLocaleDateString('zh-TW')
        });
        saveNotes();
      });
    }

    // Bind edit textarea
    container.querySelectorAll('textarea[data-note-id]').forEach(ta => {
      ta.addEventListener('change', (e) => {
        const id = ta.getAttribute('data-note-id');
        const target = notes.find(n => n.id === id);
        if (target) {
          target.text = e.target.value;
          localStorage.setItem('bulletin_notes', JSON.stringify(notes));
        }
      });
    });

    // Bind delete
    container.querySelectorAll('[data-del-note]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-note');
        notes = notes.filter(n => n.id !== id);
        saveNotes();
      });
    });
  }
};
