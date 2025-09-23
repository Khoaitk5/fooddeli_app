// dao/genericDao.js
const pool = require("../db");

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
      RETURNING *`;

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
    const keys = Object.keys(data);
    const values = Object.values(data);

    const setString = keys.map((key, i) => `${key}=$${i + 1}`).join(", ");
    const query = `
      UPDATE ${this.table}
      SET ${setString}
      WHERE ${idField}=$${keys.length + 1}
      RETURNING *`;

    const res = await pool.query(query, [...values, id]);
    return res.rows[0] ? new this.Model(res.rows[0]) : null;
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
