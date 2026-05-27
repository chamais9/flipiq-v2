const db = require('../config/db');

const Flashcard = {
  findByUser: async (userId, { q, category, difficulty } = {}) => {
    let sql = 'SELECT * FROM flashcards WHERE userId = ?';
    const params = [userId];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }
    if (difficulty && difficulty !== 'All') {
      sql += ' AND difficulty = ?';
      params.push(difficulty);
    }
    if (q) {
      sql += ' AND (question LIKE ? OR answer LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY createdAt DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM flashcards WHERE id = ?', [id]);
    return rows[0] || null;
  },

  getCategoriesByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT DISTINCT category FROM flashcards WHERE userId = ? ORDER BY category',
      [userId]
    );
    return rows.map(r => r.category);
  },

  create: async ({ userId, question, answer, category, difficulty }) => {
    const [result] = await db.query(
      'INSERT INTO flashcards (userId, question, answer, category, difficulty) VALUES (?, ?, ?, ?, ?)',
      [userId, question.trim(), answer.trim(), category || 'General', difficulty || 'Medium']
    );
    return Flashcard.findById(result.insertId);
  },

  update: async (id, userId, { question, answer, category, difficulty }) => {
    const [result] = await db.query(
      'UPDATE flashcards SET question=?, answer=?, category=?, difficulty=? WHERE id=? AND userId=?',
      [question.trim(), answer.trim(), category || 'General', difficulty, id, userId]
    );
    if (result.affectedRows === 0) return null;
    return Flashcard.findById(id);
  },

  incrementReveal: async (id, userId) => {
    await db.query(
      'UPDATE flashcards SET timesRevealed = timesRevealed + 1 WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return Flashcard.findById(id);
  },

  delete: async (id, userId) => {
    const [result] = await db.query(
      'DELETE FROM flashcards WHERE id = ? AND userId = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  findAllByUser: async (userId) => {
    const [rows] = await db.query(
      'SELECT * FROM flashcards WHERE userId = ? ORDER BY createdAt DESC',
      [userId]
    );
    return rows;
  }
};

module.exports = Flashcard;
