const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const Share = {
  create: async (userId, category) => {
    const shareCode = uuidv4().split('-')[0].toUpperCase();
    await db.query(
      'INSERT INTO shared_decks (userId, category, shareCode) VALUES (?, ?, ?)',
      [userId, category, shareCode]
    );
    return shareCode;
  },

  findByCode: async (shareCode) => {
    const [rows] = await db.query(
      `SELECT sd.*, u.name AS ownerName
       FROM shared_decks sd
       JOIN users u ON sd.userId = u.id
       WHERE sd.shareCode = ?`,
      [shareCode.toUpperCase()]
    );
    return rows[0] || null;
  },

  findByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM shared_decks WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return rows;
  },

  delete: async (id, userId) => {
    const [result] = await db.query(
      'DELETE FROM shared_decks WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Share;
