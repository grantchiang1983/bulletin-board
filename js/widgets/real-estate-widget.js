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
        case '最新上架': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        case '降價急售': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
        case '最新揭露': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        default: return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-stone-900 text-stone-100 p-4 select-none justify-between">
        <!-- Filter and Search Bar -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-stone-800">
          <!-- City Filter Badges -->
          <div class="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            <button class="px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${state.city === 'all' ? 'bg-amber-600 text-white shadow' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}" data-city-filter="all">
              全部
            </button>
            ${['台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市'].map(c => `
              <button class="px-2 py-0.5 text-xs font-medium rounded-md transition-all flex-shrink-0 ${state.city === c ? 'bg-amber-600 text-white shadow' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}" data-city-filter="${c}">
                ${c}
              </button>
            `).join('')}
          </div>

          <!-- Keyword Search & Sorting -->
          <div class="flex items-center space-x-1.5">
            <input type="text" id="re-keyword-input" placeholder="搜尋路段、捷運..." value="${state.keyword || ''}" class="bg-stone-950 border border-stone-700 rounded px-2 py-0.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 w-28">
            <select id="re-sort-select" class="bg-stone-950 border border-stone-700 rounded px-1.5 py-0.5 text-xs text-stone-300 focus:outline-none focus:border-amber-500">
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
            <div class="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/60 hover:border-amber-500/60 hover:bg-stone-800 transition-all cursor-pointer">
              <div class="flex items-start justify-between">
                <div class="flex-1 pr-2">
                  <div class="flex items-center space-x-1.5 mb-1">
                    <span class="text-[9px] px-1.5 py-0.5 rounded border ${getBadgeStyle(item.badge)} font-medium">
                      ${item.badge}
                    </span>
                    <span class="text-xs font-bold text-stone-200 line-clamp-1">
                      ${item.title}
                    </span>
                  </div>
                  <div class="text-[11px] text-stone-400 flex items-center space-x-1.5">
                    <span class="text-amber-400 font-medium">📍 ${item.city} ${item.district}</span>
                    <span>‧</span>
                    <span>${item.layout}</span>
                    <span>‧</span>
                    <span>${item.size} 坪</span>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <div class="text-sm font-extrabold text-amber-400 font-mono">
                    ${item.totalPrice.toLocaleString()} <span class="text-[10px] font-normal">萬</span>
                  </div>
                  <div class="text-[10px] text-stone-400 font-mono">
                    ${item.unitPrice} 萬/坪
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-stone-700/40 text-[10px]">
                <span class="text-orange-300">🚇 ${item.metroStation}</span>
                <span class="text-stone-500">${item.date}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer Stats -->
        <div class="flex items-center justify-between text-[10px] text-stone-400 pt-1.5 border-t border-stone-800">
          <span>共顯示 ${listings.length} 筆房產資訊</span>
          <span class="text-amber-400">即時通報連線中</span>
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
