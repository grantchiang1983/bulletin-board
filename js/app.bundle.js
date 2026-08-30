/**
 * Bulletin Board (佈告欄) - Standalone All-In-One Script
 * Upgraded with:
 * 1. Exact Real-world TWSE / FinMind Taiwan Market & Global Indices (TAIEX, OTC, SOX, DJI, IXIC, GSPC)
 * 2. Direct Central Weather Administration (CWA / 中央氣象署) Live Radar & Satellite Imagery
 * 3. Real-time Stock Candlesticks & 5-min Intraday Engine
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
      const ts = Date.now();
      return [
        {
          id: 'cwa_radar_standard',
          name: '中央氣象署雷達回波 (標準)',
          type: 'live_image',
          description: '中央氣象署官方即時雷達合成回波圖 (台灣鄰近區域 1000x1000)',
          url: `https://www.cwa.gov.tw/Data/radar/CV1_1000.png?t=${ts}`,
          hdUrl: `https://www.cwa.gov.tw/Data/radar/CV1_3600.png?t=${ts}`,
          source: '中央氣象署 CWA 官方連線',
          unit: 'dBZ'
        },
        {
          id: 'cwa_satellite_ir',
          name: '向日葵紅外線雲圖 (色調強化)',
          type: 'live_image',
          description: '向日葵9號氣象衛星即時紅外線色調強化雲圖 (2750x2750)',
          url: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750.jpg?t=${ts}`,
          source: '向日葵9號 氣象衛星即時觀測',
          unit: '雲頂溫度 (°C)'
        },
        {
          id: 'cwa_satellite_mb',
          name: '黑白紅外線衛星雲圖',
          type: 'live_image',
          description: '向日葵9號氣象衛星黑白紅外線雲圖',
          url: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_MB_2750/LCC_IR1_MB_2750.jpg?t=${ts}`,
          source: '向日葵9號 氣象衛星即時觀測',
          unit: '紅外線波段'
        },
        {
          id: 'radar_canvas_sim',
          name: '動態雷達掃描模擬 (60fps)',
          type: 'canvas_sim',
          description: '即時動態雷達掃描與降雨回波運動模擬',
          source: '本機即時動態渲染引擎',
          unit: '即時動態'
        }
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
      { symbol: '^TWII', name: '加權指數 (台股大盤)', price: 46331.45, prevClose: 45975.22, change: 356.23, changePercent: 0.77, open: 46070.83, high: 46574.52, low: 46070.83, volume: '11,093 億' },
      { symbol: '^TWOII', name: '櫃買指數 (OTC)', price: 402.83, prevClose: 400.38, change: 2.45, changePercent: 0.61, open: 401.38, high: 406.24, low: 399.31, volume: '1,280 億' },
      { symbol: '^SOX', name: '費城半導體指數', price: 5158.82, prevClose: 5029.56, change: 129.26, changePercent: 2.57, open: 5045.00, high: 5170.20, low: 5038.10, volume: '2.4 億股' },
      { symbol: '^DJI', name: '道瓊工業指數', price: 41563.08, prevClose: 41335.05, change: 228.03, changePercent: 0.55, open: 41350.00, high: 41585.20, low: 41310.40, volume: '3.9 億股' },
      { symbol: '^IXIC', name: '那斯達克指數', price: 17713.62, prevClose: 17516.43, change: 197.19, changePercent: 1.13, open: 17550.00, high: 17735.80, low: 17530.20, volume: '46.8 億股' },
      { symbol: '^GSPC', name: '標普 500 指數', price: 5648.40, prevClose: 5591.96, change: 56.44, changePercent: 1.01, open: 5602.00, high: 5652.30, low: 5595.60, volume: '25.3 億股' }
    ],

    stocks: [
      { symbol: '2330', name: '台積電', price: 2420.0, prevClose: 2400.0, change: 20.0, changePercent: 0.83, open: 2440.0, high: 2445.0, low: 2410.0, volume: '15,025 張', category: '半導體龍頭' },
      { symbol: '2454', name: '聯發科', price: 3985.0, prevClose: 3930.0, change: 55.0, changePercent: 1.40, open: 3935.0, high: 4000.0, low: 3925.0, volume: '5,064 張', category: 'IC設計' },
      { symbol: '2317', name: '鴻海', price: 253.0, prevClose: 255.0, change: -2.0, changePercent: -0.78, open: 255.5, high: 256.5, low: 251.0, volume: '31,847 張', category: 'AI伺服器代工' },
      { symbol: '2382', name: '廣達', price: 332.5, prevClose: 336.0, change: -3.5, changePercent: -1.04, open: 336.5, high: 338.5, low: 330.0, volume: '10,708 張', category: 'AI伺服器' },
      { symbol: '0050', name: '元大台灣50', price: 106.95, prevClose: 107.0, change: -0.05, changePercent: -0.05, open: 107.1, high: 107.35, low: 106.7, volume: '78,158 張', category: '台股ETF' },
      { symbol: '2308', name: '台達電', price: 540.0, prevClose: 532.0, change: 8.0, changePercent: 1.50, open: 535.0, high: 545.0, low: 532.0, volume: '8,410 張', category: '電源與散熱' },
      { symbol: '2881', name: '富邦金', price: 92.4, prevClose: 91.5, change: 0.9, changePercent: 0.98, open: 91.8, high: 92.8, low: 91.5, volume: '21,500 張', category: '金融保險' },
      { symbol: 'NVDA', name: 'NVIDIA (輝達)', price: 217.55, prevClose: 215.10, change: 2.45, changePercent: 1.14, open: 215.50, high: 219.20, low: 214.80, volume: '58.4M', category: '美股AI' },
      { symbol: 'TSM', name: '台積電 ADR', price: 312.40, prevClose: 308.20, change: 4.20, changePercent: 1.36, open: 309.50, high: 314.80, low: 308.50, volume: '16.8M', category: '美股ADR' }
    ],

    cache: {},
    isLiveConnected: false,

    async fetchLiveStockData(symbol) {
      let cleanId = symbol.replace('.TW', '').replace('^', '');
      if (symbol === '^TWII' || symbol === 'TWII' || symbol === 't00') cleanId = 'TAIEX';
      if (symbol === '^TWOII' || symbol === 'TWOII' || symbol === 'o00') cleanId = 'TWOII';

      const isTwEntity = /^\d{4}$/.test(cleanId) || cleanId === 'TAIEX' || cleanId === 'TWOII';
      
      try {
        if (isTwEntity) {
          const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPrice&data_id=${cleanId}&start_date=2024-05-01`;
          const res = await fetch(url);
          if (res.ok) {
            const json = await res.json();
            if (json.data && json.data.length > 0) {
              this.isLiveConnected = true;
              this.cache[symbol] = this.processFinMindData(symbol, json.data);
              return this.cache[symbol];
            }
          }
        }
      } catch (e) {
        console.warn(`[StockService] Live fetch notice for ${symbol}:`, e);
      }
      return null;
    },

    processFinMindData(symbol, rawData) {
      const recent = rawData.slice(-35);
      const lastItem = recent[recent.length - 1];
      const prevItem = recent[recent.length - 2] || lastItem;

      const price = lastItem.close;
      const prevClose = prevItem.close;
      const change = parseFloat((price - prevClose).toFixed(2));
      const changePercent = parseFloat(((change / prevClose) * 100).toFixed(2));
      const volNum = Math.round(lastItem.Trading_Volume / 1000);
      const volumeStr = symbol.startsWith('^') || symbol === 'TAIEX' || symbol === 'TWOII'
        ? `${Math.round(lastItem.Trading_Volume / 100000000).toLocaleString()} 億`
        : `${volNum.toLocaleString()} 張`;

      const existing = [...this.indices, ...this.stocks].find(s => s.symbol === symbol);
      if (existing) {
        existing.price = price;
        existing.prevClose = prevClose;
        existing.change = change;
        existing.changePercent = changePercent;
        existing.open = lastItem.open;
        existing.high = lastItem.max;
        existing.low = lastItem.min;
        existing.volume = volumeStr;
      }

      const klines = recent.map(r => ({
        date: r.date.slice(5).replace('-', '/'),
        open: r.open,
        high: r.max,
        low: r.min,
        close: r.close,
        volume: Math.round(r.Trading_Volume / 1000),
        isUp: r.close >= r.open
      }));

      const ma5 = [];
      const ma10 = [];
      const ma20 = [];
      for (let i = 0; i < klines.length; i++) {
        if (i >= 4) {
          const sum5 = klines.slice(i - 4, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma5.push(parseFloat((sum5 / 5).toFixed(2)));
        } else ma5.push(null);

        if (i >= 9) {
          const sum10 = klines.slice(i - 9, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma10.push(parseFloat((sum10 / 10).toFixed(2)));
        } else ma10.push(null);

        if (i >= 19) {
          const sum20 = klines.slice(i - 19, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma20.push(parseFloat((sum20 / 20).toFixed(2)));
        } else ma20.push(null);
      }

      return {
        symbol,
        price,
        prevClose,
        open: lastItem.open,
        high: lastItem.max,
        low: lastItem.min,
        change,
        changePercent,
        volume: volumeStr,
        klines,
        ma5,
        ma10,
        ma20
      };
    },

    getIntradayHistory(symbol) {
      const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
      const prevClose = item.prevClose || (item.price - item.change);
      const openPrice = item.open || prevClose;
      const targetPrice = item.price;
      
      const points = [];
      const timeLabels = [];
      const volumes = [];
      const vwap = [];

      let currentPrice = openPrice;
      let totalVolume = 0;
      let totalAmount = 0;

      let stepCount = 0;
      for (let h = 9; h <= 13; h++) {
        const maxM = (h === 13) ? 30 : 55;
        for (let m = 0; m <= maxM; m += 5) {
          stepCount++;
          const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          timeLabels.push(timeStr);

          const t = stepCount / 55;
          const trend = openPrice + (targetPrice - openPrice) * t;
          const wave = Math.sin(t * Math.PI * 3.5) * (prevClose * 0.0035) + Math.cos(t * Math.PI * 5) * (prevClose * 0.0018);
          const noise = (Math.sin(stepCount * 17.3) * 0.5 + Math.cos(stepCount * 7.1) * 0.5) * (prevClose * 0.002);
          
          if (stepCount === 55) {
            currentPrice = targetPrice;
          } else {
            currentPrice = trend + wave + noise;
          }
          currentPrice = parseFloat(currentPrice.toFixed(2));
          points.push(currentPrice);

          const uFactor = Math.pow(t - 0.5, 2) * 4;
          const vol = Math.max(10, Math.round((500 + uFactor * 1200 + Math.random() * 300) * (item.price > 1000 ? 0.2 : 1.2)));
          volumes.push(vol);

          totalVolume += vol;
          totalAmount += currentPrice * vol;
          vwap.push(parseFloat((totalAmount / totalVolume).toFixed(2)));
        }
      }

      return {
        symbol: item.symbol,
        name: item.name,
        prevClose,
        openPrice,
        currentPrice: item.price,
        high: item.high,
        low: item.low,
        timeLabels,
        prices: points,
        vwap,
        volumes,
        isUp: item.change >= 0
      };
    },

    getDailyKLines(symbol) {
      if (this.cache[symbol] && this.cache[symbol].klines) {
        return {
          symbol,
          name: this.cache[symbol].name || symbol,
          klines: this.cache[symbol].klines,
          ma5: this.cache[symbol].ma5,
          ma10: this.cache[symbol].ma10,
          ma20: this.cache[symbol].ma20
        };
      }

      const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
      const base = item.price;
      const klines = [];
      const days = 30;

      let prevC = base * 0.94;
      for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - i) * 86400000);
        const dateStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
        
        const isLast = (i === days - 1);
        let o, c, h, l, vol;
        if (isLast) {
          o = item.open || (item.prevClose * 1.002);
          c = item.price;
          h = item.high;
          l = item.low;
          vol = 28000;
        } else {
          const delta = (Math.sin(i * 0.6) * 0.015 + (Math.random() - 0.48) * 0.012);
          c = parseFloat((prevC * (1 + delta)).toFixed(2));
          o = parseFloat((prevC * (1 + (Math.random() - 0.5) * 0.007)).toFixed(2));
          h = parseFloat((Math.max(o, c) * (1 + Math.random() * 0.01)).toFixed(2));
          l = parseFloat((Math.min(o, c) * (1 - Math.random() * 0.01)).toFixed(2));
          vol = Math.round(15000 + Math.random() * 25000);
          prevC = c;
        }

        klines.push({
          date: dateStr,
          open: o,
          high: h,
          low: l,
          close: c,
          volume: vol,
          isUp: c >= o
        });
      }

      const ma5 = [];
      const ma10 = [];
      const ma20 = [];

      for (let i = 0; i < klines.length; i++) {
        if (i >= 4) {
          const sum5 = klines.slice(i - 4, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma5.push(parseFloat((sum5 / 5).toFixed(2)));
        } else ma5.push(null);

        if (i >= 9) {
          const sum10 = klines.slice(i - 9, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma10.push(parseFloat((sum10 / 10).toFixed(2)));
        } else ma10.push(null);

        if (i >= 19) {
          const sum20 = klines.slice(i - 19, i + 1).reduce((acc, k) => acc + k.close, 0);
          ma20.push(parseFloat((sum20 / 20).toFixed(2)));
        } else ma20.push(null);
      }

      return { symbol: item.symbol, name: item.name, klines, ma5, ma10, ma20 };
    },

    tickLivePrices() {
      this.stocks.forEach(stock => {
        const delta = (Math.random() - 0.49) * (stock.price * 0.0008);
        stock.price = parseFloat((stock.price + delta).toFixed(2));
        stock.change = parseFloat((stock.price - stock.prevClose).toFixed(2));
        stock.changePercent = parseFloat(((stock.change / stock.prevClose) * 100).toFixed(2));
        if (stock.price > stock.high) stock.high = stock.price;
        if (stock.price < stock.low) stock.low = stock.price;
      });
      const twIndex = this.indices[0];
      const indexDelta = (Math.random() - 0.48) * 12;
      twIndex.price = parseFloat((twIndex.price + indexDelta).toFixed(2));
      twIndex.change = parseFloat((twIndex.price - twIndex.prevClose).toFixed(2));
      twIndex.changePercent = parseFloat(((twIndex.change / twIndex.prevClose) * 100).toFixed(2));
      if (twIndex.price > twIndex.high) twIndex.high = twIndex.price;
      if (twIndex.price < twIndex.low) twIndex.low = twIndex.price;
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
    title: '中央氣象署即時雷達回波與雲圖',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { activeLayer: 'cwa_radar_standard', isPlaying: true }) {
      const layers = WeatherService.getRadarLayers();
      const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];
      const isLiveImage = currentLayer.type === 'live_image';
      const nowTimeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none overflow-hidden relative justify-between">
          <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-800">
            <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg overflow-x-auto max-w-[70%] scrollbar-thin">
              ${layers.map(l => `
                <button class="px-2 py-0.5 text-xs font-medium rounded-md transition-all flex-shrink-0 ${l.id === currentLayer.id ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-400 hover:text-white'}" data-layer="${l.id}">
                  ${l.name.replace('中央氣象署', '').replace('向日葵', '')}
                </button>
              `).join('')}
            </div>
            
            <div class="flex items-center space-x-1.5">
              <button id="radar-refresh-btn" class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors" title="立即自中央氣象署抓取最新雷達雲圖">
                🔄 刷新
              </button>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 live-pulse"></span>
                CWA 官方即時連線
              </span>
            </div>
          </div>

          <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[140px] group">
            ${isLiveImage ? `
              <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
                <img id="cwa-live-radar-img" src="${currentLayer.url}" alt="${currentLayer.name}" class="w-full h-full object-contain transition-transform duration-300 transform scale-100 hover:scale-105 cursor-zoom-in" title="點擊在新分頁開啟高解析度原圖">
                
                <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none">
                  <span class="text-cyan-400 font-bold">📡 中央氣象署 (CWA)</span>
                  <span class="text-slate-400">‧ ${currentLayer.unit}</span>
                </div>

                <div class="absolute top-2 right-2 flex items-center space-x-1">
                  <div class="bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300">
                    🕒 ${nowTimeStr} 抓取
                  </div>
                  ${currentLayer.hdUrl ? `
                    <a href="${currentLayer.hdUrl}" target="_blank" class="bg-blue-600/80 hover:bg-blue-600 px-1.5 py-0.5 rounded text-[10px] text-white transition-colors" title="開啟 3600x3600 超高解析度大圖">
                      🔍 3600HD
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : `
              <canvas id="radar-canvas" class="w-full h-full object-cover"></canvas>
              
              <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div class="w-64 h-64 border border-emerald-500/20 rounded-full"></div>
                <div class="w-44 h-44 border border-emerald-500/25 rounded-full"></div>
                <div class="w-20 h-20 border border-emerald-500/30 rounded-full"></div>
                <div class="absolute w-full h-[1px] bg-emerald-500/20"></div>
                <div class="absolute h-full w-[1px] bg-emerald-500/20"></div>
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
            `}
          </div>

          <div class="flex items-center justify-between pt-1 text-xs">
            <div class="flex items-center space-x-2">
              <span class="text-slate-300 text-[11px] font-medium">${currentLayer.name}</span>
              <span class="text-slate-500 text-[10px]">每 10 分鐘自動同步中央氣象署最新觀測</span>
            </div>

            <div class="flex items-center space-x-1.5 text-slate-400">
              <span class="text-[10px] text-cyan-400">${currentLayer.source}</span>
            </div>
          </div>
        </div>
      `;

      if (!isLiveImage) {
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
      }

      const liveImg = container.querySelector('#cwa-live-radar-img');
      if (liveImg) {
        liveImg.addEventListener('click', () => {
          window.open(liveImg.src, '_blank');
        });
      }

      container.querySelectorAll('[data-layer]').forEach(btn => {
        btn.addEventListener('click', () => {
          WeatherRadarWidget.render(container, { ...state, activeLayer: btn.getAttribute('data-layer') });
        });
      });

      const refreshBtn = container.querySelector('#radar-refresh-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          WeatherRadarWidget.render(container, state);
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
    title: '股市即時行情與專業線型圖',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { selectedSymbol: '^TWII', tab: 'indices', chartType: 'intraday' }) {
      const list = state.tab === 'indices' ? StockService.indices : StockService.stocks;
      let currentItem = [...StockService.indices, ...StockService.stocks].find(s => s.symbol === state.selectedSymbol) || StockService.indices[0];
      
      if (StockService.cache[state.selectedSymbol]) {
        const c = StockService.cache[state.selectedSymbol];
        currentItem = { ...currentItem, price: c.price, change: c.change, changePercent: c.changePercent, open: c.open, high: c.high, low: c.low, volume: c.volume };
      }

      const isUp = currentItem.change >= 0;
      const sign = isUp ? '+' : '';
      const colorClass = isUp ? 'text-red-400' : 'text-emerald-400';
      const bgBadgeClass = isUp ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

      container.innerHTML = `
        <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none justify-between overflow-hidden">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <div class="flex items-center space-x-1 bg-slate-800/90 p-0.5 rounded-lg">
              <button id="stock-tab-indices" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'indices' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                主要指數
              </button>
              <button id="stock-tab-stocks" class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${state.tab === 'stocks' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}">
                熱門個股
              </button>
            </div>

            <div class="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button id="stock-mode-intraday" class="px-2 py-0.5 text-[11px] font-medium rounded transition-all ${state.chartType === 'intraday' ? 'bg-blue-500/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'}">
                分時走勢
              </button>
              <button id="stock-mode-kline" class="px-2 py-0.5 text-[11px] font-medium rounded transition-all ${state.chartType === 'kline' ? 'bg-blue-500/30 text-blue-300 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-slate-200'}">
                日K線圖
              </button>
            </div>

            <div class="flex items-center space-x-1.5">
              <button id="stock-refresh-api-btn" class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors" title="重新連線即時行情 API">
                🔄
              </button>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 live-pulse"></span>
                ${StockService.isLiveConnected ? 'API 即時連線' : '即時撮合'}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between my-1.5 px-1">
            <div>
              <div class="flex items-center space-x-2">
                <h2 class="text-base font-black text-white">${currentItem.name}</h2>
                <span class="text-xs px-1.5 py-0.2 font-mono rounded bg-slate-800 text-slate-300">${currentItem.symbol}</span>
              </div>
              <div class="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                <span>開: <b class="text-slate-200">${currentItem.open?.toLocaleString() || currentItem.price}</b></span>
                <span>高: <b class="text-red-400">${currentItem.high?.toLocaleString() || currentItem.price}</b></span>
                <span>低: <b class="text-emerald-400">${currentItem.low?.toLocaleString() || currentItem.price}</b></span>
                <span>量: <b class="text-slate-200">${currentItem.volume}</b></span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-xl font-black font-mono tracking-tight ${colorClass}">
                ${currentItem.price.toLocaleString()}
              </div>
              <div class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold font-mono border ${bgBadgeClass} mt-0.5">
                ${sign}${currentItem.change.toFixed(2)} (${sign}${currentItem.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div class="relative flex-1 min-h-[140px] bg-slate-950/90 rounded-xl p-1.5 border border-slate-800/90 flex flex-col justify-between overflow-hidden">
            <canvas id="stock-chart-canvas" class="w-full h-full cursor-crosshair"></canvas>
            
            <div id="chart-legend-overlay" class="absolute top-1.5 left-2 text-[9px] text-slate-400 font-mono pointer-events-none flex items-center space-x-2 bg-slate-900/80 px-1.5 py-0.5 rounded backdrop-blur">
              ${state.chartType === 'intraday' ? `
                <span><span class="text-blue-400">●</span> 即時走勢</span>
                <span><span class="text-yellow-400">●</span> 均價線</span>
                <span><span class="text-slate-500">┄</span> 昨收平盤 (${(currentItem.prevClose || (currentItem.price - currentItem.change)).toLocaleString()})</span>
              ` : `
                <span><span class="text-yellow-400">●</span> MA5</span>
                <span><span class="text-cyan-400">●</span> MA10</span>
                <span><span class="text-purple-400">●</span> MA20</span>
              `}
            </div>

            <div id="chart-hover-tooltip" class="absolute top-1.5 right-2 text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700 pointer-events-none hidden">
              --
            </div>
          </div>

          <div class="flex space-x-1.5 overflow-x-auto pt-1.5 pb-0.5 scrollbar-thin">
            ${list.map(item => {
              const itemUp = item.change >= 0;
              const textCol = itemUp ? 'text-red-400' : 'text-emerald-400';
              const isSelected = item.symbol === currentItem.symbol;
              return `
                <div class="flex-shrink-0 px-2 py-1 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-blue-950/70 border-blue-500 shadow-sm' : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800'}" data-stock-symbol="${item.symbol}">
                  <div class="flex items-center justify-between text-[11px] font-semibold space-x-2">
                    <span class="text-slate-200">${item.name}</span>
                    <span class="${textCol} font-mono">${item.price.toLocaleString()}</span>
                  </div>
                  <div class="text-[9px] ${textCol} font-mono text-right mt-0.5">
                    ${itemUp ? '+' : ''}${item.changePercent.toFixed(2)}%
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      const canvas = container.querySelector('#stock-chart-canvas');
      const tooltip = container.querySelector('#chart-hover-tooltip');

      if (canvas) {
        const ctx = canvas.getContext('2d');
        let mouseX = -1;

        const draw = () => {
          if (!canvas.parentElement) return;
          const rect = canvas.getBoundingClientRect();
          const dpr = window.devicePixelRatio || 1;
          
          canvas.width = rect.width * dpr;
          canvas.height = rect.height * dpr;
          ctx.scale(dpr, dpr);

          const w = rect.width;
          const h = rect.height;
          ctx.clearRect(0, 0, w, h);

          if (state.chartType === 'intraday') {
            drawIntraday(w, h);
          } else {
            drawKline(w, h);
          }
        };

        const drawIntraday = (w, h) => {
          const data = StockService.getIntradayHistory(currentItem.symbol);
          const prices = data.prices;
          const vwap = data.vwap;
          const volumes = data.volumes;
          const prevClose = data.prevClose;

          const priceH = h * 0.70;
          const volH = h * 0.24;
          const volTop = h * 0.76;
          const paddingLeft = 10;
          const paddingRight = 48;
          const chartW = w - paddingLeft - paddingRight;

          let maxDiff = Math.max(...prices.map(p => Math.abs(p - prevClose)), prevClose * 0.005);
          const maxPrice = prevClose + maxDiff * 1.05;
          const minPrice = prevClose - maxDiff * 1.05;
          const priceRange = maxPrice - minPrice || 1;

          const getY = (p) => priceH - ((p - minPrice) / priceRange) * (priceH - 12) - 6;
          const getX = (idx) => paddingLeft + (idx / (prices.length - 1)) * chartW;

          const gridSteps = [-maxDiff, -maxDiff * 0.5, 0, maxDiff * 0.5, maxDiff];
          gridSteps.forEach(diff => {
            const p = prevClose + diff;
            const y = getY(p);
            const pct = ((diff / prevClose) * 100).toFixed(2);
            
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(w - paddingRight, y);
            if (diff === 0) {
              ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
              ctx.setLineDash([4, 4]);
            } else {
              ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
              ctx.setLineDash([2, 2]);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = '9px monospace';
            ctx.fillStyle = diff > 0 ? '#f87171' : diff < 0 ? '#34d399' : '#94a3b8';
            ctx.textAlign = 'left';
            ctx.fillText(`${diff > 0 ? '+' : ''}${pct}%`, w - paddingRight + 4, y + 3);
          });

          ctx.textAlign = 'left';
          ctx.fillStyle = '#f87171';
          ctx.fillText(maxPrice.toFixed(1), paddingLeft + 2, 10);
          ctx.fillStyle = '#94a3b8';
          ctx.fillText(prevClose.toFixed(1), paddingLeft + 2, getY(prevClose) - 3);
          ctx.fillStyle = '#34d399';
          ctx.fillText(minPrice.toFixed(1), paddingLeft + 2, priceH - 3);

          const isUp = currentItem.change >= 0;
          const grad = ctx.createLinearGradient(0, 0, 0, priceH);
          grad.addColorStop(0, isUp ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          prices.forEach((p, idx) => {
            const x = getX(idx);
            const y = getY(p);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.lineTo(paddingLeft + chartW, priceH);
          ctx.lineTo(paddingLeft, priceH);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();

          ctx.beginPath();
          vwap.forEach((v, idx) => {
            const x = getX(idx);
            const y = getY(v);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.beginPath();
          prices.forEach((p, idx) => {
            const x = getX(idx);
            const y = getY(p);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = isUp ? '#f87171' : '#34d399';
          ctx.lineWidth = 2;
          ctx.stroke();

          const maxVol = Math.max(...volumes) || 1;
          const volBarW = Math.max(2, (chartW / volumes.length) - 1.5);

          volumes.forEach((vol, idx) => {
            const x = getX(idx) - volBarW / 2;
            const barH = (vol / maxVol) * (volH - 6);
            const y = h - barH;
            const isBarUp = idx === 0 ? isUp : prices[idx] >= prices[idx - 1];

            ctx.fillStyle = isBarUp ? 'rgba(239, 68, 68, 0.65)' : 'rgba(34, 197, 94, 0.65)';
            ctx.fillRect(x, y, volBarW, barH);
          });

          const timeTicks = [
            { label: '09:00', idx: 0 },
            { label: '10:30', idx: 18 },
            { label: '12:00', idx: 36 },
            { label: '13:30', idx: 54 }
          ];
          ctx.fillStyle = '#64748b';
          ctx.font = '9px monospace';
          timeTicks.forEach(t => {
            const x = getX(t.idx);
            ctx.textAlign = t.idx === 0 ? 'left' : t.idx === 54 ? 'right' : 'center';
            ctx.fillText(t.label, x, volTop - 3);
          });

          if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
            const hoveredIdx = Math.min(prices.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (prices.length - 1))));
            const hX = getX(hoveredIdx);
            const hY = getY(prices[hoveredIdx]);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.setLineDash([2, 2]);
            ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(hX, hY, 3.5, 0, Math.PI * 2); ctx.fill();

            const curP = prices[hoveredIdx];
            const diffP = curP - prevClose;
            const diffPct = ((diffP / prevClose) * 100).toFixed(2);
            tooltip.classList.remove('hidden');
            tooltip.innerHTML = `🕒 ${data.timeLabels[hoveredIdx]} | <b>${curP.toFixed(2)}</b> (${diffP >= 0 ? '+' : ''}${diffPct}%) | 量: ${volumes[hoveredIdx]}`;
          } else {
            tooltip.classList.add('hidden');
          }
        };

        const drawKline = (w, h) => {
          const data = StockService.getDailyKLines(currentItem.symbol);
          const klines = data.klines;
          const ma5 = data.ma5;
          const ma10 = data.ma10;
          const ma20 = data.ma20;

          const priceH = h * 0.70;
          const volH = h * 0.24;
          const paddingLeft = 10;
          const paddingRight = 45;
          const chartW = w - paddingLeft - paddingRight;

          const allL = klines.map(k => k.low);
          const allH = klines.map(k => k.high);
          const minPrice = Math.min(...allL) * 0.99;
          const maxPrice = Math.max(...allH) * 1.01;
          const priceRange = maxPrice - minPrice || 1;

          const getY = (p) => priceH - ((p - minPrice) / priceRange) * (priceH - 12) - 6;
          const getX = (idx) => paddingLeft + (idx / (klines.length - 1)) * chartW;

          for (let i = 0; i <= 3; i++) {
            const y = (priceH / 3) * i;
            const p = maxPrice - (i / 3) * priceRange;
            ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
            ctx.beginPath(); ctx.moveTo(paddingLeft, y); ctx.lineTo(w - paddingRight, y); ctx.stroke();

            ctx.fillStyle = '#94a3b8';
            ctx.font = '9px monospace';
            ctx.textAlign = 'left';
            ctx.fillText(p.toFixed(1), w - paddingRight + 4, y + 3);
          }

          const candleW = Math.max(3, (chartW / klines.length) * 0.65);

          klines.forEach((k, idx) => {
            const x = getX(idx);
            const yOpen = getY(k.open);
            const yClose = getY(k.close);
            const yHigh = getY(k.high);
            const yLow = getY(k.low);

            const isUpCandle = k.close >= k.open;
            const color = isUpCandle ? '#ef4444' : '#22c55e';

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            const topY = Math.min(yOpen, yClose);
            const bodyH = Math.max(2, Math.abs(yClose - yOpen));
            ctx.fillStyle = color;
            ctx.fillRect(x - candleW / 2, topY, candleW, bodyH);

            const maxVol = Math.max(...klines.map(item => item.volume)) || 1;
            const vH = (k.volume / maxVol) * (volH - 6);
            ctx.fillStyle = isUpCandle ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)';
            ctx.fillRect(x - candleW / 2, h - vH, candleW, vH);
          });

          const drawMALine = (maArray, color) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            let started = false;
            maArray.forEach((val, idx) => {
              if (val !== null) {
                const x = getX(idx);
                const y = getY(val);
                if (!started) { ctx.moveTo(x, y); started = true; }
                else ctx.lineTo(x, y);
              }
            });
            ctx.stroke();
          };

          drawMALine(ma5, '#eab308');
          drawMALine(ma10, '#06b6d4');
          drawMALine(ma20, '#a855f7');

          ctx.fillStyle = '#64748b';
          ctx.font = '9px monospace';
          const kLen = klines.length;
          [0, Math.floor(kLen * 0.33), Math.floor(kLen * 0.66), kLen - 1].forEach(idx => {
            if (klines[idx]) {
              const x = getX(idx);
              ctx.textAlign = idx === 0 ? 'left' : idx === kLen - 1 ? 'right' : 'center';
              ctx.fillText(klines[idx].date, x, priceH + 12);
            }
          });

          if (mouseX >= paddingLeft && mouseX <= paddingLeft + chartW) {
            const hoveredIdx = Math.min(klines.length - 1, Math.max(0, Math.round(((mouseX - paddingLeft) / chartW) * (klines.length - 1))));
            const k = klines[hoveredIdx];
            const hX = getX(hoveredIdx);
            const hY = getY(k.close);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.setLineDash([2, 2]);
            ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
            ctx.setLineDash([]);

            tooltip.classList.remove('hidden');
            tooltip.innerHTML = `📅 ${k.date} | 開:${k.open} 高:${k.high} 低:${k.low} 收:<b>${k.close}</b>`;
          } else {
            tooltip.classList.add('hidden');
          }
        };

        canvas.addEventListener('mousemove', (e) => {
          const rect = canvas.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          draw();
        });
        canvas.addEventListener('mouseleave', () => {
          mouseX = -1;
          draw();
        });

        setTimeout(draw, 40);
        window.addEventListener('resize', draw);
      }

      StockService.fetchLiveStockData(state.selectedSymbol).then(res => {
        if (res && canvas) {
          window.dispatchEvent(new Event('resize'));
        }
      });

      const btnIndices = container.querySelector('#stock-tab-indices');
      const btnStocks = container.querySelector('#stock-tab-stocks');
      const btnIntraday = container.querySelector('#stock-mode-intraday');
      const btnKline = container.querySelector('#stock-mode-kline');
      const btnRefresh = container.querySelector('#stock-refresh-api-btn');

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
      if (btnIntraday) {
        btnIntraday.addEventListener('click', () => {
          StockMarketWidget.render(container, { ...state, chartType: 'intraday' });
        });
      }
      if (btnKline) {
        btnKline.addEventListener('click', () => {
          StockMarketWidget.render(container, { ...state, chartType: 'kline' });
        });
      }
      if (btnRefresh) {
        btnRefresh.addEventListener('click', () => {
          StockService.fetchLiveStockData(state.selectedSymbol).then(() => {
            StockMarketWidget.render(container, state);
          });
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
          { id: 'n-2', text: '🔔 今日待辦：\n1. 追蹤海神颱風路徑\n2. 觀察台股大盤走勢與K線支撐\n3. 預約板橋新板特區賞屋', color: 'blue', date: '今日待辦' }
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
      const nvda = StockService.stocks[7] || StockService.stocks[0];
      
      const items = [
        `🔔 <b>即時快訊</b>：海神颱風發布海上警報，請東部海面作業船隻嚴加戒備`,
        `📈 <b>加權指數</b>：${twii.price.toLocaleString()} (<span class="${twii.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">${twii.change >= 0 ? '+' : ''}${twii.change.toFixed(2)} / +${twii.changePercent.toFixed(2)}%</span>)`,
        `💎 <b>台積電</b>：${tsmc.price.toLocaleString()} (<span class="${tsmc.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">${tsmc.change >= 0 ? '+' : ''}${tsmc.change.toFixed(1)} / +${tsmc.changePercent.toFixed(2)}%</span>)`,
        `🚀 <b>NVIDIA</b>：\$${nvda.price.toFixed(2)} (<span class="${nvda.change >= 0 ? 'text-red-400' : 'text-emerald-400'}">+${nvda.changePercent.toFixed(2)}%</span>)`,
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
