// dao/genericDao.js
const pool = require("../config/db");


class GenericDao {
  constructor(tableName, Model) {
    this.table = tableName;
    this.Model = Model;
  }

async create(data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  const query = `
    INSERT INTO ${this.table} (${keys.join(", ")})
    VALUES (${placeholders})
    RETURNING *;
  `;
// 👀 log để debug

  const res = await pool.query(query, values);
  return new this.Model(res.rows[0]);
}


  async findAll() {
    const res = await pool.query(`SELECT * FROM ${this.table}`);
    return res.rows.map(row => new this.Model(row));
  }

  async findById(idField, id) {
    const res = await pool.query(
      `SELECT * FROM ${this.table} WHERE ${idField} = $1`,
      [id]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }

  async update(idField, id, data) {
    try {
      const keys = Object.keys(data);
      const values = Object.values(data);

      if (!keys.length) return null;

      // ⚠️ Chỉ thêm updated_at cho bảng addresses, không áp dụng cho user_addresses
      const hasUpdatedAt = this.table === 'addresses' || this.table === 'users' || this.table === 'products' || this.table === 'orders';
      const setString = keys.map((key, i) => `${key}=$${i + 1}`).join(", ") + 
        (hasUpdatedAt ? ", updated_at=NOW()" : "");

      const query = `
      UPDATE ${this.table}
      SET ${setString}
      WHERE ${idField}=$${keys.length + 1}
      RETURNING *`;

      console.log(`[SQL] ${query}`, values, id); // 👈 log câu query

      const res = await pool.query(query, [...values, id]);
      if (!res.rows[0]) console.warn(`⚠️ No row updated in ${this.table}`);
      return res.rows[0] ? new this.Model(res.rows[0]) : null;
    } catch (err) {
      console.error(`❌ Error in ${this.table}.update():`, err.message);
      throw err;
    }
  }

  async delete(idField, id) {
    const res = await pool.query(
      `DELETE FROM ${this.table} WHERE ${idField}=$1 RETURNING *`,
      [id]
    );
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
  }
}

module.exports = GenericDao;
