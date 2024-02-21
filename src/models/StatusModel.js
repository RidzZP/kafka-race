// databaseModel.js
import { pool } from "../config/dbConfig.js";

export async function saveDataToMySQL(
  id_kendaraan,
  no_polisi,
  id_pengemudi,
  nama_driver,
  id_msm,
  kondisi_kendaraan,
  action,
  empty_load,
  keterangan,
  customer,
  posisi,
  tujuan,
  photoPath,
  id_user
) {
  const connection = await pool.getConnection();

  try {
    const sql =
      "INSERT INTO kendaraanstatus (id_kendaraan, no_polisi, id_pengemudi, nama_driver, id_msm, kondisi_kendaraan, action, empty_load, keterangan, customer, posisi, tujuan, foto, tgl_update, id_user, tgl_create) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW())";
    const params = [
      id_kendaraan,
      no_polisi,
      id_pengemudi,
      nama_driver,
      id_msm,
      kondisi_kendaraan,
      action,
      empty_load,
      keterangan,
      customer,
      posisi,
      tujuan,
      photoPath,
      id_user,
    ];

    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}
