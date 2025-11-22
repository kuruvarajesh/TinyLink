// ============================================
// server/models/Link.js
// ============================================
import db from '../config/database.js';

const Link = {
  async create(code, originalUrl) {
    const query = `
      INSERT INTO links (code, original_url)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [code, originalUrl]);
    return result.rows[0];
  },

  async findByCode(code) {
    const result = await db.query('SELECT * FROM links WHERE code = $1', [code]);
    return result.rows[0];
  },

  async findAll(search = '') {
    let query = 'SELECT * FROM links';
    let params = [];

    if (search) {
      query += ' WHERE code ILIKE $1 OR original_url ILIKE $1';
      params = [`%${search}%`];
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    return result.rows;
  },

  async delete(code) {
    const result = await db.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
    return result.rows[0];
  },

  async incrementClicks(code) {
    const query = `
      UPDATE links 
      SET total_clicks = total_clicks + 1, last_clicked = CURRENT_TIMESTAMP
      WHERE code = $1
      RETURNING *
    `;
    const result = await db.query(query, [code]);
    return result.rows[0];
  },

  async codeExists(code) {
    const result = await db.query('SELECT EXISTS(SELECT 1 FROM links WHERE code = $1)', [code]);
    return result.rows[0].exists;
  }
};

export default Link;