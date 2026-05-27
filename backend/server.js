require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const db      = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/quiz',       require('./routes/quiz'));
app.use('/api/share',      require('./routes/share'));
app.use('/api/admin',      require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong' });
});

async function initDB() {
  const conn = await db.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) NOT NULL UNIQUE,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('student','admin') DEFAULT 'student',
        bio        TEXT,
        university VARCHAR(150) DEFAULT '',
        createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS flashcards (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        userId        INT NOT NULL,
        question      TEXT NOT NULL,
        answer        TEXT NOT NULL,
        category      VARCHAR(100) DEFAULT 'General',
        difficulty    ENUM('Easy','Medium','Hard') DEFAULT 'Medium',
        timesRevealed INT DEFAULT 0,
        createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS view_history (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        userId      INT NOT NULL,
        flashcardId INT,
        action      ENUM('reveal','quiz') DEFAULT 'reveal',
        score       INT,
        total       INT,
        category    VARCHAR(100),
        createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS shared_decks (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        userId     INT NOT NULL,
        category   VARCHAR(100) NOT NULL,
        shareCode  VARCHAR(20) NOT NULL UNIQUE,
        createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    const bcrypt = require('bcryptjs');
    const [admins] = await conn.query("SELECT id FROM users WHERE role='admin' LIMIT 1");
    if (admins.length === 0) {
      const hashed = await bcrypt.hash('admin123', 12);
      await conn.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ['Admin', 'admin@flipiq.com', hashed, 'admin']
      );
      console.log('✅ Default admin created: admin@flipiq.com / admin123');
    }

    console.log('✅ All database tables ready');
  } finally {
    conn.release();
  }
}

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
