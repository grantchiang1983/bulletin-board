/**
 * Real Estate & Housing Service
 * Provides latest property listings, transaction records, and price analytics.
 */
export const RealEstateService = {
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
      date: '10分鐘前',
      views: 342
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
      date: '35分鐘前',
      views: 520
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
      date: '1小時前',
      views: 780
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
      date: '本週登錄',
      views: 1210
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
      date: '2小時前',
      views: 640
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
      date: '3小時前',
      views: 410
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
      date: '4小時前',
      views: 290
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
      date: '本週登錄',
      views: 930
    }
  ],

  // Filter listings
  getListings(filters = {}) {
    let result = [...this.listings];
    
    if (filters.city && filters.city !== 'all') {
      result = result.filter(item => item.city === filters.city);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
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
      if (filters.sortBy === 'price_asc') {
        result.sort((a, b) => a.totalPrice - b.totalPrice);
      } else if (filters.sortBy === 'price_desc') {
        result.sort((a, b) => b.totalPrice - a.totalPrice);
      } else if (filters.sortBy === 'unit_price') {
        result.sort((a, b) => b.unitPrice - a.unitPrice);
      } else if (filters.sortBy === 'size') {
        result.sort((a, b) => b.size - a.size);
      }
    }
    return result;
  },

  getCities() {
    return ['全部縣市', '台北市', '新北市', '桃園市', '台中市', '高雄市', '新竹市'];
  }
};
