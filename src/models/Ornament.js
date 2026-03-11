const db = require('../../config/db');

const Ornament = {
  async getAll({ page = 1, limit = 15, search = '' } = {}) {
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE name LIKE ? OR body_part LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await db.query(`SELECT * FROM ornaments ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM ornaments ${where}`, params);
    return { rows, total, page, limit };
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM ornaments WHERE id=?', [id]);
    return row;
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO ornaments SET ?', [data]);
    return result.insertId;
  },
  async update(id, data) {
    await db.query('UPDATE ornaments SET ? WHERE id=?', [data, id]);
  },
  async delete(id) {
    await db.query('DELETE FROM ornaments WHERE id=?', [id]);
  }
};
module.exports = Ornament;
