import type { ProductionLine, HourlyProduction, TodayStats } from '../types'

export class ProductionService {
  constructor(private db: D1Database) {}

  async getLines(): Promise<ProductionLine[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM production_lines ORDER BY id')
      .all()
    return (results as unknown as ProductionLine[]) ?? []
  }

  async getHourly(date?: string): Promise<HourlyProduction[]> {
    const d = date ?? new Date().toISOString().slice(0, 10)
    const { results } = await this.db
      .prepare('SELECT * FROM hourly_production WHERE date = ? ORDER BY hour')
      .bind(d)
      .all()
    return (results as unknown as HourlyProduction[]) ?? []
  }

  async getTodayStats(): Promise<TodayStats> {
    const row = await this.db
      .prepare('SELECT * FROM today_stats ORDER BY id DESC LIMIT 1')
      .first()
    if (!row) {
      return { total: 0, target: 50000, defect: 0, defectRate: 0, efficiency: 0 }
    }
    return row as unknown as TodayStats
  }
}
