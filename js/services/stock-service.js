/**
 * Stock Market Service
 * Provides realistic Taiwan & Global indices, stock quotes, intraday ticks, and daily K-line candlestick data.
 */
export const StockService = {
  indices: [
    { symbol: '^TWII', name: '加權指數 (台股)', price: 23420.50, prevClose: 23252.18, change: 168.32, changePercent: 0.72, open: 23290.10, high: 23485.60, low: 23265.40, volume: '4,120 億' },
    { symbol: '^TWOII', name: '櫃買指數 (OTC)', price: 272.85, prevClose: 274.00, change: -1.15, changePercent: -0.42, open: 274.20, high: 274.80, low: 271.80, volume: '980 億' },
    { symbol: '^DJI', name: '道瓊工業指數', price: 41250.80, prevClose: 41022.75, change: 228.05, changePercent: 0.56, open: 41080.00, high: 41380.00, low: 41050.20, volume: '3.8 億股' },
    { symbol: '^IXIC', name: '那斯達克指數', price: 17820.60, prevClose: 17635.20, change: 185.40, changePercent: 1.05, open: 17680.00, high: 17890.50, low: 17660.30, volume: '45.2 億股' },
    { symbol: '^GSPC', name: '標普 500 指數', price: 5630.25, prevClose: 5591.65, change: 38.60, changePercent: 0.69, open: 5605.00, high: 5645.10, low: 5598.80, volume: '24.1 億股' }
  ],

  stocks: [
    { symbol: '2330', name: '台積電', price: 985.0, prevClose: 970.0, change: 15.0, changePercent: 1.55, open: 975.0, high: 990.0, low: 972.0, volume: '32,540 張', category: '半導體' },
    { symbol: '2454', name: '聯發科', price: 1250.0, prevClose: 1225.0, change: 25.0, changePercent: 2.04, open: 1230.0, high: 1265.0, low: 1225.0, volume: '6,820 張', category: 'IC設計' },
    { symbol: '2317', name: '鴻海', price: 184.5, prevClose: 186.5, change: -2.0, changePercent: -1.07, open: 187.0, high: 188.0, low: 183.5, volume: '48,120 張', category: '組裝代工' },
    { symbol: '2382', name: '廣達', price: 282.0, prevClose: 275.5, change: 6.5, changePercent: 2.36, open: 276.0, high: 285.0, low: 275.0, volume: '19,300 張', category: 'AI伺服器' },
    { symbol: '2308', name: '台達電', price: 410.0, prevClose: 402.0, change: 8.0, changePercent: 1.99, open: 404.0, high: 415.0, low: 402.0, volume: '8,410 張', category: '電源供應' },
    { symbol: '2881', name: '富邦金', price: 88.6, prevClose: 87.8, change: 0.8, changePercent: 0.91, open: 87.9, high: 89.2, low: 87.8, volume: '21,500 張', category: '金融保險' },
    { symbol: 'NVDA', name: 'NVIDIA (輝達)', price: 128.50, prevClose: 124.65, change: 3.85, changePercent: 3.09, open: 125.00, high: 130.20, low: 124.80, volume: '58.4M', category: '美股AI' },
    { symbol: 'TSM', name: '台積電 ADR', price: 172.80, prevClose: 169.60, change: 3.20, changePercent: 1.89, open: 170.20, high: 174.50, low: 169.80, volume: '12.8M', category: '美股ADR' }
  ],

  // Generate realistic Intraday Tick Series (09:00 - 13:30) with VWAP & Volumes
  getIntradayHistory(symbol) {
    const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
    const prevClose = item.prevClose || (item.price - item.change);
    const openPrice = item.open || prevClose;
    const targetPrice = item.price;
    
    const points = [];
    const timeLabels = [];
    const volumes = [];
    const vwap = []; // Volume weighted average price

    let currentPrice = openPrice;
    let totalVolume = 0;
    let totalAmount = 0;

    // 54 points: 9:00, 9:05, ..., 13:30 (5-min intervals)
    let stepCount = 0;
    for (let h = 9; h <= 13; h++) {
      const maxM = (h === 13) ? 30 : 55;
      for (let m = 0; m <= maxM; m += 5) {
        stepCount++;
        const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        timeLabels.push(timeStr);

        // Progress from 0 to 1
        const t = stepCount / 55;
        
        // Target trend + intraday wave oscillations
        const trend = openPrice + (targetPrice - openPrice) * t;
        const wave = Math.sin(t * Math.PI * 3.5) * (prevClose * 0.004) + Math.cos(t * Math.PI * 5) * (prevClose * 0.002);
        const noise = (Math.sin(stepCount * 17.3) * 0.5 + Math.cos(stepCount * 7.1) * 0.5) * (prevClose * 0.0025);
        
        if (stepCount === 55) {
          currentPrice = targetPrice;
        } else {
          currentPrice = trend + wave + noise;
        }
        currentPrice = parseFloat(currentPrice.toFixed(2));
        points.push(currentPrice);

        // Volume calculation (U-shaped intraday curve: heavy at open and close)
        const uFactor = Math.pow(t - 0.5, 2) * 4; // 1 at open/close, 0 at midday
        const vol = Math.max(10, Math.round((500 + uFactor * 1200 + Math.random() * 300) * (item.price > 500 ? 0.3 : 1.5)));
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

  // Generate 30 trading days of realistic Daily K-Lines (Candlesticks) with MA5, MA10, MA20
  getDailyKLines(symbol) {
    const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
    const base = item.price;
    const klines = [];
    const days = 30;

    let prevC = base * 0.92;
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
        const delta = (Math.sin(i * 0.6) * 0.018 + (Math.random() - 0.48) * 0.015);
        c = parseFloat((prevC * (1 + delta)).toFixed(2));
        o = parseFloat((prevC * (1 + (Math.random() - 0.5) * 0.008)).toFixed(2));
        h = parseFloat((Math.max(o, c) * (1 + Math.random() * 0.012)).toFixed(2));
        l = parseFloat((Math.min(o, c) * (1 - Math.random() * 0.012)).toFixed(2));
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

    // Calculate MA5, MA10, MA20
    const ma5 = [];
    const ma10 = [];
    const ma20 = [];

    for (let i = 0; i < klines.length; i++) {
      // MA5
      if (i >= 4) {
        const sum5 = klines.slice(i - 4, i + 1).reduce((acc, k) => acc + k.close, 0);
        ma5.push(parseFloat((sum5 / 5).toFixed(2)));
      } else {
        ma5.push(null);
      }
      // MA10
      if (i >= 9) {
        const sum10 = klines.slice(i - 9, i + 1).reduce((acc, k) => acc + k.close, 0);
        ma10.push(parseFloat((sum10 / 10).toFixed(2)));
      } else {
        ma10.push(null);
      }
      // MA20
      if (i >= 19) {
        const sum20 = klines.slice(i - 19, i + 1).reduce((acc, k) => acc + k.close, 0);
        ma20.push(parseFloat((sum20 / 20).toFixed(2)));
      } else {
        ma20.push(null);
      }
    }

    return {
      symbol: item.symbol,
      name: item.name,
      klines,
      ma5,
      ma10,
      ma20
    };
  },

  tickLivePrices() {
    this.stocks.forEach(stock => {
      const delta = (Math.random() - 0.49) * (stock.price * 0.001);
      stock.price = parseFloat((stock.price + delta).toFixed(2));
      stock.change = parseFloat((stock.price - stock.prevClose).toFixed(2));
      stock.changePercent = parseFloat(((stock.change / stock.prevClose) * 100).toFixed(2));
      if (stock.price > stock.high) stock.high = stock.price;
      if (stock.price < stock.low) stock.low = stock.price;
    });
    const twIndex = this.indices[0];
    const indexDelta = (Math.random() - 0.48) * 8;
    twIndex.price = parseFloat((twIndex.price + indexDelta).toFixed(2));
    twIndex.change = parseFloat((twIndex.price - twIndex.prevClose).toFixed(2));
    twIndex.changePercent = parseFloat(((twIndex.change / twIndex.prevClose) * 100).toFixed(2));
    if (twIndex.price > twIndex.high) twIndex.high = twIndex.price;
    if (twIndex.price < twIndex.low) twIndex.low = twIndex.price;
  }
};
