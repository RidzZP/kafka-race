// dbConfig.js
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  database: "db_tested",
};

const pool = mysql.createPool(dbConfig);

export { pool };
