import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

// API: 로봇 상태 데이터
app.get('/api/robots', (c) => {
  const robots = [
    { id: 'R001', name: '원료 투입 로봇 A', type: 'industrial', zone: '원료 혼합', status: 'running', efficiency: 98, uptime: 99.2, speed: 95, load: 180, unit: 'kg/batch' },
    { id: 'R002', name: '원료 투입 로봇 B', type: 'industrial', zone: '원료 혼합', status: 'running', efficiency: 97, uptime: 98.8, speed: 92, load: 165, unit: 'kg/batch' },
    { id: 'R003', name: '델타 로봇 (병 정렬)', type: 'industrial', zone: '충진 라인', status: 'running', efficiency: 99, uptime: 99.5, speed: 280, load: 0.05, unit: '개/분' },
    { id: 'R004', name: '스카라 로봇 (용기 투입)', type: 'industrial', zone: '충진 라인', status: 'running', efficiency: 98, uptime: 99.1, speed: 240, load: 0.08, unit: '개/분' },
    { id: 'R005', name: '캡핑 로봇 (다관절)', type: 'industrial', zone: '충진 라인', status: 'maintenance', efficiency: 0, uptime: 97.3, speed: 0, load: 0, unit: '개/분' },
    { id: 'R006', name: '협동 로봇 - 라벨링 A', type: 'cobot', zone: '라벨링', status: 'running', efficiency: 94, uptime: 96.5, speed: 45, load: 0.3, unit: '개/분' },
    { id: 'R007', name: '협동 로봇 - 라벨링 B', type: 'cobot', zone: '라벨링', status: 'running', efficiency: 93, uptime: 96.2, speed: 43, load: 0.3, unit: '개/분' },
    { id: 'R008', name: '협동 로봇 - 세트 포장', type: 'cobot', zone: '세트 포장', status: 'running', efficiency: 91, uptime: 95.8, speed: 28, load: 0.5, unit: '개/분' },
    { id: 'R009', name: '협동 로봇 - 품질 검사', type: 'cobot', zone: '품질 검사', status: 'running', efficiency: 96, uptime: 97.1, speed: 55, load: 0.2, unit: '개/분' },
    { id: 'R010', name: '박스 적재 로봇 A', type: 'industrial', zone: '팔레타이징', status: 'running', efficiency: 97, uptime: 98.4, speed: 85, load: 15, unit: '박스/분' },
    { id: 'R011', name: '팔레타이징 로봇 B', type: 'industrial', zone: '팔레타이징', status: 'idle', efficiency: 0, uptime: 98.1, speed: 0, load: 0, unit: '박스/분' },
  ]
  return c.json(robots)
})

// API: 생산 지표
app.get('/api/production', (c) => {
  const production = {
    today: {
      total: 48320,
      target: 50000,
      defect: 127,
      defectRate: 0.26,
      efficiency: 96.6,
    },
    lines: [
      { name: '스킨케어 메인 라인', product: '토너 200ml', status: 'running', count: 18450, target: 20000, speed: 245 },
      { name: '로션 라인', product: '로션 150ml', status: 'running', count: 15870, target: 16000, speed: 198 },
      { name: '한정판 라인', product: '추석 선물 세트', status: 'running', count: 8200, target: 9000, speed: 28 },
      { name: '맞춤형 소량 라인', product: '개인 맞춤 세럼', status: 'running', count: 5800, target: 5000, speed: 12 },
    ],
    hourly: [
      { hour: '08:00', count: 4820 },
      { hour: '09:00', count: 5100 },
      { hour: '10:00', count: 5350 },
      { hour: '11:00', count: 5200 },
      { hour: '12:00', count: 4600 },
      { hour: '13:00', count: 5050 },
      { hour: '14:00', count: 5180 },
      { hour: '15:00', count: 5320 },
      { hour: '16:00', count: 5180 },
      { hour: '17:00', count: 2520 },
    ]
  }
  return c.json(production)
})

// API: 알람 데이터
app.get('/api/alarms', (c) => {
  const alarms = [
    { id: 1, time: '17:23', level: 'error', robot: 'R005 캡핑 로봇', message: '토크 센서 이상 감지 - 유지보수 필요', zone: '충진 라인' },
    { id: 2, time: '16:45', level: 'warning', robot: 'R006 협동로봇 라벨링 A', message: '라벨 공급 잔량 15% 미만', zone: '라벨링' },
    { id: 3, time: '15:30', level: 'warning', robot: 'R003 델타 로봇', message: '속도 90% 이하로 저하 감지', zone: '충진 라인' },
    { id: 4, time: '14:12', level: 'info', robot: 'R009 품질검사 로봇', message: '불량품 10개 연속 감지 → 작업자 확인 완료', zone: '품질 검사' },
    { id: 5, time: '13:05', level: 'info', robot: 'MES 시스템', message: '한정판 라인 작업 지시 전환 완료', zone: '전체' },
  ]
  return c.json(alarms)
})

// API: MES 주문 현황
app.get('/api/orders', (c) => {
  const orders = [
    { id: 'ORD-2024-0891', product: '토너 200ml (화이트닝)', qty: 20000, type: 'mass', line: '스킨케어 메인 라인', status: 'running', progress: 92, dueDate: '오늘 18:00' },
    { id: 'ORD-2024-0892', product: '로션 150ml (모이스처)', qty: 16000, type: 'mass', line: '로션 라인', status: 'running', progress: 99, dueDate: '오늘 17:30' },
    { id: 'ORD-2024-0893', product: '추석 선물 세트 (5종)', qty: 9000, type: 'limited', line: '한정판 라인', status: 'running', progress: 91, dueDate: '내일 09:00' },
    { id: 'ORD-2024-0894', product: '개인 맞춤 세럼 (35종)', qty: 5000, type: 'custom', line: '맞춤형 소량 라인', status: 'running', progress: 116, dueDate: '오늘 16:00' },
    { id: 'ORD-2024-0895', product: '크림 50ml (안티에이징)', qty: 12000, type: 'mass', line: '스킨케어 메인 라인', status: 'pending', progress: 0, dueDate: '내일 14:00' },
    { id: 'ORD-2024-0896', product: '설 선물 세트 (3종)', qty: 3000, type: 'limited', line: '한정판 라인', status: 'pending', progress: 0, dueDate: '모레 09:00' },
  ]
  return c.json(orders)
})

// 메인 페이지
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CosmoFactory MES - 화장품 충진공장 통합 관리 시스템</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
    * { font-family: 'Noto Sans KR', sans-serif; }
    
    :root {
      --industrial: #1e40af;
      --cobot: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --bg: #0f172a;
      --surface: #1e293b;
      --surface2: #334155;
      --border: #475569;
      --text: #e2e8f0;
      --text-muted: #94a3b8;
    }

    body { background: var(--bg); color: var(--text); }

    .sidebar { 
      background: var(--surface); 
      border-right: 1px solid var(--border);
      min-height: 100vh;
    }

    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 16px; margin: 2px 8px;
      border-radius: 8px; cursor: pointer;
      transition: all 0.2s; color: var(--text-muted);
      font-size: 14px;
    }
    .nav-item:hover, .nav-item.active {
      background: rgba(99,102,241,0.15);
      color: #818cf8;
    }
    .nav-item i { width: 20px; text-align: center; }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .card-sm {
      background: var(--surface2);
      border-radius: 8px;
      padding: 14px;
    }

    .badge-industrial { 
      background: rgba(30,64,175,0.2); 
      color: #60a5fa; 
      border: 1px solid rgba(96,165,250,0.3);
      padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
    }
    .badge-cobot { 
      background: rgba(5,150,105,0.2); 
      color: #34d399; 
      border: 1px solid rgba(52,211,153,0.3);
      padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
    }

    .status-running { color: #22c55e; }
    .status-idle { color: #94a3b8; }
    .status-maintenance { color: #f59e0b; }
    .status-error { color: #ef4444; }

    .pulse { animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

    .zone-card {
      border-radius: 10px; padding: 16px; cursor: pointer;
      transition: all 0.2s; border: 1px solid transparent;
    }
    .zone-card:hover { transform: translateY(-2px); }
    .zone-industrial { background: rgba(30,64,175,0.15); border-color: rgba(96,165,250,0.2); }
    .zone-cobot { background: rgba(5,150,105,0.15); border-color: rgba(52,211,153,0.2); }
    .zone-hybrid { background: rgba(124,58,237,0.15); border-color: rgba(167,139,250,0.2); }

    .progress-bar {
      background: var(--surface2);
      border-radius: 4px; height: 6px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; border-radius: 4px;
      transition: width 0.5s ease;
    }

    .factory-layout {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .flow-arrow {
      display: flex; align-items: center; justify-content: center;
      color: var(--text-muted); font-size: 20px;
    }

    .robot-dot {
      width: 10px; height: 10px; border-radius: 50%;
      display: inline-block; margin-right: 6px;
    }
    .dot-running { background: #22c55e; box-shadow: 0 0 6px #22c55e; }
    .dot-idle { background: #94a3b8; }
    .dot-maintenance { background: #f59e0b; box-shadow: 0 0 6px #f59e0b; }

    .alarm-error { border-left: 3px solid #ef4444; background: rgba(239,68,68,0.05); }
    .alarm-warning { border-left: 3px solid #f59e0b; background: rgba(245,158,11,0.05); }
    .alarm-info { border-left: 3px solid #3b82f6; background: rgba(59,130,246,0.05); }

    .tab-btn {
      padding: 8px 16px; border-radius: 6px; cursor: pointer;
      transition: all 0.2s; font-size: 13px; font-weight: 500;
      color: var(--text-muted); background: transparent;
      border: 1px solid transparent;
    }
    .tab-btn.active {
      background: rgba(99,102,241,0.2);
      color: #818cf8;
      border-color: rgba(99,102,241,0.3);
    }

    .metric-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px; padding: 16px;
      position: relative; overflow: hidden;
    }
    .metric-card::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
    }
    .metric-green::before { background: linear-gradient(90deg, #22c55e, #16a34a); }
    .metric-blue::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
    .metric-orange::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .metric-purple::before { background: linear-gradient(90deg, #a855f7, #7c3aed); }

    .section { display: none; }
    .section.active { display: block; }

    .scenario-btn {
      padding: 10px 20px; border-radius: 8px; cursor: pointer;
      transition: all 0.2s; font-size: 13px; font-weight: 500;
      border: 1px solid var(--border); color: var(--text-muted);
      background: var(--surface2);
    }
    .scenario-btn.active {
      background: rgba(99,102,241,0.2);
      color: #818cf8;
      border-color: rgba(99,102,241,0.4);
    }
    .scenario-btn:hover { border-color: rgba(99,102,241,0.3); color: var(--text); }

    .order-mass { border-left: 3px solid #3b82f6; }
    .order-limited { border-left: 3px solid #a855f7; }
    .order-custom { border-left: 3px solid #f59e0b; }

    .gantt-bar {
      height: 22px; border-radius: 3px;
      display: flex; align-items: center;
      padding: 0 8px; font-size: 11px; font-weight: 600;
      white-space: nowrap; overflow: hidden;
    }
  </style>
</head>
<body class="flex">

<!-- 사이드바 -->
<div class="sidebar w-56 flex-shrink-0 flex flex-col">
  <div class="p-5 border-b border-slate-700">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
        <i class="fas fa-industry text-lg"></i>
      </div>
      <div>
        <div class="text-sm font-bold text-white">CosmoFactory</div>
        <div class="text-xs text-slate-400">MES 통합 관리 v2.4</div>
      </div>
    </div>
  </div>

  <div class="p-3 border-b border-slate-700">
    <div class="text-xs text-slate-400 px-3 mb-2 font-semibold tracking-wider">공장 현황</div>
    <div class="flex items-center gap-2 px-3 py-2">
      <span class="robot-dot dot-running pulse"></span>
      <span class="text-xs text-slate-300">가동 중 · 라인 4개</span>
    </div>
    <div class="grid grid-cols-2 gap-2 px-1 mt-1">
      <div class="bg-slate-700 rounded p-2 text-center">
        <div class="text-lg font-bold text-blue-400">9</div>
        <div class="text-xs text-slate-400">산업용</div>
      </div>
      <div class="bg-slate-700 rounded p-2 text-center">
        <div class="text-lg font-bold text-emerald-400">4</div>
        <div class="text-xs text-slate-400">협동로봇</div>
      </div>
    </div>
  </div>

  <nav class="flex-1 p-2 space-y-1">
    <div class="text-xs text-slate-500 px-3 py-2 font-semibold tracking-wider">메인 메뉴</div>
    <div class="nav-item active" onclick="showSection('dashboard')">
      <i class="fas fa-tachometer-alt"></i>
      <span>통합 대시보드</span>
    </div>
    <div class="nav-item" onclick="showSection('factory')">
      <i class="fas fa-map-marked-alt"></i>
      <span>공장 레이아웃</span>
    </div>
    <div class="nav-item" onclick="showSection('robots')">
      <i class="fas fa-robot"></i>
      <span>로봇 현황</span>
    </div>
    <div class="nav-item" onclick="showSection('production')">
      <i class="fas fa-chart-line"></i>
      <span>생산 모니터링</span>
    </div>
    <div class="nav-item" onclick="showSection('mes')">
      <i class="fas fa-tasks"></i>
      <span>MES 주문 관리</span>
    </div>
    <div class="nav-item" onclick="showSection('scenario')">
      <i class="fas fa-play-circle"></i>
      <span>운영 시나리오</span>
    </div>
  </nav>

  <div class="p-3 border-t border-slate-700">
    <div id="clock" class="text-xs text-slate-400 text-center"></div>
    <div class="text-xs text-center mt-1">
      <span class="robot-dot dot-running pulse"></span>
      <span class="text-slate-400">시스템 정상 가동</span>
    </div>
  </div>
</div>

<!-- 메인 콘텐츠 -->
<div class="flex-1 overflow-auto">
  
  <!-- 상단 헤더 -->
  <div class="sticky top-0 z-10 bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
    <div>
      <h1 id="pageTitle" class="text-lg font-semibold text-white">통합 대시보드</h1>
      <p id="pageDesc" class="text-xs text-slate-400">화장품 충진공장 하이브리드 자동화 실시간 현황</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
        <span class="robot-dot dot-running pulse"></span>
        <span class="text-xs text-slate-300">실시간 동기화</span>
      </div>
      <button onclick="refreshData()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
        <i class="fas fa-sync-alt mr-1"></i> 새로고침
      </button>
    </div>
  </div>

  <div class="p-6">

    <!-- ===================== 통합 대시보드 ===================== -->
    <div id="section-dashboard" class="section active">
      
      <!-- KPI 카드 4개 -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="metric-card metric-green">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-slate-400 font-medium">오늘 생산량</div>
            <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <i class="fas fa-boxes text-green-400 text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-white" id="kpi-total">48,320</div>
          <div class="flex items-center gap-2 mt-1">
            <div class="text-xs text-slate-400">목표: 50,000개</div>
            <div class="text-xs text-green-400 font-medium">96.6%</div>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-fill bg-green-500" id="kpi-total-bar" style="width:96.6%"></div>
          </div>
        </div>

        <div class="metric-card metric-blue">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-slate-400 font-medium">가동 로봇</div>
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <i class="fas fa-robot text-blue-400 text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">9<span class="text-base text-slate-400 font-normal">/11</span></div>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs text-blue-400">산업용 7대</span>
            <span class="text-xs text-emerald-400">협동 4대</span>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-fill bg-blue-500" style="width:81.8%"></div>
          </div>
        </div>

        <div class="metric-card metric-orange">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-slate-400 font-medium">불량률</div>
            <div class="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-orange-400 text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">0.26%</div>
          <div class="flex items-center gap-2 mt-1">
            <div class="text-xs text-slate-400">불량 127개</div>
            <div class="text-xs text-green-400 font-medium">▼ 목표 이하</div>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-fill bg-orange-400" style="width:26%"></div>
          </div>
        </div>

        <div class="metric-card metric-purple">
          <div class="flex items-center justify-between mb-3">
            <div class="text-xs text-slate-400 font-medium">전체 OEE</div>
            <div class="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <i class="fas fa-chart-pie text-purple-400 text-sm"></i>
            </div>
          </div>
          <div class="text-2xl font-bold text-white">94.3%</div>
          <div class="flex items-center gap-2 mt-1">
            <div class="text-xs text-green-400 font-medium">▲ 전일 대비 +1.2%</div>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-fill bg-purple-500" style="width:94.3%"></div>
          </div>
        </div>
      </div>

      <!-- 공정 흐름도 -->
      <div class="card mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-white flex items-center gap-2">
            <i class="fas fa-project-diagram text-indigo-400"></i>
            공정 흐름 현황
          </h2>
          <div class="flex items-center gap-3 text-xs">
            <span><span class="badge-industrial">산업용 로봇</span></span>
            <span><span class="badge-cobot">협동 로봇</span></span>
          </div>
        </div>
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <!-- 공정 1 -->
          <div class="zone-card zone-industrial min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">🏭</div>
              <div class="text-xs font-bold text-blue-300">원료 혼합</div>
              <div class="badge-industrial mt-1 inline-block">산업용</div>
              <div class="text-xs text-green-400 mt-2 font-medium">● 정상</div>
              <div class="text-xs text-slate-400 mt-1">2대 가동</div>
            </div>
          </div>
          <div class="flow-arrow flex-shrink-0"><i class="fas fa-chevron-right"></i></div>
          <!-- 공정 2 -->
          <div class="zone-card zone-industrial min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">⚡</div>
              <div class="text-xs font-bold text-blue-300">충진 라인</div>
              <div class="badge-industrial mt-1 inline-block">산업용</div>
              <div class="text-xs text-yellow-400 mt-2 font-medium">⚠ 일부 정비</div>
              <div class="text-xs text-slate-400 mt-1">3대 (1대 정비)</div>
            </div>
          </div>
          <div class="flow-arrow flex-shrink-0"><i class="fas fa-chevron-right"></i></div>
          <!-- 공정 3 -->
          <div class="zone-card zone-cobot min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">🏷️</div>
              <div class="text-xs font-bold text-emerald-300">라벨링</div>
              <div class="badge-cobot mt-1 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2 font-medium">● 정상</div>
              <div class="text-xs text-slate-400 mt-1">2대 가동</div>
            </div>
          </div>
          <div class="flow-arrow flex-shrink-0"><i class="fas fa-chevron-right"></i></div>
          <!-- 공정 4 -->
          <div class="zone-card zone-hybrid min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">🎁</div>
              <div class="text-xs font-bold text-violet-300">세트 포장</div>
              <div class="badge-cobot mt-1 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2 font-medium">● 정상</div>
              <div class="text-xs text-slate-400 mt-1">1대 + 작업자 2명</div>
            </div>
          </div>
          <div class="flow-arrow flex-shrink-0"><i class="fas fa-chevron-right"></i></div>
          <!-- 공정 5 -->
          <div class="zone-card zone-cobot min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">🔍</div>
              <div class="text-xs font-bold text-emerald-300">품질 검사</div>
              <div class="badge-cobot mt-1 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2 font-medium">● 정상</div>
              <div class="text-xs text-slate-400 mt-1">1대 + 비전 AI</div>
            </div>
          </div>
          <div class="flow-arrow flex-shrink-0"><i class="fas fa-chevron-right"></i></div>
          <!-- 공정 6 -->
          <div class="zone-card zone-industrial min-w-32 flex-shrink-0">
            <div class="text-center">
              <div class="text-2xl mb-1">📦</div>
              <div class="text-xs font-bold text-blue-300">팔레타이징</div>
              <div class="badge-industrial mt-1 inline-block">산업용</div>
              <div class="text-xs text-slate-400 mt-2 font-medium">◌ 1대 대기</div>
              <div class="text-xs text-slate-400 mt-1">1대 가동 + 1 대기</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 생산 라인 현황 + 알람 -->
      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-2 card">
          <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-industry text-blue-400"></i>
            생산 라인 실시간 현황
          </h2>
          <div class="space-y-3" id="production-lines"></div>
        </div>

        <div class="card">
          <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
            <i class="fas fa-bell text-yellow-400"></i>
            최근 알람
            <span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">2</span>
          </h2>
          <div class="space-y-2" id="alarm-list"></div>
        </div>
      </div>
    </div>

    <!-- ===================== 공장 레이아웃 ===================== -->
    <div id="section-factory" class="section">
      <div class="card mb-4">
        <h2 class="font-semibold text-white mb-1 flex items-center gap-2">
          <i class="fas fa-map text-indigo-400"></i>
          공장 구역 배치도
        </h2>
        <p class="text-xs text-slate-400 mb-5">구역을 클릭하면 상세 정보를 확인할 수 있습니다</p>
        
        <!-- 공장 레이아웃 그리드 -->
        <div class="grid grid-cols-7 gap-3 items-center">
          <!-- 원료 혼합 -->
          <div class="col-span-1 zone-card zone-industrial cursor-pointer" onclick="showZoneDetail('mixing')">
            <div class="text-3xl text-center mb-2">🏭</div>
            <div class="text-center">
              <div class="text-xs font-bold text-blue-300">Zone A</div>
              <div class="text-xs text-white font-semibold mt-1">원료 혼합</div>
              <div class="badge-industrial mt-2 inline-block">산업용</div>
              <div class="text-xs text-green-400 mt-2">● 2대 가동</div>
              <div class="text-xs text-slate-400 mt-1">R001, R002</div>
              <div class="text-xs text-slate-400 mt-1">위험구역 격리</div>
            </div>
          </div>
          <div class="flow-arrow"><i class="fas fa-arrow-right text-slate-500 text-xl"></i></div>
          <!-- 충진 라인 -->
          <div class="col-span-1 zone-card zone-industrial cursor-pointer" onclick="showZoneDetail('filling')">
            <div class="text-3xl text-center mb-2">⚡</div>
            <div class="text-center">
              <div class="text-xs font-bold text-blue-300">Zone B</div>
              <div class="text-xs text-white font-semibold mt-1">충진/캡핑</div>
              <div class="badge-industrial mt-2 inline-block">산업용</div>
              <div class="text-xs text-yellow-400 mt-2">⚠ 1대 정비중</div>
              <div class="text-xs text-slate-400 mt-1">R003~R005</div>
              <div class="text-xs text-slate-400 mt-1">안전펜스 격리</div>
            </div>
          </div>
          <div class="flow-arrow"><i class="fas fa-arrow-right text-slate-500 text-xl"></i></div>
          <!-- 라벨링 -->
          <div class="col-span-1 zone-card zone-cobot cursor-pointer" onclick="showZoneDetail('labeling')">
            <div class="text-3xl text-center mb-2">🏷️</div>
            <div class="text-center">
              <div class="text-xs font-bold text-emerald-300">Zone C</div>
              <div class="text-xs text-white font-semibold mt-1">라벨링</div>
              <div class="badge-cobot mt-2 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2">● 2대 가동</div>
              <div class="text-xs text-slate-400 mt-1">R006, R007</div>
              <div class="text-xs text-slate-400 mt-1">작업자 협업구역</div>
            </div>
          </div>
          <div class="flow-arrow"><i class="fas fa-arrow-right text-slate-500 text-xl"></i></div>
          <!-- 세트 포장 -->
          <div class="col-span-1 zone-card zone-hybrid cursor-pointer" onclick="showZoneDetail('setpacking')">
            <div class="text-3xl text-center mb-2">🎁</div>
            <div class="text-center">
              <div class="text-xs font-bold text-violet-300">Zone D</div>
              <div class="text-xs text-white font-semibold mt-1">세트 포장</div>
              <div class="badge-cobot mt-2 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2">● 가동 중</div>
              <div class="text-xs text-slate-400 mt-1">R008 + 작업자</div>
              <div class="text-xs text-slate-400 mt-1">협업 구역</div>
            </div>
          </div>
        </div>

        <!-- 2열 -->
        <div class="grid grid-cols-7 gap-3 items-center mt-3">
          <div class="col-span-3"></div>
          <div class="flow-arrow col-span-1 justify-end">
            <div class="flex flex-col items-center">
              <i class="fas fa-arrow-down text-slate-500 text-xl"></i>
            </div>
          </div>
          <!-- 팔레타이징 -->
          <div class="col-span-1 zone-card zone-industrial cursor-pointer" onclick="showZoneDetail('palletizing')">
            <div class="text-3xl text-center mb-2">📦</div>
            <div class="text-center">
              <div class="text-xs font-bold text-blue-300">Zone F</div>
              <div class="text-xs text-white font-semibold mt-1">팔레타이징</div>
              <div class="badge-industrial mt-2 inline-block">산업용</div>
              <div class="text-xs text-slate-400 mt-2">◌ 1대 대기</div>
              <div class="text-xs text-slate-400 mt-1">R010, R011</div>
              <div class="text-xs text-slate-400 mt-1">안전펜스 격리</div>
            </div>
          </div>
          <div class="flow-arrow"><i class="fas fa-arrow-left text-slate-500 text-xl"></i></div>
          <!-- 품질 검사 -->
          <div class="col-span-1 zone-card zone-cobot cursor-pointer" onclick="showZoneDetail('inspection')">
            <div class="text-3xl text-center mb-2">🔍</div>
            <div class="text-center">
              <div class="text-xs font-bold text-emerald-300">Zone E</div>
              <div class="text-xs text-white font-semibold mt-1">품질 검사</div>
              <div class="badge-cobot mt-2 inline-block">협동 로봇</div>
              <div class="text-xs text-green-400 mt-2">● 가동 중</div>
              <div class="text-xs text-slate-400 mt-1">R009 + 비전 AI</div>
              <div class="text-xs text-slate-400 mt-1">작업자 협업구역</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 구역 상세 정보 패널 -->
      <div id="zone-detail" class="card hidden">
        <div id="zone-detail-content"></div>
      </div>

      <!-- 구역별 요약 테이블 -->
      <div class="card mt-4">
        <h2 class="font-semibold text-white mb-4">공정별 로봇 배치 요약</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-700">
                <th class="text-left py-2 px-3 text-slate-400 font-medium">공정 단계</th>
                <th class="text-left py-2 px-3 text-slate-400 font-medium">작업 내용</th>
                <th class="text-left py-2 px-3 text-slate-400 font-medium">로봇 종류</th>
                <th class="text-left py-2 px-3 text-slate-400 font-medium">핵심 이유</th>
                <th class="text-left py-2 px-3 text-slate-400 font-medium">현재 상태</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">원료 투입</td>
                <td class="py-3 px-3 text-slate-300">무거운 원료 드럼 이송 및 투입</td>
                <td class="py-3 px-3"><span class="badge-industrial">산업용 (대형)</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">고중량 처리, 위험 환경, 24시간 무인</td>
                <td class="py-3 px-3"><span class="status-running text-xs font-medium">● 정상 가동</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">병 공급</td>
                <td class="py-3 px-3 text-slate-300">빈 용기 고속 정렬 및 투입</td>
                <td class="py-3 px-3"><span class="badge-industrial">산업용 (델타/스카라)</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">분당 수백 개 초고속 처리</td>
                <td class="py-3 px-3"><span class="status-running text-xs font-medium">● 정상 가동</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">충진/캡핑</td>
                <td class="py-3 px-3 text-slate-300">내용물 주입 및 뚜껑 체결</td>
                <td class="py-3 px-3"><span class="badge-industrial">산업용 + 자동화설비</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">정밀도와 속도가 최우선</td>
                <td class="py-3 px-3"><span class="status-maintenance text-xs font-medium">⚠ 1대 정비중</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">라벨링</td>
                <td class="py-3 px-3 text-slate-300">다양한 라벨 부착 및 외관 관리</td>
                <td class="py-3 px-3"><span class="badge-cobot">협동 로봇</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">제품별 유연성, 섬세한 힘 제어</td>
                <td class="py-3 px-3"><span class="status-running text-xs font-medium">● 정상 가동</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">세트 포장</td>
                <td class="py-3 px-3 text-slate-300">선물 세트 조립, 샘플 동봉</td>
                <td class="py-3 px-3"><span class="badge-cobot">협동 로봇 + 작업자</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">사람과 협업, 구성이 자주 변경</td>
                <td class="py-3 px-3"><span class="status-running text-xs font-medium">● 정상 가동</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">품질 검사</td>
                <td class="py-3 px-3 text-slate-300">외관 검사, 불량 샘플링</td>
                <td class="py-3 px-3"><span class="badge-cobot">협동 로봇 + 비전</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">사람에게 검사품 전달 협업</td>
                <td class="py-3 px-3"><span class="status-running text-xs font-medium">● 정상 가동</span></td>
              </tr>
              <tr class="hover:bg-slate-700/30">
                <td class="py-3 px-3 text-white font-medium">박스 적재</td>
                <td class="py-3 px-3 text-slate-300">무거운 박스 팔레트 적재</td>
                <td class="py-3 px-3"><span class="badge-industrial">산업용 (대형)</span></td>
                <td class="py-3 px-3 text-slate-400 text-xs">고중량 처리, 안전 격리 필요</td>
                <td class="py-3 px-3"><span class="status-idle text-xs font-medium">◌ 1대 대기</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ===================== 로봇 현황 ===================== -->
    <div id="section-robots" class="section">
      <div class="flex items-center gap-3 mb-4">
        <button class="tab-btn active" onclick="filterRobots('all', this)">전체 (11)</button>
        <button class="tab-btn" onclick="filterRobots('industrial', this)">산업용 (7)</button>
        <button class="tab-btn" onclick="filterRobots('cobot', this)">협동 로봇 (4)</button>
        <button class="tab-btn" onclick="filterRobots('running', this)">가동중 (9)</button>
        <button class="tab-btn" onclick="filterRobots('maintenance', this)">정비중 (1)</button>
      </div>
      <div id="robot-grid" class="grid grid-cols-3 gap-4"></div>
    </div>

    <!-- ===================== 생산 모니터링 ===================== -->
    <div id="section-production" class="section">
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="card">
          <div class="text-xs text-slate-400 mb-1">시간당 생산량 (평균)</div>
          <div class="text-2xl font-bold text-white">5,147<span class="text-sm text-slate-400 font-normal"> 개/시간</span></div>
          <div class="text-xs text-green-400 mt-1">▲ 목표 대비 +2.9%</div>
        </div>
        <div class="card">
          <div class="text-xs text-slate-400 mb-1">누적 불량 건수</div>
          <div class="text-2xl font-bold text-white">127<span class="text-sm text-slate-400 font-normal"> 건</span></div>
          <div class="text-xs text-green-400 mt-1">불량률 0.26% (기준: 0.5%)</div>
        </div>
        <div class="card">
          <div class="text-xs text-slate-400 mb-1">가동 효율 (OEE)</div>
          <div class="text-2xl font-bold text-white">94.3<span class="text-sm text-slate-400 font-normal"> %</span></div>
          <div class="text-xs text-green-400 mt-1">▲ 전일 대비 +1.2%</div>
        </div>
      </div>

      <div class="card mb-4">
        <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
          <i class="fas fa-chart-bar text-indigo-400"></i>
          시간별 생산량 추이
        </h2>
        <canvas id="productionChart" height="80"></canvas>
      </div>

      <div class="card">
        <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
          <i class="fas fa-list text-blue-400"></i>
          라인별 생산 현황
        </h2>
        <div class="space-y-4" id="production-detail"></div>
      </div>
    </div>

    <!-- ===================== MES 주문 관리 ===================== -->
    <div id="section-mes" class="section">
      <div class="grid grid-cols-4 gap-3 mb-5">
        <div class="card-sm border border-blue-800/30">
          <div class="text-xs text-slate-400">대량 생산 주문</div>
          <div class="text-xl font-bold text-blue-400 mt-1">2건</div>
          <div class="text-xs text-slate-400">39,870 개 처리중</div>
        </div>
        <div class="card-sm border border-purple-800/30">
          <div class="text-xs text-slate-400">한정판 주문</div>
          <div class="text-xl font-bold text-purple-400 mt-1">2건</div>
          <div class="text-xs text-slate-400">12,000 개 예정 포함</div>
        </div>
        <div class="card-sm border border-yellow-800/30">
          <div class="text-xs text-slate-400">맞춤형 주문</div>
          <div class="text-xl font-bold text-yellow-400 mt-1">1건</div>
          <div class="text-xs text-slate-400">5,800 개 처리중</div>
        </div>
        <div class="card-sm border border-green-800/30">
          <div class="text-xs text-slate-400">완료율</div>
          <div class="text-xl font-bold text-green-400 mt-1">97.8%</div>
          <div class="text-xs text-green-400">납기 준수율</div>
        </div>
      </div>

      <div class="card mb-4">
        <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
          <i class="fas fa-tasks text-indigo-400"></i>
          주문 현황 및 라인 배정
        </h2>
        <div class="space-y-3" id="orders-list"></div>
      </div>

      <div class="card">
        <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
          <i class="fas fa-calendar-alt text-blue-400"></i>
          생산 간트 차트 (오늘)
        </h2>
        <div class="text-xs text-slate-400 mb-3">각 라인의 금일 생산 일정</div>
        <div id="gantt-chart" class="space-y-2"></div>
      </div>
    </div>

    <!-- ===================== 운영 시나리오 ===================== -->
    <div id="section-scenario" class="section">
      <div class="flex gap-3 mb-6">
        <button class="scenario-btn active" onclick="showScenario('mass', this)">
          <i class="fas fa-industry mr-2"></i>대량 생산 시나리오
        </button>
        <button class="scenario-btn" onclick="showScenario('limited', this)">
          <i class="fas fa-gift mr-2"></i>한정판 제품 시나리오
        </button>
        <button class="scenario-btn" onclick="showScenario('custom', this)">
          <i class="fas fa-user-cog mr-2"></i>맞춤형 제품 시나리오
        </button>
      </div>

      <div id="scenario-content"></div>
    </div>

  </div>
</div>

<!-- 구역 상세 모달 -->
<div id="modal-overlay" class="hidden fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onclick="closeModal()">
  <div id="modal-content" class="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg w-full mx-4" onclick="event.stopPropagation()">
  </div>
</div>

<script>
// ========== 데이터 ===========
let robotsData = [];
let productionData = {};
let ordersData = [];
let alarmsData = [];

// ========== 초기화 ===========
async function init() {
  await Promise.all([
    loadRobots(), loadProduction(), loadOrders(), loadAlarms()
  ]);
  renderDashboard();
  renderProductionLines();
  renderAlarms();
  renderRobots('all');
  renderProductionDetail();
  renderProductionChart();
  renderOrders();
  renderGantt();
  showScenario('mass', document.querySelector('.scenario-btn'));
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(simulateRealtime, 3000);
}

async function loadRobots() {
  const r = await fetch('/api/robots');
  robotsData = await r.json();
}
async function loadProduction() {
  const r = await fetch('/api/production');
  productionData = await r.json();
}
async function loadOrders() {
  const r = await fetch('/api/orders');
  ordersData = await r.json();
}
async function loadAlarms() {
  const r = await fetch('/api/alarms');
  alarmsData = await r.json();
}

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = 
    now.toLocaleDateString('ko-KR') + ' ' + now.toLocaleTimeString('ko-KR');
}

function simulateRealtime() {
  const el = document.getElementById('kpi-total');
  if (el) {
    const cur = parseInt(el.textContent.replace(/,/g,''));
    const newVal = cur + Math.floor(Math.random() * 15);
    el.textContent = newVal.toLocaleString();
  }
}

// ========== 네비게이션 ===========
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const titles = {
    dashboard: ['통합 대시보드', '화장품 충진공장 하이브리드 자동화 실시간 현황'],
    factory: ['공장 레이아웃', '구역별 로봇 배치 현황'],
    robots: ['로봇 현황', '산업용 · 협동 로봇 상태 모니터링'],
    production: ['생산 모니터링', '라인별 생산량 및 품질 지표'],
    mes: ['MES 주문 관리', '주문 배정 및 생산 일정 관리'],
    scenario: ['운영 시나리오', '제품 유형별 최적 자동화 전략'],
  };
  document.getElementById('pageTitle').textContent = titles[name][0];
  document.getElementById('pageDesc').textContent = titles[name][1];
}

// ========== 대시보드 ===========
function renderDashboard() {}

function renderProductionLines() {
  const lines = productionData.lines || [];
  const el = document.getElementById('production-lines');
  el.innerHTML = lines.map(l => {
    const pct = Math.min(100, (l.count / l.target * 100)).toFixed(1);
    const color = pct >= 100 ? 'bg-green-500' : pct >= 80 ? 'bg-blue-500' : 'bg-yellow-500';
    return \`
      <div class="card-sm">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-sm font-semibold text-white">\${l.name}</div>
            <div class="text-xs text-slate-400">\${l.product}</div>
          </div>
          <div class="text-right">
            <div class="text-sm font-bold text-white">\${l.count.toLocaleString()}<span class="text-slate-400 font-normal"> / \${l.target.toLocaleString()}</span></div>
            <div class="text-xs text-slate-400">\${l.speed} 개/분</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="progress-bar flex-1">
            <div class="progress-fill \${color}" style="width:\${pct}%"></div>
          </div>
          <span class="text-xs font-bold \${parseFloat(pct)>=100?'text-green-400':'text-blue-400'}">\${pct}%</span>
        </div>
      </div>
    \`;
  }).join('');
}

function renderAlarms() {
  const el = document.getElementById('alarm-list');
  el.innerHTML = alarmsData.slice(0,5).map(a => {
    const colors = { error: 'text-red-400', warning: 'text-yellow-400', info: 'text-blue-400' };
    const icons = { error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    return \`
      <div class="alarm-\${a.level} rounded p-2 pl-3">
        <div class="flex items-start gap-2">
          <i class="fas \${icons[a.level]} \${colors[a.level]} mt-0.5 text-xs flex-shrink-0"></i>
          <div>
            <div class="text-xs text-white font-medium">\${a.robot}</div>
            <div class="text-xs text-slate-400 mt-0.5">\${a.message}</div>
            <div class="text-xs text-slate-500 mt-0.5">\${a.time} · \${a.zone}</div>
          </div>
        </div>
      </div>
    \`;
  }).join('');
}

// ========== 로봇 현황 ===========
function filterRobots(filter, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRobots(filter);
}

function renderRobots(filter) {
  let robots = robotsData;
  if (filter !== 'all') {
    robots = robotsData.filter(r => {
      if (filter === 'running') return r.status === 'running';
      if (filter === 'maintenance') return r.status === 'maintenance';
      return r.type === filter;
    });
  }
  const el = document.getElementById('robot-grid');
  el.innerHTML = robots.map(r => {
    const statusLabel = {running:'가동 중', idle:'대기', maintenance:'정비중', error:'오류'};
    const statusClass = {running:'status-running', idle:'status-idle', maintenance:'status-maintenance', error:'status-error'};
    const dotClass = {running:'dot-running', idle:'dot-idle', maintenance:'dot-maintenance', error:'dot-error'};
    const badgeClass = r.type === 'industrial' ? 'badge-industrial' : 'badge-cobot';
    const badgeText = r.type === 'industrial' ? '산업용' : '협동 로봇';
    const effColor = r.efficiency >= 95 ? 'text-green-400' : r.efficiency >= 80 ? 'text-yellow-400' : 'text-red-400';
    return \`
      <div class="card hover:border-indigo-500/40 transition-colors cursor-pointer">
        <div class="flex items-start justify-between mb-3">
          <div>
            <div class="text-xs text-slate-400">\${r.id}</div>
            <div class="text-sm font-semibold text-white mt-0.5">\${r.name}</div>
          </div>
          <span class="\${badgeClass}">\${badgeText}</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="robot-dot \${dotClass[r.status]} \${r.status==='running'?'pulse':''}"></span>
          <span class="text-xs \${statusClass[r.status]} font-medium">\${statusLabel[r.status]}</span>
          <span class="text-xs text-slate-500">· \${r.zone}</span>
        </div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="card-sm">
            <div class="text-xs text-slate-400">효율</div>
            <div class="text-sm font-bold \${effColor}">\${r.efficiency}%</div>
          </div>
          <div class="card-sm">
            <div class="text-xs text-slate-400">가동률</div>
            <div class="text-sm font-bold text-white">\${r.uptime}%</div>
          </div>
          <div class="card-sm">
            <div class="text-xs text-slate-400">속도</div>
            <div class="text-sm font-bold text-blue-400">\${r.speed}</div>
          </div>
        </div>
        <div class="progress-bar mt-3">
          <div class="progress-fill \${r.efficiency>=95?'bg-green-500':r.efficiency>=80?'bg-yellow-500':'bg-red-500'}" style="width:\${r.efficiency}%"></div>
        </div>
      </div>
    \`;
  }).join('');
}

// ========== 생산 모니터링 ===========
function renderProductionDetail() {
  const lines = productionData.lines || [];
  const el = document.getElementById('production-detail');
  el.innerHTML = lines.map(l => {
    const pct = Math.min(100, (l.count / l.target * 100)).toFixed(1);
    const overTarget = l.count > l.target;
    return \`
      <div class="card-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold text-white">\${l.name}</div>
            <div class="text-xs text-slate-400 mt-1">\${l.product}</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold \${overTarget?'text-green-400':'text-white'}">\${l.count.toLocaleString()}</div>
            <div class="text-xs text-slate-400">목표: \${l.target.toLocaleString()}</div>
          </div>
        </div>
        <div class="flex items-center gap-3 mt-3">
          <div class="progress-bar flex-1">
            <div class="progress-fill \${overTarget?'bg-green-500':'bg-blue-500'}" style="width:\${Math.min(100,pct)}%"></div>
          </div>
          <span class="text-sm font-bold \${overTarget?'text-green-400':'text-blue-400'} w-12 text-right">\${pct}%</span>
        </div>
        <div class="text-xs text-slate-400 mt-2">\${l.speed} 개/분 · 현재 가동중</div>
      </div>
    \`;
  }).join('');
}

function renderProductionChart() {
  const ctx = document.getElementById('productionChart');
  if (!ctx) return;
  const hourly = productionData.hourly || [];
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: hourly.map(h => h.hour),
      datasets: [{
        label: '생산량',
        data: hourly.map(h => h.count),
        backgroundColor: hourly.map((h,i) => i === hourly.length-1 ? 'rgba(99,102,241,0.5)' : 'rgba(59,130,246,0.7)'),
        borderColor: hourly.map((h,i) => i === hourly.length-1 ? '#818cf8' : '#3b82f6'),
        borderWidth: 1, borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#94a3b8', font: {size:11} }, grid: { color: 'rgba(148,163,184,0.1)' } },
        y: { ticks: { color: '#94a3b8', font: {size:11} }, grid: { color: 'rgba(148,163,184,0.1)' },
          min: 0, max: 6000 }
      }
    }
  });
}

// ========== MES 주문 ===========
function renderOrders() {
  const el = document.getElementById('orders-list');
  const typeLabel = { mass: '대량 생산', limited: '한정판', custom: '맞춤형' };
  const typeColor = { mass: 'text-blue-400', limited: 'text-purple-400', custom: 'text-yellow-400' };
  const statusLabel = { running: '생산중', pending: '대기', done: '완료' };
  el.innerHTML = ordersData.map(o => {
    const pct = Math.min(120, o.progress);
    const over = o.progress > 100;
    const barColor = over ? 'bg-green-500' : o.progress > 80 ? 'bg-blue-500' : 'bg-slate-500';
    const statusCls = o.status === 'running' ? 'text-green-400' : 'text-slate-400';
    return \`
      <div class="card-sm order-\${o.type}">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-slate-400">\${o.id}</span>
                <span class="text-xs \${typeColor[o.type]} font-medium">\${typeLabel[o.type]}</span>
              </div>
              <div class="text-sm font-semibold text-white mt-1">\${o.product}</div>
              <div class="text-xs text-slate-400 mt-0.5">
                <i class="fas fa-industry mr-1"></i>\${o.line} · 납기: \${o.dueDate}
              </div>
            </div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-sm font-bold text-white">\${o.qty.toLocaleString()}개</div>
            <div class="text-xs \${statusCls} mt-1">\${statusLabel[o.status]}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div class="progress-bar flex-1">
            <div class="progress-fill \${barColor}" style="width:\${Math.min(100,pct)}%"></div>
          </div>
          <span class="text-xs font-bold \${over?'text-green-400':'text-blue-400'} w-10 text-right">\${o.progress}%</span>
        </div>
      </div>
    \`;
  }).join('');
}

function renderGantt() {
  const el = document.getElementById('gantt-chart');
  const lines = [
    { name: '스킨케어 메인 라인', items: [
      { label: '토너 200ml', start: 0, end: 85, color: 'bg-blue-600' },
      { label: '크림 50ml', start: 87, end: 100, color: 'bg-blue-400' },
    ]},
    { name: '로션 라인', items: [
      { label: '로션 150ml', start: 0, end: 98, color: 'bg-indigo-600' },
    ]},
    { name: '한정판 라인', items: [
      { label: '추석 선물 세트', start: 0, end: 80, color: 'bg-purple-600' },
      { label: '설 선물 세트', start: 82, end: 100, color: 'bg-purple-400' },
    ]},
    { name: '맞춤형 소량 라인', items: [
      { label: '맞춤 세럼 (35종)', start: 0, end: 100, color: 'bg-yellow-600' },
    ]},
  ];
  el.innerHTML = lines.map(line => \`
    <div>
      <div class="text-xs text-slate-400 mb-1">\${line.name}</div>
      <div class="relative h-8 bg-slate-700 rounded overflow-hidden">
        \${line.items.map(item => \`
          <div class="absolute gantt-bar \${item.color} text-white" 
               style="left:\${item.start}%;width:\${item.end-item.start}%;top:3px;height:22px">
            \${item.label}
          </div>
        \`).join('')}
      </div>
    </div>
  \`).join('');
}

// ========== 공장 레이아웃 ===========
function showZoneDetail(zone) {
  const details = {
    mixing: {
      title: 'Zone A - 원료 혼합 구역',
      icon: '🏭',
      type: 'industrial',
      robots: ['R001 원료 투입 로봇 A', 'R002 원료 투입 로봇 B'],
      desc: '수백 킬로그램의 크림, 로션, 에센스 원료를 대형 믹싱 탱크로 이송하고 혼합하는 구역입니다. 고온 환경과 화학 원료를 다루므로 안전펜스로 완전 격리되어 있습니다.',
      features: ['24시간 무인 가동', '고중량 처리 (20~200kg)', '위험 환경 격리', '무균 환경 유지'],
    },
    filling: {
      title: 'Zone B - 충진/캡핑 라인',
      icon: '⚡',
      type: 'industrial',
      robots: ['R003 델타 로봇 (병 정렬)', 'R004 스카라 로봇 (용기 투입)', 'R005 캡핑 로봇 (정비중)'],
      desc: '빈 용기 정렬부터 내용물 충진, 캡핑까지 고속으로 처리하는 메인 생산 구역입니다. 분당 100~300개의 처리가 가능하며 안전펜스로 격리되어 있습니다.',
      features: ['분당 100~300개 처리', '정밀 토크 캡핑', '안전펜스 격리', '중앙 제어실 모니터링'],
    },
    labeling: {
      title: 'Zone C - 라벨링 구역',
      icon: '🏷️',
      type: 'cobot',
      robots: ['R006 협동 로봇 - 라벨링 A', 'R007 협동 로봇 - 라벨링 B'],
      desc: '다양한 크기와 형태의 용기에 라벨을 부착하는 구역으로, 협동 로봇이 섬세한 힘 제어로 용기를 손상 없이 처리합니다. 작업자가 품질 검사를 병행합니다.',
      features: ['제품별 빠른 전환', '섬세한 힘 제어', '작업자와 협업', '태블릿 프로그래밍'],
    },
    setpacking: {
      title: 'Zone D - 세트 포장 구역',
      icon: '🎁',
      type: 'hybrid',
      robots: ['R008 협동 로봇 - 세트 포장'],
      desc: '추석/설 선물 세트 등 여러 제품을 조합하는 협업 구역입니다. 협동 로봇이 기본 배치를 담당하고 작업자가 리본, 메시지 카드 등을 추가합니다.',
      features: ['협동 로봇 + 작업자 2명', '구성 변경 용이', '고급 마무리 작업', '공간 효율적'],
    },
    inspection: {
      title: 'Zone E - 품질 검사 구역',
      icon: '🔍',
      type: 'cobot',
      robots: ['R009 협동 로봇 - 품질 검사'],
      desc: 'AI 비전 시스템과 협동 로봇이 결합된 품질 검사 구역입니다. 협동 로봇이 제품을 카메라 앞에 위치시키면 AI가 라벨 불량, 캡 결함, 용기 손상을 감지합니다.',
      features: ['AI 비전 검사 시스템', '전수 검사 가능', '불량품 자동 분류', '작업자 최종 확인'],
    },
    palletizing: {
      title: 'Zone F - 팔레타이징 구역',
      icon: '📦',
      type: 'industrial',
      robots: ['R010 박스 적재 로봇 A (가동중)', 'R011 팔레타이징 로봇 B (대기)'],
      desc: '완제품을 출하용 박스에 담고 팔레트에 적재하는 최종 단계입니다. 분당 60~100개의 고속 처리와 10~20kg 박스 적재가 가능합니다.',
      features: ['분당 60~100 박스 처리', '10~20kg 고중량 처리', '자동 적재 패턴 계산', '안전펜스 격리'],
    },
  };
  const d = details[zone];
  if (!d) return;
  const typeClass = d.type === 'industrial' ? 'badge-industrial' : d.type === 'cobot' ? 'badge-cobot' : 'badge-cobot';
  const typeText = d.type === 'industrial' ? '산업용 로봇 구역' : d.type === 'cobot' ? '협동 로봇 구역' : '하이브리드 구역';
  const el = document.getElementById('zone-detail-content');
  el.innerHTML = \`
    <div class="flex items-start gap-4">
      <div class="text-4xl">\${d.icon}</div>
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h3 class="text-lg font-bold text-white">\${d.title}</h3>
          <span class="\${typeClass}">\${typeText}</span>
        </div>
        <p class="text-sm text-slate-300 mb-4">\${d.desc}</p>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-2">배치 로봇</div>
            \${d.robots.map(r => \`<div class="text-xs text-slate-300 py-1 border-b border-slate-700">· \${r}</div>\`).join('')}
          </div>
          <div>
            <div class="text-xs text-slate-400 font-semibold mb-2">주요 특징</div>
            \${d.features.map(f => \`<div class="text-xs text-slate-300 py-1 border-b border-slate-700">✓ \${f}</div>\`).join('')}
          </div>
        </div>
      </div>
    </div>
  \`;
  document.getElementById('zone-detail').classList.remove('hidden');
}

// ========== 운영 시나리오 ===========
const scenarios = {
  mass: {
    title: '대량 생산 시나리오',
    subtitle: '베스트셀러 스킨케어 - 토너/로션 대량 생산',
    icon: '🏭',
    color: 'blue',
    desc: '인기 토너나 로션 같은 스테디셀러 제품을 하루 수만 개씩 생산하는 시나리오입니다. 원료 혼합부터 충진, 캡핑, 기본 라벨링, 팔레타이징까지 거의 전 공정이 산업용 로봇으로 구성됩니다.',
    flow: [
      { step: 1, label: '원료 투입', robot: '산업용 대형', detail: '자동 드럼 투입, 24h 무인 가동', icon: '🏭', active: true },
      { step: 2, label: '고속 충진', robot: '산업용 델타/스카라', detail: '분당 280개 처리', icon: '⚡', active: true },
      { step: 3, label: '자동 캡핑', robot: '산업용 다관절', detail: '정밀 토크 1초 多개', icon: '🔧', active: true },
      { step: 4, label: '기본 라벨링', robot: '협동 로봇', detail: '자동화 모드, 최소 개입', icon: '🏷️', active: true },
      { step: 5, label: '품질 검사', robot: 'AI 비전 자동', detail: '전수 자동 검사', icon: '🔍', active: true },
      { step: 6, label: '팔레타이징', robot: '산업용 대형', detail: '자동 패턴 적재', icon: '📦', active: true },
    ],
    metrics: [
      { label: '시간당 생산량', value: '5,200개', icon: 'fa-boxes', color: 'text-blue-400' },
      { label: '인력 투입', value: '2명 (모니터링)', icon: 'fa-users', color: 'text-green-400' },
      { label: '자동화율', value: '98%', icon: 'fa-robot', color: 'text-purple-400' },
      { label: '원가 경쟁력', value: '최대 ↑', icon: 'fa-chart-line', color: 'text-yellow-400' },
    ],
    note: '사람은 중앙 제어실에서 모니터링하고 설비 이상 시에만 개입합니다. 24시간 무인 가동으로 최대 원가 경쟁력을 확보합니다.',
  },
  limited: {
    title: '한정판 제품 시나리오',
    subtitle: '명절 선물 세트 · 시즌 한정판 소량 생산',
    icon: '🎁',
    color: 'purple',
    desc: '추석이나 설 선물 세트처럼 수량이 적고 포장이 복잡한 한정판 제품 시나리오입니다. 충진까지는 메인 라인을 활용하고, 이후 특수 포장은 협동 로봇 셀로 이동합니다.',
    flow: [
      { step: 1, label: '충진 (메인 라인 공유)', robot: '산업용', detail: '기존 라인 활용', icon: '⚡', active: true },
      { step: 2, label: '특수 포장 이동', robot: 'AGV 자동 이송', detail: '협동 로봇 셀로 배정', icon: '🚗', active: true },
      { step: 3, label: '세트 구성', robot: '협동 로봇 + 작업자', detail: '5종 세트 자동 배치', icon: '🎁', active: true },
      { step: 4, label: '고급 마무리', robot: '작업자 전담', detail: '리본, 메시지 카드 동봉', icon: '✨', active: true },
      { step: 5, label: '품질 검사', robot: '협동 로봇 + 육안', detail: '외관 전수 검사', icon: '🔍', active: true },
      { step: 6, label: '특수 출하 박스', robot: '반자동', detail: '수량 소량, 수동 적재', icon: '📦', active: false },
    ],
    metrics: [
      { label: '시간당 생산량', value: '280세트', icon: 'fa-gift', color: 'text-purple-400' },
      { label: '인력 투입', value: '5명 (협업)', icon: 'fa-users', color: 'text-blue-400' },
      { label: '라인 전환 시간', value: '15분', icon: 'fa-clock', color: 'text-yellow-400' },
      { label: '품질 일관성', value: '99.2%', icon: 'fa-star', color: 'text-green-400' },
    ],
    note: '협동 로봇 덕분에 소량 생산에서도 작업자 부담이 줄고 일정한 품질을 유지할 수 있습니다. 태블릿으로 15분 내 라인 전환이 가능합니다.',
  },
  custom: {
    title: '맞춤형 제품 시나리오',
    subtitle: '개인 맞춤 화장품 - 고객별 성분/용량 개별 생산',
    icon: '👤',
    color: 'yellow',
    desc: '고객별로 성분 배합이나 용량이 다른 개인 맞춤형 화장품 생산 시나리오입니다. 소량 충진 라인에 협동 로봇을 배치하여 주문 정보에 따라 정확하게 처리합니다.',
    flow: [
      { step: 1, label: '주문 정보 수신', robot: 'MES 자동 배정', detail: 'QR 주문 정보 연동', icon: '📱', active: true },
      { step: 2, label: '원료 선택 충진', robot: '협동 로봇', detail: '35종 원료 탱크 자동 선택', icon: '🧪', active: true },
      { step: 3, label: '정밀 소량 충진', robot: '협동 로봇 정밀 제어', detail: 'ml 단위 정확도', icon: '💧', active: true },
      { step: 4, label: '맞춤 라벨 부착', robot: '작업자 전담', detail: '고객명 인쇄 라벨', icon: '🏷️', active: true },
      { step: 5, label: '개인 메시지 동봉', robot: '작업자 전담', detail: '개인 카드 · 사용 설명서', icon: '💌', active: true },
      { step: 6, label: '개별 포장 출하', robot: '반자동', detail: '1:1 개별 배송 준비', icon: '📫', active: true },
    ],
    metrics: [
      { label: '처리 주문 수', value: '12개/시간', icon: 'fa-shopping-bag', color: 'text-yellow-400' },
      { label: '성분 종류', value: '35가지 원료', icon: 'fa-flask', color: 'text-blue-400' },
      { label: '충진 정확도', value: '±0.1ml', icon: 'fa-bullseye', color: 'text-green-400' },
      { label: '고객 만족도', value: '98.5%', icon: 'fa-heart', color: 'text-red-400' },
    ],
    note: '협동 로봇이 다양한 원료 탱크에서 정확한 양을 추출하고, 작업자가 개인화 마무리를 담당합니다. 완전 자동화보다 유연하고 고객 맞춤 품질을 보장합니다.',
  },
};

function showScenario(name, btn) {
  document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const s = scenarios[name];
  const colorMap = { blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' } };
  const c = colorMap[s.color];
  document.getElementById('scenario-content').innerHTML = \`
    <div class="card mb-4 \${c.bg} border \${c.border}">
      <div class="flex items-start gap-4 mb-4">
        <div class="text-5xl">\${s.icon}</div>
        <div>
          <h2 class="text-xl font-bold text-white">\${s.title}</h2>
          <p class="\${c.text} text-sm font-medium mt-1">\${s.subtitle}</p>
          <p class="text-slate-300 text-sm mt-2">\${s.desc}</p>
        </div>
      </div>
    </div>

    <div class="card mb-4">
      <h3 class="font-semibold text-white mb-4">공정 흐름도</h3>
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        \${s.flow.map((f, i) => \`
          <div class="flex-shrink-0 flex flex-col items-center">
            <div class="w-24 \${f.active ? (name==='mass'?'zone-industrial':'zone-cobot') : 'bg-slate-700/50'} rounded-lg p-3 text-center cursor-default"
                 style="\${!f.active ? 'opacity:0.5' : ''}">
              <div class="text-2xl mb-1">\${f.icon}</div>
              <div class="text-xs font-bold \${f.active ? (name==='mass'?'text-blue-300':'name'==='limited'?'text-purple-300':'text-yellow-300') : 'text-slate-400'}">\${f.label}</div>
              <div class="text-xs text-slate-400 mt-1 leading-tight">\${f.robot}</div>
              <div class="text-xs text-slate-500 mt-1 leading-tight">\${f.detail}</div>
            </div>
          </div>
          \${i < s.flow.length-1 ? '<div class="flex-shrink-0 text-slate-500 text-lg"><i class="fas fa-chevron-right"></i></div>' : ''}
        \`).join('')}
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4">
      \${s.metrics.map(m => \`
        <div class="card text-center">
          <i class="fas \${m.icon} \${m.color} text-xl mb-2"></i>
          <div class="text-lg font-bold text-white">\${m.value}</div>
          <div class="text-xs text-slate-400 mt-1">\${m.label}</div>
        </div>
      \`).join('')}
    </div>

    <div class="card bg-slate-700/30 border border-slate-600/30">
      <div class="flex items-start gap-3">
        <i class="fas fa-lightbulb text-yellow-400 mt-0.5"></i>
        <p class="text-sm text-slate-300">\${s.note}</p>
      </div>
    </div>
  \`;
}

// ========== 새로고침 ===========
async function refreshData() {
  await Promise.all([loadRobots(), loadProduction(), loadOrders(), loadAlarms()]);
  renderProductionLines();
  renderAlarms();
  renderRobots('all');
  renderProductionDetail();
  renderOrders();
  alert('데이터가 새로고침 되었습니다.');
}

init();
</script>
</body>
</html>`)
})

export default app
