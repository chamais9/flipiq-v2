const db = require('../config/db');

const ViewHistory = {
  logReveal: async (userId, flashcardId) => {
    await db.query(
      'INSERT INTO view_history (userId, flashcardId, action) VALUES (?, ?, ?)',
      [userId, flashcardId, 'reveal']
    );
  },

  saveQuizScore: async (userId, { score, total, category }) => {
    await db.query(
      'INSERT INTO view_history (userId, action, score, total, category) VALUES (?, ?, ?, ?, ?)',
      [userId, 'quiz', score, total, category || 'All']
    );
  },

  getQuizHistory: async (userId) => {
    const [rows] = await db.query(
      `SELECT id, score, total, category, createdAt
       FROM view_history
       WHERE userId = ? AND action = 'quiz'
       ORDER BY createdAt DESC LIMIT 10`,
      [userId]
    );
    return rows;
  },

  getTodayReveals: async (userId) => {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS count FROM view_history
       WHERE userId = ? AND action = 'reveal' AND DATE(createdAt) = CURDATE()`,
      [userId]
    );
    return rows[0].count;
  },

  getRecentActivity: async (limit = 50) => {
    const [rows] = await db.query(
      `SELECT vh.*, u.name, u.email
       FROM view_history vh
       JOIN users u ON vh.userId = u.id
       ORDER BY vh.createdAt DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }
};

module.exports = ViewHistory;
