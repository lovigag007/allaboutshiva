const db = require('../../config/db');

const Event = {
  async getUpcoming(limit = 5) {
    const [rows] = await db.query(
      `SELECT * FROM events WHERE event_date >= CURDATE() AND is_active=1 ORDER BY event_date ASC LIMIT ?`,
      [limit]
    );
    return rows;
  },
  async getAll({ page = 1, limit = 15 } = {}) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query('SELECT * FROM events ORDER BY event_date ASC LIMIT ? OFFSET ?', [limit, offset]);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM events');
    return { rows, total, page, limit };
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM events WHERE id=?', [id]);
    return row;
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO events SET ?', [data]);
    return result.insertId;
  },
  async update(id, data) {
    await db.query('UPDATE events SET ? WHERE id=?', [data, id]);
  },
  async delete(id) {
    await db.query('DELETE FROM events WHERE id=?', [id]);
  }
};
module.exports = Event;
