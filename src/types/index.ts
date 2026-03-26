// ─── Cloudflare Workers 바인딩 ───────────────────────────────────────────────
export type Bindings = {
  DB: D1Database
}

// ─── 공통 상태 타입 ───────────────────────────────────────────────────────────
export type RobotStatus = 'running' | 'maintenance' | 'idle' | 'error'
export type RobotType   = 'industrial' | 'cobot'
export type AlarmLevel  = 'error' | 'warning' | 'info'
export type OrderStatus = 'running' | 'pending' | 'completed' | 'paused'
export type OrderType   = 'mass' | 'limited' | 'custom'

// ─── 로봇 ─────────────────────────────────────────────────────────────────────
export interface Robot {
  id: string
  name: string
  type: RobotType
  zone: string
  status: RobotStatus
  efficiency: number
  uptime: number
  speed: number
  load: number
  unit: string
  created_at?: string
  updated_at?: string
}

// ─── 생산 라인 ────────────────────────────────────────────────────────────────
export interface ProductionLine {
  id: string
  name: string
  product: string
  status: RobotStatus
  count: number
  target: number
  speed: number
  created_at?: string
  updated_at?: string
}

// ─── 시간대별 생산량 ──────────────────────────────────────────────────────────
export interface HourlyProduction {
  id?: number
  hour: string
  count: number
  date?: string
}

// ─── 알람 ─────────────────────────────────────────────────────────────────────
export interface Alarm {
  id: number
  time: string
  level: AlarmLevel
  robot: string
  message: string
  zone: string
  created_at?: string
}

// ─── MES 주문 ─────────────────────────────────────────────────────────────────
export interface Order {
  id: string
  product: string
  qty: number
  type: OrderType
  line: string
  status: OrderStatus
  progress: number
  dueDate: string
  created_at?: string
  updated_at?: string
}

// ─── PLC 탱크 데이터 ──────────────────────────────────────────────────────────
export interface PlcTank {
  id: string
  name: string
  status: 'mixing' | 'idle' | 'cleaning' | 'error'
  temperature: number
  pressure: number
  agitation_speed: number
  fill_level: number
  recipe: string
  phase: string
  time_remaining: number
  batch_id: string
  operator: string
  start_time: string
  updated_at?: string
}

// ─── PLC 센서 ─────────────────────────────────────────────────────────────────
export interface PlcSensor {
  id?: number
  tank_id: string
  temperature: number
  pressure: number
  agitation_speed: number
  fill_level: number
  ph?: number
  viscosity?: number
  recorded_at?: string
}

// ─── 오늘 생산 통계 ───────────────────────────────────────────────────────────
export interface TodayStats {
  total: number
  target: number
  defect: number
  defectRate: number
  efficiency: number
}
