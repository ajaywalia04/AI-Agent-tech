import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../chat.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id)
  );
`);

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function createSession(sessionId: string) {
    const stmt = db.prepare('INSERT OR IGNORE INTO sessions (id) VALUES (?)');
    stmt.run(sessionId);
}

export function saveMessage(sessionId: string, role: 'user' | 'assistant', content: string) {
    const stmt = db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)');
    stmt.run(sessionId, role, content);
}

export function getHistory(sessionId: string): Message[] {
    const stmt = db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY timestamp ASC');
    return stmt.all(sessionId) as Message[];
}

export default db;
