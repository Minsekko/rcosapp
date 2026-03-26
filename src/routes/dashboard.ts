import type { Context } from 'hono'
import type { Bindings } from '../types'
import { RobotService } from '../services/robotService'
import { ProductionService } from '../services/productionService'
import { AlarmService } from '../services/alarmService'
import { OrderService } from '../services/orderService'
import { dashboardView } from '../views/dashboard'
import { errorPage } from '../views/layout'

export async function dashboardHandler(c: Context<{ Bindings: Bindings }>) {
  try {
    const [robots, alarms, orders, stats, lines] = await Promise.all([
      new RobotService(c.env.DB).getAll(),
      new AlarmService(c.env.DB).getAll(5),
      new OrderService(c.env.DB).getAll(),
      new ProductionService(c.env.DB).getTodayStats(),
      new ProductionService(c.env.DB).getLines(),
    ])
    return c.html(dashboardView(robots, alarms, orders, stats, lines))
  } catch (e: any) {
    console.error('Dashboard error:', e)
    return c.html(errorPage('데이터베이스 연결 실패: ' + e.message), 500)
  }
}
