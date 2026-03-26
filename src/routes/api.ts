import type { Context } from 'hono'
import type { Bindings } from '../types'
import { RobotService } from '../services/robotService'
import { ProductionService } from '../services/productionService'
import { AlarmService } from '../services/alarmService'
import { OrderService } from '../services/orderService'
import { PlcService } from '../services/plcService'

// ─── 로봇 ─────────────────────────────────────────────────────────────────────
export async function apiRobots(c: Context<{ Bindings: Bindings }>) {
  const robots = await new RobotService(c.env.DB).getAll()
  return c.json({ success: true, data: robots, ts: new Date().toISOString() })
}

export async function apiRobot(c: Context<{ Bindings: Bindings }>) {
  const robot = await new RobotService(c.env.DB).getById(c.req.param('id'))
  if (!robot) return c.json({ success: false, error: 'Not found' }, 404)
  return c.json({ success: true, data: robot, ts: new Date().toISOString() })
}

// ─── 생산 ─────────────────────────────────────────────────────────────────────
export async function apiProduction(c: Context<{ Bindings: Bindings }>) {
  const svc = new ProductionService(c.env.DB)
  const [lines, hourly, stats] = await Promise.all([
    svc.getLines(), svc.getHourly(), svc.getTodayStats()
  ])
  return c.json({ success: true, data: { lines, hourly, today: stats }, ts: new Date().toISOString() })
}

// ─── 알람 ─────────────────────────────────────────────────────────────────────
export async function apiAlarms(c: Context<{ Bindings: Bindings }>) {
  const alarms = await new AlarmService(c.env.DB).getAll(20)
  return c.json({ success: true, data: alarms, ts: new Date().toISOString() })
}

// ─── 주문 ─────────────────────────────────────────────────────────────────────
export async function apiOrders(c: Context<{ Bindings: Bindings }>) {
  const orders = await new OrderService(c.env.DB).getAll()
  return c.json({ success: true, data: orders, ts: new Date().toISOString() })
}

// ─── PLC ──────────────────────────────────────────────────────────────────────
export async function apiPlcTanks(c: Context<{ Bindings: Bindings }>) {
  const tanks = await new PlcService(c.env.DB).getAllTanks()
  return c.json({ success: true, data: tanks, ts: new Date().toISOString() })
}

export async function apiPlcTank(c: Context<{ Bindings: Bindings }>) {
  const svc = new PlcService(c.env.DB)
  const tank = await svc.getTank(c.req.param('tankId'))
  if (!tank) return c.json({ success: false, error: 'Tank not found' }, 404)
  const history = await svc.getSensorHistory(c.req.param('tankId'), 60)
  return c.json({ success: true, data: { tank, history }, ts: new Date().toISOString() })
}
