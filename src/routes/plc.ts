import type { Context } from 'hono'
import type { Bindings, PlcTank } from '../types'
import { PlcService } from '../services/plcService'
import { layout, errorPage } from '../views/layout'
import { getTankStatusBadge, getTankStatusText } from '../utils/helpers'

// ─── PLC 원료 혼합 대시보드 ───────────────────────────────────────────────────
export async function plcMixingHandler(c: Context<{ Bindings: Bindings }>) {
  try {
    const tanks = await new PlcService(c.env.DB).getAllTanks()
    return c.html(plcMixingView(tanks))
  } catch (e: any) {
    return c.html(errorPage('PLC 데이터 로드 실패: ' + e.message), 500)
  }
}

// ─── PLC 탱크 상세 ─────────────────────────────────────────────────────────────
export async function plcTankDetailHandler(c: Context<{ Bindings: Bindings }>) {
  try {
    const svc = new PlcService(c.env.DB)
    const tank = await svc.getTank(c.req.param('tankId'))
    if (!tank) return c.html(errorPage('탱크를 찾을 수 없습니다'), 404)
    const history = await svc.getSensorHistory(tank.id, 60)
    return c.html(plcTankDetailView(tank, history))
  } catch (e: any) {
    return c.html(errorPage('탱크 상세 로드 실패: ' + e.message), 500)
  }
}

// ─── PLC 혼합 뷰 ──────────────────────────────────────────────────────────────
function plcMixingView(tanks: PlcTank[]): string {
  const mixing = tanks.filter(t => t.status === 'mixing').length

  const body = /* html */`
  <div class="flex items-center justify-between mb-6">
    <div>
      <div class="flex items-center gap-2 text-cyan-400 text-sm mb-1">
        <i class="fas fa-arrow-left"></i>
        <a href="/" class="hover:text-white">대시보드</a>
        <span class="text-slate-600">/</span>
        <span>PLC 원료 혼합</span>
      </div>
      <h1 class="text-2xl font-bold text-white">원료 혼합 구역 <span class="text-cyan-400">PLC 연동</span></h1>
      <p class="text-slate-400 text-sm mt-1">Zone A · 수상·유상·균질화 탱크 실시간 모니터링</p>
    </div>
    <div class="text-right">
      <div class="text-xs text-slate-500">활성 혼합</div>
      <div class="text-3xl font-bold text-cyan-400">${mixing}<span class="text-sm text-slate-400">/${tanks.length}</span></div>
    </div>
  </div>

  <!-- 탱크 카드 그리드 -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
    ${tanks.map(t => /* html */`
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-cyan-700 transition-colors cursor-pointer"
         onclick="location.href='/plc/mixing/${t.id}'">
      <div class="flex items-start justify-between mb-4">
        <div>
          <div class="font-mono text-xs text-slate-500">${t.id}</div>
          <div class="font-semibold text-white mt-0.5">${t.name}</div>
          <div class="text-xs text-slate-400 mt-0.5">${t.recipe}</div>
        </div>
        <span class="px-2 py-1 rounded text-xs font-medium ${getTankStatusBadge(t.status)}">
          ${getTankStatusText(t.status)}
        </span>
      </div>

      <!-- 게이지들 -->
      <div class="space-y-3">
        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span><i class="fas fa-thermometer-half text-red-400 mr-1"></i>온도</span>
            <span class="font-mono text-white">${t.temperature.toFixed(1)} °C</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div class="h-1.5 rounded-full bg-red-500" style="width:${Math.min((t.temperature/100)*100,100)}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span><i class="fas fa-gauge text-blue-400 mr-1"></i>압력</span>
            <span class="font-mono text-white">${t.pressure.toFixed(2)} bar</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div class="h-1.5 rounded-full bg-blue-500" style="width:${Math.min((t.pressure/5)*100,100)}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span><i class="fas fa-circle-nodes text-green-400 mr-1"></i>교반 RPM</span>
            <span class="font-mono text-white">${t.agitation_speed} rpm</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div class="h-1.5 rounded-full bg-green-500" style="width:${Math.min((t.agitation_speed/5000)*100,100)}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs text-slate-400 mb-1">
            <span><i class="fas fa-fill text-cyan-400 mr-1"></i>충진량</span>
            <span class="font-mono text-white">${t.fill_level.toFixed(0)} %</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5">
            <div class="h-1.5 rounded-full bg-cyan-500" style="width:${t.fill_level}%"></div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-xs text-slate-500">
          배치: <span class="font-mono text-slate-400">${t.batch_id}</span>
        </div>
        <div class="text-xs text-cyan-400 hover:text-white">
          상세 보기 <i class="fas fa-arrow-right ml-1"></i>
        </div>
      </div>
    </div>`).join('')}
  </div>

  <!-- 실시간 데이터 갱신 -->
  <div class="bg-slate-800 rounded-xl border border-slate-700 p-4 flex items-center justify-between">
    <div class="flex items-center gap-3 text-sm text-slate-400">
      <div class="w-2 h-2 bg-cyan-400 rounded-full pulse-dot"></div>
      D1 데이터베이스 연동 · 실시간 갱신
    </div>
    <button onclick="location.reload()" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors">
      <i class="fas fa-refresh mr-1"></i> 새로고침
    </button>
  </div>
  `

  return layout('PLC 원료 혼합', body)
}

// ─── 탱크 상세 뷰 ─────────────────────────────────────────────────────────────
function plcTankDetailView(tank: PlcTank, history: any[]): string {
  const tempLabels = history.map((_, i) => `${i}분전`).reverse()
  const tempData = history.map(h => h.temperature)
  const pressData = history.map(h => h.pressure)
  const rpmData = history.map(h => h.agitation_speed)

  const body = /* html */`
  <div class="flex items-center gap-2 text-cyan-400 text-sm mb-4">
    <a href="/plc/mixing" class="hover:text-white flex items-center gap-1">
      <i class="fas fa-arrow-left"></i> PLC 혼합 구역
    </a>
    <span class="text-slate-600">/</span>
    <span class="text-white">${tank.id} · ${tank.name}</span>
  </div>

  <!-- 상단 상태바 -->
  <div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-6">
    <div class="flex items-start justify-between mb-4">
      <div>
        <h1 class="text-xl font-bold text-white">${tank.name}</h1>
        <div class="text-slate-400 text-sm mt-0.5">${tank.recipe} · 배치: <span class="font-mono">${tank.batch_id}</span></div>
      </div>
      <span class="px-3 py-1.5 rounded-lg text-sm font-medium ${getTankStatusBadge(tank.status)}">
        ${getTankStatusText(tank.status)}
      </span>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold font-mono text-red-400">${tank.temperature.toFixed(1)}<span class="text-sm">°C</span></div>
        <div class="text-xs text-slate-500 mt-1">온도 (PV)</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold font-mono text-blue-400">${tank.pressure.toFixed(2)}<span class="text-sm">bar</span></div>
        <div class="text-xs text-slate-500 mt-1">압력 (PV)</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold font-mono text-green-400">${tank.agitation_speed}<span class="text-sm">rpm</span></div>
        <div class="text-xs text-slate-500 mt-1">교반 속도</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold font-mono text-cyan-400">${tank.fill_level.toFixed(0)}<span class="text-sm">%</span></div>
        <div class="text-xs text-slate-500 mt-1">충진 레벨</div>
      </div>
    </div>
  </div>

  <!-- 트렌드 차트 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div class="text-sm font-medium text-white mb-3"><i class="fas fa-thermometer-half text-red-400 mr-2"></i>온도 트렌드</div>
      <canvas id="tempChart" height="120"></canvas>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div class="text-sm font-medium text-white mb-3"><i class="fas fa-gauge text-blue-400 mr-2"></i>압력 트렌드</div>
      <canvas id="pressChart" height="120"></canvas>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div class="text-sm font-medium text-white mb-3"><i class="fas fa-circle-nodes text-green-400 mr-2"></i>RPM 트렌드</div>
      <canvas id="rpmChart" height="120"></canvas>
    </div>
  </div>

  <!-- 운영 정보 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 class="font-semibold text-white mb-3"><i class="fas fa-user-cog text-purple-400 mr-2"></i>운영 정보</h3>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-slate-400">담당자</span><span class="text-white">${tank.operator}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">배치 ID</span><span class="font-mono text-white">${tank.batch_id}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">레시피</span><span class="font-mono text-white">${tank.recipe}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">공정 단계</span><span class="text-white">${tank.phase}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">시작 시간</span><span class="text-white">${tank.start_time}</span></div>
        <div class="flex justify-between"><span class="text-slate-400">잔여 시간</span><span class="text-cyan-400">${tank.time_remaining}분</span></div>
      </div>
    </div>
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 class="font-semibold text-white mb-3"><i class="fas fa-database text-cyan-400 mr-2"></i>센서 이력 (${history.length}건)</h3>
      <div class="overflow-y-auto max-h-40 space-y-1">
        ${history.slice(0,10).map(h => /* html */`
        <div class="flex justify-between text-xs bg-slate-900/50 rounded px-2 py-1">
          <span class="font-mono text-slate-500">${h.recorded_at ? new Date(h.recorded_at).toLocaleTimeString('ko-KR') : '—'}</span>
          <span class="text-red-400">${h.temperature?.toFixed(1)}°C</span>
          <span class="text-blue-400">${h.pressure?.toFixed(2)}bar</span>
          <span class="text-green-400">${h.agitation_speed}rpm</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <script>
    const labels = ${JSON.stringify(tempLabels)};
    const cfg = (data, color, label) => ({
      type: 'line',
      data: { labels, datasets: [{ label, data, borderColor: color, borderWidth: 1.5, pointRadius: 0, tension: 0.4, fill: true, backgroundColor: color + '18' }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: {
        x: { display: false },
        y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { color: '#1e293b' } }
      }}
    });
    new Chart(document.getElementById('tempChart'), cfg(${JSON.stringify(tempData)}, '#f87171', '온도'));
    new Chart(document.getElementById('pressChart'), cfg(${JSON.stringify(pressData)}, '#60a5fa', '압력'));
    new Chart(document.getElementById('rpmChart'), cfg(${JSON.stringify(rpmData)}, '#4ade80', 'RPM'));
  </script>
  `
  return layout(`${tank.id} 상세`, body)
}
