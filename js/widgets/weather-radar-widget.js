import { WeatherService } from '../services/weather-service.js';

export const WeatherRadarWidget = {
  id: 'weather-radar',
  title: '天氣雷達雲圖與雨量觀測',
  icon: 'radar',
  defaultWidth: 6,
  defaultHeight: 4,
  minWidth: 4,
  minHeight: 3,

  render(container, state = { activeLayer: 'radar_echo', isPlaying: true, frameIdx: 1, timer: null }) {
    const layers = WeatherService.getRadarLayers();
    const currentLayer = layers.find(l => l.id === state.activeLayer) || layers[0];

    container.innerHTML = `
      <div class="flex flex-col h-full bg-slate-900 text-slate-100 p-3 select-none overflow-hidden relative">
        <!-- Top Toolbar -->
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

        <!-- Radar Canvas Display Area -->
        <div class="relative flex-1 my-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group">
          <!-- Animated Radar Canvas Background -->
          <canvas id="radar-canvas" class="w-full h-full object-cover"></canvas>
          
          <!-- Radar Sweep Ring Overlays -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div class="w-72 h-72 border border-emerald-500/20 rounded-full"></div>
            <div class="w-48 h-48 border border-emerald-500/25 rounded-full"></div>
            <div class="w-24 h-24 border border-emerald-500/30 rounded-full"></div>
            <div class="absolute w-full h-[1px] bg-emerald-500/20"></div>
            <div class="absolute h-full w-[1px] bg-emerald-500/20"></div>
          </div>

          <!-- Taiwan Outline & Region Markers Overlay -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div class="text-center font-bold text-emerald-400/80 text-xs translate-x-2 -translate-y-4">
              [ 台灣海峽與本島防護區 ]
              <div class="text-[10px] text-slate-400 font-normal mt-0.5">北部 28°C ‧ 中部 29°C ‧ 南部 31°C</div>
            </div>
          </div>

          <!-- Radar Echo Intensity Legend -->
          <div class="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[10px] flex items-center space-x-1.5 pointer-events-none">
            <span class="text-slate-400">回波強度:</span>
            <div class="flex h-2 w-24 rounded overflow-hidden">
              <span class="flex-1 bg-cyan-400" title="10-20 dBZ"></span>
              <span class="flex-1 bg-blue-500" title="20-30 dBZ"></span>
              <span class="flex-1 bg-green-500" title="30-40 dBZ"></span>
              <span class="flex-1 bg-yellow-400" title="40-50 dBZ"></span>
              <span class="flex-1 bg-orange-500" title="50-60 dBZ"></span>
              <span class="flex-1 bg-red-600" title="60+ dBZ (強降水)"></span>
            </div>
            <span class="text-slate-300 font-mono text-[9px]">dBZ</span>
          </div>

          <!-- Timestamp Overlay -->
          <div class="absolute top-2 right-2 bg-slate-900/90 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[11px] font-mono text-cyan-300">
            🕒 <span id="radar-time-display">2026-08-30 22:00 (最新)</span>
          </div>
        </div>

        <!-- Playback Controller -->
        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center space-x-2">
            <button id="radar-play-toggle" class="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
              <span id="play-icon-label">${state.isPlaying ? '⏸ 暫停' : '▶ 播放'}</span>
            </button>
            <span class="text-slate-400 text-[11px]">動態雲圖循環播放 (60fps)</span>
          </div>

          <div class="flex items-center space-x-2 text-slate-400">
            <label class="text-[11px]">回波透明度</label>
            <input type="range" id="radar-opacity" min="30" max="100" value="85" class="w-20 accent-blue-500 cursor-pointer">
          </div>
        </div>
      </div>
    `;

    // Initialize HTML5 Radar Canvas Drawing Loop
    const canvas = container.querySelector('#radar-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let angle = 0;
      let animId;

      // Echo cloud blobs simulation for authentic radar experience
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

        // Draw dark nautical map grid
        ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // Draw Taiwan Island stylized contour
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

        // Draw Weather Echo Blobs with subtle pulse
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

        // Draw Sweep Scanner Line
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

        animId = requestAnimationFrame(draw);
      };

      draw();
      window.addEventListener('resize', resizeCanvas);
    }

    // Bind layer switches
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
