// databaseModel.js
import { pool } from "../config/dbConfig.js";

export async function saveDataToMySQL(name, age, job, photoPath) {
  const connection = await pool.getConnection();

  try {
    const sql = "INSERT INTO user (name, age, job, foto) VALUES (?, ?, ?, ?)";
    const params = [name, age, job, photoPath];

    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}
