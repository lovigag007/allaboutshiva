const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const bcrypt = require('bcryptjs');

const adapter = new FileSync(path.join(__dirname, '../data/db.json'));
const db = low(adapter);

// Set defaults
db.defaults({
  names: [],
  mantras: [],
  vedas: [],
  stotras: [],
  ornaments: [],
  events: [],
  pages: [],
  admin: []
}).write();

// Seed admin if not exists
if (db.get('admin').value().length === 0) {
  const hash = bcrypt.hashSync('om-namah-shivaya', 10);
  db.get('admin').push({ id: '1', username: 'admin', password: hash }).write();
}

module.exports = db;
