import type { RobotStatus, AlarmLevel, OrderStatus, OrderType } from '../types'

// ─── 로봇 상태 ────────────────────────────────────────────────────────────────
export function getRobotStatusBadge(status: RobotStatus): string {
  const map: Record<RobotStatus, string> = {
    running:     'bg-green-100 text-green-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    idle:        'bg-gray-100 text-gray-600',
    error:       'bg-red-100 text-red-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function getRobotStatusText(status: RobotStatus): string {
  const map: Record<RobotStatus, string> = {
    running:     '가동중',
    maintenance: '정비중',
    idle:        '대기',
    error:       '오류',
  }
  return map[status] ?? '알 수 없음'
}

export function getRobotStatusDot(status: RobotStatus): string {
  const map: Record<RobotStatus, string> = {
    running:     'bg-green-400',
    maintenance: 'bg-yellow-400',
    idle:        'bg-gray-400',
    error:       'bg-red-400',
  }
  return map[status] ?? 'bg-gray-400'
}

// ─── 알람 ─────────────────────────────────────────────────────────────────────
export function getAlarmBadge(level: AlarmLevel): string {
  const map: Record<AlarmLevel, string> = {
    error:   'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info:    'bg-blue-100 text-blue-800',
  }
  return map[level] ?? 'bg-gray-100 text-gray-600'
}

export function getAlarmDot(level: AlarmLevel): string {
  const map: Record<AlarmLevel, string> = {
    error:   'bg-red-500',
    warning: 'bg-yellow-500',
    info:    'bg-blue-500',
  }
  return map[level] ?? 'bg-gray-500'
}

export function getAlarmIcon(level: AlarmLevel): string {
  const map: Record<AlarmLevel, string> = {
    error:   'fa-circle-xmark text-red-500',
    warning: 'fa-triangle-exclamation text-yellow-500',
    info:    'fa-circle-info text-blue-500',
  }
  return map[level] ?? 'fa-circle-info text-gray-500'
}

// ─── 주문 ─────────────────────────────────────────────────────────────────────
export function getOrderStatusBadge(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    running:   'bg-green-100 text-green-800',
    pending:   'bg-gray-100 text-gray-600',
    completed: 'bg-blue-100 text-blue-800',
    paused:    'bg-yellow-100 text-yellow-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function getOrderStatusText(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    running:   '생산중',
    pending:   '대기',
    completed: '완료',
    paused:    '일시정지',
  }
  return map[status] ?? '알 수 없음'
}

export function getOrderTypeBadge(type: OrderType): string {
  const map: Record<OrderType, string> = {
    mass:    'bg-purple-100 text-purple-800',
    limited: 'bg-pink-100 text-pink-800',
    custom:  'bg-indigo-100 text-indigo-800',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}

export function getOrderTypeText(type: OrderType): string {
  const map: Record<OrderType, string> = {
    mass:    '대량생산',
    limited: '한정판',
    custom:  '맞춤형',
  }
  return map[type] ?? '기타'
}

// ─── 효율 / 진행률 ────────────────────────────────────────────────────────────
export function getEfficiencyColor(val: number): string {
  if (val >= 90) return 'text-green-600'
  if (val >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

export function getProgressBarColor(pct: number): string {
  if (pct >= 100) return 'bg-blue-500'
  if (pct >= 80)  return 'bg-green-500'
  if (pct >= 60)  return 'bg-yellow-500'
  return 'bg-red-500'
}

// ─── 숫자 포맷 ────────────────────────────────────────────────────────────────
export function fmt(n: number): string {
  return n.toLocaleString('ko-KR')
}

export function pct(current: number, target: number): number {
  if (!target) return 0
  return Math.min(Math.round((current / target) * 100), 999)
}

// ─── PLC 상태 ─────────────────────────────────────────────────────────────────
export function getTankStatusBadge(status: string): string {
  const map: Record<string, string> = {
    mixing:   'bg-blue-100 text-blue-800',
    idle:     'bg-gray-100 text-gray-600',
    cleaning: 'bg-purple-100 text-purple-800',
    error:    'bg-red-100 text-red-800',
  }
  return map[status] ?? 'bg-gray-100 text-gray-600'
}

export function getTankStatusText(status: string): string {
  const map: Record<string, string> = {
    mixing:   '혼합 중',
    idle:     '대기',
    cleaning: '세척 중',
    error:    '오류',
  }
  return map[status] ?? status
}
