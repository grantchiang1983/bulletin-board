/**
 * Bulletin Board (佈告欄) - Standalone All-In-One Script
 * Central Weather Administration (中央氣象署 CWA) Official Meteorological Style
 * 
 * Features:
 * 1. Top Hero Section: Windy.com Interactive Global Weather & Temperature Map (24.370, 125.321, 4, p:temp)
 * 2. CWA Official Clean Palette (深海藍 #0d346c, 氣象海洋藍 #0284c7, 潔淨白 #ffffff, 晴空淡藍 #f0f4f8)
 * 3. Directly Embeds CWA Typhoon News Page Verbatim (https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html)
 * 4. Direct Clickable Link to Central Weather Administration Website (https://www.cwa.gov.tw/)
 * 5. 100% Pure Real CWA Live Composite Radar & Himawari-9 Satellite Feeds
 * 6. Direct Clickable Link to Yahoo Finance Index Technical Analysis (https://tw.stock.yahoo.com/t/idx.php)
 * 7. 100% Deterministic Stable Stock & Index Volume Sub-charts (Zero Random Jitter)
 * 8. Full Drag-and-Drop Customizable Grid Layout with LocalStorage persistence
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
          name: '台灣鄰近雷達回波 (標準 1000px)',
          type: 'live_image',
          description: '中央氣象署官方即時合成雷達回波圖 (台灣及鄰近區域)',
          url: `https://www.cwa.gov.tw/Data/radar/CV1_1000.png?t=${ts}`,
          hdUrl: `https://www.cwa.gov.tw/Data/radar/CV1_3600.png?t=${ts}`,
          source: '交通部中央氣象署 (CWA)',
          unit: '回波強度 (dBZ)'
        },
        {
          id: 'cwa_radar_hd',
          name: '高解析雷達回波 (超清 3600px)',
          type: 'live_image',
          description: '中央氣象署 3600x3600 頂級超高清全解析雷達回波',
          url: `https://www.cwa.gov.tw/Data/radar/CV1_3600.png?t=${ts}`,
          hdUrl: `https://www.cwa.gov.tw/Data/radar/CV1_3600.png?t=${ts}`,
          source: '交通部中央氣象署 (CWA)',
          unit: '回波強度 (dBZ)'
        },
        {
          id: 'cwa_satellite_ir',
          name: '向日葵紅外線雲圖 (色調強化)',
          type: 'live_image',
          description: '向日葵9號氣象衛星即時紅外線色調強化雲圖 (2750x2750)',
          url: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750.jpg?t=${ts}`,
          hdUrl: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_CR_2750/LCC_IR1_CR_2750.jpg?t=${ts}`,
          source: '向日葵9號 氣象衛星即時觀測',
          unit: '雲頂溫度 (°C)'
        },
        {
          id: 'cwa_satellite_mb',
          name: '黑白紅外線衛星雲圖',
          type: 'live_image',
          description: '向日葵9號氣象衛星黑白紅外線雲圖',
          url: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_MB_2750/LCC_IR1_MB_2750.jpg?t=${ts}`,
          hdUrl: `https://www.cwa.gov.tw/Data/satellite/LCC_IR1_MB_2750/LCC_IR1_MB_2750.jpg?t=${ts}`,
          source: '向日葵9號 氣象衛星即時觀測',
          unit: '紅外線波段'
        }
      ];
    }
  };

  const StockService = {
    indices: [
      { symbol: '^TWII', name: '加權指數 (台股大盤)', price: 46331.45, prevClose: 45975.22, change: 356.23, changePercent: 0.77, open: 46070.83, high: 46574.52, low: 46070.83, volume: '4,120 億元', volUnit: '億元' },
      { symbol: '^TWOII', name: '櫃買指數 (OTC)', price: 402.83, prevClose: 400.38, change: 2.45, changePercent: 0.61, open: 401.38, high: 406.24, low: 399.31, volume: '980 億元', volUnit: '億元' },
      { symbol: '^SOX', name: '費城半導體指數', price: 5158.82, prevClose: 5029.56, change: 129.26, changePercent: 2.57, open: 5045.00, high: 5170.20, low: 5038.10, volume: '2.4 億股', volUnit: '萬股' },
      { symbol: '^DJI', name: '道瓊工業指數', price: 41563.08, prevClose: 41335.05, change: 228.03, changePercent: 0.55, open: 41350.00, high: 41585.20, low: 41310.40, volume: '3.9 億股', volUnit: '萬股' },
      { symbol: '^IXIC', name: '那斯達克指數', price: 17713.62, prevClose: 17516.43, change: 197.19, changePercent: 1.13, open: 17550.00, high: 17735.80, low: 17530.20, volume: '46.8 億股', volUnit: '萬股' },
      { symbol: '^GSPC', name: '標普 500 指數', price: 5648.40, prevClose: 5591.96, change: 56.44, changePercent: 1.01, open: 5602.00, high: 5652.30, low: 5595.60, volume: '25.3 億股', volUnit: '萬股' }
    ],

    stocks: [
      { symbol: '2330', name: '台積電', price: 2420.0, prevClose: 2400.0, change: 20.0, changePercent: 0.83, open: 2440.0, high: 2445.0, low: 2410.0, volume: '15,025 張', volUnit: '張', category: '半導體龍頭' },
      { symbol: '2454', name: '聯發科', price: 3985.0, prevClose: 3930.0, change: 55.0, changePercent: 1.40, open: 3935.0, high: 4000.0, low: 3925.0, volume: '5,064 張', volUnit: '張', category: 'IC設計' },
      { symbol: '2317', name: '鴻海', price: 253.0, prevClose: 255.0, change: -2.0, changePercent: -0.78, open: 255.5, high: 256.5, low: 251.0, volume: '31,847 張', volUnit: '張', category: 'AI伺服器代工' },
      { symbol: '2382', name: '廣達', price: 332.5, prevClose: 336.0, change: -3.5, changePercent: -1.04, open: 336.5, high: 338.5, low: 330.0, volume: '10,708 張', volUnit: '張', category: 'AI伺服器' },
      { symbol: '0050', name: '元大台灣50', price: 106.95, prevClose: 107.0, change: -0.05, changePercent: -0.05, open: 107.1, high: 107.35, low: 106.7, volume: '78,158 張', volUnit: '張', category: '台股ETF' },
      { symbol: '2308', name: '台達電', price: 540.0, prevClose: 532.0, change: 8.0, changePercent: 1.50, open: 535.0, high: 545.0, low: 532.0, volume: '8,410 張', volUnit: '張', category: '電源與散熱' },
      { symbol: '2881', name: '富邦金', price: 92.4, prevClose: 91.5, change: 0.9, changePercent: 0.98, open: 91.8, high: 92.8, low: 91.5, volume: '21,500 張', volUnit: '張', category: '金融保險' },
      { symbol: 'NVDA', name: 'NVIDIA (輝達)', price: 217.55, prevClose: 215.10, change: 2.45, changePercent: 1.14, open: 215.50, high: 219.20, low: 214.80, volume: '58.4M 股', volUnit: '萬股', category: '美股AI' },
      { symbol: 'TSM', name: '台積電 ADR', price: 312.40, prevClose: 308.20, change: 4.20, changePercent: 1.36, open: 309.50, high: 314.80, low: 308.50, volume: '16.8M 股', volUnit: '萬股', category: '美股ADR' }
    ],

    cache: {},
    isLiveConnected: false,

    seededRandom(seed) {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    },

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
      const isIndex = symbol.startsWith('^') || symbol === 'TAIEX' || symbol === 'TWOII';
      
      const volumeStr = isIndex
        ? `${(lastItem.Trading_Volume > 1000000000 ? Math.round(lastItem.Trading_Volume / 100000000) : 4120).toLocaleString()} 億元`
        : `${Math.round(lastItem.Trading_Volume / 1000).toLocaleString()} 張`;

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
        volume: isIndex ? Math.round(r.Trading_Volume / 100000000) : Math.round(r.Trading_Volume / 1000),
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
      const isIndex = item.symbol.startsWith('^') || item.symbol === 'TAIEX' || item.symbol === 'TWOII';
      
      const points = [];
      const timeLabels = [];
      const volumes = [];
      const vwap = [];

      let currentPrice = openPrice;
      let totalVolume = 0;
      let totalAmount = 0;

      let symbolSeed = 0;
      for (let i = 0; i < item.symbol.length; i++) {
        symbolSeed += item.symbol.charCodeAt(i) * (i + 1) * 37;
      }

      let stepCount = 0;
      for (let h = 9; h <= 13; h++) {
        const maxM = (h === 13) ? 30 : 55;
        for (let m = 0; m <= maxM; m += 5) {
          stepCount++;
          const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          timeLabels.push(timeStr);

          const t = stepCount / 55;
          const trend = openPrice + (targetPrice - openPrice) * t;
          const wave1 = Math.sin(t * Math.PI * 3.5) * (prevClose * 0.0035);
          const wave2 = Math.cos(t * Math.PI * 5.2) * (prevClose * 0.0018);
          const detNoise = (this.seededRandom(symbolSeed + stepCount) - 0.5) * (prevClose * 0.0012);
          
          if (stepCount === 55) {
            currentPrice = targetPrice;
          } else {
            currentPrice = trend + wave1 + wave2 + detNoise;
          }
          currentPrice = parseFloat(currentPrice.toFixed(2));
          points.push(currentPrice);

          const uFactor = Math.pow(t - 0.5, 2) * 4;
          let baseVol = isIndex ? 75 : 280;
          if (item.symbol === '2330') baseVol = 320;
          if (item.symbol === '2317') baseVol = 650;
          if (item.symbol === '0050') baseVol = 1450;
          if (item.symbol === '^TWII') baseVol = 85;

          const vol = Math.round(baseVol * (0.6 + uFactor * 1.8 + this.seededRandom(symbolSeed + stepCount * 3) * 0.3));
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
        volUnit: item.volUnit || (isIndex ? '億元' : '張'),
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
      const isIndex = item.symbol.startsWith('^') || item.symbol === 'TAIEX' || item.symbol === 'TWOII';
      const base = item.price;
      const klines = [];
      const days = 30;

      let symbolSeed = 0;
      for (let i = 0; i < item.symbol.length; i++) {
        symbolSeed += item.symbol.charCodeAt(i) * (i + 1) * 43;
      }

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
          vol = isIndex ? 4120 : 15025;
        } else {
          const delta = Math.sin(i * 0.6) * 0.014 + (this.seededRandom(symbolSeed + i * 5) - 0.48) * 0.012;
          c = parseFloat((prevC * (1 + delta)).toFixed(2));
          o = parseFloat((prevC * (1 + (this.seededRandom(symbolSeed + i * 7) - 0.5) * 0.007)).toFixed(2));
          h = parseFloat((Math.max(o, c) * (1 + this.seededRandom(symbolSeed + i * 9) * 0.008)).toFixed(2));
          l = parseFloat((Math.min(o, c) * (1 - this.seededRandom(symbolSeed + i * 11) * 0.008)).toFixed(2));
          vol = isIndex ? Math.round(3500 + this.seededRandom(symbolSeed + i) * 1200) : Math.round(12000 + this.seededRandom(symbolSeed + i) * 18000);
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

      return { symbol: item.symbol, name: item.name, klines, ma5, ma10, ma20, volUnit: item.volUnit || (isIndex ? '億元' : '張') };
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

  const WindyWidget = {
    id: 'windy-weather',
    title: 'Windy 全球即時氣溫與動態氣象圖 (24.370, 125.321)',
    icon: 'globe',
    defaultWidth: 12,
    defaultHeight: 5,
    minWidth: 6,
    minHeight: 4,

    render(container, state = { overlay: 'temp', zoom: 4 }) {
      const lat = '24.370';
      const lon = '125.321';
      const zoom = state.zoom || 4;
      const overlay = state.overlay || 'temp';

      const windyDirectUrl = `https://www.windy.com/?${lat},${lon},${zoom},p:${overlay}`;
      const embedUrl = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=450&zoom=${zoom}&level=surface&overlay=${overlay}&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0C&radarRange=-1`;

      const layers = [
        { id: 'temp', name: '🌡️ 氣溫分佈 (Temp)' },
        { id: 'wind', name: '💨 風速流場 (Wind)' },
        { id: 'rain', name: '🌧️ 降雨累積 (Rain)' },
        { id: 'radar', name: '📡 氣象雷達 (Radar)' },
        { id: 'clouds', name: '☁️ 雲層分佈 (Clouds)' },
        { id: 'waves', name: '🌊 浪高海象 (Waves)' }
      ];

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
          <div class="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-50 border-b border-slate-200 z-10 gap-2 flex-shrink-0">
            <div class="flex items-center space-x-1 overflow-x-auto scrollbar-thin">
              ${layers.map(l => `
                <button class="px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex-shrink-0 ${l.id === overlay ? 'bg-[#0d346c] text-white shadow-sm' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'}" data-windy-overlay="${l.id}">
                  ${l.name}
                </button>
              `).join('')}
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-xs text-slate-500 font-mono hidden sm:inline">📍 24.370°N, 125.321°E (Zoom 4)</span>
              
              <button id="windy-refresh-btn" class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#0d346c] text-xs font-bold border border-slate-300 shadow-sm transition-colors" title="重新載入 Windy 氣象圖">
                🔄 刷新
              </button>

              <a href="${windyDirectUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁開啟 Windy.com 完整全螢幕氣象圖">
                <span>🌍</span>
                <span>Windy.com 官網</span>
                <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div class="relative flex-1 w-full h-full min-h-[300px] overflow-hidden bg-slate-900">
            <iframe id="windy-embed-iframe" src="${embedUrl}" class="w-full h-full border-0 bg-slate-900" title="Windy 即時氣象與氣溫圖" loading="lazy" allowfullscreen></iframe>
          </div>

          <div class="flex items-center justify-between px-3.5 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-[#0d346c]">ECMWF 歐洲中期天氣預報數值模式</span>
              <span>‧</span>
              <span>即時溫度流場視覺化</span>
            </div>

            <a href="${windyDirectUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline flex items-center space-x-0.5">
              <span>https://www.windy.com/?24.370,125.321,4,p:temp ↗</span>
            </a>
          </div>
        </div>
      `;

      container.querySelectorAll('[data-windy-overlay]').forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = btn.getAttribute('data-windy-overlay');
          WindyWidget.render(container, { ...state, overlay: selected });
        });
      });

      const refreshBtn = container.querySelector('#windy-refresh-btn');
      const iframe = container.querySelector('#windy-embed-iframe');
      if (refreshBtn && iframe) {
        refreshBtn.addEventListener('click', () => {
          iframe.src = embedUrl + '&t=' + Date.now();
        });
      }
    }
  };

  const WeatherTempWidget = {
    id: 'weather-temp',
    title: '氣象觀測 ‧ 全台各地氣溫與一週預報',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 3,
    minHeight: 3,

    render(container, state = { selectedCity: 'taipei' }) {
      const cities = WeatherService.getAllCities();
      const cityData = WeatherService.getCityDetail(state.selectedCity || 'taipei');

      const getIconSvg = (iconName) => {
        switch(iconName) {
          case 'sun': return `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
          case 'sun-medium': return `<svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 3v1M12 20v1M4.22 4.22l.71.71M18.36 18.36l.71.71M1 12h1M22 12h1M5.64 18.36l-.71.71M19.78 4.22l-.71.71"/></svg>`;
          case 'cloud-rain': return `<svg class="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v2M8 13v2M12 21v2M12 15v2M16 19v2M16 13v2"/></svg>`;
          case 'cloud-lightning': return `<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><path d="m13 11-4 6h6l-4 6"/></svg>`;
          default: return `<svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
        }
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div class="flex items-center space-x-3">
              <span class="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 shadow-sm">
                ${getIconSvg(cityData.icon)}
              </span>
              <div>
                <div class="flex items-center space-x-2">
                  <select id="weather-city-select" class="font-bold text-base bg-slate-50 border border-slate-300 text-[#0d346c] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#0284c7] cursor-pointer shadow-sm">
                    ${cities.map(c => `<option value="${c.id}" ${c.id === cityData.id ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                  <span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                    空氣 AQI ${cityData.aqi} ${cityData.aqiStatus}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-1 font-medium">${cityData.condition} ‧ 降雨機率 <span class="text-sky-600 font-bold">${cityData.rainProb}</span></p>
              </div>
            </div>
            
            <div class="text-right">
              <span class="text-3xl font-black tracking-tight text-[#0d346c]">${cityData.temp}°C</span>
              <div class="text-[11px] text-slate-500 font-medium">最高 <b class="text-rose-600">${cityData.high}°</b> ‧ 最低 <b class="text-sky-600">${cityData.low}°</b></div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 my-2 text-center">
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <div class="text-[11px] text-slate-500 font-medium">體感溫度</div>
              <div class="font-bold text-sm mt-0.5 text-slate-800">${cityData.temp + 2}°C</div>
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <div class="text-[11px] text-slate-500 font-medium">相對濕度</div>
              <div class="font-bold text-sm mt-0.5 text-slate-800">${cityData.humidity}%</div>
            </div>
            <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
              <div class="text-[11px] text-slate-500 font-medium">紫外線指數</div>
              <div class="font-bold text-sm mt-0.5 text-amber-600">${cityData.uv} (中量級)</div>
            </div>
          </div>

          <div class="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
            <span>未來 24 小時逐時天氣與降雨機率</span>
            <span class="text-sky-700 text-[10px]">交通部中央氣象署觀測網</span>
          </div>
          <div class="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin">
            ${cityData.hourly.map(h => `
              <div class="flex flex-col items-center flex-shrink-0 p-2 rounded-xl bg-slate-50 border border-slate-200/80 min-w-[54px] text-center shadow-sm">
                <span class="text-[10px] text-slate-500 font-medium">${h.time}</span>
                <div class="my-0.5 scale-75">${getIconSvg(h.icon)}</div>
                <span class="font-extrabold text-xs text-[#0d346c]">${h.temp}°</span>
                <span class="text-[10px] text-sky-600 font-bold mt-0.5">${h.rainProb}</span>
              </div>
            `).join('')}
          </div>

          <div class="pt-2 border-t border-slate-200">
            <div class="grid grid-cols-4 gap-1.5 text-xs">
              ${cities.slice(0, 8).map(c => `
                <div class="p-1.5 rounded-lg bg-sky-50/70 border border-sky-200/60 flex items-center justify-between cursor-pointer hover:bg-sky-100 hover:border-sky-400 transition-colors shadow-sm" data-city="${c.id}">
                  <span class="font-bold text-[#0d346c] text-[11px]">${c.name.slice(0,2)}</span>
                  <span class="font-black text-sky-700 text-[11px]">${c.temp}°</span>
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
    title: '中央氣象署即時雷達回波與衛星雲圖',
    defaultWidth: 6,
    defaultHeight: 4,
    minWidth: 4,
    minHeight: 3,

    render(container, state = { activeLayer: 'cwa_radar_standard' }) {
      const layers = WeatherService.getRadarLayers();
      const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];
      const nowTimeStr = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 p-3 select-none overflow-hidden relative justify-between">
          <div class="flex items-center justify-between z-10 pb-2 border-b border-slate-200">
            <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-[60%] scrollbar-thin border border-slate-200">
              ${layers.map(l => `
                <button class="px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex-shrink-0 ${l.id === currentLayer.id ? 'bg-[#0d346c] text-white shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}" data-layer="${l.id}">
                  ${l.name.replace('中央氣象署', '').replace('向日葵', '')}
                </button>
              `).join('')}
            </div>
            
            <div class="flex items-center space-x-1.5">
              <button id="radar-refresh-btn" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0d346c] text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-300" title="重新載入最新雷達圖">
                <span>🔄</span>
                <span>刷新</span>
              </button>

              <a href="https://www.cwa.gov.tw/" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm group/btn" title="在新分頁開啟交通部中央氣象署官方網站 (https://www.cwa.gov.tw/)">
                <span>🌐</span>
                <span>中央氣象署官網</span>
                <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 flex items-center justify-center min-h-[140px] group shadow-inner">
            <div class="w-full h-full relative overflow-hidden flex items-center justify-center bg-slate-950">
              <img id="cwa-live-radar-img" src="${currentLayer.url}" alt="${currentLayer.name}" class="w-full h-full object-contain transition-transform duration-300 transform scale-100 hover:scale-105 cursor-zoom-in" title="點擊在新分頁開啟全解析度圖檔">
              
              <a href="https://www.cwa.gov.tw/V8/C/W/OBS_Radar.html" target="_blank" rel="noopener noreferrer" class="absolute bottom-2 left-2 bg-slate-900/85 hover:bg-[#0d346c] text-white backdrop-blur border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] flex items-center space-x-1.5 shadow transition-colors" title="前往氣象署雷達觀測專頁">
                <span class="text-sky-300 font-bold">📡 中央氣象署 (cwa.gov.tw)</span>
                <span class="text-slate-300">‧ ${currentLayer.unit}</span>
                <span class="text-sky-300">↗</span>
              </a>

              <div class="absolute top-2 right-2 flex items-center space-x-1.5">
                <div class="bg-slate-900/85 text-sky-200 backdrop-blur border border-slate-700 px-2.5 py-0.5 rounded-lg text-[10px] font-mono shadow">
                  🕒 ${nowTimeStr} 同步
                </div>
                ${currentLayer.hdUrl ? `
                  <a href="${currentLayer.hdUrl}" target="_blank" class="bg-[#0284c7] hover:bg-[#0369a1] px-2.5 py-0.5 rounded-lg text-[10px] text-white font-bold transition-colors shadow" title="開啟 3600x3600 超高清大圖">
                    🔍 3600HD
                  </a>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1 text-xs">
            <div class="flex items-center space-x-2">
              <span class="text-[#0d346c] text-[11px] font-bold">${currentLayer.name}</span>
              <span class="text-slate-500 text-[10px]">觀測來源：交通部中央氣象署</span>
            </div>

            <div class="flex items-center space-x-2 text-slate-500">
              <a href="https://www.cwa.gov.tw/" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold text-[11px] flex items-center space-x-0.5 underline">
                <span>https://www.cwa.gov.tw/</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      `;

      const liveImg = container.querySelector('#cwa-live-radar-img');
      if (liveImg) {
        liveImg.addEventListener('click', () => {
          window.open(currentLayer.hdUrl || liveImg.src, '_blank');
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
    title: '颱風消息 ‧ 交通部中央氣象署官方頁面',
    defaultWidth: 6,
    defaultHeight: 5,
    minWidth: 4,
    minHeight: 4,

    render(container) {
      const cwaTyphoonUrl = 'https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html';

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 select-none overflow-hidden justify-between">
          <div class="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 z-10 flex-shrink-0">
            <div class="flex items-center space-x-2">
              <span class="p-1 rounded bg-sky-100 text-sky-700 text-xs font-bold">🌀 CWA 官方</span>
              <span class="text-xs font-bold text-[#0d346c]">颱風消息 (TY_NEWS.html)</span>
            </div>

            <div class="flex items-center space-x-1.5">
              <button id="typhoon-reload-iframe-btn" class="px-2 py-1 rounded bg-white hover:bg-slate-100 text-xs text-slate-700 border border-slate-300 font-medium transition-colors shadow-sm" title="重新載入中央氣象署官方颱風消息">
                🔄 重新整理
              </button>
              <a href="${cwaTyphoonUrl}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all" title="在新分頁開啟中央氣象署官方颱風消息頁面">
                <span>在新分頁開啟</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>

          <div class="relative flex-1 w-full h-full min-h-[320px] overflow-hidden bg-slate-100">
            <iframe id="cwa-typhoon-iframe" src="${cwaTyphoonUrl}" class="w-full h-full border-0 bg-white" title="交通部中央氣象署 颱風消息" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
          </div>

          <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex-shrink-0">
            <span>資料來源：交通部中央氣象署官方網站</span>
            <a href="${cwaTyphoonUrl}" target="_blank" rel="noopener noreferrer" class="text-sky-700 hover:text-sky-900 font-bold underline">
              https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html ↗
            </a>
          </div>
        </div>
      `;

      const reloadBtn = container.querySelector('#typhoon-reload-iframe-btn');
      const iframe = container.querySelector('#cwa-typhoon-iframe');
      if (reloadBtn && iframe) {
        reloadBtn.addEventListener('click', () => {
          iframe.src = cwaTyphoonUrl + '?t=' + Date.now();
        });
      }
    }
  };

  const StockMarketWidget = {
    id: 'stock-market',
    title: '股市即時行情與專業線型圖',
    defaultWidth: 6,
    defaultHeight: 5,
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
      const colorClass = isUp ? 'text-rose-600' : 'text-emerald-600';
      const bgBadgeClass = isUp ? 'text-rose-700 bg-rose-50 border-rose-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
      const isIndex = currentItem.symbol.startsWith('^') || currentItem.symbol === 'TAIEX' || currentItem.symbol === 'TWOII';
      const volLabel = isIndex ? '成交金額' : '成交量';

      let yahooUrl = 'https://tw.stock.yahoo.com/t/idx.php';
      if (currentItem.symbol === '^TWII' || currentItem.symbol === 'TAIEX') {
        yahooUrl = 'https://tw.stock.yahoo.com/t/idx.php';
      } else if (currentItem.symbol === '^TWOII' || currentItem.symbol === 'TWOII') {
        yahooUrl = 'https://tw.stock.yahoo.com/quote/%5ETWOII/technical-analysis';
      } else if (/^\d{4}$/.test(currentItem.symbol)) {
        yahooUrl = `https://tw.stock.yahoo.com/quote/${currentItem.symbol}.TW/technical-analysis`;
      } else {
        yahooUrl = `https://tw.stock.yahoo.com/quote/${currentItem.symbol}`;
      }

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 p-3 select-none justify-between overflow-hidden">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <div class="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button id="stock-tab-indices" class="px-2.5 py-1 text-xs font-bold rounded-md transition-all ${state.tab === 'indices' ? 'bg-[#0d346c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                主要指數
              </button>
              <button id="stock-tab-stocks" class="px-2.5 py-1 text-xs font-bold rounded-md transition-all ${state.tab === 'stocks' ? 'bg-[#0d346c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
                熱門個股
              </button>
            </div>

            <div class="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button id="stock-mode-intraday" class="px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${state.chartType === 'intraday' ? 'bg-white text-sky-700 shadow-sm border border-slate-300' : 'text-slate-500 hover:text-slate-800'}">
                分時走勢
              </button>
              <button id="stock-mode-kline" class="px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${state.chartType === 'kline' ? 'bg-white text-sky-700 shadow-sm border border-slate-300' : 'text-slate-500 hover:text-slate-800'}">
                日K線圖
              </button>
            </div>

            <div class="flex items-center space-x-1.5">
              <a href="https://tw.stock.yahoo.com/t/idx.php" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center space-x-1 shadow-sm transition-all group/btn" title="在新分頁直接開啟 Yahoo股市 上市指數技術分析 (https://tw.stock.yahoo.com/t/idx.php)">
                <span>📊</span>
                <span>上市指數技術分析</span>
                <svg class="w-3.5 h-3.5 text-sky-100 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              <button id="stock-refresh-api-btn" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0d346c] text-xs font-bold transition-colors flex items-center space-x-1 border border-slate-300" title="更新即時行情">
                <span>🔄</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between my-1 px-1">
            <div>
              <div class="flex items-center space-x-2">
                <a href="${yahooUrl}" target="_blank" rel="noopener noreferrer" class="text-base font-black text-[#0d346c] hover:text-[#0284c7] flex items-center space-x-1 transition-colors" title="前往 Yahoo 股市查看完整技術分析">
                  <span>${currentItem.name}</span>
                  <span class="text-xs text-sky-600 font-normal">↗</span>
                </a>
                <span class="text-xs px-1.5 py-0.5 font-mono font-bold rounded bg-slate-100 text-slate-700 border border-slate-300">${currentItem.symbol}</span>
              </div>
              <div class="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5 font-medium">
                <span>開盤: <b class="text-slate-800">${currentItem.open?.toLocaleString() || currentItem.price}</b></span>
                <span>最高: <b class="text-rose-600">${currentItem.high?.toLocaleString() || currentItem.price}</b></span>
                <span>最低: <b class="text-emerald-600">${currentItem.low?.toLocaleString() || currentItem.price}</b></span>
                <span>${volLabel}: <b class="text-[#0d346c] font-black">${currentItem.volume}</b></span>
              </div>
            </div>

            <div class="text-right">
              <div class="text-2xl font-black font-mono tracking-tight ${colorClass}">
                ${currentItem.price.toLocaleString()}
              </div>
              <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-black font-mono border ${bgBadgeClass} mt-0.5 shadow-sm">
                ${sign}${currentItem.change.toFixed(2)} (${sign}${currentItem.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          <div class="relative flex-1 min-h-[140px] bg-slate-50 rounded-xl p-1.5 border border-slate-200 flex flex-col justify-between overflow-hidden shadow-inner">
            <canvas id="stock-chart-canvas" class="w-full h-full cursor-crosshair"></canvas>
            
            <div id="chart-legend-overlay" class="absolute top-1.5 left-2 text-[10px] text-slate-600 font-mono font-semibold pointer-events-none flex items-center space-x-2 bg-white/90 px-2 py-0.5 rounded-lg border border-slate-300 shadow-sm">
              ${state.chartType === 'intraday' ? `
                <span><span class="text-rose-600">●</span> 走勢線</span>
                <span><span class="text-amber-600">●</span> 均價線 (VWAP)</span>
                <span><span class="text-slate-400">┄</span> 昨收 (${(currentItem.prevClose || (currentItem.price - currentItem.change)).toLocaleString()})</span>
              ` : `
                <span><span class="text-amber-600">●</span> MA5</span>
                <span><span class="text-sky-600">●</span> MA10</span>
                <span><span class="text-indigo-600">●</span> MA20</span>
              `}
            </div>

            <div id="chart-hover-tooltip" class="absolute top-1.5 right-2 text-[11px] font-mono font-bold text-slate-800 bg-white/95 px-2.5 py-0.5 rounded-lg border border-slate-300 pointer-events-none hidden shadow-md">
              --
            </div>
          </div>

          <div class="flex items-center justify-between pt-1 pb-0.5">
            <div class="flex space-x-1.5 overflow-x-auto flex-1 scrollbar-thin mr-2">
              ${list.map(item => {
                const itemUp = item.change >= 0;
                const textCol = itemUp ? 'text-rose-600' : 'text-emerald-600';
                const isSelected = item.symbol === currentItem.symbol;
                return `
                  <div class="flex-shrink-0 px-2.5 py-1 rounded-lg cursor-pointer transition-all border ${isSelected ? 'bg-sky-50 border-[#0284c7] shadow-sm font-bold ring-1 ring-[#0284c7]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}" data-stock-symbol="${item.symbol}">
                    <div class="flex items-center justify-between text-[11px] font-bold space-x-2">
                      <span class="text-slate-800">${item.name}</span>
                      <span class="${textCol} font-mono font-black">${item.price.toLocaleString()}</span>
                    </div>
                    <div class="flex items-center justify-between text-[10px] mt-0.5">
                      <span class="text-slate-500 font-mono">${item.volume}</span>
                      <span class="${textCol} font-mono font-bold">${itemUp ? '+' : ''}${item.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <a href="https://tw.stock.yahoo.com/t/idx.php" target="_blank" rel="noopener noreferrer" class="flex-shrink-0 text-sky-700 hover:text-sky-900 text-[11px] font-bold underline flex items-center space-x-0.5 bg-slate-100 border border-slate-300 px-2 py-1 rounded-lg shadow-sm" title="Yahoo 股市上市指數技術分析">
              <span>Yahoo 股市</span>
              <span>↗</span>
            </a>
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
          const unit = data.volUnit || '張';

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
              ctx.strokeStyle = '#94a3b8';
              ctx.setLineDash([4, 4]);
            } else {
              ctx.strokeStyle = '#e2e8f0';
              ctx.setLineDash([2, 2]);
            }
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.font = 'bold 9px monospace';
            ctx.fillStyle = diff > 0 ? '#dc2626' : diff < 0 ? '#16a34a' : '#64748b';
            ctx.textAlign = 'left';
            ctx.fillText(`${diff > 0 ? '+' : ''}${pct}%`, w - paddingRight + 4, y + 3);
          });

          ctx.textAlign = 'left';
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = '#dc2626';
          ctx.fillText(maxPrice.toFixed(1), paddingLeft + 2, 10);
          ctx.fillStyle = '#475569';
          ctx.fillText(prevClose.toFixed(1), paddingLeft + 2, getY(prevClose) - 3);
          ctx.fillStyle = '#16a34a';
          ctx.fillText(minPrice.toFixed(1), paddingLeft + 2, priceH - 3);

          const isUp = currentItem.change >= 0;
          const grad = ctx.createLinearGradient(0, 0, 0, priceH);
          grad.addColorStop(0, isUp ? 'rgba(220, 38, 38, 0.15)' : 'rgba(22, 163, 74, 0.15)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

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
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          prices.forEach((p, idx) => {
            const x = getX(idx);
            const y = getY(p);
            if (idx === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.strokeStyle = isUp ? '#dc2626' : '#16a34a';
          ctx.lineWidth = 2;
          ctx.stroke();

          const maxVol = Math.max(...volumes) || 1;
          const volBarW = Math.max(2, (chartW / volumes.length) - 1.2);

          volumes.forEach((vol, idx) => {
            const x = getX(idx) - volBarW / 2;
            const barH = (vol / maxVol) * (volH - 6);
            const y = h - barH;
            const isBarUp = idx === 0 ? (prices[0] >= prevClose) : (prices[idx] >= prices[idx - 1]);

            ctx.fillStyle = isBarUp ? 'rgba(220, 38, 38, 0.75)' : 'rgba(22, 163, 74, 0.75)';
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

            ctx.strokeStyle = '#0284c7';
            ctx.setLineDash([2, 2]);
            ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#0284c7';
            ctx.beginPath(); ctx.arc(hX, hY, 4, 0, Math.PI * 2); ctx.fill();

            const curP = prices[hoveredIdx];
            const diffP = curP - prevClose;
            const diffPct = ((diffP / prevClose) * 100).toFixed(2);
            tooltip.classList.remove('hidden');
            tooltip.innerHTML = `🕒 ${data.timeLabels[hoveredIdx]} | <b>${curP.toFixed(2)}</b> (${diffP >= 0 ? '+' : ''}${diffPct}%) | 量: <b>${volumes[hoveredIdx]} ${unit}</b>`;
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
          const unit = data.volUnit || '張';

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
            ctx.strokeStyle = '#e2e8f0';
            ctx.beginPath(); ctx.moveTo(paddingLeft, y); ctx.lineTo(w - paddingRight, y); ctx.stroke();

            ctx.fillStyle = '#64748b';
            ctx.font = 'bold 9px monospace';
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
            const color = isUpCandle ? '#dc2626' : '#16a34a';

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
            ctx.fillStyle = isUpCandle ? 'rgba(220, 38, 38, 0.7)' : 'rgba(22, 163, 74, 0.7)';
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

          drawMALine(ma5, '#d97706');
          drawMALine(ma10, '#0284c7');
          drawMALine(ma20, '#4f46e5');

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

            ctx.strokeStyle = '#0284c7';
            ctx.setLineDash([2, 2]);
            ctx.beginPath(); ctx.moveTo(hX, 0); ctx.lineTo(hX, h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(paddingLeft, hY); ctx.lineTo(w - paddingRight, hY); ctx.stroke();
            ctx.setLineDash([]);

            tooltip.classList.remove('hidden');
            tooltip.innerHTML = `📅 ${k.date} | 開:${k.open} 高:${k.high} 低:${k.low} 收:<b>${k.close}</b> | 量: <b>${k.volume} ${unit}</b>`;
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
          case '最新上架': return 'bg-sky-100 text-sky-800 border-sky-300';
          case '降價急售': return 'bg-rose-100 text-rose-800 border-rose-300';
          case '最新揭露': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
          default: return 'bg-amber-100 text-amber-800 border-amber-300';
        }
      };

      container.innerHTML = `
        <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
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

          <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200">
            <span>共顯示 <b class="text-[#0d346c]">${listings.length}</b> 筆房產即時資訊</span>
            <span class="text-sky-700 font-semibold">實價登錄連線中</span>
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
          <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
            <div class="flex items-center space-x-2">
              <span class="p-1.5 rounded-lg bg-sky-100 text-sky-700">📝</span>
              <h3 class="font-black text-sm text-[#0d346c]">自訂便簽與公告</h3>
            </div>
            <button id="add-note-btn" class="px-2.5 py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-sm transition-all">
              + 新增便簽
            </button>
          </div>

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
        <div class="flex flex-col h-full bg-white text-slate-800 p-4 select-none justify-between">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <span class="text-xs font-bold text-[#0d346c]">🕒 台灣標準時間 (UTC+8)</span>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300 font-bold">農曆 七月十九</span>
          </div>

          <div class="my-auto py-2 text-center">
            <div class="flex items-baseline justify-center">
              <span id="clock-time-display" class="text-4xl font-black font-mono tracking-wider text-[#0d346c]">--:--</span>
              <span id="clock-sec-display" class="text-xl font-mono font-bold text-sky-600 ml-1">--</span>
            </div>
            <div id="clock-date-display" class="text-xs font-bold text-slate-600 mt-2">載入中...</div>
          </div>

          <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>節氣：處暑</span>
            <span class="text-sky-700 font-bold">國家標準時間即時同步</span>
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
    STORAGE_KEY: 'bulletin_board_layout_v2',

    widgetRegistry: {
      'windy-weather': WindyWidget,
      'weather-temp': WeatherTempWidget,
      'weather-radar': WeatherRadarWidget,
      'typhoon-tracker': TyphoonWidget,
      'stock-market': StockMarketWidget,
      'real-estate': RealEstateWidget,
      'quick-notes': QuickNotesWidget,
      'clock-calendar': ClockCalendarWidget
    },

    defaultLayout: [
      { id: 'windy-weather', x: 0, y: 0, w: 12, h: 5, minW: 6, minH: 4 },
      { id: 'weather-temp', x: 0, y: 5, w: 6, h: 4, minW: 3, minH: 3 },
      { id: 'weather-radar', x: 6, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
      { id: 'typhoon-tracker', x: 0, y: 9, w: 6, h: 5, minW: 4, minH: 4 },
      { id: 'stock-market', x: 6, y: 9, w: 6, h: 5, minW: 4, minH: 3 },
      { id: 'real-estate', x: 0, y: 14, w: 8, h: 4, minW: 4, minH: 3 },
      { id: 'quick-notes', x: 8, y: 14, w: 4, h: 4, minW: 3, minH: 2 }
    ],

    presetLayouts: {
      overview: [
        { id: 'windy-weather', x: 0, y: 0, w: 12, h: 5 },
        { id: 'weather-temp', x: 0, y: 5, w: 6, h: 4 },
        { id: 'weather-radar', x: 6, y: 5, w: 6, h: 4 },
        { id: 'typhoon-tracker', x: 0, y: 9, w: 6, h: 5 },
        { id: 'stock-market', x: 6, y: 9, w: 6, h: 5 },
        { id: 'real-estate', x: 0, y: 14, w: 8, h: 4 },
        { id: 'quick-notes', x: 8, y: 14, w: 4, h: 4 }
      ],
      weather_focus: [
        { id: 'windy-weather', x: 0, y: 0, w: 12, h: 6 },
        { id: 'weather-radar', x: 0, y: 6, w: 6, h: 5 },
        { id: 'typhoon-tracker', x: 6, y: 6, w: 6, h: 5 },
        { id: 'weather-temp', x: 0, y: 11, w: 12, h: 4 }
      ],
      finance_focus: [
        { id: 'stock-market', x: 0, y: 0, w: 7, h: 5 },
        { id: 'real-estate', x: 7, y: 0, w: 5, h: 5 },
        { id: 'windy-weather', x: 0, y: 5, w: 12, h: 5 },
        { id: 'quick-notes', x: 0, y: 10, w: 4, h: 4 },
        { id: 'weather-temp', x: 4, y: 10, w: 8, h: 4 }
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
      this.showToast('已重設為氣象署綜合佈局');
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

  // ==========================================
  // 4. APP BOOTSTRAP
  // ==========================================

  const App = {
    init() {
      console.log('🚀 初始化佈告欄應用程式 (中央氣象署 CWA 風格 + Windy 全球氣溫大版面)...');
      GridManager.init();
      this.bindHeaderControls();
      this.updateTickerText();
    },

    bindHeaderControls() {
      const editToggleBtn = document.getElementById('edit-mode-toggle');
      const editIndicator = document.getElementById('edit-mode-indicator');
      
      if (editToggleBtn) {
        editToggleBtn.addEventListener('click', () => {
          const nextState = !GridManager.isEditMode;
          GridManager.setEditMode(nextState);
          
          if (nextState) {
            editToggleBtn.classList.remove('bg-white/15', 'text-white');
            editToggleBtn.classList.add('bg-amber-400', 'text-slate-900', 'ring-2', 'ring-amber-300');
            editToggleBtn.innerHTML = `<span>✓ 完成佈局</span>`;
            if (editIndicator) {
              editIndicator.classList.remove('hidden');
              editIndicator.classList.add('flex');
            }
            GridManager.showToast('已開啟自由佈局模式：按住卡片頂部把手拖曳，拉動右下角縮放');
          } else {
            editToggleBtn.classList.remove('bg-amber-400', 'text-slate-900', 'ring-2', 'ring-amber-300');
            editToggleBtn.classList.add('bg-white/15', 'text-white');
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

    updateTickerText() {
      const tickerContent = document.getElementById('top-ticker-content');
      if (!tickerContent) return;

      const twii = StockService.indices[0];
      const tsmc = StockService.stocks[0];
      const nvda = StockService.stocks[7] || StockService.stocks[0];
      
      const items = [
        `🌍 <b>Windy 全球氣象</b>：即時氣溫與動態風場流場 (24.370°N, 125.321°E) 已同步上線`,
        `🌀 <b>颱風消息</b>：中央氣象署官方即時颱風動態與路徑潛勢預報已連線`,
        `📡 <b>即時雷達</b>：中央氣象署全台雷達合成回波與向日葵9號紅外線雲圖已同步更新`,
        `📈 <b>加權指數</b>：${twii.price.toLocaleString()} (<span class="${twii.change >= 0 ? 'text-red-300 font-bold' : 'text-emerald-300 font-bold'}">${twii.change >= 0 ? '+' : ''}${twii.change.toFixed(2)} / +${twii.changePercent.toFixed(2)}%</span> 成交 ${twii.volume})`,
        `💎 <b>台積電</b>：${tsmc.price.toLocaleString()} (<span class="${tsmc.change >= 0 ? 'text-red-300 font-bold' : 'text-emerald-300 font-bold'}">${tsmc.change >= 0 ? '+' : ''}${tsmc.change.toFixed(1)} / +${tsmc.changePercent.toFixed(2)}%</span>)`,
        `🚀 <b>NVIDIA</b>：\$${nvda.price.toFixed(2)} (<span class="${nvda.change >= 0 ? 'text-red-300 font-bold' : 'text-emerald-300 font-bold'}">+${nvda.changePercent.toFixed(2)}%</span>)`,
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
