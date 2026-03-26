import type { Order } from '../types'

export class OrderService {
  constructor(private db: D1Database) {}

  async getAll(): Promise<Order[]> {
    const { results } = await this.db
      .prepare('SELECT * FROM orders ORDER BY created_at DESC')
      .all()
    return (results as unknown as Order[]) ?? []
  }

  async getById(id: string): Promise<Order | null> {
    const row = await this.db
      .prepare('SELECT * FROM orders WHERE id = ?')
      .bind(id)
      .first()
    return (row as unknown as Order) ?? null
  }

  async updateProgress(id: string, progress: number): Promise<boolean> {
    const res = await this.db
      .prepare('UPDATE orders SET progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .bind(progress, id)
      .run()
    return res.success
  }
}
