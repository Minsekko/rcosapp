import type { Robot } from '../types'

export class RobotService {
  constructor(private db: D1Database) {}

  async getAll(): Promise<Robot[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM robots ORDER BY id')
      .all()
    return (results as unknown as Robot[]) ?? []
  }

  async getById(id: string): Promise<Robot | null> {
    const row = await this.db
      .prepare('SELECT * FROM robots WHERE id = ?')
      .bind(id)
      .first()
    return (row as unknown as Robot) ?? null
  }

  async updateStatus(id: string, status: string): Promise<boolean> {
    const res = await this.db
      .prepare('UPDATE robots SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(status, id)
      .run()
    return res.success
  }
}
