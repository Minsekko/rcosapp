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

// ============================================================
// PLC 연동 API - 원료 혼합 구역 실시간 데이터
// ============================================================

// 실시간 PLC 센서값 시뮬레이터 (실제 환경에서는 OPC-UA / Modbus TCP로 대체)
function simulatePLC() {
  const now = Date.now()
  const t = now / 1000

  // 탱크별 실시간 센서값 (삼각함수로 현실적 변동 시뮬레이션)
  const tanks = [
    {
      id: 'TK-101', name: '수상 믹싱 탱크 A', product: '토너 베이스', status: 'mixing',
      capacity: 2000, current: 1580 + Math.sin(t * 0.05) * 20,
      temp: 72.3 + Math.sin(t * 0.08) * 1.2,
      tempSP: 72.0,
      pressure: 1.82 + Math.sin(t * 0.12) * 0.05,
      pressureSP: 1.80,
      agitatorRPM: 145 + Math.sin(t * 0.1) * 3,
      agitatorSP: 145,
      viscosity: 380 + Math.sin(t * 0.06) * 15,
      batchProgress: 78,
      batchNo: 'BT-2024-0891-A',
      recipe: 'R-TONER-WH-200',
      elapsedMin: 94,
      remainMin: 26,
      plcAddr: 'DB1.DBW0',
    },
    {
      id: 'TK-102', name: '수상 믹싱 탱크 B', product: '로션 베이스', status: 'heating',
      capacity: 2000, current: 820 + Math.sin(t * 0.04) * 10,
      temp: 58.7 + Math.sin(t * 0.09) * 0.8,
      tempSP: 75.0,
      pressure: 1.21 + Math.sin(t * 0.07) * 0.03,
      pressureSP: 1.20,
      agitatorRPM: 80 + Math.sin(t * 0.11) * 2,
      agitatorSP: 80,
      viscosity: 0,
      batchProgress: 41,
      batchNo: 'BT-2024-0892-A',
      recipe: 'R-LOTION-MO-150',
      elapsedMin: 49,
      remainMin: 71,
      plcAddr: 'DB1.DBW10',
    },
    {
      id: 'TK-201', name: '유상 믹싱 탱크 A', product: '크림 오일상', status: 'complete',
      capacity: 1000, current: 945 + Math.sin(t * 0.03) * 5,
      temp: 80.1 + Math.sin(t * 0.06) * 0.5,
      tempSP: 80.0,
      pressure: 2.01 + Math.sin(t * 0.08) * 0.02,
      pressureSP: 2.00,
      agitatorRPM: 60 + Math.sin(t * 0.09) * 1,
      agitatorSP: 60,
      viscosity: 8500 + Math.sin(t * 0.05) * 200,
      batchProgress: 100,
      batchNo: 'BT-2024-0893-A',
      recipe: 'R-CREAM-AA-50',
      elapsedMin: 120,
      remainMin: 0,
      plcAddr: 'DB2.DBW0',
    },
    {
      id: 'TK-202', name: '유상 믹싱 탱크 B', product: '—', status: 'idle',
      capacity: 1000, current: 0,
      temp: 24.5 + Math.sin(t * 0.02) * 0.3,
      tempSP: 0,
      pressure: 0.00,
      pressureSP: 0,
      agitatorRPM: 0,
      agitatorSP: 0,
      viscosity: 0,
      batchProgress: 0,
      batchNo: '—',
      recipe: '—',
      elapsedMin: 0,
      remainMin: 0,
      plcAddr: 'DB2.DBW10',
    },
    {
      id: 'TK-301', name: '균질화 탱크 (호모믹서)', product: '에멀전 믹싱', status: 'mixing',
      capacity: 3000, current: 2780 + Math.sin(t * 0.06) * 30,
      temp: 65.8 + Math.sin(t * 0.07) * 0.9,
      tempSP: 65.0,
      pressure: 2.45 + Math.sin(t * 0.1) * 0.08,
      pressureSP: 2.40,
      agitatorRPM: 3200 + Math.sin(t * 0.15) * 50,
      agitatorSP: 3200,
      viscosity: 12400 + Math.sin(t * 0.05) * 350,
      batchProgress: 62,
      batchNo: 'BT-2024-0890-F',
      recipe: 'R-EMULSION-BASE',
      elapsedMin: 74,
      remainMin: 46,
      plcAddr: 'DB3.DBW0',
    },
  ]

  // 원료 공급 밸브 상태
  const valves = [
    { id: 'V-101', name: '정제수 공급', tag: 'FV-101', status: 'open', flow: 42.3 + Math.sin(t * 0.1) * 1.2, flowSP: 42.0, unit: 'L/min', plcAddr: 'DB10.DBX0.0' },
    { id: 'V-102', name: '글리세린 공급', tag: 'FV-102', status: 'open', flow: 8.7 + Math.sin(t * 0.08) * 0.3, flowSP: 8.5, unit: 'L/min', plcAddr: 'DB10.DBX0.1' },
    { id: 'V-103', name: '히알루론산 투입', tag: 'FV-103', status: 'closed', flow: 0, flowSP: 0, unit: 'L/min', plcAddr: 'DB10.DBX0.2' },
    { id: 'V-104', name: '방부제 계량', tag: 'FV-104', status: 'open', flow: 0.32 + Math.sin(t * 0.05) * 0.01, flowSP: 0.30, unit: 'L/min', plcAddr: 'DB10.DBX0.3' },
    { id: 'V-105', name: '향료 투입', tag: 'FV-105', status: 'closed', flow: 0, flowSP: 0, unit: 'L/min', plcAddr: 'DB10.DBX0.4' },
    { id: 'V-201', name: '스팀 공급', tag: 'TV-201', status: 'open', flow: 18.5 + Math.sin(t * 0.12) * 0.8, flowSP: 18.0, unit: 'kg/hr', plcAddr: 'DB10.DBX1.0' },
    { id: 'V-202', name: '냉각수 공급', tag: 'CV-202', status: 'closed', flow: 0, flowSP: 0, unit: 'L/min', plcAddr: 'DB10.DBX1.1' },
  ]

  // PLC 인터락 및 알람
  const interlocks = [
    { id: 'IL-001', tag: 'TIC-101', desc: 'TK-101 온도 상한 인터락', status: 'normal', value: 72.3, limit: 85.0, unit: '°C' },
    { id: 'IL-002', tag: 'PIC-101', desc: 'TK-101 압력 상한 인터락', status: 'normal', value: 1.82, limit: 3.50, unit: 'bar' },
    { id: 'IL-003', tag: 'TIC-301', desc: '호모믹서 과열 방지', status: 'normal', value: 65.8, limit: 80.0, unit: '°C' },
    { id: 'IL-004', tag: 'AIC-101', desc: '교반기 과전류 보호', status: 'warning', value: 38.2, limit: 40.0, unit: 'A' },
    { id: 'IL-005', tag: 'LIC-301', desc: 'TK-301 하한 레벨 인터락', status: 'normal', value: 92.7, limit: 20.0, unit: '%' },
  ]

  // 배치 원료 투입 이력 (현재 진행중인 배치)
  const ingredients = [
    { seq: 1, name: '정제수 (Purified Water)', amount: 1200.0, actual: 1200.0, unit: 'kg', status: 'done', time: '08:12', robot: 'R001' },
    { seq: 2, name: '부틸렌글라이콜', amount: 80.0, actual: 80.2, unit: 'kg', status: 'done', time: '08:38', robot: 'R001' },
    { seq: 3, name: '글리세린', amount: 50.0, actual: 49.8, unit: 'kg', status: 'done', time: '08:51', robot: 'R002' },
    { seq: 4, name: '나이아신아마이드', amount: 32.0, actual: 32.1, unit: 'kg', status: 'done', time: '09:04', robot: 'R002' },
    { seq: 5, name: '히알루론산 (1%aq)', amount: 100.0, actual: 100.0, unit: 'kg', status: 'done', time: '09:22', robot: 'R001' },
    { seq: 6, name: '판테놀', amount: 10.0, actual: 10.0, unit: 'kg', status: 'doing', time: '진행중', robot: 'R001' },
    { seq: 7, name: '알란토인', amount: 5.0, actual: 0, unit: 'kg', status: 'pending', time: '—', robot: 'R002' },
    { seq: 8, name: '방부제 (페녹시에탄올)', amount: 8.0, actual: 0, unit: 'kg', status: 'pending', time: '—', robot: 'R002' },
    { seq: 9, name: '향료', amount: 3.0, actual: 0, unit: 'kg', status: 'pending', time: '—', robot: 'R002' },
    { seq: 10, name: '구연산 (pH 조정)', amount: 2.0, actual: 0, unit: 'kg', status: 'pending', time: '—', robot: 'R001' },
  ]

  // 트렌드 히스토리 (최근 60분, 1분 간격)
  const trendHistory = Array.from({ length: 60 }, (_, i) => {
    const minAgo = 60 - i
    const tBase = t - minAgo * 60
    return {
      label: `${String(Math.floor((new Date().getHours() * 60 + new Date().getMinutes() - minAgo + 1440) % 1440 / 60)).padStart(2,'0')}:${String(((new Date().getMinutes() - minAgo) % 60 + 60) % 60).padStart(2,'0')}`,
      temp101: parseFloat((72.3 + Math.sin(tBase * 0.08) * 1.2 + (i < 20 ? (i - 20) * 0.3 : 0)).toFixed(1)),
      pressure101: parseFloat((1.82 + Math.sin(tBase * 0.12) * 0.05).toFixed(3)),
      rpm101: parseFloat((145 + Math.sin(tBase * 0.1) * 3).toFixed(0)),
      temp301: parseFloat((65.8 + Math.sin(tBase * 0.07) * 0.9).toFixed(1)),
      rpm301: parseFloat((3200 + Math.sin(tBase * 0.15) * 50).toFixed(0)),
    }
  })

  return { tanks, valves, interlocks, ingredients, trendHistory, ts: new Date().toISOString() }
}

// PLC 실시간 데이터 API
app.get('/api/plc/mixing', (c) => {
  return c.json(simulatePLC())
})

// PLC 탱크별 상세
app.get('/api/plc/mixing/:tankId', (c) => {
  const data = simulatePLC()
  const tank = data.tanks.find(t => t.id === c.req.param('tankId'))
  if (!tank) return c.json({ error: 'Tank not found' }, 404)
  return c.json({ tank, trendHistory: data.trendHistory, ts: data.ts })
})

// 레시피 목록 API
app.get('/api/recipes', (c) => {
  const recipes = [
    { id: 'R-TONER-WH-200', name: '화이트닝 토너 200ml', version: 'v3.2', lastUpdated: '2024-08-15', steps: 8, totalTime: 120, status: 'active' },
    { id: 'R-LOTION-MO-150', name: '모이스처 로션 150ml', version: 'v2.8', lastUpdated: '2024-07-22', steps: 10, totalTime: 150, status: 'active' },
    { id: 'R-CREAM-AA-50', name: '안티에이징 크림 50ml', version: 'v4.1', lastUpdated: '2024-09-01', steps: 12, totalTime: 180, status: 'active' },
    { id: 'R-EMULSION-BASE', name: '에멀전 베이스 (공용)', version: 'v1.5', lastUpdated: '2024-06-10', steps: 9, totalTime: 130, status: 'active' },
    { id: 'R-SERUM-VC-30', name: '비타민C 세럼 30ml', version: 'v2.1', lastUpdated: '2024-08-28', steps: 11, totalTime: 140, status: 'review' },
  ]
  return c.json(recipes)
})

// ============================================================
// PLC 원료 혼합 상세 페이지 라우트
// ============================================================
app.get('/plc/mixing', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PLC 연동 - 원료 혼합 구역 | CosmoFactory MES</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
    * { font-family: 'Noto Sans KR', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }

    :root {
      --bg: #060d1a;
      --surface: #0d1b2e;
      --surface2: #112236;
      --surface3: #17304a;
      --border: #1e4060;
      --border2: #2a5580;
      --text: #c8dff5;
      --text-muted: #6b93b8;
      --accent: #00d4ff;
      --accent2: #00ff9d;
      --warn: #ffb300;
      --danger: #ff3d5a;
      --running: #00ff9d;
      --heating: #ff8c00;
    }

    body { background: var(--bg); color: var(--text); }

    /* 스캔라인 효과 */
    body::before {
      content: '';
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px);
      pointer-events: none; z-index: 0;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px; padding: 16px;
      position: relative; z-index: 1;
    }
    .card::before {
      content: ''; position: absolute;
      top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.3;
    }
    .card-sm {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px; padding: 12px;
    }

    /* SCADA 탱크 SVG 스타일 */
    .tank-svg { filter: drop-shadow(0 0 8px rgba(0,212,255,0.3)); }
    .tank-body { fill: var(--surface2); stroke: var(--border2); stroke-width: 2; }
    .tank-liquid-ok { fill: url(#liquidGrad); }
    .tank-liquid-warn { fill: rgba(255,140,0,0.6); }
    .tank-shell { fill: none; stroke: var(--accent); stroke-width: 1; opacity: 0.4; }

    /* 수치 표시 */
    .pv-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 28px; font-weight: 600;
      color: var(--accent);
      text-shadow: 0 0 12px rgba(0,212,255,0.6);
    }
    .pv-unit { font-size: 13px; color: var(--text-muted); margin-left: 4px; }
    .sp-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; color: var(--text-muted);
    }
    .deviation-ok { color: var(--accent2); font-size: 11px; }
    .deviation-warn { color: var(--warn); font-size: 11px; }
    .deviation-alarm { color: var(--danger); font-size: 11px; }

    /* 게이지 */
    .gauge-bar {
      height: 8px; border-radius: 4px;
      background: var(--surface3);
      overflow: hidden; position: relative;
    }
    .gauge-fill {
      height: 100%; border-radius: 4px;
      transition: width 0.8s ease;
    }
    .gauge-ok { background: linear-gradient(90deg, #00a86b, #00ff9d); }
    .gauge-warn { background: linear-gradient(90deg, #cc7700, #ffb300); }
    .gauge-high { background: linear-gradient(90deg, #cc2233, #ff3d5a); }

    /* 밸브 표시 */
    .valve-open {
      background: rgba(0,255,157,0.1);
      border: 1px solid rgba(0,255,157,0.4);
      border-radius: 6px;
    }
    .valve-closed {
      background: rgba(107,147,184,0.08);
      border: 1px solid rgba(107,147,184,0.2);
      border-radius: 6px;
    }
    .valve-dot-open { background: #00ff9d; box-shadow: 0 0 6px #00ff9d; }
    .valve-dot-closed { background: #6b93b8; }

    /* 인터락 */
    .interlock-normal {
      background: rgba(0,168,107,0.08);
      border: 1px solid rgba(0,255,157,0.15);
      border-radius: 6px;
    }
    .interlock-warning {
      background: rgba(255,179,0,0.1);
      border: 1px solid rgba(255,179,0,0.4);
      border-radius: 6px;
      animation: borderPulse 1.5s infinite;
    }
    .interlock-alarm {
      background: rgba(255,61,90,0.1);
      border: 1px solid rgba(255,61,90,0.5);
      border-radius: 6px;
    }
    @keyframes borderPulse {
      0%,100% { border-color: rgba(255,179,0,0.4); }
      50% { border-color: rgba(255,179,0,0.9); }
    }

    /* 탱크 상태 배지 */
    .badge-mixing { background: rgba(0,212,255,0.15); color: var(--accent); border: 1px solid rgba(0,212,255,0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; }
    .badge-heating { background: rgba(255,140,0,0.15); color: #ffb347; border: 1px solid rgba(255,140,0,0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-complete { background: rgba(0,255,157,0.15); color: var(--accent2); border: 1px solid rgba(0,255,157,0.3); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
    .badge-idle { background: rgba(107,147,184,0.1); color: var(--text-muted); border: 1px solid rgba(107,147,184,0.2); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }

    /* 원료 투입 단계 */
    .step-done { border-left: 3px solid var(--accent2); background: rgba(0,255,157,0.04); }
    .step-doing { border-left: 3px solid var(--accent); background: rgba(0,212,255,0.07); animation: stepPulse 2s infinite; }
    .step-pending { border-left: 3px solid var(--border2); background: transparent; opacity: 0.55; }
    @keyframes stepPulse { 0%,100%{background:rgba(0,212,255,0.07)} 50%{background:rgba(0,212,255,0.14)} }

    /* 탭 */
    .plc-tab { padding: 7px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-muted); border: 1px solid transparent; transition: all 0.2s; }
    .plc-tab.active { background: rgba(0,212,255,0.12); color: var(--accent); border-color: rgba(0,212,255,0.3); }
    .plc-tab:hover:not(.active) { color: var(--text); border-color: var(--border2); }

    /* PLC 연결 상태 바 */
    .comm-ok { color: var(--accent2); }
    .comm-badge { background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.3); padding: 3px 10px; border-radius: 4px; font-size: 11px; color: var(--accent2); font-weight: 600; }

    /* 플로우 라인 애니메이션 */
    .flow-anim { stroke-dasharray: 6 4; animation: flowMove 1.2s linear infinite; }
    @keyframes flowMove { to { stroke-dashoffset: -10; } }

    /* 선택된 탱크 하이라이트 */
    .tank-card { cursor: pointer; transition: all 0.2s; }
    .tank-card:hover { border-color: rgba(0,212,255,0.5); }
    .tank-card.selected { border-color: var(--accent) !important; box-shadow: 0 0 16px rgba(0,212,255,0.2); }

    .blink { animation: blink 1s step-end infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .section { display: none; }
    .section.active { display: block; }

    /* 스크롤바 */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }
  </style>
</head>
<body>

<!-- 상단 헤더 -->
<div style="background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;">
  <div class="flex items-center justify-between px-5 py-3">
    <div class="flex items-center gap-4">
      <a href="/" class="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors text-sm">
        <i class="fas fa-arrow-left"></i>
        <span>MES 대시보드</span>
      </a>
      <div style="width:1px;height:20px;background:var(--border)"></div>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded" style="background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-flask" style="color:var(--accent);font-size:14px;"></i>
        </div>
        <div>
          <div class="text-white font-semibold text-sm">원료 혼합 구역 (Zone A)</div>
          <div class="mono text-xs" style="color:var(--text-muted);">PLC: SIEMENS S7-1500 · OPC-UA · DB1~DB10</div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <!-- PLC 통신 상태 -->
      <div class="comm-badge flex items-center gap-2">
        <span style="width:7px;height:7px;border-radius:50%;background:var(--accent2);display:inline-block;box-shadow:0 0 6px var(--accent2);" class="blink"></span>
        PLC 연결됨 · Cycle 12ms
      </div>
      <div class="mono text-xs" style="color:var(--text-muted);" id="plc-ts">—</div>
      <button onclick="loadAll()" style="background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.3);color:var(--accent);padding:5px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">
        <i class="fas fa-sync-alt mr-1"></i> 갱신
      </button>
    </div>
  </div>
  <!-- 탭 -->
  <div class="flex items-center gap-2 px-5 pb-3">
    <button class="plc-tab active" onclick="switchTab('overview',this)">전체 현황</button>
    <button class="plc-tab" onclick="switchTab('trend',this)">트렌드 차트</button>
    <button class="plc-tab" onclick="switchTab('ingredients',this)">원료 투입 이력</button>
    <button class="plc-tab" onclick="switchTab('valves',this)">밸브 / 유량</button>
    <button class="plc-tab" onclick="switchTab('interlocks',this)">인터락 / 알람</button>
    <button class="plc-tab" onclick="switchTab('recipes',this)">배치 레시피</button>
  </div>
</div>

<div class="p-5">

  <!-- ===== 탭: 전체 현황 ===== -->
  <div id="tab-overview" class="section active">

    <!-- 요약 KPI -->
    <div class="grid grid-cols-5 gap-3 mb-5">
      <div class="card-sm text-center">
        <div class="text-xs mb-1" style="color:var(--text-muted)">가동 탱크</div>
        <div class="mono text-2xl font-bold" style="color:var(--accent)" id="kpi-active-tanks">—</div>
        <div class="text-xs" style="color:var(--text-muted)">/ 5기</div>
      </div>
      <div class="card-sm text-center">
        <div class="text-xs mb-1" style="color:var(--text-muted)">진행중 배치</div>
        <div class="mono text-2xl font-bold" style="color:var(--accent2)" id="kpi-batches">—</div>
        <div class="text-xs" style="color:var(--text-muted)">건</div>
      </div>
      <div class="card-sm text-center">
        <div class="text-xs mb-1" style="color:var(--text-muted)">인터락 경고</div>
        <div class="mono text-2xl font-bold" style="color:var(--warn)" id="kpi-interlocks">—</div>
        <div class="text-xs" style="color:var(--text-muted)">건</div>
      </div>
      <div class="card-sm text-center">
        <div class="text-xs mb-1" style="color:var(--text-muted)">개방 밸브</div>
        <div class="mono text-2xl font-bold" style="color:var(--accent)" id="kpi-valves">—</div>
        <div class="text-xs" style="color:var(--text-muted)">개</div>
      </div>
      <div class="card-sm text-center">
        <div class="text-xs mb-1" style="color:var(--text-muted)">오늘 배치 완료</div>
        <div class="mono text-2xl font-bold text-white">8</div>
        <div class="text-xs" style="color:var(--accent2)">배치</div>
      </div>
    </div>

    <!-- 탱크 카드 그리드 -->
    <div class="grid grid-cols-5 gap-3 mb-5" id="tank-grid"></div>

    <!-- 선택된 탱크 상세 -->
    <div id="tank-detail-panel" class="card hidden">
      <div id="tank-detail-content"></div>
    </div>

    <!-- 공정 흐름도 (P&ID 간략) -->
    <div class="card mt-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold text-sm" style="color:var(--accent)">
          <i class="fas fa-project-diagram mr-2"></i>P&ID 흐름도 — 수상·유상 혼합 공정
        </h3>
        <span class="mono text-xs" style="color:var(--text-muted)">Zone A · 실시간 연동</span>
      </div>
      <svg viewBox="0 0 900 220" class="w-full" style="max-height:220px;">
        <defs>
          <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#0066aa" stop-opacity="0.5"/>
          </linearGradient>
          <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#00d4ff" opacity="0.8"/>
          </marker>
          <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#00ff9d" opacity="0.8"/>
          </marker>
        </defs>
        <!-- 배경 -->
        <rect width="900" height="220" fill="var(--surface2)" rx="6"/>

        <!-- 정제수 공급 -->
        <rect x="10" y="10" width="80" height="36" rx="4" fill="var(--surface3)" stroke="#2a5580" stroke-width="1"/>
        <text x="50" y="25" fill="#6b93b8" font-size="9" text-anchor="middle">정제수 공급</text>
        <text x="50" y="38" fill="#00d4ff" font-size="10" text-anchor="middle" font-weight="bold">FV-101</text>

        <!-- 정제수 → TK-101 -->
        <line x1="90" y1="28" x2="148" y2="28" stroke="#00d4ff" stroke-width="1.5" marker-end="url(#arrowBlue)"/>
        <line x1="90" y1="28" x2="148" y2="28" stroke="#00d4ff" stroke-width="3" opacity="0.15" class="flow-anim" stroke-dasharray="6 4"/>

        <!-- TK-101 수상 -->
        <rect x="150" y="10" width="110" height="90" rx="6" fill="var(--surface3)" stroke="#2a5580" stroke-width="1.5"/>
        <rect x="155" y="55" width="100" height="40" rx="2" fill="url(#liquidGrad)" id="pid-tk101-liquid"/>
        <text x="205" y="30" fill="#00d4ff" font-size="11" text-anchor="middle" font-weight="bold">TK-101</text>
        <text x="205" y="45" fill="#6b93b8" font-size="9" text-anchor="middle">수상 믹싱 A</text>
        <text x="205" y="85" fill="#c8dff5" font-size="10" text-anchor="middle" id="pid-tk101-temp">72.3°C</text>
        <text x="205" y="97" fill="#6b93b8" font-size="8" text-anchor="middle" id="pid-tk101-rpm">145 RPM</text>
        <!-- 교반기 아이콘 -->
        <line x1="205" y1="55" x2="205" y2="40" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>
        <ellipse cx="205" cy="54" rx="10" ry="3" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.5"/>

        <!-- TK-102 수상 -->
        <rect x="280" y="10" width="110" height="90" rx="6" fill="var(--surface3)" stroke="#2a5580" stroke-width="1.5"/>
        <rect x="285" y="60" width="100" height="35" rx="2" fill="rgba(255,140,0,0.4)" id="pid-tk102-liquid"/>
        <text x="335" y="30" fill="#ffb347" font-size="11" text-anchor="middle" font-weight="bold">TK-102</text>
        <text x="335" y="45" fill="#6b93b8" font-size="9" text-anchor="middle">수상 믹싱 B</text>
        <text x="335" y="82" fill="#c8dff5" font-size="10" text-anchor="middle" id="pid-tk102-temp">58.7°C</text>
        <text x="335" y="94" fill="#ffb347" font-size="8" text-anchor="middle">가열중</text>

        <!-- TK-101 → 호모믹서 -->
        <line x1="260" y1="60" x2="420" y2="60" stroke="#00d4ff" stroke-width="1.5" marker-end="url(#arrowBlue)"/>
        <line x1="260" y1="60" x2="420" y2="60" stroke="#00d4ff" stroke-width="3" opacity="0.15" class="flow-anim"/>
        <!-- 밸브 표시 -->
        <polygon points="290,54 310,60 290,66" fill="#00d4ff" opacity="0.5"/>
        <polygon points="310,54 290,60 310,66" fill="#00d4ff" opacity="0.5"/>
        <text x="300" y="50" fill="#00d4ff" font-size="7" text-anchor="middle">TV-301</text>

        <!-- TK-201 유상 -->
        <rect x="150" y="120" width="110" height="80" rx="6" fill="var(--surface3)" stroke="#2a5580" stroke-width="1.5"/>
        <rect x="155" y="160" width="100" height="35" rx="2" fill="rgba(255,100,0,0.3)"/>
        <text x="205" y="140" fill="#ff8c42" font-size="11" text-anchor="middle" font-weight="bold">TK-201</text>
        <text x="205" y="155" fill="#6b93b8" font-size="9" text-anchor="middle">유상 믹싱 A</text>
        <text x="205" y="178" fill="#c8dff5" font-size="10" text-anchor="middle" id="pid-tk201-temp">80.1°C</text>
        <text x="205" y="190" fill="#00ff9d" font-size="8" text-anchor="middle">완료</text>

        <!-- TK-201 → 호모믹서 -->
        <line x1="260" y1="160" x2="440" y2="140" stroke="#ff8c42" stroke-width="1.5" marker-end="url(#arrowBlue)"/>
        <line x1="260" y1="160" x2="440" y2="140" stroke="#ff8c42" stroke-width="3" opacity="0.15" class="flow-anim"/>

        <!-- 호모믹서 TK-301 -->
        <rect x="420" y="20" width="130" height="170" rx="8" fill="var(--surface3)" stroke="#00d4ff" stroke-width="1.5"/>
        <rect x="428" y="100" width="114" height="85" rx="3" fill="url(#liquidGrad)" opacity="0.8"/>
        <text x="485" y="42" fill="#00d4ff" font-size="12" text-anchor="middle" font-weight="bold">TK-301</text>
        <text x="485" y="57" fill="#6b93b8" font-size="9" text-anchor="middle">균질화 탱크</text>
        <text x="485" y="72" fill="#c8dff5" font-size="9" text-anchor="middle">(호모믹서)</text>
        <!-- 고속 교반기 -->
        <line x1="485" y1="98" x2="485" y2="78" stroke="#00d4ff" stroke-width="2" opacity="0.7"/>
        <ellipse cx="485" cy="100" rx="16" ry="4" fill="none" stroke="#00d4ff" stroke-width="1.5" opacity="0.7"/>
        <ellipse cx="485" cy="100" rx="8" ry="2" fill="#00d4ff" opacity="0.3"/>
        <text x="485" y="155" fill="#c8dff5" font-size="11" text-anchor="middle" id="pid-tk301-temp">65.8°C</text>
        <text x="485" y="170" fill="#00d4ff" font-size="10" text-anchor="middle" id="pid-tk301-rpm">3200 RPM</text>
        <text x="485" y="182" fill="#6b93b8" font-size="8" text-anchor="middle">점도: 12,400 cP</text>

        <!-- 배치 진행률 바 -->
        <rect x="428" y="188" width="114" height="6" rx="3" fill="var(--surface)"/>
        <rect x="428" y="188" width="71" height="6" rx="3" fill="#00d4ff" opacity="0.8" id="pid-tk301-prog"/>
        <text x="485" y="205" fill="#00d4ff" font-size="8" text-anchor="middle">62% 진행</text>

        <!-- TK-301 → 충진 라인 -->
        <line x1="550" y1="110" x2="670" y2="110" stroke="#00ff9d" stroke-width="2" marker-end="url(#arrowGreen)"/>
        <line x1="550" y1="110" x2="670" y2="110" stroke="#00ff9d" stroke-width="4" opacity="0.1" class="flow-anim"/>
        <text x="610" y="105" fill="#6b93b8" font-size="8" text-anchor="middle">이송 펌프</text>
        <text x="610" y="116" fill="#00ff9d" font-size="8" text-anchor="middle">P-301</text>

        <!-- 충진 라인 박스 -->
        <rect x="670" y="80" width="100" height="60" rx="6" fill="rgba(0,168,107,0.1)" stroke="rgba(0,255,157,0.3)" stroke-width="1.5"/>
        <text x="720" y="105" fill="#00ff9d" font-size="10" text-anchor="middle" font-weight="bold">충진 라인</text>
        <text x="720" y="120" fill="#6b93b8" font-size="8" text-anchor="middle">Zone B</text>
        <text x="720" y="133" fill="#c8dff5" font-size="9" text-anchor="middle">245 개/분</text>

        <!-- 스팀 공급 -->
        <rect x="800" y="10" width="85" height="36" rx="4" fill="var(--surface3)" stroke="#2a5580" stroke-width="1"/>
        <text x="842" y="25" fill="#6b93b8" font-size="9" text-anchor="middle">스팀 공급</text>
        <text x="842" y="38" fill="#ffb347" font-size="10" text-anchor="middle" font-weight="bold">TV-201</text>
        <line x1="800" y1="28" x2="560" y2="80" stroke="#ffb347" stroke-width="1" stroke-dasharray="4 3" opacity="0.5"/>

        <!-- 범례 -->
        <line x1="10" y1="210" x2="35" y2="210" stroke="#00d4ff" stroke-width="1.5"/>
        <text x="40" y="213" fill="#6b93b8" font-size="8">수상 흐름</text>
        <line x1="90" y1="210" x2="115" y2="210" stroke="#ff8c42" stroke-width="1.5"/>
        <text x="120" y="213" fill="#6b93b8" font-size="8">유상 흐름</text>
        <line x1="170" y1="210" x2="195" y2="210" stroke="#00ff9d" stroke-width="1.5"/>
        <text x="200" y="213" fill="#6b93b8" font-size="8">완제 반제품</text>
        <line x1="250" y1="210" x2="275" y2="210" stroke="#ffb347" stroke-width="1" stroke-dasharray="4 3"/>
        <text x="280" y="213" fill="#6b93b8" font-size="8">스팀/유틸리티</text>
      </svg>
    </div>
  </div>

  <!-- ===== 탭: 트렌드 차트 ===== -->
  <div id="tab-trend" class="section">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-sm" style="color:var(--accent)">TK-101 온도 트렌드</h3>
            <div class="mono text-xs" style="color:var(--text-muted)">Tag: TIC-101 · SP: 72.0°C</div>
          </div>
          <div class="mono text-xs" style="color:var(--accent2)" id="trend-tk101-temp-now">—</div>
        </div>
        <canvas id="chart-temp101" height="130"></canvas>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-sm" style="color:var(--accent)">TK-101 압력 트렌드</h3>
            <div class="mono text-xs" style="color:var(--text-muted)">Tag: PIC-101 · SP: 1.80 bar</div>
          </div>
          <div class="mono text-xs" style="color:var(--accent2)" id="trend-tk101-pres-now">—</div>
        </div>
        <canvas id="chart-pres101" height="130"></canvas>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-sm" style="color:var(--accent)">TK-101 교반 속도 트렌드</h3>
            <div class="mono text-xs" style="color:var(--text-muted)">Tag: SIC-101 · SP: 145 RPM</div>
          </div>
          <div class="mono text-xs" style="color:var(--accent2)" id="trend-tk101-rpm-now">—</div>
        </div>
        <canvas id="chart-rpm101" height="130"></canvas>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="font-semibold text-sm" style="color:var(--accent)">TK-301 (호모믹서) 온도 + RPM</h3>
            <div class="mono text-xs" style="color:var(--text-muted)">Tag: TIC-301 / SIC-301</div>
          </div>
          <div class="mono text-xs" style="color:var(--accent2)" id="trend-tk301-now">—</div>
        </div>
        <canvas id="chart-homo" height="130"></canvas>
      </div>
    </div>
  </div>

  <!-- ===== 탭: 원료 투입 이력 ===== -->
  <div id="tab-ingredients" class="section">
    <div class="grid grid-cols-3 gap-4 mb-4">
      <div class="col-span-2 card">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="font-semibold text-sm" style="color:var(--accent)">배치 원료 투입 순서 — BT-2024-0891-A</h3>
            <div class="mono text-xs mt-1" style="color:var(--text-muted)">레시피: R-TONER-WH-200 v3.2 · 로봇: R001, R002 자동 투입</div>
          </div>
          <div class="flex items-center gap-2">
            <span style="background:rgba(0,255,157,0.1);border:1px solid rgba(0,255,157,0.3);color:var(--accent2);padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">진행중</span>
            <span class="mono text-xs" style="color:var(--text-muted)">78% 완료</span>
          </div>
        </div>
        <div class="space-y-2" id="ingredient-list"></div>
      </div>
      <div class="card">
        <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">투입 현황 요약</h3>
        <div class="space-y-3">
          <div class="card-sm">
            <div class="text-xs mb-1" style="color:var(--text-muted)">총 원료 수</div>
            <div class="mono text-xl font-bold" style="color:var(--accent)">10<span class="text-sm text-slate-400 font-normal"> 종</span></div>
          </div>
          <div class="card-sm">
            <div class="text-xs mb-1" style="color:var(--text-muted)">투입 완료</div>
            <div class="mono text-xl font-bold" style="color:var(--accent2)" id="ing-done-count">—</div>
          </div>
          <div class="card-sm">
            <div class="text-xs mb-1" style="color:var(--text-muted)">현재 투입중</div>
            <div class="mono text-xl font-bold" style="color:var(--accent)" id="ing-doing">—</div>
          </div>
          <div class="card-sm">
            <div class="text-xs mb-1" style="color:var(--text-muted)">잔여</div>
            <div class="mono text-xl font-bold text-white" id="ing-pending-count">—</div>
          </div>
          <div class="card-sm">
            <div class="text-xs mb-1" style="color:var(--text-muted)">총 투입량 (실적)</div>
            <div class="mono text-lg font-bold text-white" id="ing-total-kg">—</div>
          </div>
          <div class="card-sm" style="background:rgba(0,212,255,0.05);border-color:rgba(0,212,255,0.2);">
            <div class="text-xs mb-1" style="color:var(--text-muted)">배치 진행률</div>
            <div class="mono text-xl font-bold" style="color:var(--accent)">78%</div>
            <div class="gauge-bar mt-2">
              <div class="gauge-fill gauge-ok" style="width:78%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 탭: 밸브 / 유량 ===== -->
  <div id="tab-valves" class="section">
    <div class="card mb-4">
      <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">
        <i class="fas fa-tint mr-2"></i>원료 공급 밸브 및 유량 제어 현황
      </h3>
      <div class="grid grid-cols-3 gap-3" id="valve-grid"></div>
    </div>
    <div class="card">
      <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">PLC 주소 맵 (Modbus / OPC-UA)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-xs mono">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">태그</th>
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">설명</th>
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">PLC 주소</th>
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">현재값</th>
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">단위</th>
              <th class="text-left py-2 px-3" style="color:var(--text-muted)">상태</th>
            </tr>
          </thead>
          <tbody id="plc-addr-table" style="divide-y divide-gray-700"></tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- ===== 탭: 인터락 / 알람 ===== -->
  <div id="tab-interlocks" class="section">
    <div class="grid grid-cols-2 gap-4">
      <div class="card">
        <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">
          <i class="fas fa-shield-alt mr-2"></i>PLC 인터락 상태
        </h3>
        <div class="space-y-2" id="interlock-list"></div>
      </div>
      <div class="card">
        <h3 class="font-semibold text-sm mb-4" style="color:var(--warn)">
          <i class="fas fa-bell mr-2"></i>알람 이력 (최근 24시간)
        </h3>
        <div class="space-y-2" id="alarm-history"></div>
      </div>
    </div>
    <div class="card mt-4">
      <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">
        <i class="fas fa-microchip mr-2"></i>PLC I/O 상태 요약
      </h3>
      <div class="grid grid-cols-4 gap-3">
        <div class="card-sm text-center">
          <div class="text-xs mb-1" style="color:var(--text-muted)">디지털 입력 (DI)</div>
          <div class="mono text-xl font-bold" style="color:var(--accent)">128</div>
          <div class="text-xs" style="color:var(--accent2)">정상</div>
        </div>
        <div class="card-sm text-center">
          <div class="text-xs mb-1" style="color:var(--text-muted)">디지털 출력 (DO)</div>
          <div class="mono text-xl font-bold" style="color:var(--accent)">96</div>
          <div class="text-xs" style="color:var(--accent2)">정상</div>
        </div>
        <div class="card-sm text-center">
          <div class="text-xs mb-1" style="color:var(--text-muted)">아날로그 입력 (AI)</div>
          <div class="mono text-xl font-bold" style="color:var(--accent)">64</div>
          <div class="text-xs" style="color:var(--warn)">1개 경고</div>
        </div>
        <div class="card-sm text-center">
          <div class="text-xs mb-1" style="color:var(--text-muted)">아날로그 출력 (AO)</div>
          <div class="mono text-xl font-bold" style="color:var(--accent)">32</div>
          <div class="text-xs" style="color:var(--accent2)">정상</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ===== 탭: 배치 레시피 ===== -->
  <div id="tab-recipes" class="section">
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1 card">
        <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">레시피 목록</h3>
        <div class="space-y-2" id="recipe-list"></div>
      </div>
      <div class="col-span-2 card" id="recipe-detail-panel">
        <h3 class="font-semibold text-sm mb-4" style="color:var(--accent)">레시피 상세 — R-TONER-WH-200</h3>
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="card-sm"><div class="text-xs" style="color:var(--text-muted)">버전</div><div class="mono font-bold" style="color:var(--accent)">v3.2</div></div>
          <div class="card-sm"><div class="text-xs" style="color:var(--text-muted)">공정 단계</div><div class="mono font-bold text-white">8 단계</div></div>
          <div class="card-sm"><div class="text-xs" style="color:var(--text-muted)">총 소요시간</div><div class="mono font-bold text-white">120 분</div></div>
        </div>
        <div class="space-y-2">
          ${[
            { step: 1, name: '정제수 투입 및 예열', param: '온도 SP: 70°C / 교반: 80 RPM', time: '15분', color: 'var(--accent2)' },
            { step: 2, name: '수용성 원료 계량 투입', param: '글리세린, 부틸렌글라이콜, 나이아신아마이드', time: '20분', color: 'var(--accent)' },
            { step: 3, name: '가열 및 분산', param: '온도 SP: 72°C / 교반: 145 RPM', time: '25분', color: 'var(--accent)' },
            { step: 4, name: '기능성 원료 투입', param: '히알루론산, 판테놀, 알란토인', time: '15분', color: 'var(--accent)' },
            { step: 5, name: '균질화 (호모믹서 이송)', param: '이송 후 3,200 RPM 균질화', time: '20분', color: 'var(--accent)' },
            { step: 6, name: '냉각', param: '냉각수 투입 / 목표 온도: 35°C', time: '15분', color: 'var(--text-muted)' },
            { step: 7, name: '방부제·향료 투입', param: '페녹시에탄올, 향료, pH 조정제', time: '5분', color: 'var(--text-muted)' },
            { step: 8, name: 'QC 샘플링 및 승인', param: '점도, pH, 외관 검사', time: '5분', color: 'var(--text-muted)' },
          ].map(s => `
            <div style="display:flex;align-items:flex-start;gap:12px;padding:10px;background:var(--surface2);border-radius:6px;border-left:3px solid ${s.color};">
              <div style="width:22px;height:22px;border-radius:50%;background:rgba(0,212,255,0.15);border:1px solid rgba(0,212,255,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <span style="font-size:10px;color:var(--accent);font-weight:700;">${s.step}</span>
              </div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;color:#c8dff5;">${s.name}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${s.param}</div>
              </div>
              <div style="font-size:11px;color:var(--text-muted);flex-shrink:0;">${s.time}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

</div>

<script>
let plcData = null;
let charts = {};
let selectedTank = 'TK-101';

// ======== 데이터 로드 ========
async function loadAll() {
  const [plcRes, recipeRes] = await Promise.all([
    fetch('/api/plc/mixing'),
    fetch('/api/recipes'),
  ]);
  plcData = await plcRes.json();
  const recipes = await recipeRes.json();

  document.getElementById('plc-ts').textContent = new Date(plcData.ts).toLocaleTimeString('ko-KR');

  renderKPIs();
  renderTankGrid();
  renderPID();
  renderTrends();
  renderIngredients();
  renderValves();
  renderInterlocks();
  renderRecipes(recipes);
}

// ======== KPI ========
function renderKPIs() {
  const active = plcData.tanks.filter(t => t.status !== 'idle').length;
  const batches = plcData.tanks.filter(t => t.status === 'mixing' || t.status === 'heating').length;
  const warnIL = plcData.interlocks.filter(i => i.status !== 'normal').length;
  const openV = plcData.valves.filter(v => v.status === 'open').length;
  document.getElementById('kpi-active-tanks').textContent = active;
  document.getElementById('kpi-batches').textContent = batches;
  document.getElementById('kpi-interlocks').textContent = warnIL;
  document.getElementById('kpi-valves').textContent = openV;
}

// ======== 탱크 그리드 ========
function renderTankGrid() {
  const el = document.getElementById('tank-grid');
  el.innerHTML = plcData.tanks.map(tk => {
    const fillPct = tk.capacity > 0 ? (tk.current / tk.capacity * 100).toFixed(1) : 0;
    const badgeHtml = {
      mixing: '<span class="badge-mixing">교반중</span>',
      heating: '<span class="badge-heating">가열중</span>',
      complete: '<span class="badge-complete">완료</span>',
      idle: '<span class="badge-idle">대기</span>',
    }[tk.status] || '';
    const tempDev = tk.tempSP > 0 ? (tk.temp - tk.tempSP).toFixed(1) : null;
    const devClass = tempDev === null ? '' : Math.abs(tempDev) <= 1 ? 'deviation-ok' : Math.abs(tempDev) <= 3 ? 'deviation-warn' : 'deviation-alarm';
    return \`
      <div class="card tank-card \${selectedTank===tk.id?'selected':''}" onclick="selectTank('\${tk.id}')">
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="mono text-xs" style="color:var(--accent);\${tk.status==='idle'?'opacity:0.5':''}">\${tk.id}</div>
            <div class="text-sm font-semibold" style="color:#c8dff5;">\${tk.name}</div>
          </div>
          \${badgeHtml}
        </div>

        \${tk.status !== 'idle' ? \`
        <!-- 온도 표시 -->
        <div class="flex items-end gap-1 mb-1">
          <span class="mono" style="font-size:22px;font-weight:700;color:var(--accent);text-shadow:0 0 10px rgba(0,212,255,0.5);">\${tk.temp.toFixed(1)}</span>
          <span class="mono text-xs" style="color:var(--text-muted);margin-bottom:4px;">°C</span>
          \${tempDev !== null ? \`<span class="\${devClass}" style="margin-bottom:4px;">\${tempDev >= 0 ? '+' : ''}\${tempDev}</span>\` : ''}
        </div>
        <div class="mono text-xs mb-2" style="color:var(--text-muted)">SP: \${tk.tempSP}°C</div>

        <!-- 레벨 게이지 -->
        <div class="flex items-center gap-2 mb-1">
          <div class="gauge-bar flex-1">
            <div class="gauge-fill \${tk.status==='complete'?'gauge-ok':'gauge-ok'}" style="width:\${fillPct}%"></div>
          </div>
          <span class="mono text-xs" style="color:var(--accent2);">\${fillPct}%</span>
        </div>
        <div class="mono text-xs mb-2" style="color:var(--text-muted)">\${Math.round(tk.current)} / \${tk.capacity} kg</div>

        <!-- 교반 RPM -->
        <div class="flex items-center justify-between">
          <span class="text-xs" style="color:var(--text-muted)">교반</span>
          <span class="mono text-xs" style="color:\${tk.status==='mixing'?'var(--accent2)':'#6b93b8'};">\${tk.agitatorRPM.toFixed(0)} RPM</span>
        </div>

        <!-- 배치 진행률 -->
        \${tk.batchNo !== '—' ? \`
        <div class="mt-2 pt-2" style="border-top:1px solid var(--border)">
          <div class="flex justify-between text-xs mb-1">
            <span class="mono" style="color:var(--text-muted);">\${tk.batchNo}</span>
            <span class="mono" style="color:var(--accent);">\${tk.batchProgress}%</span>
          </div>
          <div class="gauge-bar">
            <div class="gauge-fill \${tk.batchProgress>=100?'gauge-ok':'gauge-ok'}" style="width:\${Math.min(100,tk.batchProgress)}%"></div>
          </div>
          <div class="flex justify-between text-xs mt-1">
            <span style="color:var(--text-muted)">경과 \${tk.elapsedMin}분</span>
            <span style="color:\${tk.remainMin>0?'var(--warn)':'var(--accent2)'};">\${tk.remainMin>0?'잔여 '+tk.remainMin+'분':'완료'}</span>
          </div>
        </div>
        \` : ''}
        \` : \`
        <div class="text-center py-4" style="color:var(--text-muted);opacity:0.5;">
          <i class="fas fa-power-off text-2xl mb-2"></i>
          <div class="text-xs">대기 중</div>
        </div>
        \`}
      </div>
    \`;
  }).join('');
}

// ======== 탱크 선택 ========
function selectTank(id) {
  selectedTank = id;
  renderTankGrid();
  const tank = plcData.tanks.find(t => t.id === id);
  if (!tank || tank.status === 'idle') {
    document.getElementById('tank-detail-panel').classList.add('hidden');
    return;
  }
  const panel = document.getElementById('tank-detail-panel');
  panel.classList.remove('hidden');

  const fillPct = (tank.current / tank.capacity * 100).toFixed(1);
  const tempDev = (tank.temp - tank.tempSP).toFixed(2);
  const presDev = (tank.pressure - tank.pressureSP).toFixed(3);
  const rpmDev = (tank.agitatorRPM - tank.agitatorSP).toFixed(0);

  document.getElementById('tank-detail-content').innerHTML = \`
    <div class="flex items-center justify-between mb-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="mono font-bold" style="color:var(--accent);font-size:18px;">\${tank.id}</span>
          <span class="text-white font-semibold">\${tank.name}</span>
          <span class="mono text-xs" style="color:var(--text-muted);">PLC: \${tank.plcAddr}</span>
        </div>
        <div class="text-xs mt-1" style="color:var(--text-muted)">레시피: \${tank.recipe} · 배치: \${tank.batchNo}</div>
      </div>
      <div class="text-right">
        <div class="text-xs" style="color:var(--text-muted)">경과 / 잔여</div>
        <div class="mono text-sm" style="color:var(--warn)">\${tank.elapsedMin}분 경과 / \${tank.remainMin}분 잔여</div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-3 mb-4">
      <!-- 온도 -->
      <div class="card-sm">
        <div class="text-xs mb-1" style="color:var(--text-muted)">온도 (TIC)</div>
        <div class="flex items-end gap-1">
          <span class="mono" style="font-size:26px;font-weight:700;color:var(--accent);text-shadow:0 0 10px rgba(0,212,255,0.5);">\${tank.temp.toFixed(1)}</span>
          <span style="color:var(--text-muted);margin-bottom:3px;">°C</span>
        </div>
        <div class="mono text-xs" style="color:var(--text-muted)">SP: \${tank.tempSP}°C</div>
        <div class="mono text-xs \${Math.abs(tempDev)<=1?'deviation-ok':Math.abs(tempDev)<=3?'deviation-warn':'deviation-alarm'}">편차: \${tempDev>=0?'+':''}\${tempDev}°C</div>
        <div class="gauge-bar mt-2">
          <div class="gauge-fill \${Math.abs(tempDev)<=1?'gauge-ok':Math.abs(tempDev)<=3?'gauge-warn':'gauge-high'}" style="width:\${Math.min(100, tank.temp/85*100).toFixed(0)}%"></div>
        </div>
      </div>
      <!-- 압력 -->
      <div class="card-sm">
        <div class="text-xs mb-1" style="color:var(--text-muted)">압력 (PIC)</div>
        <div class="flex items-end gap-1">
          <span class="mono" style="font-size:26px;font-weight:700;color:var(--accent);text-shadow:0 0 10px rgba(0,212,255,0.5);">\${tank.pressure.toFixed(2)}</span>
          <span style="color:var(--text-muted);margin-bottom:3px;">bar</span>
        </div>
        <div class="mono text-xs" style="color:var(--text-muted)">SP: \${tank.pressureSP} bar</div>
        <div class="mono text-xs \${Math.abs(presDev)<=0.05?'deviation-ok':Math.abs(presDev)<=0.2?'deviation-warn':'deviation-alarm'}">편차: \${presDev>=0?'+':''}\${presDev}</div>
        <div class="gauge-bar mt-2">
          <div class="gauge-fill \${Math.abs(presDev)<=0.05?'gauge-ok':Math.abs(presDev)<=0.2?'gauge-warn':'gauge-high'}" style="width:\${Math.min(100, tank.pressure/3.5*100).toFixed(0)}%"></div>
        </div>
      </div>
      <!-- 교반 -->
      <div class="card-sm">
        <div class="text-xs mb-1" style="color:var(--text-muted)">교반 속도 (SIC)</div>
        <div class="flex items-end gap-1">
          <span class="mono" style="font-size:26px;font-weight:700;color:var(--accent);text-shadow:0 0 10px rgba(0,212,255,0.5);">\${tank.agitatorRPM.toFixed(0)}</span>
          <span style="color:var(--text-muted);margin-bottom:3px;">RPM</span>
        </div>
        <div class="mono text-xs" style="color:var(--text-muted)">SP: \${tank.agitatorSP} RPM</div>
        <div class="mono text-xs \${Math.abs(rpmDev)<=5?'deviation-ok':Math.abs(rpmDev)<=15?'deviation-warn':'deviation-alarm'}">편차: \${rpmDev>=0?'+':''}\${rpmDev}</div>
        <div class="gauge-bar mt-2">
          <div class="gauge-fill gauge-ok" style="width:\${Math.min(100, tank.agitatorRPM/5000*100).toFixed(0)}%"></div>
        </div>
      </div>
      <!-- 점도 / 레벨 -->
      <div class="card-sm">
        <div class="text-xs mb-1" style="color:var(--text-muted)">점도 / 레벨</div>
        <div class="flex items-end gap-1">
          <span class="mono" style="font-size:22px;font-weight:700;color:var(--accent);">\${tank.viscosity > 0 ? tank.viscosity.toFixed(0) : '—'}</span>
          <span style="color:var(--text-muted);margin-bottom:3px;font-size:11px;">\${tank.viscosity > 0 ? 'cP' : ''}</span>
        </div>
        <div class="mono text-xs" style="color:var(--text-muted)">레벨: \${fillPct}%</div>
        <div class="mono text-xs" style="color:var(--accent2)">\${Math.round(tank.current)} / \${tank.capacity} kg</div>
        <div class="gauge-bar mt-2">
          <div class="gauge-fill gauge-ok" style="width:\${fillPct}%"></div>
        </div>
      </div>
    </div>

    <!-- 배치 진행 타임라인 -->
    <div>
      <div class="text-xs font-semibold mb-2" style="color:var(--text-muted)">배치 진행률</div>
      <div class="flex items-center gap-3">
        <div class="gauge-bar flex-1" style="height:12px;">
          <div class="gauge-fill gauge-ok" style="width:\${tank.batchProgress}%;height:12px;"></div>
        </div>
        <span class="mono font-bold" style="color:var(--accent);">\${tank.batchProgress}%</span>
      </div>
    </div>
  \`;
}

// ======== P&ID 실시간 업데이트 ========
function renderPID() {
  const tk101 = plcData.tanks[0];
  const tk102 = plcData.tanks[1];
  const tk201 = plcData.tanks[2];
  const tk301 = plcData.tanks[4];
  if (!tk101 || !tk301) return;
  const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  el('pid-tk101-temp', tk101.temp.toFixed(1) + '°C');
  el('pid-tk101-rpm', tk101.agitatorRPM.toFixed(0) + ' RPM');
  el('pid-tk102-temp', tk102.temp.toFixed(1) + '°C');
  el('pid-tk201-temp', tk201.temp.toFixed(1) + '°C');
  el('pid-tk301-temp', tk301.temp.toFixed(1) + '°C');
  el('pid-tk301-rpm', tk301.agitatorRPM.toFixed(0) + ' RPM');
}

// ======== 트렌드 차트 ========
function renderTrends() {
  const hist = plcData.trendHistory;
  const labels = hist.map(h => h.label);
  const last = hist.length > 0 ? hist[hist.length - 1] : {};

  const el = (id, val) => { const e = document.getElementById(id); if(e) e.textContent = val; };
  el('trend-tk101-temp-now', last.temp101 + '°C');
  el('trend-tk101-pres-now', last.pressure101 + ' bar');
  el('trend-tk101-rpm-now', last.rpm101 + ' RPM');
  el('trend-tk301-now', last.temp301 + '°C / ' + last.rpm301 + ' RPM');

  const chartOptions = (yLabel, min, max, color) => ({
    responsive: true,
    animation: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: '#6b93b8', font: { size: 9, family: 'JetBrains Mono' }, maxTicksLimit: 10 }, grid: { color: 'rgba(30,64,96,0.5)' } },
      y: { title: { display: true, text: yLabel, color: '#6b93b8', font: { size: 9 } }, ticks: { color: '#6b93b8', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: 'rgba(30,64,96,0.5)' }, min, max }
    }
  });

  const spLine = (val, len) => Array(len).fill(val);

  if (!charts.temp101) {
    charts.temp101 = new Chart(document.getElementById('chart-temp101'), {
      type: 'line', data: {
        labels,
        datasets: [
          { label: 'PV', data: hist.map(h => h.temp101), borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.05)', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: true },
          { label: 'SP', data: spLine(72.0, labels.length), borderColor: '#ff3d5a', borderWidth: 1, borderDash: [4,3], pointRadius: 0 },
        ]
      }, options: chartOptions('°C', 65, 80)
    });
  } else {
    charts.temp101.data.labels = labels;
    charts.temp101.data.datasets[0].data = hist.map(h => h.temp101);
    charts.temp101.update('none');
  }

  if (!charts.pres101) {
    charts.pres101 = new Chart(document.getElementById('chart-pres101'), {
      type: 'line', data: {
        labels,
        datasets: [
          { label: 'PV', data: hist.map(h => h.pressure101), borderColor: '#00ff9d', backgroundColor: 'rgba(0,255,157,0.05)', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: true },
          { label: 'SP', data: spLine(1.80, labels.length), borderColor: '#ff3d5a', borderWidth: 1, borderDash: [4,3], pointRadius: 0 },
        ]
      }, options: chartOptions('bar', 1.6, 2.1)
    });
  } else {
    charts.pres101.data.labels = labels;
    charts.pres101.data.datasets[0].data = hist.map(h => h.pressure101);
    charts.pres101.update('none');
  }

  if (!charts.rpm101) {
    charts.rpm101 = new Chart(document.getElementById('chart-rpm101'), {
      type: 'line', data: {
        labels,
        datasets: [
          { label: 'PV', data: hist.map(h => h.rpm101), borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.05)', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: true },
          { label: 'SP', data: spLine(145, labels.length), borderColor: '#ff3d5a', borderWidth: 1, borderDash: [4,3], pointRadius: 0 },
        ]
      }, options: chartOptions('RPM', 130, 160)
    });
  } else {
    charts.rpm101.data.labels = labels;
    charts.rpm101.data.datasets[0].data = hist.map(h => h.rpm101);
    charts.rpm101.update('none');
  }

  if (!charts.homo) {
    charts.homo = new Chart(document.getElementById('chart-homo'), {
      type: 'line', data: {
        labels,
        datasets: [
          { label: '온도(°C)', data: hist.map(h => h.temp301), borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.03)', borderWidth: 1.5, pointRadius: 0, tension: 0.3, yAxisID: 'y' },
          { label: 'RPM', data: hist.map(h => h.rpm301 / 100), borderColor: '#f59e0b', borderWidth: 1.5, pointRadius: 0, tension: 0.3, yAxisID: 'y2', borderDash: [3,2] },
        ]
      }, options: {
        responsive: true, animation: false,
        plugins: { legend: { labels: { color: '#6b93b8', font: { size: 10 }, boxWidth: 12 } } },
        scales: {
          x: { ticks: { color: '#6b93b8', font: { size: 9, family: 'JetBrains Mono' }, maxTicksLimit: 10 }, grid: { color: 'rgba(30,64,96,0.5)' } },
          y: { position: 'left', ticks: { color: '#00d4ff', font: { size: 9, family: 'JetBrains Mono' } }, grid: { color: 'rgba(30,64,96,0.3)' }, min: 60, max: 75, title: { display: true, text: '온도(°C)', color: '#00d4ff', font: { size: 9 } } },
          y2: { position: 'right', ticks: { color: '#f59e0b', font: { size: 9, family: 'JetBrains Mono' }, callback: v => v*100 }, grid: { display: false }, min: 30, max: 35, title: { display: true, text: 'RPM(×100)', color: '#f59e0b', font: { size: 9 } } },
        }
      }
    });
  } else {
    charts.homo.data.labels = labels;
    charts.homo.data.datasets[0].data = hist.map(h => h.temp301);
    charts.homo.data.datasets[1].data = hist.map(h => h.rpm301 / 100);
    charts.homo.update('none');
  }
}

// ======== 원료 투입 이력 ========
function renderIngredients() {
  const ings = plcData.ingredients;
  const el = document.getElementById('ingredient-list');
  el.innerHTML = ings.map(ing => {
    const cls = { done: 'step-done', doing: 'step-doing', pending: 'step-pending' }[ing.status];
    const icon = { done: 'fa-check-circle', doing: 'fa-spinner fa-spin', pending: 'fa-circle' }[ing.status];
    const iconColor = { done: 'var(--accent2)', doing: 'var(--accent)', pending: 'var(--border2)' }[ing.status];
    const accuracy = ing.actual > 0 ? ((Math.abs(ing.actual - ing.amount) / ing.amount) * 100).toFixed(2) : null;
    return \`
      <div class="\${cls} rounded p-3">
        <div class="flex items-center gap-3">
          <span class="mono text-xs" style="color:var(--text-muted);width:20px;text-align:right;">\${ing.seq}</span>
          <i class="fas \${icon}" style="color:\${iconColor};font-size:14px;width:16px;text-align:center;"></i>
          <div class="flex-1">
            <div class="text-sm font-semibold" style="color:#c8dff5;">\${ing.name}</div>
            <div class="flex items-center gap-3 mt-1">
              <span class="mono text-xs" style="color:var(--text-muted)">계획: \${ing.amount} \${ing.unit}</span>
              \${ing.actual > 0 ? \`<span class="mono text-xs" style="color:var(--accent2)">실적: \${ing.actual} \${ing.unit}</span>\` : ''}
              \${accuracy !== null ? \`<span class="mono text-xs \${parseFloat(accuracy)<=0.5?'deviation-ok':parseFloat(accuracy)<=1?'deviation-warn':'deviation-alarm'}">정확도: \${(100-parseFloat(accuracy)).toFixed(2)}%</span>\` : ''}
            </div>
          </div>
          <div class="text-right">
            <div class="mono text-xs" style="color:var(--text-muted)">\${ing.time}</div>
            <div class="mono text-xs mt-1" style="color:var(--text-muted)">로봇: \${ing.robot}</div>
          </div>
        </div>
      </div>
    \`;
  }).join('');

  const done = ings.filter(i => i.status === 'done');
  const doing = ings.find(i => i.status === 'doing');
  const pending = ings.filter(i => i.status === 'pending');
  const totalKg = done.reduce((sum, i) => sum + i.actual, 0);
  const el2 = (id, v) => { const e = document.getElementById(id); if(e) e.textContent = v; };
  el2('ing-done-count', done.length + ' 종');
  el2('ing-doing', doing ? doing.name.split(' ')[0] + '...' : '—');
  el2('ing-pending-count', pending.length + ' 종');
  el2('ing-total-kg', totalKg.toFixed(1) + ' kg');
}

// ======== 밸브 / 유량 ========
function renderValves() {
  const el = document.getElementById('valve-grid');
  el.innerHTML = plcData.valves.map(v => {
    const isOpen = v.status === 'open';
    const devPct = v.flowSP > 0 ? Math.abs((v.flow - v.flowSP) / v.flowSP * 100).toFixed(1) : 0;
    return \`
      <div class="\${isOpen ? 'valve-open' : 'valve-closed'} p-3">
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="mono text-xs font-bold" style="color:\${isOpen?'var(--accent)':'var(--text-muted)'};">\${v.tag}</div>
            <div class="text-sm font-semibold mt-0.5" style="color:#c8dff5;">\${v.name}</div>
          </div>
          <div class="flex items-center gap-2">
            <span style="width:8px;height:8px;border-radius:50%;display:inline-block;" class="\${isOpen?'valve-dot-open':' valve-dot-closed'}"></span>
            <span class="mono text-xs font-bold" style="color:\${isOpen?'var(--accent2)':'var(--text-muted)'};">\${isOpen?'개방':'닫힘'}</span>
          </div>
        </div>
        \${isOpen ? \`
        <div class="flex items-end gap-1 mb-1">
          <span class="mono font-bold" style="font-size:20px;color:var(--accent);">\${v.flow.toFixed(2)}</span>
          <span class="mono text-xs" style="color:var(--text-muted);margin-bottom:2px;">\${v.unit}</span>
        </div>
        <div class="mono text-xs" style="color:var(--text-muted)">SP: \${v.flowSP} \${v.unit} · 편차: \${devPct}%</div>
        <div class="gauge-bar mt-2">
          <div class="gauge-fill \${devPct<=2?'gauge-ok':devPct<=5?'gauge-warn':'gauge-high'}" style="width:\${Math.min(100, v.flow/Math.max(v.flowSP,1)*100).toFixed(0)}%"></div>
        </div>
        \` : \`<div class="mono text-xs mt-1" style="color:var(--text-muted);">유량: 0.00 \${v.unit}</div>\`}
        <div class="mono text-xs mt-2" style="color:var(--border2);">PLC: \${v.plcAddr}</div>
      </div>
    \`;
  }).join('');

  const tableEl = document.getElementById('plc-addr-table');
  tableEl.innerHTML = plcData.valves.map(v => \`
    <tr style="border-bottom:1px solid var(--border)">
      <td class="py-2 px-3" style="color:var(--accent);">\${v.tag}</td>
      <td class="py-2 px-3" style="color:#c8dff5;">\${v.name}</td>
      <td class="py-2 px-3" style="color:var(--text-muted);">\${v.plcAddr}</td>
      <td class="py-2 px-3" style="color:\${v.status==='open'?'var(--accent2)':'var(--text-muted)'};">\${v.flow.toFixed(2)}</td>
      <td class="py-2 px-3" style="color:var(--text-muted);">\${v.unit}</td>
      <td class="py-2 px-3"><span style="padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700;\${v.status==='open'?'background:rgba(0,255,157,0.1);color:var(--accent2);border:1px solid rgba(0,255,157,0.3);':'background:rgba(107,147,184,0.1);color:var(--text-muted);border:1px solid var(--border);'}">\${v.status==='open'?'OPEN':'CLOSED'}</span></td>
    </tr>
  \`).join('');
}

// ======== 인터락 ========
function renderInterlocks() {
  const el = document.getElementById('interlock-list');
  el.innerHTML = plcData.interlocks.map(il => {
    const cls = { normal: 'interlock-normal', warning: 'interlock-warning', alarm: 'interlock-alarm' }[il.status];
    const icon = { normal: 'fa-check-shield', warning: 'fa-exclamation-triangle', alarm: 'fa-times-circle' }[il.status] || 'fa-shield-alt';
    const color = { normal: 'var(--accent2)', warning: 'var(--warn)', alarm: 'var(--danger)' }[il.status];
    const pct = (il.value / il.limit * 100).toFixed(0);
    return \`
      <div class="\${cls} p-3">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <i class="fas \${icon}" style="color:\${color};"></i>
            <div>
              <div class="mono text-xs font-bold" style="color:\${color};">\${il.tag}</div>
              <div class="text-sm" style="color:#c8dff5;">\${il.desc}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="mono font-bold" style="color:\${color};font-size:18px;">\${il.value}</div>
            <div class="mono text-xs" style="color:var(--text-muted)">한계: \${il.limit} \${il.unit}</div>
          </div>
        </div>
        <div class="gauge-bar">
          <div class="gauge-fill \${pct>=90?'gauge-high':pct>=70?'gauge-warn':'gauge-ok'}" style="width:\${Math.min(100,pct)}%"></div>
        </div>
        <div class="mono text-xs mt-1" style="color:var(--text-muted)">현재값의 \${pct}% 도달</div>
      </div>
    \`;
  }).join('');

  const alarmEl = document.getElementById('alarm-history');
  const alarms = [
    { time: '16:42', level: 'warning', tag: 'AIC-101', msg: '교반기 전류 상승 — 38.2A (한계 40A)', ack: true },
    { time: '14:15', level: 'info', tag: 'TIC-102', msg: 'TK-102 가열 시작 — 목표온도 75°C 설정', ack: true },
    { time: '12:30', level: 'warning', tag: 'FV-101', msg: '정제수 공급 유량 편차 5% 초과', ack: true },
    { time: '10:05', level: 'info', tag: 'BT-0890', msg: '배치 BT-2024-0890-F 시작 — TK-301', ack: true },
    { time: '09:12', level: 'info', tag: 'BT-0891', msg: '배치 BT-2024-0891-A 시작 — TK-101', ack: true },
    { time: '08:55', level: 'alarm', tag: 'PIC-201', msg: 'TK-201 압력 이상 — 즉시 복구됨', ack: true },
  ];
  alarmEl.innerHTML = alarms.map(a => {
    const color = { alarm: 'var(--danger)', warning: 'var(--warn)', info: 'var(--accent)' }[a.level];
    const icon = { alarm: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }[a.level];
    return \`
      <div style="padding:10px;border-radius:6px;background:var(--surface2);border-left:3px solid \${color};">
        <div class="flex items-start gap-2">
          <i class="fas \${icon}" style="color:\${color};margin-top:2px;font-size:12px;"></i>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="mono text-xs font-bold" style="color:\${color};">\${a.tag}</span>
              \${a.ack ? '<span style="font-size:10px;color:var(--accent2);">확인완료</span>' : '<span style="font-size:10px;color:var(--danger);font-weight:700;">미확인</span>'}
            </div>
            <div class="text-xs mt-0.5" style="color:#c8dff5;">\${a.msg}</div>
            <div class="mono text-xs mt-0.5" style="color:var(--text-muted);">\${a.time}</div>
          </div>
        </div>
      </div>
    \`;
  }).join('');
}

// ======== 레시피 목록 ========
function renderRecipes(recipes) {
  const el = document.getElementById('recipe-list');
  el.innerHTML = recipes.map((r, i) => \`
    <div onclick="this.closest('.space-y-2').querySelectorAll('div').forEach(d=>d.style.background='');this.style.background='rgba(0,212,255,0.08)';"
         style="padding:12px;border-radius:6px;background:\${i===0?'rgba(0,212,255,0.08)':'var(--surface2)'};border:1px solid \${i===0?'rgba(0,212,255,0.25)':'var(--border)'};cursor:pointer;transition:all 0.2s;">
      <div class="flex items-start justify-between mb-1">
        <div class="mono text-xs font-bold" style="color:var(--accent);">\${r.id}</div>
        <span style="padding:1px 6px;border-radius:3px;font-size:10px;font-weight:700;\${r.status==='active'?'background:rgba(0,255,157,0.1);color:var(--accent2);border:1px solid rgba(0,255,157,0.3);':'background:rgba(255,179,0,0.1);color:var(--warn);border:1px solid rgba(255,179,0,0.3);'}">\${r.status==='active'?'활성':'검토중'}</span>
      </div>
      <div class="text-sm font-semibold" style="color:#c8dff5;">\${r.name}</div>
      <div class="mono text-xs mt-1" style="color:var(--text-muted);">\${r.version} · \${r.steps}단계 · \${r.totalTime}분</div>
      <div class="mono text-xs" style="color:var(--text-muted);">최종수정: \${r.lastUpdated}</div>
    </div>
  \`).join('');
}

// ======== 탭 전환 ========
function switchTab(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  document.querySelectorAll('.plc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ======== 자동 폴링 (2초) ========
loadAll();
setInterval(loadAll, 2000);
</script>
</body>
</html>`)
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

    <div class="text-xs text-slate-500 px-3 py-2 mt-2 font-semibold tracking-wider">PLC 연동</div>
    <a href="/plc/mixing" class="nav-item" style="text-decoration:none;">
      <i class="fas fa-flask" style="color:#00d4ff;"></i>
      <span style="color:#67e8f9;">원료 혼합 Zone A</span>
      <span class="ml-auto text-xs bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50">LIVE</span>
    </a>
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
          <div class="zone-card zone-industrial min-w-36 flex-shrink-0 relative">
            <a href="/plc/mixing" class="absolute top-2 right-2 text-xs bg-blue-600/40 hover:bg-blue-600/70 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 transition-colors" title="PLC 상세 보기">
              <i class="fas fa-microchip mr-1"></i>PLC
            </a>
            <div class="text-center">
              <div class="text-2xl mb-1">🏭</div>
              <div class="text-xs font-bold text-blue-300">원료 혼합</div>
              <div class="badge-industrial mt-1 inline-block">산업용</div>
              <div class="text-xs text-green-400 mt-2 font-medium">● 정상</div>
              <div class="text-xs text-slate-400 mt-1">2대 가동</div>
              <a href="/plc/mixing" class="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 underline">PLC 상세 →</a>
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
        <div class="flex items-center justify-between mb-3">
          <div>
            <h2 class="font-semibold text-white flex items-center gap-2">
              <i class="fas fa-map text-indigo-400"></i>
              공장 구역 배치도 — 평면도
            </h2>
            <p class="text-xs text-slate-400 mt-1">Zone을 클릭하면 상세 정보를 확인할 수 있습니다</p>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <span class="flex items-center gap-1.5"><span style="width:12px;height:12px;background:#1e3a5f;border:2px solid #f59e0b;display:inline-block;border-radius:2px;"></span>안전펜스 (산업용)</span>
            <span class="flex items-center gap-1.5"><span style="width:12px;height:12px;background:rgba(30,64,175,0.3);border:1px dashed #60a5fa;display:inline-block;border-radius:2px;"></span>산업용 로봇</span>
            <span class="flex items-center gap-1.5"><span style="width:12px;height:12px;background:rgba(5,150,105,0.25);border:1px dashed #34d399;display:inline-block;border-radius:2px;"></span>협동 로봇</span>
            <span class="flex items-center gap-1.5"><span style="width:12px;height:12px;background:rgba(124,58,237,0.25);border:1px dashed #a78bfa;display:inline-block;border-radius:2px;"></span>하이브리드</span>
          </div>
        </div>

        <!-- SVG 공장 평면도 -->
        <div style="background:#111827;border-radius:10px;padding:12px;border:1px solid #374151;">
        <svg id="factory-svg" viewBox="0 0 960 520" style="width:100%;cursor:default;" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- 안전펜스 패턴 (노란색 격자) -->
            <pattern id="fence" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#1a2535"/>
              <line x1="0" y1="0" x2="8" y2="8" stroke="#d97706" stroke-width="0.8" opacity="0.7"/>
              <line x1="8" y1="0" x2="0" y2="8" stroke="#d97706" stroke-width="0.8" opacity="0.7"/>
            </pattern>
            <!-- 컨베이어 롤러 패턴 -->
            <pattern id="conveyor" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#1e3a5f"/>
              <rect x="1" y="4" width="12" height="6" rx="3" fill="#2d5986" stroke="#3b82f6" stroke-width="0.5"/>
            </pattern>
            <!-- 화살표 마커 -->
            <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#60a5fa"/>
            </marker>
            <marker id="arr-green" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#34d399"/>
            </marker>
            <marker id="arr-white" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7 Z" fill="#94a3b8"/>
            </marker>
            <!-- 컨베이어 흐름 애니메이션 -->
            <pattern id="conveyorAnim" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
              <rect width="20" height="10" fill="#1e3a5f"/>
              <rect x="1" y="2" width="18" height="6" rx="3" fill="#2563eb" stroke="#3b82f6" stroke-width="0.5" opacity="0.7"/>
            </pattern>
            <!-- 글로우 필터 -->
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <!-- 코봇 글로우 -->
            <filter id="glowGreen">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- ── 공장 외벽 ── -->
          <rect x="10" y="10" width="940" height="500" rx="8" fill="#0d1b2e" stroke="#374151" stroke-width="3"/>
          <!-- 바닥 격자 -->
          <pattern id="floor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="none"/>
            <path d="M40,0 L0,0 L0,40" stroke="#1e293b" stroke-width="0.5" fill="none"/>
          </pattern>
          <rect x="10" y="10" width="940" height="500" rx="8" fill="url(#floor)"/>

          <!-- ═══════════════════════════════════════════════
               ZONE 1 — 원료 혼합 (좌상단, 안전펜스)
          ═══════════════════════════════════════════════ -->
          <!-- 안전펜스 배경 -->
          <rect x="20" y="20" width="230" height="240" rx="4" fill="url(#fence)" stroke="#f59e0b" stroke-width="2.5"/>
          <!-- Zone 내부 -->
          <rect id="zone1-bg" x="26" y="26" width="218" height="228" rx="3"
                fill="rgba(30,58,138,0.25)" stroke="#3b82f6" stroke-width="1" stroke-dasharray="6 3"
                class="zone-clickable" style="cursor:pointer;" onclick="selectZone('zone1')"/>
          <!-- Zone 라벨 -->
          <text x="135" y="46" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700" font-family="Arial">Zone 1</text>
          <text x="135" y="59" text-anchor="middle" fill="#93c5fd" font-size="9" font-family="Arial">Raw Material Mixing Area</text>
          <text x="135" y="71" text-anchor="middle" fill="#bfdbfe" font-size="10" font-weight="600" font-family="Arial">원료 조합</text>
          <!-- 펜스 코너 볼트 -->
          <circle cx="20" cy="20" r="4" fill="#f59e0b"/><circle cx="250" cy="20" r="4" fill="#f59e0b"/>
          <circle cx="20" cy="260" r="4" fill="#f59e0b"/><circle cx="250" cy="260" r="4" fill="#f59e0b"/>

          <!-- 원료 드럼통 (좌측) -->
          <g opacity="0.85">
            <ellipse cx="52" cy="105" rx="14" ry="7" fill="#374151" stroke="#6b7280" stroke-width="1"/>
            <rect x="38" y="105" width="28" height="45" fill="#374151" stroke="#6b7280" stroke-width="1"/>
            <ellipse cx="52" cy="150" rx="14" ry="7" fill="#4b5563" stroke="#6b7280" stroke-width="1"/>

            <ellipse cx="78" cy="105" rx="14" ry="7" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1"/>
            <rect x="64" y="105" width="28" height="45" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1"/>
            <ellipse cx="78" cy="150" rx="14" ry="7" fill="#1e40af" stroke="#3b82f6" stroke-width="1"/>

            <ellipse cx="52" cy="165" rx="14" ry="7" fill="#374151" stroke="#9ca3af" stroke-width="1"/>
            <rect x="38" y="165" width="28" height="38" fill="#374151" stroke="#9ca3af" stroke-width="1"/>
            <ellipse cx="52" cy="203" rx="14" ry="7" fill="#4b5563" stroke="#9ca3af" stroke-width="1"/>

            <ellipse cx="78" cy="165" rx="14" ry="7" fill="#374151" stroke="#9ca3af" stroke-width="1"/>
            <rect x="64" y="165" width="28" height="38" fill="#374151" stroke="#9ca3af" stroke-width="1"/>
            <ellipse cx="78" cy="203" rx="14" ry="7" fill="#4b5563" stroke="#9ca3af" stroke-width="1"/>
          </g>

          <!-- 산업용 로봇 (Zone 1 중앙) -->
          <g id="robot-z1" filter="url(#glow)" onclick="selectZone('zone1')" style="cursor:pointer;">
            <!-- 베이스 -->
            <rect x="115" y="185" width="34" height="10" rx="2" fill="#1e40af" stroke="#60a5fa" stroke-width="1.2"/>
            <!-- 하부 암 -->
            <rect x="128" y="150" width="8" height="38" rx="2" fill="#2563eb" stroke="#60a5fa" stroke-width="1"/>
            <!-- 상부 암 -->
            <rect x="132" y="118" width="6" height="36" rx="2" fill="#3b82f6" stroke="#93c5fd" stroke-width="1"
                  transform="rotate(-20 135 150)"/>
            <!-- 엔드 이펙터 -->
            <circle cx="154" cy="112" r="7" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1.5"/>
            <line x1="150" y1="108" x2="158" y2="116" stroke="#60a5fa" stroke-width="1.5"/>
            <line x1="158" y1="108" x2="150" y2="116" stroke="#60a5fa" stroke-width="1.5"/>
            <!-- 동작 표시 -->
            <circle cx="135" cy="140" r="3" fill="#60a5fa" opacity="0.6">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite"/>
            </circle>
          </g>

          <!-- 혼합 탱크 A -->
          <g opacity="0.9">
            <ellipse cx="185" cy="108" rx="22" ry="9" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1.5"/>
            <rect x="163" y="108" width="44" height="60" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1.5"/>
            <ellipse cx="185" cy="168" rx="22" ry="9" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
            <!-- 탱크 내용물 -->
            <rect x="164" y="130" width="42" height="37" fill="rgba(59,130,246,0.3)"/>
            <!-- 교반기 -->
            <line x1="185" y1="108" x2="185" y2="140" stroke="#93c5fd" stroke-width="1.5"/>
            <line x1="173" y1="132" x2="197" y2="132" stroke="#93c5fd" stroke-width="2"/>
            <text x="185" y="192" text-anchor="middle" fill="#93c5fd" font-size="8" font-family="Arial">TK-101</text>
          </g>
          <!-- 혼합 탱크 B (소형) -->
          <g opacity="0.9">
            <ellipse cx="222" cy="130" rx="16" ry="7" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1"/>
            <rect x="206" y="130" width="32" height="45" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1"/>
            <ellipse cx="222" cy="175" rx="16" ry="7" fill="#1e40af" stroke="#60a5fa" stroke-width="0.8"/>
            <text x="222" y="195" text-anchor="middle" fill="#93c5fd" font-size="8" font-family="Arial">TK-102</text>
          </g>
          <!-- 상태 표시 -->
          <circle cx="50" cy="235" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="62" y="239" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">가동중 · R001,R002</text>
          <!-- PLC 링크 버튼 -->
          <rect x="30" y="78" width="68" height="18" rx="4" fill="rgba(37,99,235,0.4)" stroke="#60a5fa" stroke-width="1"
                style="cursor:pointer;" onclick="event.stopPropagation();window.location.href='/plc/mixing'"/>
          <text x="64" y="91" text-anchor="middle" fill="#93c5fd" font-size="9" font-family="Arial" font-weight="700"
                style="cursor:pointer;" onclick="event.stopPropagation();window.location.href='/plc/mixing'">⚙ PLC 상세</text>


          <!-- ═══════════════════════════════════════════════
               ZONE 2 — 충진 라인 (상단 중앙, 가장 긴 구역)
          ═══════════════════════════════════════════════ -->
          <rect x="260" y="20" width="480" height="240" rx="4" fill="rgba(30,58,138,0.18)" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="8 3"/>
          <text x="500" y="40" text-anchor="middle" fill="#60a5fa" font-size="10" font-weight="700" font-family="Arial">Zone 2 — Main Filling Line · 충진 라인</text>

          <!-- 컨베이어 벨트 메인 (상단) -->
          <rect x="268" y="100" width="460" height="30" rx="3" fill="url(#conveyorAnim)">
            <animateTransform attributeName="patternTransform" type="translate" values="0,0;20,0" dur="0.8s" repeatCount="indefinite"/>
          </rect>
          <rect x="268" y="100" width="460" height="30" rx="3" fill="none" stroke="#3b82f6" stroke-width="1.5"/>
          <!-- 컨베이어 롤러 표시 -->
          <line x1="268" y1="115" x2="728" y2="115" stroke="#1e3a5f" stroke-width="0.5" stroke-dasharray="10 10"/>

          <!-- 제품 병들 (컨베이어 위) -->
          <g fill="#ef4444" opacity="0.85">
            <rect x="278" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="294" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="310" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="326" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="342" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="358" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="374" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="390" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="406" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="422" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="438" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="454" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="470" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="486" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="502" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="518" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="534" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="550" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="566" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="582" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="598" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="614" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="630" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="646" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="662" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="678" y="103" width="8" height="22" rx="4" fill="#f97316" stroke="#fdba74" stroke-width="0.5"/>
            <rect x="694" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
            <rect x="710" y="103" width="8" height="22" rx="4" fill="#ef4444" stroke="#fca5a5" stroke-width="0.5"/>
          </g>

          <!-- 리턴 컨베이어 (하단) -->
          <rect x="268" y="148" width="460" height="14" rx="2" fill="#0f172a" stroke="#1e3a5f" stroke-width="1" stroke-dasharray="4 4"/>

          <!-- 충진 로봇 (좌측 델타) -->
          <g id="robot-z2a" filter="url(#glow)" onclick="selectZone('zone2')" style="cursor:pointer;">
            <rect x="280" y="165" width="32" height="8" rx="2" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
            <rect x="293" y="140" width="6" height="28" rx="2" fill="#2563eb" stroke="#60a5fa" stroke-width="1"/>
            <rect x="296" y="125" width="5" height="19" rx="2" fill="#3b82f6" stroke="#93c5fd" stroke-width="1" transform="rotate(-15 298 140)"/>
            <rect x="302" y="118" width="16" height="10" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="1.2"/>
            <!-- 델타 로봇 헤드 -->
            <line x1="293" y1="138" x2="285" y2="125" stroke="#60a5fa" stroke-width="1"/>
            <line x1="299" y1="138" x2="307" y2="125" stroke="#60a5fa" stroke-width="1"/>
            <line x1="285" y1="125" x2="307" y2="125" stroke="#60a5fa" stroke-width="1"/>
            <circle cx="296" cy="125" r="4" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
          </g>
          <text x="296" y="220" text-anchor="middle" fill="#93c5fd" font-size="8" font-family="Arial">델타 로봇</text>
          <text x="296" y="230" text-anchor="middle" fill="#6b7280" font-size="7" font-family="Arial">280개/분</text>

          <!-- 캡핑 로봇 (중앙 다관절) — 정비중 표시 -->
          <g id="robot-z2b" onclick="selectZone('zone2')" style="cursor:pointer;" opacity="0.7">
            <rect x="465" y="165" width="32" height="8" rx="2" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
            <rect x="478" y="138" width="6" height="30" rx="2" fill="#92400e" stroke="#f59e0b" stroke-width="1"/>
            <rect x="481" y="120" width="5" height="22" rx="2" fill="#b45309" stroke="#fbbf24" stroke-width="1" transform="rotate(25 483 138)"/>
            <circle cx="493" cy="115" r="6" fill="#78350f" stroke="#f59e0b" stroke-width="1.5"/>
          </g>
          <!-- 정비중 경고 표시 -->
          <rect x="448" y="205" width="62" height="22" rx="4" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="1"/>
          <text x="479" y="220" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="Arial" font-weight="700">⚠ 정비중</text>

          <!-- 캡핑 로봇 라벨 -->
          <text x="479" y="235" text-anchor="middle" fill="#fbbf24" font-size="8" font-family="Arial">캡핑 로봇</text>

          <!-- 충진 스테이션 로봇 (우측) -->
          <g id="robot-z2c" filter="url(#glow)" onclick="selectZone('zone2')" style="cursor:pointer;">
            <rect x="660" y="165" width="32" height="8" rx="2" fill="#1e40af" stroke="#60a5fa" stroke-width="1"/>
            <rect x="673" y="140" width="6" height="28" rx="2" fill="#2563eb" stroke="#60a5fa" stroke-width="1"/>
            <rect x="676" y="125" width="5" height="19" rx="2" fill="#3b82f6" stroke="#93c5fd" stroke-width="1" transform="rotate(15 678 140)"/>
            <circle cx="682" cy="120" r="5" fill="#1e40af" stroke="#60a5fa" stroke-width="1.2"/>
          </g>
          <text x="676" y="220" text-anchor="middle" fill="#93c5fd" font-size="8" font-family="Arial">스카라 로봇</text>
          <text x="676" y="230" text-anchor="middle" fill="#6b7280" font-size="7" font-family="Arial">240개/분</text>

          <!-- 가동 상태 -->
          <circle cx="270" cy="232" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="282" y="236" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">가동중 · 245개/분</text>
          <circle cx="460" cy="232" r="5" fill="#f59e0b"/>
          <text x="472" y="236" fill="#f59e0b" font-size="9" font-family="Arial" font-weight="600">R005 정비중</text>

          <!-- Zone 2 클릭 영역 -->
          <rect x="260" y="20" width="480" height="240" rx="4" fill="transparent" stroke="transparent"
                style="cursor:pointer;" onclick="selectZone('zone2')"/>


          <!-- ═══════════════════════════════════════════════
               ZONE 3 — 라벨링 (우상단)
          ═══════════════════════════════════════════════ -->
          <rect x="750" y="20" width="200" height="240" rx="4" fill="rgba(5,150,105,0.15)" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 3"/>
          <text x="850" y="40" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700" font-family="Arial">Zone 3 — Labeling Area</text>
          <text x="850" y="52" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="600" font-family="Arial">라벨링</text>

          <!-- 컨베이어 연장 (Zone 3 상단) -->
          <rect x="755" y="100" width="100" height="30" rx="3" fill="url(#conveyorAnim)"/>
          <rect x="755" y="100" width="100" height="30" rx="3" fill="none" stroke="#34d399" stroke-width="1"/>

          <!-- 라벨링 머신 -->
          <rect x="860" y="88" width="75" height="55" rx="4" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
          <rect x="868" y="96" width="59" height="24" rx="2" fill="#065f46" stroke="#6ee7b7" stroke-width="0.8"/>
          <text x="897" y="112" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="Arial">라벨링 머신</text>
          <circle cx="872" cy="130" r="4" fill="#34d399" opacity="0.8"/>
          <circle cx="884" cy="130" r="4" fill="#34d399" opacity="0.8"/>

          <!-- 협동 로봇 (Zone 3 하단부) -->
          <g id="cobot-z3a" filter="url(#glowGreen)" onclick="selectZone('zone3')" style="cursor:pointer;">
            <!-- 베이스 -->
            <rect x="775" y="198" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <!-- 암 -->
            <rect x="787" y="175" width="5" height="26" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="789" y="160" width="4" height="19" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(-20 791 175)"/>
            <!-- 엔드 이펙터 -->
            <circle cx="803" cy="155" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <line x1="799" y1="151" x2="807" y2="159" stroke="#34d399" stroke-width="1.5"/>
            <!-- 안전 링 -->
            <circle cx="789" cy="187" r="10" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <!-- 협동 로봇 B -->
          <g id="cobot-z3b" filter="url(#glowGreen)" onclick="selectZone('zone3')" style="cursor:pointer;">
            <rect x="855" y="198" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="867" y="175" width="5" height="26" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="869" y="158" width="4" height="20" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(20 871 175)"/>
            <circle cx="857" cy="153" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <line x1="853" y1="149" x2="861" y2="157" stroke="#34d399" stroke-width="1.5"/>
            <circle cx="869" cy="187" r="10" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <!-- 작업자 -->
          <circle cx="920" cy="175" r="9" fill="#1e3a5f" stroke="#93c5fd" stroke-width="1.5"/>
          <line x1="920" y1="184" x2="920" y2="210" stroke="#93c5fd" stroke-width="2"/>
          <line x1="908" y1="193" x2="932" y2="193" stroke="#93c5fd" stroke-width="2"/>
          <line x1="920" y1="210" x2="910" y2="228" stroke="#93c5fd" stroke-width="1.5"/>
          <line x1="920" y1="210" x2="930" y2="228" stroke="#93c5fd" stroke-width="1.5"/>
          <text x="920" y="240" text-anchor="middle" fill="#93c5fd" font-size="8" font-family="Arial">작업자</text>

          <!-- 작업 테이블 -->
          <rect x="760" y="158" width="145" height="35" rx="3" fill="#0f172a" stroke="#374151" stroke-width="1"/>

          <!-- 가동 상태 -->
          <circle cx="758" cy="232" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="770" y="236" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">2대 · 협동</text>


          <!-- ═══════════════════════════════════════════════
               ZONE 3 하단 — 라벨링 (좌하단)
          ═══════════════════════════════════════════════ -->
          <rect x="20" y="270" width="230" height="240" rx="4" fill="rgba(5,150,105,0.13)" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 3"/>
          <text x="135" y="290" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700" font-family="Arial">Zone 3 — Labeling Area</text>
          <text x="135" y="302" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="600" font-family="Arial">라벨링</text>

          <!-- 소형 컨베이어 (Zone 3 하단) -->
          <rect x="28" y="315" width="100" height="20" rx="2" fill="#1e3a5f" stroke="#374151" stroke-width="1"/>
          <line x1="28" y1="325" x2="128" y2="325" stroke="#3b82f6" stroke-width="0.8" stroke-dasharray="8 6"/>

          <!-- 협동 로봇 (좌하단 Zone 3) -->
          <g id="cobot-z3c" filter="url(#glowGreen)" onclick="selectZone('zone3')" style="cursor:pointer;">
            <rect x="42" y="388" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="54" y="363" width="5" height="28" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="56" y="348" width="4" height="19" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(-25 58 363)"/>
            <circle cx="40" cy="342" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <line x1="36" y1="338" x2="44" y2="346" stroke="#34d399" stroke-width="1.5"/>
            <circle cx="56" cy="376" r="12" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <!-- 작업 테이블 -->
          <rect x="30" y="348" width="140" height="35" rx="3" fill="#0f172a" stroke="#374151" stroke-width="1"/>
          <!-- 협동 로봇 2 (우측) -->
          <g id="cobot-z3d" filter="url(#glowGreen)" onclick="selectZone('zone3')" style="cursor:pointer;">
            <rect x="148" y="388" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="160" y="363" width="5" height="28" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="162" y="348" width="4" height="19" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(25 164 363)"/>
            <circle cx="176" cy="342" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <line x1="172" y1="338" x2="180" y2="346" stroke="#34d399" stroke-width="1.5"/>
            <circle cx="162" cy="376" r="12" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <!-- 작업자 (하단 Zone3) -->
          <circle cx="205" cy="370" r="9" fill="#1e3a5f" stroke="#93c5fd" stroke-width="1.5"/>
          <line x1="205" y1="379" x2="205" y2="400" stroke="#93c5fd" stroke-width="2"/>
          <line x1="193" y1="388" x2="217" y2="388" stroke="#93c5fd" stroke-width="2"/>
          <line x1="205" y1="400" x2="196" y2="415" stroke="#93c5fd" stroke-width="1.5"/>
          <line x1="205" y1="400" x2="214" y2="415" stroke="#93c5fd" stroke-width="1.5"/>
          <!-- 가동 상태 -->
          <circle cx="28" cy="490" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="40" y="494" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">가동중 · R006,R007</text>


          <!-- ═══════════════════════════════════════════════
               ZONE 4 — 세트 포장 (하단 중앙 좌)
          ═══════════════════════════════════════════════ -->
          <rect x="260" y="270" width="240" height="240" rx="4" fill="rgba(124,58,237,0.15)" stroke="#a78bfa" stroke-width="1.5" stroke-dasharray="6 3"/>
          <text x="380" y="290" text-anchor="middle" fill="#a78bfa" font-size="10" font-weight="700" font-family="Arial">Zone 4 — Gift Set Assembly</text>
          <text x="380" y="302" text-anchor="middle" fill="#c4b5fd" font-size="10" font-weight="600" font-family="Arial">세트 포장</text>

          <!-- 작업 테이블 (중앙) -->
          <rect x="310" y="340" width="140" height="100" rx="4" fill="#0f172a" stroke="#4b5563" stroke-width="1.5"/>
          <!-- 박스들 -->
          <rect x="320" y="350" width="28" height="22" rx="2" fill="#be185d" stroke="#f9a8d4" stroke-width="0.8"/>
          <rect x="355" y="350" width="28" height="22" rx="2" fill="#9d174d" stroke="#f9a8d4" stroke-width="0.8"/>
          <rect x="390" y="350" width="28" height="22" rx="2" fill="#be185d" stroke="#f9a8d4" stroke-width="0.8"/>
          <rect x="320" y="378" width="28" height="22" rx="2" fill="#9d174d" stroke="#f9a8d4" stroke-width="0.8"/>
          <rect x="355" y="378" width="28" height="22" rx="2" fill="#be185d" stroke="#f9a8d4" stroke-width="0.8"/>
          <rect x="390" y="378" width="28" height="22" rx="2" fill="#9d174d" stroke="#f9a8d4" stroke-width="0.8"/>

          <!-- 협동 로봇 4기 (녹색, 테이블 사방 배치) -->
          <!-- 상단 로봇 -->
          <g filter="url(#glowGreen)" onclick="selectZone('zone4')" style="cursor:pointer;">
            <rect x="365" y="308" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="377" y="288" width="5" height="22" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="379" y="275" width="4" height="17" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(-10 381 288)"/>
            <circle cx="391" cy="271" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
          </g>
          <!-- 하단 로봇 -->
          <g filter="url(#glowGreen)" onclick="selectZone('zone4')" style="cursor:pointer;">
            <rect x="365" y="449" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="377" y="440" width="5" height="12" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="379" y="425" width="4" height="18" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(10 381 440)"/>
            <circle cx="386" cy="421" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
          </g>
          <!-- 좌측 로봇 -->
          <g filter="url(#glowGreen)" onclick="selectZone('zone4')" style="cursor:pointer;">
            <rect x="270" y="378" width="8" height="28" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="285" y="383" width="22" height="5" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2" transform="rotate(-10 285 385)"/>
            <rect x="300" y="380" width="8" height="8" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1"/>
          </g>
          <!-- 우측 로봇 -->
          <g filter="url(#glowGreen)" onclick="selectZone('zone4')" style="cursor:pointer;">
            <rect x="480" y="378" width="8" height="28" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="453" y="383" width="22" height="5" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2" transform="rotate(10 460 385)"/>
            <rect x="446" y="380" width="8" height="8" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1"/>
          </g>
          <!-- 가동 상태 -->
          <circle cx="268" cy="492" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="280" y="496" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">가동중 · R008</text>


          <!-- ═══════════════════════════════════════════════
               ZONE 5 — 품질 검사 (하단 중앙 우)
          ═══════════════════════════════════════════════ -->
          <rect x="510" y="270" width="220" height="240" rx="4" fill="rgba(5,150,105,0.13)" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 3"/>
          <text x="620" y="290" text-anchor="middle" fill="#34d399" font-size="10" font-weight="700" font-family="Arial">Zone 5 — Quality Inspection</text>
          <text x="620" y="302" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="600" font-family="Arial">품질 검사</text>

          <!-- 검사 스테이션 A -->
          <rect x="525" y="325" width="85" height="100" rx="4" fill="#0f172a" stroke="#374151" stroke-width="1"/>
          <!-- 비전 카메라 -->
          <rect x="545" y="332" width="45" height="30" rx="3" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1"/>
          <rect x="553" y="336" width="29" height="22" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="0.8"/>
          <circle cx="567" cy="347" r="7" fill="#1e3a5f" stroke="#60a5fa" stroke-width="1.2"/>
          <circle cx="567" cy="347" r="4" fill="#3b82f6" opacity="0.6"/>
          <text x="567" y="376" text-anchor="middle" fill="#6b93b8" font-size="8" font-family="Arial">비전 AI</text>

          <!-- 협동 로봇 (Zone 5) -->
          <g id="cobot-z5" filter="url(#glowGreen)" onclick="selectZone('zone5')" style="cursor:pointer;">
            <rect x="538" y="425" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="550" y="398" width="5" height="30" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <rect x="552" y="382" width="4" height="20" rx="2" fill="#10b981" stroke="#6ee7b7" stroke-width="1" transform="rotate(-15 554 398)"/>
            <circle cx="565" cy="378" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <line x1="561" y1="374" x2="569" y2="382" stroke="#34d399" stroke-width="1.5"/>
            <circle cx="552" cy="412" r="14" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <text x="552" y="448" text-anchor="middle" fill="#6ee7b7" font-size="8" font-family="Arial">협동 로봇</text>

          <!-- 검사 스테이션 B -->
          <rect x="625" y="325" width="85" height="100" rx="4" fill="#0f172a" stroke="#374151" stroke-width="1"/>
          <!-- 계측 장비 -->
          <rect x="635" y="332" width="65" height="45" rx="3" fill="#1e3a5f" stroke="#3b82f6" stroke-width="1"/>
          <rect x="640" y="337" width="55" height="30" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="0.8"/>
          <!-- 측정 화면 -->
          <line x1="645" y1="350" x2="688" y2="350" stroke="#22c55e" stroke-width="1" stroke-dasharray="3 2"/>
          <polyline points="645,360 655,353 665,358 675,346 685,355 690,348" stroke="#22c55e" stroke-width="1.2" fill="none"/>
          <text x="667" y="390" text-anchor="middle" fill="#6b93b8" font-size="8" font-family="Arial">품질 측정기</text>
          <!-- 로봇 (검사 스테이션 B) -->
          <g onclick="selectZone('zone5')" style="cursor:pointer;">
            <rect x="638" y="425" width="28" height="8" rx="2" fill="#065f46" stroke="#34d399" stroke-width="1.5"/>
            <rect x="650" y="400" width="5" height="28" rx="2" fill="#059669" stroke="#34d399" stroke-width="1.2"/>
            <circle cx="658" cy="395" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.5"/>
            <circle cx="652" cy="412" r="14" fill="none" stroke="#34d399" stroke-width="0.8" stroke-dasharray="3 2" opacity="0.5"/>
          </g>
          <!-- 가동 상태 -->
          <circle cx="518" cy="492" r="5" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="530" y="496" fill="#22c55e" font-size="9" font-family="Arial" font-weight="600">가동중 · R009</text>


          <!-- ═══════════════════════════════════════════════
               ZONE 6 — 팔레타이징 (우하단, 안전펜스)
          ═══════════════════════════════════════════════ -->
          <!-- 안전펜스 -->
          <rect x="740" y="270" width="210" height="240" rx="4" fill="url(#fence)" stroke="#f59e0b" stroke-width="2.5"/>
          <rect x="746" y="276" width="198" height="228" rx="3" fill="rgba(30,58,138,0.22)" stroke="#3b82f6" stroke-width="1" stroke-dasharray="6 3"
                style="cursor:pointer;" onclick="selectZone('zone6')"/>
          <!-- 펜스 코너 볼트 -->
          <circle cx="740" cy="270" r="4" fill="#f59e0b"/><circle cx="950" cy="270" r="4" fill="#f59e0b"/>
          <circle cx="740" cy="510" r="4" fill="#f59e0b"/><circle cx="950" cy="510" r="4" fill="#f59e0b"/>

          <text x="845" y="292" text-anchor="middle" fill="#f59e0b" font-size="10" font-weight="700" font-family="Arial">Zone 6</text>
          <text x="845" y="304" text-anchor="middle" fill="#93c5fd" font-size="9" font-family="Arial">Palletizing Zone · 팔레타이징</text>

          <!-- 팔레트 (목재) -->
          <g opacity="0.9">
            <rect x="755" y="360" width="80" height="60" rx="2" fill="#78350f" stroke="#a16207" stroke-width="1"/>
            <line x1="755" y1="380" x2="835" y2="380" stroke="#92400e" stroke-width="1.5"/>
            <line x1="755" y1="400" x2="835" y2="400" stroke="#92400e" stroke-width="1.5"/>
            <line x1="775" y1="360" x2="775" y2="420" stroke="#92400e" stroke-width="1"/>
            <line x1="795" y1="360" x2="795" y2="420" stroke="#92400e" stroke-width="1"/>
            <line x1="815" y1="360" x2="815" y2="420" stroke="#92400e" stroke-width="1"/>
            <!-- 박스 스택 -->
            <rect x="758" y="330" width="74" height="32" rx="2" fill="#374151" stroke="#6b7280" stroke-width="1"/>
            <rect x="762" y="304" width="66" height="28" rx="2" fill="#4b5563" stroke="#6b7280" stroke-width="1"/>
            <rect x="766" y="282" width="58" height="24" rx="2" fill="#374151" stroke="#6b7280" stroke-width="1"/>
          </g>

          <!-- 팔레트 B -->
          <g opacity="0.8">
            <rect x="855" y="380" width="80" height="55" rx="2" fill="#78350f" stroke="#a16207" stroke-width="1"/>
            <line x1="855" y1="397" x2="935" y2="397" stroke="#92400e" stroke-width="1.5"/>
            <line x1="855" y1="415" x2="935" y2="415" stroke="#92400e" stroke-width="1"/>
            <line x1="875" y1="380" x2="875" y2="435" stroke="#92400e" stroke-width="1"/>
            <line x1="895" y1="380" x2="895" y2="435" stroke="#92400e" stroke-width="1"/>
            <line x1="915" y1="380" x2="915" y2="435" stroke="#92400e" stroke-width="1"/>
            <!-- 박스 스택 일부 -->
            <rect x="858" y="355" width="74" height="28" rx="2" fill="#374151" stroke="#6b7280" stroke-width="1"/>
          </g>

          <!-- 대형 산업용 로봇 A (상단) -->
          <g id="robot-z6a" filter="url(#glow)" onclick="selectZone('zone6')" style="cursor:pointer;">
            <rect x="840" y="298" width="40" height="14" rx="3" fill="#1e40af" stroke="#f59e0b" stroke-width="1.5"/>
            <rect x="855" y="262" width="10" height="38" rx="3" fill="#2563eb" stroke="#60a5fa" stroke-width="1.2"/>
            <rect x="858" y="238" width="8" height="28" rx="2" fill="#3b82f6" stroke="#93c5fd" stroke-width="1" transform="rotate(-30 862 262)"/>
            <rect x="870" y="222" width="8" height="22" rx="2" fill="#2563eb" stroke="#93c5fd" stroke-width="1" transform="rotate(15 874 238)"/>
            <!-- 그리퍼 -->
            <rect x="876" y="215" width="18" height="10" rx="2" fill="#0f172a" stroke="#f59e0b" stroke-width="1.2"/>
            <line x1="879" y1="215" x2="879" y2="206" stroke="#f59e0b" stroke-width="1.5"/>
            <line x1="890" y1="215" x2="890" y2="206" stroke="#f59e0b" stroke-width="1.5"/>
          </g>

          <!-- 대형 산업용 로봇 B (하단) -->
          <g id="robot-z6b" filter="url(#glow)" onclick="selectZone('zone6')" style="cursor:pointer;">
            <rect x="750" y="455" width="40" height="14" rx="3" fill="#1e40af" stroke="#60a5fa" stroke-width="1.5"/>
            <rect x="765" y="428" width="10" height="30" rx="3" fill="#2563eb" stroke="#60a5fa" stroke-width="1.2"/>
            <rect x="768" y="410" width="8" height="22" rx="2" fill="#3b82f6" stroke="#93c5fd" stroke-width="1" transform="rotate(-20 772 428)"/>
            <rect x="778" y="396" width="8" height="20" rx="2" fill="#2563eb" stroke="#93c5fd" stroke-width="1" transform="rotate(25 782 410)"/>
            <rect x="783" y="390" width="16" height="8" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="1.2"/>
          </g>

          <!-- 가동 상태 -->
          <circle cx="748" cy="492" r="5" fill="#94a3b8"/>
          <text x="760" y="496" fill="#94a3b8" font-size="9" font-family="Arial" font-weight="600">R010 가동 · R011 대기</text>


          <!-- ═══════════════════════════════════════════════
               물류 흐름 화살표 (SVG 경로)
          ═══════════════════════════════════════════════ -->
          <!-- Zone 1 → Zone 2 (우측) -->
          <path d="M252,135 L262,135" stroke="#60a5fa" stroke-width="2.5" marker-end="url(#arr-blue)" fill="none"/>
          <path d="M252,135 L262,135" stroke="#60a5fa" stroke-width="5" opacity="0.15" fill="none" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.5s" repeatCount="indefinite"/>
          </path>

          <!-- Zone 2 → Zone 3 우상단 (우측) -->
          <path d="M742,115 L752,115" stroke="#60a5fa" stroke-width="2.5" marker-end="url(#arr-blue)" fill="none"/>
          <path d="M742,115 L752,115" stroke="#60a5fa" stroke-width="5" opacity="0.15" fill="none" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.5s" repeatCount="indefinite"/>
          </path>

          <!-- Zone 3 상단 → Zone 3 하단 (하향) -->
          <path d="M850,262 L850,272" stroke="#34d399" stroke-width="2" marker-end="url(#arr-green)" fill="none"/>
          <path d="M135,262 L135,268" stroke="#34d399" stroke-width="2" marker-end="url(#arr-green)" fill="none"/>

          <!-- Zone 3 하단 → Zone 4 (우측) -->
          <path d="M252,390 L262,390" stroke="#a78bfa" stroke-width="2.5" marker-end="url(#arr-blue)" fill="none"/>
          <path d="M252,390 L262,390" stroke="#a78bfa" stroke-width="5" opacity="0.15" fill="none" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.5s" repeatCount="indefinite"/>
          </path>

          <!-- Zone 4 → Zone 5 (우측) -->
          <path d="M502,390 L512,390" stroke="#34d399" stroke-width="2.5" marker-end="url(#arr-green)" fill="none"/>
          <path d="M502,390 L512,390" stroke="#34d399" stroke-width="5" opacity="0.15" fill="none" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.5s" repeatCount="indefinite"/>
          </path>

          <!-- Zone 5 → Zone 6 (우측) -->
          <path d="M732,390 L742,390" stroke="#60a5fa" stroke-width="2.5" marker-end="url(#arr-blue)" fill="none"/>
          <path d="M732,390 L742,390" stroke="#60a5fa" stroke-width="5" opacity="0.15" fill="none" stroke-dasharray="4 3">
            <animate attributeName="stroke-dashoffset" values="0;-7" dur="0.5s" repeatCount="indefinite"/>
          </path>

          <!-- 전체 흐름 연결 (우상→우하) Zone 3 → Zone 3 하단 이음 경로 -->
          <path d="M850,260 Q950,265 950,390 Q950,500 730,500 Q620,505 620,500"
                stroke="#374151" stroke-width="1.5" fill="none" stroke-dasharray="5 4" opacity="0.4"/>

          <!-- 출입구 표시 -->
          <rect x="440" y="505" width="80" height="8" rx="2" fill="#374151" stroke="#6b7280" stroke-width="1"/>
          <text x="480" y="515" text-anchor="middle" fill="#6b7280" font-size="8" font-family="Arial">출입구</text>

        </svg>
        </div>
        <!-- 클릭 안내 -->
        <div id="zone-info-bar" class="mt-3 p-3 rounded-lg text-center" style="background:#1e293b;border:1px solid #334155;">
          <span class="text-xs text-slate-400"><i class="fas fa-hand-pointer mr-1"></i>Zone을 클릭하면 상세 정보가 여기 표시됩니다</span>
        </div>

        <!-- ── 기존 그리드 완전 제거, 하단 패널만 유지 ── -->
        <div class="hidden"><!-- 구 그리드 영역 -->
        <div class="grid grid-cols-7 gap-3 items-center">
          <!-- 원료 혼합 -->
          <div class="col-span-1 zone-card zone-industrial cursor-pointer relative" onclick="showZoneDetail('mixing')">
            <a href="/plc/mixing" onclick="event.stopPropagation()"
               class="absolute top-2 right-2 z-10 bg-blue-600/50 hover:bg-blue-600/80 text-blue-200 text-xs px-2 py-0.5 rounded border border-blue-400/40 transition-colors">
              <i class="fas fa-microchip mr-1"></i>PLC
            </a>
            <div class="text-3xl text-center mb-2">🏭</div>
            <div class="text-center">
              <div class="text-xs font-bold text-blue-300">Zone A</div>
              <div class="text-xs text-white font-semibold mt-1">원료 혼합</div>
              <div class="badge-industrial mt-2 inline-block">산업용</div>
              <div class="text-xs text-green-400 mt-2">● 2대 가동</div>
              <div class="text-xs text-slate-400 mt-1">R001, R002</div>
              <div class="text-xs text-slate-400 mt-1">위험구역 격리</div>
              <a href="/plc/mixing" onclick="event.stopPropagation()" class="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 underline">PLC 상세 →</a>
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

      </div><!-- hidden div 닫기 -->

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

// ========== SVG 공장 평면도 Zone 선택 ===========
const zoneInfoMap = {
  zone1: {
    id: 'zone1', label: 'Zone 1 — 원료 혼합 (Raw Material Mixing)',
    color: '#60a5fa', border: '#1e40af',
    robots: 'R001 원료 투입 로봇 A · R002 원료 투입 로봇 B',
    type: '산업용 대형 로봇 (안전펜스 격리)',
    status: '● 정상 가동', statusColor: '#22c55e',
    speed: '180 kg/batch', uptime: '99.2%',
    desc: '고중량 원료 드럼(20~200kg) 자동 이송·투입. 화학 원료 취급 위험구역으로 안전펜스 완전 격리, 24시간 무인 가동.',
    plcLink: '/plc/mixing',
  },
  zone2: {
    id: 'zone2', label: 'Zone 2 — 충진 라인 (Main Filling Line)',
    color: '#60a5fa', border: '#1e40af',
    robots: 'R003 델타 로봇 · R004 스카라 로봇 · R005 캡핑 로봇 (정비중)',
    type: '산업용 로봇 + 자동화 설비',
    status: '⚠ R005 정비중', statusColor: '#f59e0b',
    speed: '245 개/분 (현재)', uptime: '97.3%',
    desc: '분당 100~300개 고속 충진·캡핑. 델타/스카라 로봇으로 병 정렬, 다관절 로봇으로 정밀 토크 캡핑. 안전펜스 격리.',
    plcLink: null,
  },
  zone3: {
    id: 'zone3', label: 'Zone 3 — 라벨링 (Labeling Area)',
    color: '#34d399', border: '#065f46',
    robots: 'R006 협동 로봇 라벨링 A · R007 협동 로봇 라벨링 B',
    type: '협동 로봇 (작업자 협업 구역)',
    status: '● 정상 가동', statusColor: '#22c55e',
    speed: '44 개/분 (평균)', uptime: '96.4%',
    desc: '다양한 용기 크기·디자인에 섬세한 힘 제어로 라벨 부착. 태블릿으로 15분 내 품종 전환. 작업자 육안 검사 병행.',
    plcLink: null,
  },
  zone4: {
    id: 'zone4', label: 'Zone 4 — 세트 포장 (Gift Set Assembly)',
    color: '#a78bfa', border: '#4c1d95',
    robots: 'R008 협동 로봇 세트 포장 (4기)',
    type: '협동 로봇 + 작업자 협업',
    status: '● 정상 가동', statusColor: '#22c55e',
    speed: '28 세트/분', uptime: '95.8%',
    desc: '명절 선물 세트 조립. 협동 로봇 4기가 테이블을 둘러싸고 제품 배치, 작업자가 리본·메시지카드 추가. 구성 변경 용이.',
    plcLink: null,
  },
  zone5: {
    id: 'zone5', label: 'Zone 5 — 품질 검사 (Quality Inspection)',
    color: '#34d399', border: '#065f46',
    robots: 'R009 협동 로봇 품질 검사',
    type: '협동 로봇 + AI 비전 시스템',
    status: '● 정상 가동', statusColor: '#22c55e',
    speed: '55 개/분 (전수 검사)', uptime: '97.1%',
    desc: '협동 로봇이 제품을 비전 카메라 앞에 위치. AI가 라벨 불량·캡 결함·용기 손상 자동 감지. 불량품 작업자 전달 협업.',
    plcLink: null,
  },
  zone6: {
    id: 'zone6', label: 'Zone 6 — 팔레타이징 (Palletizing Zone)',
    color: '#60a5fa', border: '#1e40af',
    robots: 'R010 박스 적재 로봇 A · R011 팔레타이징 로봇 B (대기)',
    type: '산업용 대형 로봇 (안전펜스 격리)',
    status: '◌ R011 대기', statusColor: '#94a3b8',
    speed: '85 박스/분', uptime: '98.4%',
    desc: '10~20kg 완제품 박스 팔레트 자동 적재. 최적 패턴 자동 계산으로 공간 효율 최대화. 안전펜스 격리, 24시간 가동.',
    plcLink: null,
  },
};

function selectZone(zoneId) {
  // SVG 하이라이트 초기화
  document.querySelectorAll('[id^="zone"][id$="-bg"]').forEach(el => {
    el.setAttribute('stroke-width', '1');
    el.setAttribute('opacity', '1');
  });

  const info = zoneInfoMap[zoneId];
  if (!info) return;

  // 정보 바 업데이트
  const bar = document.getElementById('zone-info-bar');
  bar.innerHTML = \`
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center gap-2">
        <span style="width:10px;height:10px;border-radius:50%;background:\${info.statusColor};display:inline-block;box-shadow:0 0 6px \${info.statusColor};"></span>
        <span class="font-semibold text-white text-sm">\${info.label}</span>
      </div>
      <span style="background:rgba(255,255,255,0.08);padding:2px 8px;border-radius:4px;font-size:12px;color:#94a3b8;">\${info.type}</span>
      <span class="text-xs" style="color:\${info.statusColor};">\${info.status}</span>
      <span class="text-xs text-slate-400">속도: \${info.speed}</span>
      <span class="text-xs text-slate-400">가동률: \${info.uptime}</span>
      \${info.plcLink ? \`<a href="\${info.plcLink}" class="ml-auto text-xs bg-blue-700/40 hover:bg-blue-700/70 text-blue-300 px-3 py-1 rounded border border-blue-600/40 transition-colors"><i class="fas fa-microchip mr-1"></i>PLC 상세 →</a>\` : ''}
    </div>
    <div class="text-xs text-slate-400 mt-2 text-left">\${info.desc}</div>
    <div class="text-xs text-slate-500 mt-1 text-left"><i class="fas fa-robot mr-1"></i>\${info.robots}</div>
  \`;
  bar.style.background = 'rgba(30,41,59,0.9)';
  bar.style.borderColor = info.color;

  // 상세 패널도 업데이트
  showZoneDetail(
    zoneId === 'zone1' ? 'mixing' :
    zoneId === 'zone2' ? 'filling' :
    zoneId === 'zone3' ? 'labeling' :
    zoneId === 'zone4' ? 'setpacking' :
    zoneId === 'zone5' ? 'inspection' : 'palletizing'
  );
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
