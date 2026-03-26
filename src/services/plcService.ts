import type { PlcTank, PlcSensor } from '../types'

export class PlcService {
  constructor(private db: D1Database) {}

  async getAllTanks(): Promise<PlcTank[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM plc_tanks ORDER BY id')
      .all()
    return (results as unknown as PlcTank[]) ?? []
  }

  async getTank(id: string): Promise<PlcTank | null> {
    const row = await this.db
      .prepare('SELECT * FROM plc_tanks WHERE id = ?')
      .bind(id)
      .first()
    return (row as unknown as PlcTank) ?? null
  }

  async getSensorHistory(tankId: string, limit = 20): Promise<PlcSensor[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM plc_sensor_log WHERE tank_id = ? ORDER BY recorded_at DESC LIMIT ?')
      .bind(tankId, limit)
      .all()
    return (results as unknown as PlcSensor[]) ?? []
  }

  async logSensor(data: Omit<PlcSensor, 'id' | 'recorded_at'>): Promise<boolean> {
    const res = await this.db
      .prepare(`INSERT INTO plc_sensor_log (tank_id, temperature, pressure, agitation_speed, fill_level, ph, viscosity)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(data.tank_id, data.temperature, data.pressure, data.agitation_speed, data.fill_level, data.ph ?? null, data.viscosity ?? null)
      .run()
    return res.success
  }

  async updateTank(id: string, fields: Partial<PlcTank>): Promise<boolean> {
    const res = await this.db
      .prepare(`UPDATE plc_tanks SET temperature=?, pressure=?, agitation_speed=?, fill_level=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .bind(fields.temperature, fields.pressure, fields.agitation_speed, fields.fill_level, fields.status, id)
      .run()
    return res.success
  }
}
