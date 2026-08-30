import { RealEstateService } from '../services/real-estate-service.js';

export const RealEstateWidget = {
  id: 'real-estate',
  title: '最新房屋買賣與實價登錄',
  icon: 'home',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { city: 'all', keyword: '', sortBy: 'date' }) {
    const listings = RealEstateService.getListings(state);

    const getBadgeStyle = (badge) => {
      switch(badge) {
        case '最新上架': return 'bg-sky-100 text-sky-800 border-sky-300';
        case '降價急售': return 'bg-rose-100 text-rose-800 border-rose-300';
        case '最新揭露': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
        default: return 'bg-amber-100 text-amber-800 border-amber-300';
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
        <!-- Filter and Search Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <!-- City Filter Badges -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            <button class="px-2.5 py-0.5 text-xs font-bold rounded-md transition-all ${state.city === 'all' ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}" data-city-filter="all">
              全部
            </button>
            ${['台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市'].map(c => `
              <button class="px-2.5 py-0.5 text-xs font-bold rounded-md transition-all flex-shrink-0 ${state.city === c ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'}" data-city-filter="${c}">
                ${c}
              </button>
            `).join('')}
          </div>

          <!-- Keyword Search & Sorting -->
          <div class="flex items-center space-x-1.5">
            <input type="text" id="re-keyword-input" placeholder="搜尋路段、捷運..." value="${state.keyword || ''}" class="bg-slate-50 border border-slate-300 rounded-lg px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-[#0284c7] w-28">
            <select id="re-sort-select" class="bg-slate-50 border border-slate-300 rounded-lg px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none focus:border-[#0284c7]">
              <option value="date" ${state.sortBy === 'date' ? 'selected' : ''}>最新發布</option>
              <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>總價低至高</option>
              <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>總價高至低</option>
              <option value="unit_price" ${state.sortBy === 'unit_price' ? 'selected' : ''}>單價最高</option>
            </select>
          </div>
        </div>

        <!-- Real Estate Listings List -->
        <div class="flex-1 overflow-y-auto space-y-2 my-2 pr-1 scrollbar-thin">
          ${listings.map(item => `
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0284c7] hover:bg-sky-50/50 transition-all cursor-pointer shadow-sm">
              <div class="flex items-start justify-between">
                <div class="flex-1 pr-2">
                  <div class="flex items-center space-x-1.5 mb-1">
                    <span class="text-[10px] px-1.5 py-0.5 rounded border ${getBadgeStyle(item.badge)} font-bold">
                      ${item.badge}
                    </span>
                    <span class="text-xs font-bold text-slate-800 line-clamp-1">
                      ${item.title}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-500 flex items-center space-x-1.5 font-medium">
                    <span class="text-sky-700 font-bold">📍 ${item.city} ${item.district}</span>
                    <span>‧</span>
                    <span>${item.layout}</span>
                    <span>‧</span>
                    <span>${item.size} 坪</span>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <div class="text-base font-black text-[#0d346c] font-mono">
                    ${item.totalPrice.toLocaleString()} <span class="text-xs font-bold text-slate-600">萬</span>
                  </div>
                  <div class="text-[11px] text-slate-500 font-mono font-medium">
                    ${item.unitPrice} 萬/坪
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200 text-[11px]">
                <span class="text-sky-800 font-medium">🚇 ${item.metroStation}</span>
                <span class="text-slate-400 font-medium">${item.date}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer Stats -->
        <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200">
          <span>共顯示 <b class="text-[#0d346c]">${listings.length}</b> 筆房產即時資訊</span>
          <span class="text-sky-700 font-semibold">實價登錄連線中</span>
        </div>
      </div>
    `;

    // Filter events
    container.querySelectorAll('[data-city-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-city-filter');
        RealEstateWidget.render(container, { ...state, city: selected });
      });
    });

    const kwInput = container.querySelector('#re-keyword-input');
    if (kwInput) {
      kwInput.addEventListener('input', (e) => {
        RealEstateWidget.render(container, { ...state, keyword: e.target.value });
      });
    }

    const sortSelect = container.querySelector('#re-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        RealEstateWidget.render(container, { ...state, sortBy: e.target.value });
      });
    }
  }
};
