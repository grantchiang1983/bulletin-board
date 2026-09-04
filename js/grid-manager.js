import { WindyWidget } from './widgets/windy-widget.js';
import { WeatherTempWidget } from './widgets/weather-temp-widget.js';
import { WeatherRadarWidget } from './widgets/weather-radar-widget.js';
import { TyphoonWidget } from './widgets/typhoon-widget.js';
import { StockMarketWidget } from './widgets/stock-market-widget.js';
import { RealEstateWidget } from './widgets/real-estate-widget.js';
import { RealEstateQianpinWidget } from './widgets/real-estate-qianpin-widget.js';
import { QuickNotesWidget } from './widgets/quick-notes-widget.js';
import { ClockCalendarWidget } from './widgets/clock-calendar-widget.js';
import { GmailLabelsWidget } from './widgets/gmail-labels-widget.js';
import { ThreadsNativeCrawlerWidget } from './widgets/threads-native-crawler-widget.js';
import { ThreadsGoogleTrendsWidget } from './widgets/threads-google-trends-widget.js';

export const GridManager = {
  grid: null,
  isEditMode: false,
  STORAGE_KEY: 'bulletin_board_layout_v11',

  widgetRegistry: {
    'windy-weather': WindyWidget,
    'weather-temp': WeatherTempWidget,
    'weather-radar': WeatherRadarWidget,
    'typhoon-tracker': TyphoonWidget,
    'stock-market': StockMarketWidget,
    'real-estate': RealEstateWidget,
    'real-estate-qianpin': RealEstateQianpinWidget,
    'quick-notes': QuickNotesWidget,
    'clock-calendar': ClockCalendarWidget,
    'gmail-labels': GmailLabelsWidget,
    'threads-native-crawler': ThreadsNativeCrawlerWidget,
    'threads-google-trends': ThreadsGoogleTrendsWidget
  },

  defaultLayout: [
    { id: 'windy-weather', x: 0, y: 0, w: 12, h: 5, minW: 6, minH: 4 },
    { id: 'weather-temp', x: 0, y: 5, w: 6, h: 4, minW: 3, minH: 3 },
    { id: 'weather-radar', x: 6, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    { id: 'typhoon-tracker', x: 0, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
    { id: 'stock-market', x: 6, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
    { id: 'real-estate', x: 0, y: 14, w: 8, h: 5, minW: 4, minH: 4 },
    { id: 'quick-notes', x: 8, y: 14, w: 4, h: 5, minW: 3, minH: 2 },
    { id: 'real-estate-qianpin', x: 0, y: 19, w: 8, h: 5, minW: 4, minH: 4 },
    { id: 'clock-calendar', x: 8, y: 19, w: 4, h: 5, minW: 3, minH: 2 },
    { id: 'gmail-labels', x: 0, y: 24, w: 12, h: 5, minW: 4, minH: 4 },
    { id: 'threads-native-crawler', x: 0, y: 29, w: 6, h: 5, minW: 4, minH: 4 },
    { id: 'threads-google-trends', x: 6, y: 29, w: 6, h: 5, minW: 4, minH: 4 }
  ],

  presetLayouts: {
    overview: [
      { id: 'windy-weather', x: 0, y: 0, w: 12, h: 5 },
      { id: 'weather-temp', x: 0, y: 5, w: 6, h: 4 },
      { id: 'weather-radar', x: 6, y: 5, w: 6, h: 4 },
      { id: 'typhoon-tracker', x: 0, y: 9, w: 6, h: 5 },
      { id: 'stock-market', x: 6, y: 9, w: 6, h: 5 },
      { id: 'real-estate', x: 0, y: 14, w: 8, h: 5 },
      { id: 'quick-notes', x: 8, y: 14, w: 4, h: 5 },
      { id: 'real-estate-qianpin', x: 0, y: 19, w: 8, h: 5 },
      { id: 'clock-calendar', x: 8, y: 19, w: 4, h: 5 },
      { id: 'gmail-labels', x: 0, y: 24, w: 12, h: 5 },
      { id: 'threads-native-crawler', x: 0, y: 29, w: 6, h: 5 },
      { id: 'threads-google-trends', x: 6, y: 29, w: 6, h: 5 }
    ],
    finance_focus: [
      { id: 'stock-market', x: 0, y: 0, w: 6, h: 5 },
      { id: 'real-estate', x: 6, y: 0, w: 6, h: 5 },
      { id: 'real-estate-qianpin', x: 0, y: 5, w: 6, h: 5 },
      { id: 'quick-notes', x: 6, y: 5, w: 6, h: 5 },
      { id: 'windy-weather', x: 0, y: 10, w: 12, h: 5 }
    ],
    weather_focus: [
      { id: 'windy-weather', x: 0, y: 0, w: 12, h: 6 },
      { id: 'weather-radar', x: 0, y: 6, w: 6, h: 5 },
      { id: 'typhoon-tracker', x: 6, y: 6, w: 6, h: 5 },
      { id: 'weather-temp', x: 0, y: 11, w: 12, h: 4 }
    ]
  },

  init() {
    this.grid = GridStack.init({
      column: 12,
      cellHeight: 105,
      animate: true,
      margin: 12,
      staticGrid: true,
      draggable: {
        handle: '.widget-drag-handle',
        scroll: false
      },
      resizable: {
        handles: 'e, se, s, sw, w'
      }
    });

    this.loadLayout();
    this.bindEvents();
  },

  loadLayout() {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    } catch (e) {
      console.warn(e);
    }

    const itemsToLoad = (saved && Array.isArray(saved) && saved.length > 0) ? saved : this.defaultLayout;
    this.grid.removeAll();

    itemsToLoad.filter(item => item && item.id !== 'gmail-ai-classifier').forEach(item => {
      this.addWidget(item.id, item);
    });

    this.setEditMode(this.isEditMode);
  },

  addWidget(widgetId, options = {}) {
    const widgetDef = this.widgetRegistry[widgetId];
    if (!widgetDef) return;

    const w = options.w || widgetDef.defaultWidth || 6;
    const h = options.h || widgetDef.defaultHeight || 4;
    const x = options.x !== undefined ? options.x : undefined;
    const y = options.y !== undefined ? options.y : undefined;
    const minW = options.minW || widgetDef.minWidth || 3;
    const minH = options.minH || widgetDef.minHeight || 2;

    const el = document.createElement('div');
    el.className = 'grid-stack-item';
    el.setAttribute('data-widget-id', widgetId);

    el.innerHTML = `
      <div class="grid-stack-item-content bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col overflow-hidden relative group">
        <div class="widget-drag-handle flex items-center justify-between px-3.5 py-2 bg-slate-100/90 border-b border-slate-200 select-none z-20 cursor-grab">
          <div class="flex items-center space-x-2">
            <span class="text-xs text-[#0d346c] font-black tracking-wide">⠿ ${widgetDef.title}</span>
          </div>
          <div class="widget-edit-controls flex items-center space-x-1.5">
            <button class="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors" data-remove-widget title="移除此區塊">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div class="widget-body-container flex-1 overflow-hidden relative"></div>
      </div>
    `;

    const removeBtn = el.querySelector('[data-remove-widget]');
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.grid.removeWidget(el);
        this.saveLayout();
      });
    }

    this.grid.addWidget(el, { x, y, w, h, minW, minH, autoPosition: x === undefined });

    const bodyContainer = el.querySelector('.widget-body-container');
    if (bodyContainer && widgetDef.render) {
      widgetDef.render(bodyContainer);
    }
  },

  setEditMode(enabled) {
    this.isEditMode = enabled;
    if (enabled) {
      document.body.classList.add('edit-mode');
      this.grid.setStatic(false);
    } else {
      document.body.classList.remove('edit-mode');
      this.grid.setStatic(true);
      this.saveLayout();
    }
  },

  applyPreset(presetKey) {
    const layout = this.presetLayouts[presetKey];
    if (!layout) return;

    this.grid.removeAll();
    layout.forEach(item => {
      this.addWidget(item.id, item);
    });
    this.setEditMode(this.isEditMode);
    this.saveLayout();
  },

  saveLayout() {
    const items = [];
    this.grid.engine.nodes.forEach(node => {
      const widgetId = node.el.getAttribute('data-widget-id');
      if (widgetId) {
        items.push({
          id: widgetId,
          x: node.x,
          y: node.y,
          w: node.w,
          h: node.h,
          minW: node.minW,
          minH: node.minH
        });
      }
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.showToast('佈局設定已自動儲存');
  },

  resetLayout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadLayout();
    this.showToast('已重設為預設綜合佈局');
  },

  exportLayout() {
    const layoutData = localStorage.getItem(this.STORAGE_KEY) || JSON.stringify(this.defaultLayout);
    const blob = new Blob([layoutData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulletin_cwa_layout_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importLayout(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
        this.loadLayout();
        this.showToast('成功匯入專屬佈局設定！');
      } else {
        alert('匯入格式不正確');
      }
    } catch (e) {
      alert('無效的 JSON 佈局檔案');
    }
  },

  bindEvents() {
    this.grid.on('change', () => {
      if (this.isEditMode) {
        this.saveLayout();
      }
    });

    this.grid.on('resizestop', () => {
      window.dispatchEvent(new Event('resize'));
    });
  },

  showToast(msg) {
    const toast = document.getElementById('app-toast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove('opacity-0', 'translate-y-4');
      toast.classList.add('opacity-100', 'translate-y-0');
      setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-4');
      }, 2200);
    }
  }
};
