import { GridManager } from './grid-manager.js';
import { StockService } from './services/stock-service.js';

export const App = {
  init() {
    console.log('🚀 初始化佈告欄應用程式...');
    GridManager.init();
    this.bindHeaderControls();
    this.startLiveEngines();
  },

  bindHeaderControls() {
    // Edit mode switch
    const editToggleBtn = document.getElementById('edit-mode-toggle');
    const editIndicator = document.getElementById('edit-mode-indicator');
    
    if (editToggleBtn) {
      editToggleBtn.addEventListener('click', () => {
        const nextState = !GridManager.isEditMode;
        GridManager.setEditMode(nextState);
        
        if (nextState) {
          editToggleBtn.classList.remove('bg-slate-800', 'text-slate-200');
          editToggleBtn.classList.add('bg-blue-600', 'text-white', 'ring-2', 'ring-blue-400');
          editToggleBtn.innerHTML = `<span>✓ 完成佈局</span>`;
          if (editIndicator) editIndicator.classList.remove('hidden');
          GridManager.showToast('已開啟自由佈局模式：可自由拖曳排版與縮放大小');
        } else {
          editToggleBtn.classList.remove('bg-blue-600', 'text-white', 'ring-2', 'ring-blue-400');
          editToggleBtn.classList.add('bg-slate-800', 'text-slate-200');
          editToggleBtn.innerHTML = `<span>✏️ 自由佈局</span>`;
          if (editIndicator) editIndicator.classList.add('hidden');
          GridManager.showToast('已鎖定並儲存當前佈局');
        }
      });
    }

    // Add Widget Menu
    const addWidgetBtn = document.getElementById('add-widget-btn');
    const addWidgetModal = document.getElementById('add-widget-modal');
    const closeWidgetModal = document.getElementById('close-widget-modal');

    if (addWidgetBtn && addWidgetModal) {
      addWidgetBtn.addEventListener('click', () => {
        addWidgetModal.classList.remove('hidden');
      });
      if (closeWidgetModal) {
        closeWidgetModal.addEventListener('click', () => {
          addWidgetModal.classList.add('hidden');
        });
      }
      addWidgetModal.addEventListener('click', (e) => {
        if (e.target === addWidgetModal) {
          addWidgetModal.classList.add('hidden');
        }
      });
    }

    // Add specific widget triggers
    document.querySelectorAll('[data-add-widget-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const widgetType = btn.getAttribute('data-add-widget-type');
        GridManager.addWidget(widgetType);
        GridManager.saveLayout();
        if (addWidgetModal) addWidgetModal.classList.add('hidden');
        GridManager.showToast(`已新增小工具：${GridManager.widgetRegistry[widgetType]?.title || widgetType}`);
      });
    });

    // Preset selector
    const presetSelect = document.getElementById('preset-select');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        if (e.target.value) {
          GridManager.applyPreset(e.target.value);
        }
      });
    }

    // Reset layout
    const resetBtn = document.getElementById('reset-layout-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('確定要將所有區塊恢復為預設綜合佈局嗎？')) {
          GridManager.resetLayout();
        }
      });
    }

    // Export Layout
    const exportBtn = document.getElementById('export-layout-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        GridManager.exportLayout();
      });
    }

    // Import Layout
    const importInput = document.getElementById('import-layout-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          GridManager.importLayout(ev.target.result);
        };
        reader.readAsText(file);
      });
    }
  },

  startLiveEngines() {
    // Tick prices every 3.5s and refresh ticker bar
    setInterval(() => {
      StockService.tickLivePrices();
      this.updateTickerText();
    }, 3500);
  },

  updateTickerText() {
    const tickerContent = document.getElementById('top-ticker-content');
    if (!tickerContent) return;

    const twii = StockService.indices[0];
    const tsmc = StockService.stocks[0];
    const nvda = StockService.stocks[6];
    
    const items = [
      `🔔 <b>即時快訊</b>：海神颱風發布海上警報，請東部海面作業船隻嚴加戒備`,
      `📈 <b>加權指數</b>：${twii.price.toLocaleString()} (<span class="${twii.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">${twii.change >= 0 ? '+' : ''}${twii.change} / ${twii.changePercent}%</span>)`,
      `💎 <b>台積電</b>：${tsmc.price} (<span class="${tsmc.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">${tsmc.change >= 0 ? '+' : ''}${tsmc.changePercent}%</span>)`,
      `🚀 <b>NVIDIA</b>：\$${nvda.price} (<span class="${nvda.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">+${nvda.changePercent}%</span>)`,
      `🏠 <b>房市速報</b>：最新揭露新板特區高樓豪邸每坪78.5萬、大安森林公園景觀戶上架`
    ];

    tickerContent.innerHTML = items.join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
  }
};

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
