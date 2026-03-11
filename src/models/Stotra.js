const db = require('../../config/db');

const Stotra = {
  async getAll({ page = 1, limit = 10, search = '' } = {}) {
    const offset = (page - 1) * limit;
    let where = '';
    const params = [];
    if (search) {
      where = 'WHERE title LIKE ? OR written_by LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await db.query(`SELECT * FROM stotras ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`, [...params, limit, offset]);
    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM stotras ${where}`, params);
    return { rows, total, page, limit };
  },
  async getFeatured() {
    const [rows] = await db.query('SELECT * FROM stotras WHERE is_featured=1 ORDER BY sort_order ASC');
    return rows;
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM stotras WHERE id=?', [id]);
    return row;
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO stotras SET ?', [data]);
    return result.insertId;
  },
  async update(id, data) {
    await db.query('UPDATE stotras SET ? WHERE id=?', [data, id]);
  },
  async delete(id) {
    await db.query('DELETE FROM stotras WHERE id=?', [id]);
  }
};
module.exports = Stotra;
