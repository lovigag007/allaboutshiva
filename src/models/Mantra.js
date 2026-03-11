const db = require('../../config/db');

const Mantra = {
  async getAll({ page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE title LIKE ? OR text_english LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await db.query(`SELECT * FROM mantras ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM mantras ${where}`, params);
    return { rows, total, page, limit };
  },
  async getFeatured() {
    const [rows] = await db.query('SELECT * FROM mantras WHERE is_featured=1 ORDER BY sort_order ASC');
    return rows;
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM mantras WHERE id=?', [id]);
    return row;
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO mantras SET ?', [data]);
    return result.insertId;
  },
  async update(id, data) {
    await db.query('UPDATE mantras SET ? WHERE id=?', [data, id]);
  },
  async delete(id) {
    await db.query('DELETE FROM mantras WHERE id=?', [id]);
  }
};
module.exports = Mantra;
