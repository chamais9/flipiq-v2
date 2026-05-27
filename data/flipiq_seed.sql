-- FlipIQ v2 Database Export
-- Run: mysql -u root -p flipiq < data/flipiq_seed.sql

CREATE DATABASE IF NOT EXISTS flipiq;
USE flipiq;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('student','admin') DEFAULT 'student',
  bio        TEXT,
  university VARCHAR(150) DEFAULT '',
  createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
);

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
);

CREATE TABLE IF NOT EXISTS shared_decks (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  userId     INT NOT NULL,
  category   VARCHAR(100) NOT NULL,
  shareCode  VARCHAR(20) NOT NULL UNIQUE,
  createdAt  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin account (password: admin123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@flipiq.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbB.KDZ9C', 'admin');
