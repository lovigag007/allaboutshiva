const db = require('../../config/db');
const bcrypt = require('bcryptjs');

const Admin = {
  async findByEmail(email) {
    const [[row]] = await db.query('SELECT * FROM admin_users WHERE email=?', [email]);
    return row;
  },
  async verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }
};

const Page = {
  async getBySlug(slug) {
    const [[row]] = await db.query('SELECT * FROM pages WHERE slug=? AND is_active=1', [slug]);
    return row;
  },
  async getAll() {
    const [rows] = await db.query('SELECT * FROM pages ORDER BY slug ASC');
    return rows;
  },
  async getById(id) {
    const [[row]] = await db.query('SELECT * FROM pages WHERE id=?', [id]);
    return row;
  },
  async update(id, data) {
    await db.query('UPDATE pages SET ? WHERE id=?', [data, id]);
  },
  async create(data) {
    const [result] = await db.query('INSERT INTO pages SET ?', [data]);
    return result.insertId;
  },
  async delete(id) {
    await db.query('DELETE FROM pages WHERE id=?', [id]);
  }
};

module.exports = { Admin, Page };
