import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Bindings } from './types'

// ─── 페이지 라우트 ────────────────────────────────────────────────────────────
import { dashboardHandler } from './routes/dashboard'
import { plcMixingHandler, plcTankDetailHandler } from './routes/plc'

// ─── API 라우트 ───────────────────────────────────────────────────────────────
import {
  apiRobots, apiRobot,
  apiProduction,
  apiAlarms,
  apiOrders,
  apiPlcTanks, apiPlcTank,
} from './routes/api'

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

// ── 페이지 ────────────────────────────────────────────────────────────────────
app.get('/',               dashboardHandler)
app.get('/plc/mixing',     plcMixingHandler)
app.get('/plc/mixing/:tankId', plcTankDetailHandler)

// ── REST API ──────────────────────────────────────────────────────────────────
app.get('/api/robots',           apiRobots)
app.get('/api/robots/:id',       apiRobot)
app.get('/api/production',       apiProduction)
app.get('/api/alarms',           apiAlarms)
app.get('/api/orders',           apiOrders)
app.get('/api/plc/tanks',        apiPlcTanks)
app.get('/api/plc/tanks/:tankId',apiPlcTank)

// ── 헬스체크 ──────────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({
  status: 'ok',
  ts: new Date().toISOString(),
  version: '2.0.0',
}))

export default app
