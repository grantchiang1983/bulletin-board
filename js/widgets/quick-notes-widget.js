export const QuickNotesWidget = {
  id: 'quick-notes',
  title: '佈告欄便簽與備忘錄',
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
        { id: 'n-1', text: '📌 自由佈局提示：\n點擊右上角「✏️ 自由佈局」開啟編輯模式，按住卡片頂部把手即可拖曳移動位置，拉動卡片邊緣或右下角可縮放寬高！', color: 'blue', date: '重要提醒' },
        { id: 'n-2', text: '🔔 今日待辦：\n1. 追蹤中央氣象署海神颱風路徑\n2. 觀察台股大盤走勢與K線技術分析\n3. 預約板橋新板特區賞屋', color: 'amber', date: '今日待辦' }
      ];
    }

    const saveNotes = () => {
      localStorage.setItem('bulletin_notes', JSON.stringify(notes));
      QuickNotesWidget.render(container);
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- Header -->
        <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div class="flex items-center space-x-2">
            <span class="p-1.5 rounded-lg bg-sky-100 text-sky-700">📝</span>
            <h3 class="font-black text-sm text-[#0d346c]">自訂便簽與公告</h3>
          </div>
          <button id="add-note-btn" class="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-sm transition-all">
            + 新增便簽
          </button>
        </div>

        <!-- Notes List -->
        <div class="flex-1 overflow-y-auto space-y-2 my-2 pr-1 scrollbar-thin">
          ${notes.map(note => {
            const bgMap = {
              blue: 'bg-sky-50 border-sky-200 text-slate-800',
              amber: 'bg-amber-50 border-amber-200 text-slate-800',
              emerald: 'bg-emerald-50 border-emerald-200 text-slate-800'
            };
            return `
              <div class="p-2.5 rounded-xl border ${bgMap[note.color] || bgMap.blue} flex flex-col justify-between shadow-sm">
                <textarea class="w-full bg-transparent border-0 focus:outline-none text-xs leading-relaxed resize-none text-slate-800 font-sans font-medium" rows="3" data-note-id="${note.id}">${note.text}</textarea>
                <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200 text-[10px]">
                  <span class="text-slate-500 font-medium">${note.date}</span>
                  <button class="text-rose-600 hover:text-rose-800 font-bold" data-del-note="${note.id}">
                    🗑️ 刪除
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Add note
    const addBtn = container.querySelector('#add-note-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        notes.unshift({
          id: 'n-' + Date.now(),
          text: '新便簽筆記...',
          color: ['blue', 'amber', 'emerald'][notes.length % 3],
          date: new Date().toLocaleDateString('zh-TW')
        });
        saveNotes();
      });
    }

    // Edit note
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

    // Delete note
    container.querySelectorAll('[data-del-note]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-note');
        notes = notes.filter(n => n.id !== id);
        saveNotes();
      });
    });
  }
};
