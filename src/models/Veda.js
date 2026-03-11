const db = require('../../config/db');

const Veda = {
  async getAll() {
    const [rows] = await db.query('SELECT * FROM vedas ORDER BY sort_order ASC');
    return rows;
  },
  async getById(id) {
    const [[veda]] = await db.query('SELECT * FROM vedas WHERE id=?', [id]);
    if (!veda) return null;
    const [incidents] = await db.query('SELECT * FROM veda_incidents WHERE veda_id=? ORDER BY sort_order ASC, id ASC', [id]);
    veda.incidents = incidents.filter(i => i.type === 'incident');
    veda.stories = incidents.filter(i => i.type === 'story');
    return veda;
  },
  async getBySlug(name) {
    const [[veda]] = await db.query('SELECT * FROM vedas WHERE LOWER(name)=?', [name.toLowerCase()]);
    if (!veda) return null;
    const [incidents] = await db.query('SELECT * FROM veda_incidents WHERE veda_id=? ORDER BY sort_order ASC', [veda.id]);
    veda.incidents = incidents.filter(i => i.type === 'incident');
    veda.stories = incidents.filter(i => i.type === 'story');
    return veda;
  },
  async update(id, data, incidents) {
    await db.query('UPDATE vedas SET ? WHERE id=?', [data, id]);
    if (incidents) {
      await db.query('DELETE FROM veda_incidents WHERE veda_id=?', [id]);
      for (const inc of incidents) {
        if (inc.title && inc.content) {
          await db.query('INSERT INTO veda_incidents SET ?', [{ veda_id: id, ...inc }]);
        }
      }
    }
  },
  async addIncident(data) {
    const [result] = await db.query('INSERT INTO veda_incidents SET ?', [data]);
    return result.insertId;
  },
  async deleteIncident(id) {
    await db.query('DELETE FROM veda_incidents WHERE id=?', [id]);
  }
};
module.exports = Veda;
