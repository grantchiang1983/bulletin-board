/**
 * Bulletin Board (佈告欄) - Standalone All-In-One Script
 * Works seamlessly with file:/// protocol and HTTP/HTTPS.
 */
(function() {
  'use strict';

  // ==========================================
  // 1. SERVICES
  // ==========================================

  const WeatherService = {
    cities: [
      { id: 'taipei', name: '台北市', temp: 28, high: 32, low: 25, condition: '多雲短暫雨', icon: 'cloud-rain', humidity: 78, uv: 6, rainProb: '40%', aqi: 35, aqiStatus: '良好' },
      { id: 'new_taipei', name: '新北市', temp: 28, high: 33, low: 25, condition: '陰天', icon: 'cloud', humidity: 76, uv: 5, rainProb: '30%', aqi: 42, aqiStatus: '良好' },
      { id: 'taoyuan', name: '桃園市', temp: 27, high: 31, low: 24, condition: '多雲時晴', icon: 'sun-medium', humidity: 72, uv: 7, rainProb: '20%', aqi: 48, aqiStatus: '良好' },
      { id: 'hsinchu', name: '新竹市', temp: 27, high: 31, low: 24, condition: '晴時多雲', icon: 'sun', humidity: 68, uv: 8, rainProb: '10%', aqi: 38, aqiStatus: '良好' },
      { id: 'taichung', name: '台中市', temp: 29, high: 34, low: 26, condition: '晴朗炎熱', icon: 'sun', humidity: 65, uv: 9, rainProb: '10%', aqi: 55, aqiStatus: '普通' },
      { id: 'tainan', name: '台南市', temp: 30, high: 33, low: 26, condition: '晴時多雲', icon: 'sun-medium', humidity: 74, uv: 9, rainProb: '20%', aqi: 52, aqiStatus: '普通' },
      { id: 'kaohsiung', name: '高雄市', temp: 31, high: 34, low: 27, condition: '午後局部雷雨', icon: 'cloud-lightning', humidity: 79, uv: 8, rainProb: '60%', aqi: 62, aqiStatus: '普通' },
      { id: 'keelung', name: '基隆市', temp: 27, high: 30, low: 24, condition: '陰短暫雨', icon: 'cloud-drizzle', humidity: 82, uv: 4, rainProb: '50%', aqi: 28, aqiStatus: '優良' },
      { id: 'yilan', name: '宜蘭縣', temp: 26, high: 30, low: 23, condition: '陣雨', icon: 'cloud-rain', humidity: 85, uv: 5, rainProb: '70%', aqi: 25, aqiStatus: '優良' },
      { id: 'hualien', name: '花蓮縣', temp: 28, high: 31, low: 25, condition: '多雲局部雨', icon: 'cloud-sun-rain', humidity: 80, uv: 7, rainProb: '40%', aqi: 22, aqiStatus: '優良' },
      { id: 'taitung', name: '台東縣', temp: 29, high: 32, low: 26, condition: '晴多雲', icon: 'sun', humidity: 75, uv: 8, rainProb: '20%', aqi: 20, aqiStatus: '優良' },
      { id: 'penghu', name: '澎湖縣', temp: 29, high: 32, low: 26, condition: '晴朗有風', icon: 'wind', humidity: 70, uv: 10, rainProb: '0%', aqi: 30, aqiStatus: '優良' }
    ],

    getAllCities() {
      return this.cities;
    },

    getCityDetail(cityId) {
      const city = this.cities.find(c => c.id === cityId) || this.cities[0];
      const nowHour = new Date().getHours();
      const hourly = [];
      for (let i = 0; i < 24; i += 2) {
        const h = (nowHour + i) % 24;
        const timeStr = `${h.toString().padStart(2, '0')}:00`;
        const tempVariation = Math.sin((h - 6) / 24 * Math.PI * 2) * 3;
        hourly.push({
          time: timeStr,
          temp: Math.round(city.temp + tempVariation),
          rainProb: Math.max(5, Math.min(90, Math.round(parseInt(city.rainProb) + (Math.sin(i) * 15)))) + '%',
          icon: i % 4 === 0 ? city.icon : (h > 6 && h < 18 ? 'sun' : 'moon')
        });
      }

      const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      const currentDayIdx = new Date().getDay();
      const weekly = [];
      for (let i = 0; i < 7; i++) {
        const dayName = i === 0 ? '今天' : days[(currentDayIdx + i) % 7];
        weekly.push({
          day: dayName,
          high: city.high + Math.floor(Math.sin(i) * 2),
          low: city.low + Math.floor(Math.cos(i) * 2),
          icon: ['sun', 'sun-medium', 'cloud-rain', 'cloud', 'cloud-lightning'][Math.abs((city.name.charCodeAt(0) + i) % 5)],
          rainProb: `${(i * 15 + 10) % 80}%`
        });
      }
      return { ...city, hourly, weekly };
    },

    getRadarLayers() {
      return [
        { id: 'radar_echo', name: '雷達回波圖 (即時降雨)', type: 'radar', unit: 'dBZ (回波強度)' },
        { id: 'satellite_ir', name: '紅外線衛星雲圖 (色調強化)', type: 'satellite', unit: '雲頂溫度 (°C)' },
        { id: 'rainfall_accum', name: '日累積雨量分佈圖', type: 'rainfall', unit: '毫米 (mm)' }
      ];
    },

    getTyphoonInfo() {
      return {
        nameZh: '海神 (HAISHEN)',
        nameEn: 'Typhoon HAISHEN',
        number: '2026 年第 11 號颱風',
        intensity: '中度颱風 (Moderate Typhoon)',
        status: '海上警報發布中',
        alertAreas: ['巴士海峽', '台灣東南部海面', '台灣東北部海面', '恆春半島'],
        centerLocation: '北緯 21.6 度，東經 124.5 度 (鵝鑾鼻東南方約 380 公里)',
        movementSpeed: '向西北西進行，時速 18 公里',
        centralPressure: '955 hPa',
        maxWindSpeed: '43 m/s (約 14 級風，瞬間最大陣風 16 級)',
        radius7: '250 公里 (7級風暴風半徑)',
        radius10: '80 公里 (10級風暴風半徑)',
        pathPoints: [
          { time: '昨 14:00', status: '輕度', past: true },
          { time: '昨 20:00', status: '中度', past: true },
          { time: '今 08:00', status: '中度', past: true },
          { time: '現在位置', status: '中度 (中心)', current: true },
          { time: '預估 +12h', status: '中度', forecast: true },
          { time: '預估 +24h', status: '中度 (逼近陸地)', forecast: true },
          { time: '預估 +36h', status: '輕度', forecast: true }
        ],
        impactNotice: '受颱風外圍環流影響，東半部及恆春半島有大雨或豪雨發生機率；沿海風浪明顯偏大，請避免前往海邊活動。'
      };
    }
  };

  const StockService = {
    indices: [
      { symbol: '^TWII', name: '加權指數 (台股)', price: 23420.50, change: 168.32, changePercent: 0.72, volume: '4,120 億', high: 23480.12, low: 23290.45 },
      { symbol: '^TWOII', name: '櫃買指數 (OTC)', price: 272.85, change: -1.15, changePercent: -0.42, volume: '980 億', high: 274.60, low: 271.80 },
      { symbol: '^DJI', name: '道瓊工業指數', price: 41250.80, change: 228.05, changePercent: 0.56, volume: '3.8 億股', high: 41380.00, low: 41100.20 },
      { symbol: '^IXIC', name: '那斯達克指數', price: 17820.60, change: 185.40, changePercent: 1.05, volume: '45.2 億股', high: 17890.50, low: 17690.30 },
      { symbol: '^GSPC', name: '標普 500 指數', price: 5630.25, change: 38.60, changePercent: 0.69, volume: '24.1 億股', high: 5645.10, low: 5610.80 }
    ],

    stocks: [
      { symbol: '2330', name: '台積電', price: 985.0, change: 15.0, changePercent: 1.55, volume: '32,540 張', high: 990.0, low: 975.0, category: '半導體' },
      { symbol: '2454', name: '聯發科', price: 1250.0, change: 25.0, changePercent: 2.04, volume: '6,820 張', high: 1265.0, low: 1235.0, category: 'IC設計' },
      { symbol: '2317', name: '鴻海', price: 184.5, change: -2.0, changePercent: -1.07, volume: '48,120 張', high: 188.0, low: 183.5, category: '組裝代工' },
      { symbol: '2382', name: '廣達', price: 282.0, change: 6.5, changePercent: 2.36, volume: '19,300 張', high: 285.0, low: 276.0, category: 'AI伺服器' },
      { symbol: '2308', name: '台達電', price: 410.0, change: 8.0, changePercent: 1.99, volume: '8,410 張', high: 415.0, low: 403.0, category: '電源供應' },
      { symbol: '2881', name: '富邦金', price: 88.6, change: 0.8, changePercent: 0.91, volume: '21,500 張', high: 89.2, low: 88.0, category: '金融保險' },
      { symbol: 'NVDA', name: 'NVIDIA (輝達)', price: 128.50, change: 3.85, changePercent: 3.09, volume: '58.4M', high: 130.20, low: 125.60, category: '美股AI' },
      { symbol: 'TSM', name: '台積電 ADR', price: 172.80, change: 3.20, changePercent: 1.89, volume: '12.8M', high: 174.50, low: 170.10, category: '美股ADR' }
    ],

    getIntradayHistory(symbol) {
      const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
      const basePrice = item.price - item.change;
      const labels = [];
      const prices = [];
      
      let current = basePrice;
      for (let h = 9; h <= 13; h++) {
        const maxM = h === 13 ? 30 : 55;
        for (let m = 0; m <= maxM; m += 10) {
          const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          labels.push(timeLabel);
          const progress = labels.length / 28;
          const drift = (item.price - basePrice) * progress;
          const noise = (Math.random() - 0.48) * (basePrice * 0.003);
          current = basePrice + drift + noise;
          prices.push(parseFloat(current.toFixed(2)));
        }
      }
      prices[prices.length - 1] = item.price;

      return {
        name: item.name,
        symbol: item.symbol,
        labels,
        prices,
        basePrice,
        isPositive: item.change >= 0
      };
    },

    tickLivePrices() {
      this.stocks.forEach(stock => {
        const delta = (Math.random() - 0.49) * (stock.price * 0.001);
        stock.price = parseFloat((stock.price + delta).toFixed(2));
        stock.change = parseFloat((stock.change + delta).toFixed(2));
        stock.changePercent = parseFloat(((stock.change / (stock.price - stock.change)) * 100).toFixed(2));
      });
      const twIndex = this.indices[0];
      const indexDelta = (Math.random() - 0.48) * 8;
      twIndex.price = parseFloat((twIndex.price + indexDelta).toFixed(2));
      twIndex.change = parseFloat((twIndex.change + indexDelta).toFixed(2));
      twIndex.changePercent = parseFloat(((twIndex.change / (twIndex.price - twIndex.change)) * 100).toFixed(2));
    }
  };

  const RealEstateService = {
    listings: [
      {
        id: 'RE-101',
        title: '大安森林公園景觀高樓四房（附平面雙車位）',
        city: '台北市',
        district: '大安區',
        address: '信義路三段',
        metroStation: '大安森林公園站 200m',
        totalPrice: 6880,
        unitPrice: 125.8,
        size: 54.7,
        layout: '4房2廳2衛',
        floor: '12F/18F',
        age: 6,
        type: '電梯大樓',
        tags: ['近捷運', '公園景觀', '坡平車位', '24H保全'],
        badge: '最新上架',
        category: 'sale',
        date: '10分鐘前'
      },
      {
        id: 'RE-102',
        title: '板橋新板特區地標豪邸｜精緻裝潢採光極佳',
        city: '新北市',
        district: '板橋區',
        address: '縣民大道二段',
        metroStation: '板橋五鐵共構站 350m',
        totalPrice: 3580,
        unitPrice: 78.5,
        size: 45.6,
        layout: '3房2廳2衛',
        floor: '9F/26F',
        age: 8,
        type: '電梯大樓',
        tags: ['新板特區', '邊間雙面採光', '高檔裝潢', '近高鐵'],
        badge: '降價急售',
        category: 'sale',
        date: '35分鐘前'
      },
      {
        id: 'RE-103',
        title: '信義區莊敬商圈靜巷透天｜土地持分大具都更效益',
        city: '台北市',
        district: '信義區',
        address: '莊敬路',
        metroStation: '台北101/世貿站 550m',
        totalPrice: 4280,
        unitPrice: 89.2,
        size: 48.0,
        layout: '5房3廳3衛',
        floor: '整棟1-3F',
        age: 38,
        type: '透天厝',
        tags: ['土地持分大', '門前停車', '靜巷住家', '世貿商圈'],
        badge: '熱門關注',
        category: 'sale',
        date: '1小時前'
      },
      {
        id: 'RE-104',
        title: '【實價登錄成交】台中七期國家歌劇院首排景觀戶',
        city: '台中市',
        district: '西屯區',
        address: '市政北六路',
        metroStation: '市政府捷運站',
        totalPrice: 5350,
        unitPrice: 62.1,
        size: 86.2,
        layout: '4房2廳3衛',
        floor: '18F/33F',
        age: 4,
        type: '電梯大樓',
        tags: ['實價登錄', '歌劇院首排', '鋼骨制震', '豪宅規格'],
        badge: '最新揭露',
        category: 'transaction',
        date: '本週登錄'
      },
      {
        id: 'RE-105',
        title: '竹北高鐵特區首購首選｜水岸視野景觀三房',
        city: '新竹市',
        district: '竹北市',
        address: '文興路二段',
        metroStation: '新竹高鐵站 600m',
        totalPrice: 2680,
        unitPrice: 68.3,
        size: 39.2,
        layout: '3房2廳2衛',
        floor: '11F/15F',
        age: 5,
        type: '電梯大樓',
        tags: ['高鐵特區', '水岸景觀', '明星學區', '含B1車位'],
        badge: '首購推薦',
        category: 'sale',
        date: '2小時前'
      },
      {
        id: 'RE-106',
        title: '高雄美術館特區綠園道景觀宅｜輕軌步行3分鐘',
        city: '高雄市',
        district: '鼓山區',
        address: '美術東二路',
        metroStation: '內惟藝術中心輕軌站',
        totalPrice: 1980,
        unitPrice: 42.6,
        size: 46.5,
        layout: '3房2廳2衛',
        floor: '7F/22F',
        age: 7,
        type: '電梯大樓',
        tags: ['美術館第一排', '綠園道', '輕軌生活圈', '飯店式管理'],
        badge: '性價比高',
        category: 'sale',
        date: '3小時前'
      },
      {
        id: 'RE-107',
        title: '三重重陽重劃區水岸雙拼華廈｜低公設稀有釋出',
        city: '新北市',
        district: '三重區',
        address: '集賢路',
        metroStation: '徐匯中學站 800m',
        totalPrice: 2180,
        unitPrice: 51.2,
        size: 42.6,
        layout: '3房2廳2衛',
        floor: '5F/7F',
        age: 14,
        type: '華廈',
        tags: ['一橋進台北', '重劃區街廓', '低公設比', '方正格局'],
        badge: '精選推薦',
        category: 'sale',
        date: '4小時前'
      },
      {
        id: 'RE-108',
        title: '【實價登錄成交】桃園藝文特區中悅建設大坪數地標',
        city: '桃園市',
        district: '桃園區',
        address: '中正路',
        metroStation: '綠線G10站預定地',
        totalPrice: 4600,
        unitPrice: 45.3,
        size: 101.5,
        layout: '4房2廳3衛',
        floor: '15F/28F',
        age: 9,
        type: '電梯大樓',
        tags: ['實價登錄', '藝文特區', '中悅名邸', '三車位'],
        badge: '最新揭露',
        category: 'transaction',
        date: '本週登錄'
      }
    ],

    getListings(filters = {}) {
      let result = [...this.listings];
      if (filters.city && filters.city !== 'all') {
        result = result.filter(item => item.city === filters.city);
      }
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        result = result.filter(item => 
          item.title.toLowerCase().includes(kw) || 
          item.district.toLowerCase().includes(kw) ||
          item.tags.some(t => t.toLowerCase().includes(kw))
        );
      }
      if (filters.sortBy) {
        if (filters.sortBy === 'price_asc') result.sort((a, b) => a.totalPrice - b.totalPrice);
        else if (filters.sortBy === 'price_desc') result.sort((a, b) => b.totalPrice - a.totalPrice);
        else if (filters.sortBy === 'unit_price') result.sort((a, b) => b.unitPrice - a.unitPrice);
        else if (filters.sortBy === 'size') result.sort((a, b) => b.size - a.size);
      }
      return result;
    }
  };

  // ==========================================
  // 2. WIDGETS
  // ==========================================

  const WeatherTempWidget = {
    id: 'weather-temp',
    title: '天氣各地氣溫與預報',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 3,
    minHeight: 3,

    render(container, state = { selectedCity: 'taipei' }) {
      const cities = WeatherService.getAllCities();
      const cityData = WeatherService.getCityDetail(state.selectedCity || 'taipei');

      const getIconSvg = (iconName) => {
        switch(iconName) {
          case 'sun': return `<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
          case 'sun-medium': return `<svg class="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
          case 'cloud-rain': return `<svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
          case 'cloud-lightning': return `<svg class="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`;
          default: return `<svg class="w-7 h-7 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
        }
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div class="flex items-center space-x-2.5">
              <span class="p-2 rounded-xl bg-blue-950/70 border border-blue-800/40 text-blue-400">
                ${getIconSvg(cityData.icon)}
              </span>
              <div>
                <div class="flex items-center space-x-2">
                  <select id="weather-city-select" class="font-bold text-base bg-slate-800 border border-slate-700 text-white rounded px-2 py-0.5 focus:outline-none cursor-pointer">
                    ${cities.map(c => `<option value="${c.id}" ${c.id === cityData.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                    AQI ${cityData.aqi} ${cityData.aqiStatus}
                  </span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">${cityData.condition} ‧ 降雨機率 ${cityData.rainProb}</p>
              </div>
            </div>
            
            <div class="text-right">
              <span class="text-3xl font-extrabold tracking-tight text-white">${cityData.temp}°C</span>
              <div class="text-[11px] text-slate-400">最高 ${cityData.high}° ‧ 最低 ${cityData.low}°</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 my-2 text-center">
            <div class="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-[10px] text-slate-400">體感溫度</div>
              <div class="font-bold text-xs mt-0.5 text-slate-200">${cityData.temp + 2}°C</div>
            </div>
            <div class="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-[10px] text-slate-400">相對濕度</div>
              <div class="font-bold text-xs mt-0.5 text-slate-200">${cityData.humidity}%</div>
            </div>
            <div class="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div class="text-[10px] text-slate-400">紫外線指數</div>
              <div class="font-bold text-xs mt-0.5 text-amber-400">${cityData.uv} (中高)</div>
            </div>
          </div>

          <div class="text-[11px] font-medium text-slate-400 mb-1">未來 24 小時氣溫與降雨趨勢</div>
          <div class="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
            ${cityData.hourly.map(h => `
              <div class="flex flex-col items-center flex-shrink-0 p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40 min-w-[50px] text-center">
                <span class="text-[10px] text-slate-400">${h.time}</span>
                <div class="my-0.5 scale-75">${getIconSvg(h.icon)}</div>
                <span class="font-bold text-xs text-white">${h.temp}°</span>
                <span class="text-[9px] text-blue-400 mt-0.5">${h.rainProb}</span>
              </div>
            `).join('')}
          </div>

          <div class="pt-2 border-t border-slate-800/80">
            <div class="grid grid-cols-4 gap-1.5 text-xs">
              ${cities.slice(0, 8).map(c => `
                <div class="p-1 rounded bg-slate-800/70 border border-slate-700/40 flex items-center justify-between cursor-pointer hover:bg-blue-900/40 transition-colors" data-city="${c.id}">
                  <span class="font-medium text-slate-300 text-[11px]">${c.name.slice(0,2)}</span>
                  <span class="font-bold text-slate-100 text-[11px]">${c.temp}°</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      const select = container.querySelector('#weather-city-select');
      if (select) {
        select.addEventListener('change', (e) => {
          WeatherTempWidget.render(container, { selectedCity: e.target.value });
        });
      }

      container.querySelectorAll('[data-city]').forEach(el => {
        el.addEventListener('click', () => {
          const cityId = el.getAttribute('data-city');
          WeatherTempWidget.render(container, { selectedCity: cityId });
        });
      });
    }
  };

  const WeatherRadarWidget = {
    id: 'weather-radar',
    title: '天氣雷達雲圖與雨量觀測',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { activeLayer: 'radar_echo', isPlaying: true }) {
      const layers = WeatherService.getRadarLayers();
      const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none overflow-hidden relative justify-between">
          <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-800">
            <div class="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-lg">
              ${layers.map(l => `
                <button class="px-2.5 py-1 text-xs font-medium rounded-md transition-all ${l.id === currentLayer.id ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}" data-layer="${l.id}">
                  ${l.name.split(' ')[0]}
                </button>
              `).join('')}
            </div>
            
            <div class="flex items-center space-x-2 text-xs">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
                即時連線 (CWA)
              </span>
            </div>
          </div>

          <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[140px]">
            <canvas id="radar-canvas" class="w-full h-full object-cover"></canvas>
            
            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="w-64 h-64 border border-emerald-500/20 rounded-full"></div>
              <div class="w-44 h-44 border border-emerald-500/25 rounded-full"></div>
              <div class="w-20 h-20 border border-emerald-500/30 rounded-full"></div>
              <div class="absolute w-full h-[1px] bg-emerald-500/20"></div>
              <div class="absolute h-full w-[1px] bg-emerald-500/20"></div>
            </div>

            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div class="text-center font-bold text-emerald-400/80 text-xs translate-x-2 -translate-y-4">
                [ 台灣海峽與本島防護區 ]
                <div class="text-[10px] text-slate-400 font-normal mt-0.5">北部 28°C ‧ 中部 29°C ‧ 南部 31°C</div>
              </div>
            </div>

            <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none">
              <span class="text-slate-400">回波強度:</span>
              <div class="flex h-2 w-20 rounded overflow-hidden">
                <span class="flex-1 bg-cyan-400"></span>
                <span class="flex-1 bg-blue-500"></span>
                <span class="flex-1 bg-green-500"></span>
                <span class="flex-1 bg-yellow-400"></span>
                <span class="flex-1 bg-orange-500"></span>
                <span class="flex-1 bg-red-600"></span>
              </div>
              <span class="text-slate-300 font-mono text-[9px]">dBZ</span>
            </div>

            <div class="absolute top-2 right-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
              🕒 22:00 (即時雷達)
            </div>
          </div>

          <div class="flex items-center justify-between pt-1 text-xs">
            <div class="flex items-center space-x-2">
              <button id="radar-play-toggle" class="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] transition-colors">
                <span id="play-icon-label">${state.isPlaying ? '⏸ 暫停' : '▶ 播放'}</span>
              </button>
              <span class="text-slate-400 text-[10px]">動態雲圖循環播放 (60fps)</span>
            </div>

            <div class="flex items-center space-x-1.5 text-slate-400">
              <span class="text-[10px]">自動更新中</span>
            </div>
          </div>
        </div>
      `;

      const canvas = container.querySelector('#radar-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        let angle = 0;

        const echoes = [
          { x: 0.62, y: 0.35, r: 40, color: 'rgba(34, 197, 94, 0.65)' },
          { x: 0.65, y: 0.38, r: 25, color: 'rgba(234, 179, 8, 0.75)' },
          { x: 0.68, y: 0.40, r: 14, color: 'rgba(239, 68, 68, 0.85)' },
          { x: 0.55, y: 0.72, r: 35, color: 'rgba(59, 130, 246, 0.6)' },
          { x: 0.48, y: 0.65, r: 28, color: 'rgba(34, 197, 94, 0.5)' }
        ];

        const resizeCanvas = () => {
          if (!canvas.parentElement) return;
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
        };
        resizeCanvas();

        const draw = () => {
          if (!canvas || !canvas.parentElement) return;
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
          }
          for (let y = 0; y < h; y += 40) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
          }

          ctx.save();
          ctx.translate(w * 0.5, h * 0.5);
          ctx.fillStyle = 'rgba(51, 65, 85, 0.4)';
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, w * 0.12, h * 0.32, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          const pulse = Math.sin(Date.now() * 0.003) * 3;
          echoes.forEach(e => {
            ctx.save();
            const grad = ctx.createRadialGradient(w * e.x, h * e.y, 2, w * e.x, h * e.y, e.r + pulse);
            grad.addColorStop(0, e.color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(w * e.x, h * e.y, e.r + pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          if (state.isPlaying) {
            angle += 0.025;
            ctx.save();
            ctx.translate(w * 0.5, h * 0.5);
            ctx.rotate(angle);
            
            const sweepGrad = ctx.createLinearGradient(0, 0, w * 0.5, 0);
            sweepGrad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
            sweepGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
            ctx.fillStyle = sweepGrad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, Math.max(w, h), 0, Math.PI / 4);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(w * 0.6, 0);
            ctx.stroke();
            ctx.restore();
          }

          requestAnimationFrame(draw);
        };

        draw();
        window.addEventListener('resize', resizeCanvas);
      }

      container.querySelectorAll('[data-layer]').forEach(btn => {
        btn.addEventListener('click', () => {
          WeatherRadarWidget.render(container, { ...state, activeLayer: btn.getAttribute('data-layer') });
        });
      });

      const playBtn = container.querySelector('#radar-play-toggle');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          state.isPlaying = !state.isPlaying;
          const label = container.querySelector('#play-icon-label');
          if (label) label.textContent = state.isPlaying ? '⏸ 暫停' : '▶ 播放';
        });
      }
    }
  };

  const TyphoonWidget = {
    id: 'typhoon-tracker',
    title: '颱風動態與路徑資訊',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container) {
      const typhoon = WeatherService.getTyphoonInfo();

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div class="flex items-center space-x-2">
              <div class="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <svg class="w-5 h-5 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-bold text-base text-white">${typhoon.nameZh}</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    ${typhoon.intensity}
                  </span>
                </div>
                <p class="text-xs text-slate-400 font-mono">${typhoon.number}</p>
              </div>
            </div>

            <div class="text-right">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                ⚠️ ${typhoon.status}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 my-2">
            <div class="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-[10px] text-slate-400">目前中心位置</span>
              <div class="font-semibold text-xs text-cyan-300 mt-0.5 truncate">${typhoon.centerLocation}</div>
            </div>
            <div class="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <span class="text-[10px] text-slate-400">進行方向與速度</span>
              <div class="font-semibold text-xs text-emerald-300 mt-0.5">${typhoon.movementSpeed}</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center mb-2">
            <div class="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <div class="text-[9px] text-slate-400">中心氣壓</div>
              <div class="font-bold text-xs text-white mt-0.5">${typhoon.centralPressure}</div>
            </div>
            <div class="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <div class="text-[9px] text-slate-400">最大風速</div>
              <div class="font-bold text-xs text-amber-400 mt-0.5">${typhoon.maxWindSpeed.split('(')[0]}</div>
            </div>
            <div class="p-1.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
              <div class="text-[9px] text-slate-400">7級風半徑</div>
              <div class="font-bold text-xs text-cyan-400 mt-0.5">${typhoon.radius7.split('(')[0]}</div>
            </div>
          </div>

          <div class="bg-slate-950/80 rounded-xl p-2 border border-slate-800 flex flex-col justify-between">
            <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>預測路徑時間軸</span>
              <span class="text-amber-400">警戒海域：${typhoon.alertAreas.join('、')}</span>
            </div>

            <div class="flex items-center justify-between px-1 py-1 overflow-x-auto scrollbar-thin">
              ${typhoon.pathPoints.map((pt) => `
                <div class="flex flex-col items-center flex-shrink-0 min-w-[52px]">
                  <span class="text-[9px] text-slate-400 mb-0.5">${pt.time}</span>
                  <div class="w-3.5 h-3.5 rounded-full flex items-center justify-center ${pt.current ? 'bg-rose-500 text-white ring-2 ring-rose-500/30' : pt.past ? 'bg-slate-600' : 'bg-amber-500'}"></div>
                  <span class="text-[9px] font-medium mt-0.5 ${pt.current ? 'text-rose-400 font-bold' : pt.forecast ? 'text-amber-300' : 'text-slate-500'}">
                    ${pt.status.split(' ')[0]}
                  </span>
                </div>
              `).join('<div class="h-0.5 w-4 bg-slate-700 flex-shrink-0 -mt-2"></div>')}
            </div>

            <div class="text-[10px] text-rose-300 bg-rose-950/40 border border-rose-800/40 rounded p-1 mt-1.5 flex items-start space-x-1">
              <span>📢</span>
              <span class="leading-tight">${typhoon.impactNotice}</span>
            </div>
          </div>
        </div>
      `;
    }
  };

  const StockMarketWidget = {
    id: 'stock-market',
    title: '股市即時行情與大盤走勢',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { selectedSymbol: '^TWII', tab: 'indices' }) {
      const list = state.tab === 'indices' ? StockService.indices : StockService.stocks;
      const currentItem = [...StockService.indices, ...StockService.stocks].find(s => s.symbol === state.selectedSymbol) || StockService.indices[0];
      const history = StockService.getIntradayHistory(currentItem.symbol);

      const isUp = currentItem.change >= 0;
      const badgeClass = isUp ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      const sign = isUp ? '+' : '';

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg">
              <button id="stock-tab-indices" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'indices' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                主要指數
              </button>
              <button id="stock-tab-stocks" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'stocks' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                熱門個股
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
                即時撮合
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between my-2">
            <div>
              <div class="flex items-center space-x-2">
                <h2 class="text-lg font-extrabold text-white">${currentItem.name}</h2>
                <span class="text-xs px-1.5 py-0.5 font-mono rounded bg-slate-800 text-slate-300">${currentItem.symbol}</span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">成交量：${currentItem.volume} ‧ 最高：${currentItem.high}</p>
            </div>

            <div class="text-right">
              <div class="text-2xl font-black font-mono tracking-tight ${isUp ? 'text-red-400' : 'text-emerald-400'}">
                ${currentItem.price.toLocaleString()}
              </div>
              <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${badgeClass} mt-0.5">
                ${sign}${currentItem.change} (${sign}${currentItem.changePercent}%)
              </div>
            </div>
          </div>

          <div class="relative flex-1 min-h-[90px] bg-slate-950/70 rounded-xl p-2 border border-slate-800/80 mb-2">
            <canvas id="stock-chart-canvas" class="w-full h-full"></canvas>
            <div class="absolute top-1.5 left-2.5 text-[9px] text-slate-500 font-mono pointer-events-none">
              分時走勢 ‧ 平盤: ${history.basePrice.toLocaleString()}
            </div>
          </div>

          <div class="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-thin">
            ${list.map(item => {
              const itemUp = item.change >= 0;
              const textCol = itemUp ? 'text-red-400' : 'text-emerald-400';
              const isSelected = item.symbol === currentItem.symbol;
              return `
                <div class="flex-shrink-0 p-1.5 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-950/60 border-blue-500/80' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'}" data-stock-symbol="${item.symbol}">
                  <div class="flex items-center justify-between text-[11px] font-semibold space-x-2">
                    <span class="text-slate-200">${item.name}</span>
                    <span class="${textCol} font-mono">${item.price.toLocaleString()}</span>
                  </div>
                  <div class="text-[9px] ${textCol} font-mono text-right">
                    ${itemUp ? '+' : ''}${item.changePercent}%
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const canvas = container.querySelector('#stock-chart-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const resize = () => {
          if (!canvas.parentElement) return;
          canvas.width = canvas.parentElement.clientWidth;
          canvas.height = canvas.parentElement.clientHeight;
          drawChart();
        };

        const drawChart = () => {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          const prices = history.prices;
          const min = Math.min(...prices, history.basePrice * 0.995);
          const max = Math.max(...prices, history.basePrice * 1.005);
          const range = max - min || 1;

          const baseY = h - ((history.basePrice - min) / range) * (h - 20) - 10;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
          ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(w, baseY); ctx.stroke();
          ctx.setLineDash([]);

          const grad = ctx.createLinearGradient(0, 0, 0, h);
          grad.addColorStop(0, isUp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          prices.forEach((p, idx) => {
            const x = (idx / (prices.length - 1)) * w;
            const y = h - ((p - min) / range) * (h - 20) - 10;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          prices.forEach((p, idx) => {
            const x = (idx / (prices.length - 1)) * w;
            const y = h - ((p - min) / range) * (h - 20) - 10;
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = isUp ? '#f87171' : '#34d399';
          ctx.lineWidth = 2;
          ctx.stroke();
        };

        setTimeout(resize, 30);
        window.addEventListener('resize', resize);
      }

      const btnIndices = container.querySelector('#stock-tab-indices');
      const btnStocks = container.querySelector('#stock-tab-stocks');

      if (btnIndices) {
        btnIndices.addEventListener('click', () => {
          StockMarketWidget.render(container, { ...state, tab: 'indices', selectedSymbol: StockService.indices[0].symbol });
        });
      }
      if (btnStocks) {
        btnStocks.addEventListener('click', () => {
          StockMarketWidget.render(container, { ...state, tab: 'stocks', selectedSymbol: StockService.stocks[0].symbol });
        });
      }

      container.querySelectorAll('[data-stock-symbol]').forEach(el => {
        el.addEventListener('click', () => {
          const symbol = el.getAttribute('data-stock-symbol');
          StockMarketWidget.render(container, { ...state, selectedSymbol: symbol });
        });
      });
    }
  };

  const RealEstateWidget = {
    id: 'real-estate',
    title: '最新房屋買賣與實價登錄',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { city: 'all', keyword: '', sortBy: 'date' }) {
      const listings = RealEstateService.getListings(state);

      const getBadgeStyle = (badge) => {
        switch(badge) {
          case '最新上架': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
          case '降價急售': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
          case '最新揭露': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
          default: return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
        }
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div class="flex items-center space-x-1 overflow-x-auto pb-1 max-w-full scrollbar-thin">
              <button class="px-2 py-0.5 text-xs font-semibold rounded-md transition-all ${state.city === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}" data-city-filter="all">
                全部
              </button>
              ${['台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市'].map(c => `
                <button class="px-2 py-0.5 text-xs font-medium rounded-md transition-all flex-shrink-0 ${state.city === c ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'}" data-city-filter="${c}">
                  ${c}
                </button>
              `).join('')}
            </div>

            <div class="flex items-center space-x-1.5">
              <input type="text" id="re-keyword-input" placeholder="搜尋路段、捷運..." value="${state.keyword || ''}" class="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-blue-500 w-28">
              <select id="re-sort-select" class="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-slate-300 focus:outline-none">
                <option value="date" ${state.sortBy === 'date' ? 'selected' : ''}>最新發布</option>
                <option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>總價低至高</option>
                <option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>總價高至低</option>
                <option value="unit_price" ${state.sortBy === 'unit_price' ? 'selected' : ''}>單價最高</option>
              </select>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2 my-2 pr-1 scrollbar-thin">
            ${listings.map(item => `
              <div class="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/60 hover:bg-slate-800 transition-all cursor-pointer">
                <div class="flex items-start justify-between">
                  <div class="flex-1 pr-2">
                    <div class="flex items-center space-x-1.5 mb-1">
                      <span class="text-[9px] px-1.5 py-0.5 rounded border ${getBadgeStyle(item.badge)} font-medium">
                        ${item.badge}
                      </span>
                      <span class="text-xs font-bold text-slate-200 line-clamp-1">
                        ${item.title}
                      </span>
                    </div>
                    <div class="text-[11px] text-slate-400 flex items-center space-x-1.5">
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
                    <div class="text-[10px] text-slate-400 font-mono">
                      ${item.unitPrice} 萬/坪
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-700/40 text-[10px]">
                  <span class="text-cyan-400">🚇 ${item.metroStation}</span>
                  <span class="text-slate-500">${item.date}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800">
            <span>共顯示 ${listings.length} 筆房產資訊</span>
            <span class="text-blue-400">即時通報連線中</span>
          </div>
        </div>
      `;

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

  const QuickNotesWidget = {
    id: 'quick-notes',
    title: '佈告欄便簽與備忘錄',
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
          { id: 'n-1', text: '📌 自由佈局提示：\n點擊右上角「✏️ 自由佈局」開啟編輯模式，按住卡片頂部把手即可拖曳移動位置，拉動卡片邊緣或右下角可縮放寬高！', color: 'yellow', date: '重要提醒' },
          { id: 'n-2', text: '🔔 今日待辦：\n1. 追蹤海神颱風路徑\n2. 觀察台股大盤走勢\n3. 預約賞屋行程', color: 'blue', date: '今日待辦' }
        ];
      }

      const saveNotes = () => {
        localStorage.setItem('bulletin_notes', JSON.stringify(notes));
        QuickNotesWidget.render(container);
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div class="flex items-center space-x-2">
              <span class="p-1 rounded-lg bg-amber-500/20 text-amber-400">📝</span>
              <h3 class="font-bold text-sm text-white">自訂便簽與公告</h3>
            </div>
            <button id="add-note-btn" class="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
              + 新增便簽
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2 my-2 pr-1 scrollbar-thin">
            ${notes.map(note => {
              const bgMap = {
                yellow: 'bg-amber-950/40 border-amber-500/40 text-amber-200',
                blue: 'bg-blue-950/40 border-blue-500/40 text-blue-200',
                green: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              };
              return `
                <div class="p-2.5 rounded-xl border ${bgMap[note.color] || bgMap.yellow} flex flex-col justify-between">
                  <textarea class="w-full bg-transparent border-0 focus:outline-none text-xs leading-relaxed resize-none text-slate-100 font-sans" rows="3" data-note-id="${note.id}">${note.text}</textarea>
                  <div class="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-700/40 text-[10px]">
                    <span class="text-slate-400">${note.date}</span>
                    <button class="text-rose-400 hover:text-rose-300" data-del-note="${note.id}">
                      🗑️ 刪除
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const addBtn = container.querySelector('#add-note-btn');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          notes.unshift({
            id: 'n-' + Date.now(),
            text: '新便簽筆記...',
            color: ['yellow', 'blue', 'green'][notes.length % 3],
            date: new Date().toLocaleDateString('zh-TW')
          });
          saveNotes();
        });
      }

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

      container.querySelectorAll('[data-del-note]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-del-note');
          notes = notes.filter(n => n.id !== id);
          saveNotes();
        });
      });
    }
  };

  const ClockCalendarWidget = {
    id: 'clock-calendar',
    title: '實時時鐘與日曆',
    defaultWidth: 4,
    defaultHeight: 3,
    minWidth: 3,
    minHeight: 2,

    render(container) {
      const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const dateStr = now.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
        
        const timeDisplay = container.querySelector('#clock-time-display');
        const secDisplay = container.querySelector('#clock-sec-display');
        const dateDisplay = container.querySelector('#clock-date-display');
        
        if (timeDisplay) timeDisplay.textContent = `${hours}:${minutes}`;
        if (secDisplay) secDisplay.textContent = `:${seconds}`;
        if (dateDisplay) dateDisplay.textContent = dateStr;
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <span class="text-xs font-semibold text-slate-400">🕒 台灣標準時間 (UTC+8)</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">農曆 七月十九</span>
          </div>

          <div class="my-auto py-2 text-center">
            <div class="flex items-baseline justify-center">
              <span id="clock-time-display" class="text-4xl font-black font-mono tracking-wider text-white">--:--</span>
              <span id="clock-sec-display" class="text-xl font-mono font-bold text-blue-400 ml-1">--</span>
            </div>
            <div id="clock-date-display" class="text-xs font-medium text-slate-300 mt-2">載入中...</div>
          </div>

          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>節氣：處暑</span>
            <span class="text-emerald-400">系統即時同步</span>
          </div>
        </div>
      `;

      updateTime();
      setInterval(updateTime, 1000);
    }
  };

  // ==========================================
  // 3. GRID MANAGER (GridStack Integration)
  // ==========================================

  const GridManager = {
    grid: null,
    isEditMode: false,
    STORAGE_KEY: 'bulletin_board_layout_v1',

    widgetRegistry: {
      'weather-temp': WeatherTempWidget,
      'weather-radar': WeatherRadarWidget,
      'typhoon-tracker': TyphoonWidget,
      'stock-market': StockMarketWidget,
      'real-estate': RealEstateWidget,
      'quick-notes': QuickNotesWidget,
      'clock-calendar': ClockCalendarWidget
    },

    defaultLayout: [
      { id: 'weather-temp', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
      { id: 'weather-radar', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
      { id: 'typhoon-tracker', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
      { id: 'stock-market', x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
      { id: 'real-estate', x: 0, y: 8, w: 8, h: 4, minW: 4, minH: 3 },
      { id: 'quick-notes', x: 8, y: 8, w: 4, h: 4, minW: 3, minH: 2 }
    ],

    presetLayouts: {
      overview: [
        { id: 'weather-temp', x: 0, y: 0, w: 6, h: 4 },
        { id: 'weather-radar', x: 6, y: 0, w: 6, h: 4 },
        { id: 'typhoon-tracker', x: 0, y: 4, w: 6, h: 4 },
        { id: 'stock-market', x: 6, y: 4, w: 6, h: 4 },
        { id: 'real-estate', x: 0, y: 8, w: 8, h: 4 },
        { id: 'quick-notes', x: 8, y: 8, w: 4, h: 4 }
      ],
      weather_focus: [
        { id: 'weather-radar', x: 0, y: 0, w: 8, h: 5 },
        { id: 'typhoon-tracker', x: 8, y: 0, w: 4, h: 5 },
        { id: 'weather-temp', x: 0, y: 5, w: 12, h: 4 }
      ],
      finance_focus: [
        { id: 'stock-market', x: 0, y: 0, w: 7, h: 5 },
        { id: 'real-estate', x: 7, y: 0, w: 5, h: 5 },
        { id: 'quick-notes', x: 0, y: 5, w: 4, h: 4 },
        { id: 'weather-temp', x: 4, y: 5, w: 8, h: 4 }
      ]
    },

    init() {
      this.grid = GridStack.init({
        column: 12,
        cellHeight: 105,
        animate: true,
        margin: 12,
        staticGrid: true, // starts locked
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

      itemsToLoad.forEach(item => {
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
        <div class="grid-stack-item-content bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden relative group">
          <div class="widget-drag-handle flex items-center justify-between px-3 py-1.5 bg-slate-800/90 border-b border-slate-700/60 select-none z-20 cursor-grab">
            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-300 font-bold tracking-wider">⠿ ${widgetDef.title}</span>
            </div>
            <div class="widget-edit-controls flex items-center space-x-1.5">
              <button class="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors" data-remove-widget title="移除此區塊">
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
      a.download = `bulletin_layout_${new Date().toISOString().slice(0,10)}.json`;
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

  // ==========================================
  // 4. APP BOOTSTRAP
  // ==========================================

  const App = {
    init() {
      console.log('🚀 初始化佈告欄應用程式...');
      GridManager.init();
      this.bindHeaderControls();
      this.startLiveEngines();
    },

    bindHeaderControls() {
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
            if (editIndicator) {
              editIndicator.classList.remove('hidden');
              editIndicator.classList.add('flex');
            }
            GridManager.showToast('已開啟自由佈局模式：按住卡片頂部把手拖曳，拉動右下角縮放');
          } else {
            editToggleBtn.classList.remove('bg-blue-600', 'text-white', 'ring-2', 'ring-blue-400');
            editToggleBtn.classList.add('bg-slate-800', 'text-slate-200');
            editToggleBtn.innerHTML = `<span>✏️ 自由佈局</span>`;
            if (editIndicator) {
              editIndicator.classList.add('hidden');
              editIndicator.classList.remove('flex');
            }
            GridManager.showToast('已鎖定並儲存當前佈局');
          }
        });
      }

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

      document.querySelectorAll('[data-add-widget-type]').forEach(btn => {
        btn.addEventListener('click', () => {
          const widgetType = btn.getAttribute('data-add-widget-type');
          GridManager.addWidget(widgetType);
          GridManager.saveLayout();
          if (addWidgetModal) addWidgetModal.classList.add('hidden');
          GridManager.showToast(`已新增小工具：${GridManager.widgetRegistry[widgetType]?.title || widgetType}`);
        });
      });

      const presetSelect = document.getElementById('preset-select');
      if (presetSelect) {
        presetSelect.addEventListener('change', (e) => {
          if (e.target.value) {
            GridManager.applyPreset(e.target.value);
          }
        });
      }

      const resetBtn = document.getElementById('reset-layout-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('確定要將所有區塊恢復為預設綜合佈局嗎？')) {
            GridManager.resetLayout();
          }
        });
      }

      const exportBtn = document.getElementById('export-layout-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          GridManager.exportLayout();
        });
      }

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

  window.BulletinBoardApp = App;
  window.GridManager = GridManager;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();
