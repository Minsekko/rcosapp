import { layout } from './layout'
import { getRobotStatusDot, getRobotStatusText, getRobotStatusBadge, getAlarmIcon, getAlarmBadge, getOrderStatusBadge, getOrderStatusText, getOrderTypeBadge, getOrderTypeText, getEfficiencyColor, fmt, pct } from '../utils/helpers'
import type { Robot, Alarm, Order, TodayStats, ProductionLine } from '../types'

export function dashboardView(
  robots: Robot[],
  alarms: Alarm[],
  orders: Order[],
  stats: TodayStats,
  lines: ProductionLine[],
): string {
  const running = robots.filter(r => r.status === 'running').length
  const maintenance = robots.filter(r => r.status === 'maintenance').length
  const industrial = robots.filter(r => r.type === 'industrial').length
  const cobots = robots.filter(r => r.type === 'cobot').length

  const body = /* html */`
  <!-- 헤더 -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-white">통합 대시보드</h1>
      <p class="text-slate-400 text-sm mt-1">화장품 충진공장 하이브리드 자동화 시스템 · Cloudflare D1 연동</p>
    </div>
    <div class="flex items-center gap-2 text-sm text-slate-400">
      <div class="w-2 h-2 bg-green-400 rounded-full pulse-dot"></div>
      실시간 연결됨
    </div>
  </div>

  <!-- KPI 카드 -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="text-slate-400 text-xs mb-1">오늘 총 생산량</div>
      <div class="text-2xl font-bold text-white">${fmt(stats.total)}<span class="text-sm text-slate-400 ml-1">병</span></div>
      <div class="text-xs text-slate-500 mt-1">목표 ${fmt(stats.target)} · ${pct(stats.total, stats.target)}%</div>
    </div>
    <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="text-slate-400 text-xs mb-1">설비 가동률</div>
      <div class="text-2xl font-bold ${getEfficiencyColor(stats.efficiency)}">${stats.efficiency}<span class="text-sm ml-1">%</span></div>
      <div class="text-xs text-slate-500 mt-1">불량률 ${stats.defectRate}% (${fmt(stats.defect)}개)</div>
    </div>
    <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="text-slate-400 text-xs mb-1">로봇 가동 현황</div>
      <div class="text-2xl font-bold text-white">${running}<span class="text-sm text-slate-400 ml-1">/ ${robots.length}</span></div>
      <div class="text-xs text-slate-500 mt-1">산업용 ${industrial}기 · 협동 ${cobots}기</div>
    </div>
    <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="text-slate-400 text-xs mb-1">정비중 로봇</div>
      <div class="text-2xl font-bold text-yellow-400">${maintenance}<span class="text-sm text-slate-400 ml-1">기</span></div>
      <div class="text-xs text-slate-500 mt-1">활성 알람 ${alarms.filter(a=>a.level==='error').length}건</div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <!-- 생산 라인 현황 -->
    <div class="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-5">
      <h3 class="font-semibold text-white mb-4"><i class="fas fa-chart-line text-blue-400 mr-2"></i>생산 라인 현황</h3>
      <div class="space-y-3">
        ${lines.map(l => {
          const p = pct(l.count, l.target)
          return /* html */`
          <div class="bg-slate-900/50 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <div>
                <span class="text-white text-sm font-medium">${l.name}</span>
                <span class="text-slate-500 text-xs ml-2">${l.product}</span>
              </div>
              <span class="text-xs font-mono text-slate-400">${fmt(l.count)} / ${fmt(l.target)}</span>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-1.5">
              <div class="h-1.5 rounded-full ${p>=100?'bg-blue-500':p>=80?'bg-green-500':p>=60?'bg-yellow-500':'bg-red-500'}" style="width:${Math.min(p,100)}%"></div>
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-xs text-slate-500">${p}% 달성</span>
              <span class="text-xs text-slate-500">${l.speed} 병/분</span>
            </div>
          </div>`
        }).join('')}
      </div>
    </div>

    <!-- 활성 알람 -->
    <div class="bg-slate-800 rounded-xl border border-slate-700 p-5">
      <h3 class="font-semibold text-white mb-4"><i class="fas fa-bell text-red-400 mr-2"></i>활성 알람</h3>
      <div class="space-y-2">
        ${alarms.slice(0,5).map(a => /* html */`
        <div class="bg-slate-900/50 rounded-lg p-3">
          <div class="flex items-start gap-2">
            <i class="fas ${getAlarmIcon(a.level)} mt-0.5 text-sm"></i>
            <div class="flex-1 min-w-0">
              <div class="text-xs text-slate-400 font-mono">${a.time} · ${a.zone}</div>
              <div class="text-sm text-slate-200 leading-snug mt-0.5">${a.message}</div>
              <div class="text-xs text-slate-500 mt-0.5">${a.robot}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- 로봇 상태 테이블 -->
  <div class="bg-slate-800 rounded-xl border border-slate-700 p-5 mb-6">
    <h3 class="font-semibold text-white mb-4"><i class="fas fa-robot text-purple-400 mr-2"></i>로봇 전체 현황 (${robots.length}기)</h3>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-slate-400 text-xs border-b border-slate-700">
            <th class="pb-2 text-left">ID</th>
            <th class="pb-2 text-left">이름</th>
            <th class="pb-2 text-left">구역</th>
            <th class="pb-2 text-left">유형</th>
            <th class="pb-2 text-left">상태</th>
            <th class="pb-2 text-right">효율</th>
            <th class="pb-2 text-right">가동률</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
          ${robots.map(r => /* html */`
          <tr class="text-slate-300 hover:bg-slate-700/30 transition-colors">
            <td class="py-2 font-mono text-xs text-slate-500">${r.id}</td>
            <td class="py-2 text-white">${r.name}</td>
            <td class="py-2 text-slate-400 text-xs">${r.zone}</td>
            <td class="py-2">
              <span class="px-2 py-0.5 rounded text-xs ${r.type==='industrial'?'bg-blue-900/50 text-blue-300':'bg-green-900/50 text-green-300'}">
                ${r.type==='industrial'?'산업용':'협동'}
              </span>
            </td>
            <td class="py-2">
              <span class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full ${getRobotStatusDot(r.status)}"></span>
                <span class="text-xs ${getRobotStatusBadge(r.status).replace('bg-','').replace('-100','').replace('text-','')} ">${getRobotStatusText(r.status)}</span>
              </span>
            </td>
            <td class="py-2 text-right font-mono text-xs ${getEfficiencyColor(r.efficiency)}">${r.efficiency}%</td>
            <td class="py-2 text-right font-mono text-xs text-slate-400">${r.uptime}%</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- MES 주문 -->
  <div class="bg-slate-800 rounded-xl border border-slate-700 p-5">
    <h3 class="font-semibold text-white mb-4"><i class="fas fa-clipboard-list text-orange-400 mr-2"></i>MES 주문 현황</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${orders.map(o => /* html */`
      <div class="bg-slate-900/50 rounded-lg p-4">
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="font-mono text-xs text-slate-500">${o.id}</div>
            <div class="text-sm font-medium text-white mt-0.5">${o.product}</div>
          </div>
          <div class="flex gap-1.5">
            <span class="px-2 py-0.5 rounded text-xs ${getOrderTypeBadge(o.type)}">${getOrderTypeText(o.type)}</span>
            <span class="px-2 py-0.5 rounded text-xs ${getOrderStatusBadge(o.status)}">${getOrderStatusText(o.status)}</span>
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-500 mb-2">
          <span>${o.line}</span>
          <span>마감: ${o.dueDate}</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-1.5">
          <div class="h-1.5 rounded-full ${o.progress>=100?'bg-blue-500':'bg-green-500'}" style="width:${Math.min(o.progress,100)}%"></div>
        </div>
        <div class="text-right text-xs text-slate-500 mt-1">${fmt(o.qty)}개 · ${o.progress}%</div>
      </div>`).join('')}
    </div>
  </div>

  <script>
    // 3초마다 페이지 데이터 갱신 (서버에서 받은 최신 데이터 반영)
    setInterval(()=>{ /* 실시간 갱신은 API 엔드포인트 호출로 확장 가능 */ }, 3000)
  </script>
  `

  return layout('통합 대시보드', body)
}
