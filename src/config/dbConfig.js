// dbConfig.js
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  database: "kafka_race",
};

const pool = mysql.createPool(dbConfig);

export { pool };
