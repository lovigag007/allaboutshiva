const db = require('../../config/db');

const Name = {
  async getAll({ page = 1, limit = 20, search = '' } = {}) {
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE name LIKE ? OR meaning LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await db.query(`SELECT * FROM names ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM names ${where}`, params);
    return { rows, total, page, limit };
  },
  async getFeatured(limit = 6) {
    const [rows] = await db.query('SELECT * FROM names WHERE is_featured=1 ORDER BY RAND() LIMIT ?', [limit]);
    return rows;
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM names WHERE id=?', [id]);
    return row;
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO names SET ?', [data]);
    return result.insertId;
  },
  async update(id, data) {
    await db.query('UPDATE names SET ? WHERE id=?', [data, id]);
  },
  async delete(id) {
    await db.query('DELETE FROM names WHERE id=?', [id]);
  }
};
module.exports = Name;
