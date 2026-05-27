const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT id, name, email, role, bio, university, createdAt FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  create: async ({ name, email, password, university = '' }) => {
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role, university) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hashed, 'student', university]
    );
    return result.insertId;
  },

  updateProfile: async (id, { name, bio, university }) => {
    await db.query(
      'UPDATE users SET name = ?, bio = ?, university = ? WHERE id = ?',
      [name.trim(), bio || '', university || '', id]
    );
    return User.findById(id);
  },

  verifyPassword: async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
  },

  getAllWithCardCount: async () => {
    const [rows] = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.university, u.createdAt,
             COUNT(f.id) AS cardCount
      FROM users u
      LEFT JOIN flashcards f ON f.userId = u.id
      GROUP BY u.id
      ORDER BY u.createdAt DESC
    `);
    return rows;
  },

  delete: async (id) => {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
};

module.exports = User;
