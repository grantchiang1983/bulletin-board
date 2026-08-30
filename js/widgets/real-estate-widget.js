import { RealEstateService } from '../services/real-estate-service.js';

export const RealEstateWidget = {
  id: 'real-estate',
  title: '最新房屋買賣與實價登錄',
  icon: 'home',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { city: 'all', category: 'all', keyword: '', sortBy: 'date' }) {
    const listings = RealEstateService.getListings(state);
    const cities = RealEstateService.getCities();

    const getBadgeStyle = (badge) => {
      switch(badge) {
        case '最新上架': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
        case '降價急售': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
        case '最新揭露': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
        default: return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      }
    };

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none">
        <!-- Header & Filters -->
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full scrollbar-thin">
            <button class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${state.city === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}" data-city-filter="all">
              全部地區
            </button>
            ${['台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市'].map(c => `
              <button class="px-2.5 py-1 text-xs font-medium rounded-lg transition-all flex-shrink-0 ${state.city === c ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}" data-city-filter="${c}">
                ${c}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center space-x-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-44">
              <input type="text" id="re-keyword-input" placeholder="搜尋路段、捷運、建案..." value="${state.keyword || ''}" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500">
            </div>
            <select id="re-sort-select" class="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none">
              <option value="date" ${state.sortBy === 'date' ? 'selected' : ''}>最新發布</option>
              <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>總價由低到高</option>
              <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>總價由高到低</option>
              <option value="unit_price" ${state.sortBy === 'unit_price' ? 'selected' : ''}>單價最高</option>
              <option value="size" ${state.sortBy === 'size' ? 'selected' : ''}>坪數最大</option>
            </select>
          </div>
        </div>

        <!-- Property Card Listing (Scrollable) -->
        <div class="flex-1 overflow-y-auto space-y-2.5 my-2.5 pr-1 scrollbar-thin">
          ${listings.length === 0 ? `
            <div class="flex flex-col items-center justify-center h-40 text-slate-500 text-xs">
              <span>查無符合條件之房產訊息</span>
            </div>
          ` : listings.map(item => `
            <div class="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/60 hover:bg-slate-800/90 transition-all cursor-pointer group" data-listing-id="${item.id}">
              <div class="flex items-start justify-between">
                <div class="flex-1 pr-2">
                  <div class="flex items-center space-x-2 mb-1">
                    <span class="text-[10px] px-1.5 py-0.5 rounded border ${getBadgeStyle(item.badge)} font-medium">
                      ${item.badge}
                    </span>
                    <span class="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                      ${item.title}
                    </span>
                  </div>
                  <div class="text-xs text-slate-400 flex items-center space-x-2">
                    <span class="text-amber-400/90 font-medium">📍 ${item.city} ${item.district}</span>
                    <span>‧</span>
                    <span>${item.layout}</span>
                    <span>‧</span>
                    <span>建坪 ${item.size} 坪</span>
                    <span>‧</span>
                    <span>${item.floor}</span>
                  </div>
                </div>

                <div class="text-right flex-shrink-0">
                  <div class="text-base font-extrabold text-amber-400 font-mono">
                    ${item.totalPrice.toLocaleString()} <span class="text-xs font-normal">萬元</span>
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono">
                    單價 ${item.unitPrice} 萬/坪
                  </div>
                </div>
              </div>

              <!-- Tags and Metro -->
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40 text-[11px]">
                <div class="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span class="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded text-[10px] border border-cyan-800/40">
                    🚇 ${item.metroStation}
                  </span>
                  ${item.tags.slice(0, 2).map(t => `
                    <span class="text-slate-300 bg-slate-700/50 px-1.5 py-0.5 rounded text-[10px]">${t}</span>
                  `).join('')}
                </div>
                <span class="text-slate-500 text-[10px]">${item.date}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer Stats -->
        <div class="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <span>共顯示 ${listings.length} 筆最新房產買賣與實價登錄</span>
          <span class="text-blue-400">即時串接全台房屋買賣通報中心</span>
        </div>
      </div>
    `;

    // Bind Filter Events
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
