import { GridManager } from './grid-manager.js';
import { StockService } from './services/stock-service.js';

export const AuthManager = {
  DEFAULT_HASH: '1629a589b2b16f26d423e8592eb08ec72b21b8c8e76b30f690f9aac7ea5f6b7f', // Default SHA-256 hash

  async sha256(str) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const buf = new TextEncoder().encode(str);
        const digest = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        console.warn('SubtleCrypto fallback:', e);
      }
    }
    return this.fallbackSha256(str);
  },

  fallbackSha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let lengthProperty = 'length';
    let i, j;
    let result = '';
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    ascii += '\x80';
    while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii[lengthProperty]; i++) {
      j = ascii.charCodeAt(i);
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
    words[words[lengthProperty]] = (asciiBitLength);

    for (j = 0; j < words[lengthProperty];) {
      const w = words.slice(j, j += 16);
      const oldHash = hash;
      hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const s0 = (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3));
        const s1 = (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10));
        w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;
        const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
        const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
        const sigma0 = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
        const sigma1 = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
        const temp1 = hash[7] + sigma1 + ch + k[i] + w[i];
        const temp2 = sigma0 + maj;
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
    }
    for (i = 0; i < 8; i++) {
      for (let b = 3; b >= 0; b--) {
        const byte = (hash[i] >> (b * 8)) & 255;
        result += (byte < 16 ? '0' : '') + byte.toString(16);
      }
    }
    return result;
  },

  getCurrentHash() {
    return localStorage.getItem('bulletin_password_hash') || this.DEFAULT_HASH;
  },

  isAuthenticated() {
    const token = localStorage.getItem('bulletin_auth_token') || sessionStorage.getItem('bulletin_auth_token');
    return !!token && token === this.getCurrentHash();
  },

  async verifyPassword(pwd) {
    if (!pwd) return false;
    const hash = await this.sha256(pwd);
    return hash === this.getCurrentHash();
  },

  login(remember = true) {
    const currentHash = this.getCurrentHash();
    if (remember) {
      localStorage.setItem('bulletin_auth_token', currentHash);
    } else {
      sessionStorage.setItem('bulletin_auth_token', currentHash);
    }
  },

  logout() {
    localStorage.removeItem('bulletin_auth_token');
    sessionStorage.removeItem('bulletin_auth_token');
    location.reload();
  },

  async changePassword(oldPwd, newPwd) {
    const isOldValid = await this.verifyPassword(oldPwd);
    if (!isOldValid) {
      return { success: false, error: '目前密碼不正確' };
    }
    if (!newPwd || newPwd.length > 26) {
      return { success: false, error: '新密碼長度必須在 1 到 26 個字元之間' };
    }
    const newHash = await this.sha256(newPwd);
    localStorage.setItem('bulletin_password_hash', newHash);
    if (localStorage.getItem('bulletin_auth_token')) {
      localStorage.setItem('bulletin_auth_token', newHash);
    }
    if (sessionStorage.getItem('bulletin_auth_token')) {
      sessionStorage.setItem('bulletin_auth_token', newHash);
    }
    return { success: true };
  }
};

export const App = {
  isDashboardStarted: false,

  init() {
    console.log('🚀 初始化佈告欄應用程式 (安全防護模式)...');

    const lockOverlay = document.getElementById('lock-screen-overlay');
    const dashboardWrapper = document.getElementById('dashboard-wrapper');

    if (AuthManager.isAuthenticated()) {
      if (lockOverlay) lockOverlay.classList.add('hidden');
      if (dashboardWrapper) dashboardWrapper.classList.remove('hidden');
      this.startDashboard();
    } else {
      if (lockOverlay) lockOverlay.classList.remove('hidden');
      if (dashboardWrapper) dashboardWrapper.classList.add('hidden');
      this.bindLockScreenEvents();
    }
  },

  startDashboard() {
    if (this.isDashboardStarted) return;
    this.isDashboardStarted = true;

    GridManager.init();
    this.bindHeaderControls();
    this.bindPasswordModalControls();
    this.startLiveEngines();
  },

  bindLockScreenEvents() {
    const form = document.getElementById('lock-screen-form');
    const input = document.getElementById('lock-password-input');
    const toggle = document.getElementById('lock-toggle-visibility');
    const errorMsg = document.getElementById('lock-error-msg');
    const rememberCheck = document.getElementById('lock-remember-device');
    const lockOverlay = document.getElementById('lock-screen-overlay');
    const dashboardWrapper = document.getElementById('dashboard-wrapper');
    const submitBtn = document.getElementById('lock-submit-btn');

    if (toggle && input) {
      toggle.addEventListener('click', () => {
        if (input.type === 'password') {
          input.type = 'text';
          toggle.textContent = '🙈';
        } else {
          input.type = 'password';
          toggle.textContent = '👁️';
        }
      });
    }

    if (form && input) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const pwd = input.value.trim();
        if (errorMsg) errorMsg.classList.add('hidden');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>驗證中...</span>';
        }

        const isValid = await AuthManager.verifyPassword(pwd);

        if (isValid) {
          AuthManager.login(rememberCheck ? rememberCheck.checked : true);
          if (lockOverlay) lockOverlay.classList.add('hidden');
          if (dashboardWrapper) dashboardWrapper.classList.remove('hidden');
          App.startDashboard();
        } else {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>解鎖進入儀表板</span><span>➔</span>';
          }
          if (errorMsg) {
            errorMsg.classList.remove('hidden');
          }
          input.classList.add('border-rose-500', 'animate-shake');
          setTimeout(() => {
            input.classList.remove('animate-shake');
          }, 400);
          input.select();
        }
      });
    }
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

    // Change Password Button
    const changePwdBtn = document.getElementById('change-pwd-btn');
    const changePwdModal = document.getElementById('change-pwd-modal');
    if (changePwdBtn && changePwdModal) {
      changePwdBtn.addEventListener('click', () => {
        changePwdModal.classList.remove('hidden');
        const currInput = document.getElementById('input-current-pwd');
        if (currInput) {
          currInput.value = '';
          currInput.focus();
        }
        const newInput = document.getElementById('input-new-pwd');
        if (newInput) newInput.value = '';
        const confirmInput = document.getElementById('input-confirm-pwd');
        if (confirmInput) confirmInput.value = '';
        const counter = document.getElementById('new-pwd-counter');
        if (counter) counter.textContent = '0/26 字';
        const errBox = document.getElementById('change-pwd-error');
        if (errBox) errBox.classList.add('hidden');
      });
    }

    // Lock App Button
    const lockAppBtn = document.getElementById('lock-app-btn');
    if (lockAppBtn) {
      lockAppBtn.addEventListener('click', () => {
        if (confirm('確定要立即鎖定儀表板嗎？')) {
          AuthManager.logout();
        }
      });
    }
  },

  bindPasswordModalControls() {
    const changePwdModal = document.getElementById('change-pwd-modal');
    const closeBtn = document.getElementById('close-pwd-modal');
    const cancelBtn = document.getElementById('cancel-pwd-btn');
    const form = document.getElementById('change-pwd-form');
    const newInput = document.getElementById('input-new-pwd');
    const newCounter = document.getElementById('new-pwd-counter');
    const toggleNew = document.getElementById('toggle-new-pwd');
    const errBox = document.getElementById('change-pwd-error');

    const closeModal = () => {
      if (changePwdModal) changePwdModal.classList.add('hidden');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (changePwdModal) {
      changePwdModal.addEventListener('click', (e) => {
        if (e.target === changePwdModal) closeModal();
      });
    }

    if (newInput && newCounter) {
      newInput.addEventListener('input', () => {
        newCounter.textContent = `${newInput.value.length}/26 字`;
      });
    }

    if (toggleNew && newInput) {
      toggleNew.addEventListener('click', () => {
        if (newInput.type === 'password') {
          newInput.type = 'text';
          toggleNew.textContent = '🙈';
        } else {
          newInput.type = 'password';
          toggleNew.textContent = '👁️';
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currPwd = document.getElementById('input-current-pwd').value.trim();
        const newPwd = document.getElementById('input-new-pwd').value.trim();
        const confirmPwd = document.getElementById('input-confirm-pwd').value.trim();

        if (errBox) errBox.classList.add('hidden');

        if (newPwd !== confirmPwd) {
          if (errBox) {
            errBox.textContent = '⚠️ 兩次輸入的新密碼不相符，請重新確認。';
            errBox.classList.remove('hidden');
          }
          return;
        }

        if (newPwd.length < 1 || newPwd.length > 26) {
          if (errBox) {
            errBox.textContent = '⚠️ 新密碼長度必須在 1 到 26 個字元之間。';
            errBox.classList.remove('hidden');
          }
          return;
        }

        const res = await AuthManager.changePassword(currPwd, newPwd);
        if (res.success) {
          closeModal();
          GridManager.showToast('✓ 密碼修改成功！新密碼已安全啟用。');
        } else {
          if (errBox) {
            errBox.textContent = `⚠️ ${res.error || '目前密碼輸入錯誤'}`;
            errBox.classList.remove('hidden');
          }
        }
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

