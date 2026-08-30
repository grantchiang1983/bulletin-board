/**
 * Stock Market Service
 * Provides real-time indices, stock quotes, and intraday charts.
 */
export const StockService = {
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

  // Generate realistic intraday tick history for chart
  getIntradayHistory(symbol) {
    const item = [...this.indices, ...this.stocks].find(s => s.symbol === symbol) || this.indices[0];
    const basePrice = item.price - item.change;
    const labels = [];
    const prices = [];
    
    // Intraday 9:00 to 13:30 (5-min intervals)
    let current = basePrice;
    for (let h = 9; h <= 13; h++) {
      const maxM = h === 13 ? 30 : 55;
      for (let m = 0; m <= maxM; m += 10) {
        const timeLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        labels.push(timeLabel);
        
        // Random walk towards target price
        const progress = labels.length / 28;
        const drift = (item.price - basePrice) * progress;
        const noise = (Math.random() - 0.48) * (basePrice * 0.003);
        current = basePrice + drift + noise;
        prices.push(parseFloat(current.toFixed(2)));
      }
    }
    // ensure last price matches
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

  // Simulate small price changes for live ticker
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
