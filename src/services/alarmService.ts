import type { Alarm } from '../types'

export class AlarmService {
  constructor(private db: D1Database) {}

  async getAll(limit = 20): Promise<Alarm[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM alarms ORDER BY id DESC LIMIT ?')
      .bind(limit)
      .all()
    return (results as unknown as Alarm[]) ?? []
  }

  async getByZone(zone: string): Promise<Alarm[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM alarms WHERE zone = ? ORDER BY id DESC')
      .bind(zone)
      .all()
    return (results as unknown as Alarm[]) ?? []
  }
}
