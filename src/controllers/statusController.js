// statusController.js
import { sendToKafka } from "../services/statusService.js";
import { saveDataToMySQL } from "../models/StatusModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/race");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage }).single("foto");

export async function sendStatus(req, res) {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const {
        id_kendaraan,
        no_polisi,
        id_pengemudi,
        nama_driver,
        id_msm,
        kondisi_kendaraan,
        action,
        empty_load,
        keterangan,
        memo,
        customer,
        posisi,
        longitude,
        latitude,
        tujuan,
        id_user,
      } = req.body;

      const fotoPath = req.file.path.replace(/\\/g, "/");

      const logMessage = JSON.stringify(
        { ...req.body, foto: fotoPath },
        null,
        2
      );

      console.log("Request Body:", req.body);

      fs.appendFile("request_logs.txt", logMessage + "\n\n", (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      });

      await sendToKafka(
        id_kendaraan,
        no_polisi,
        id_pengemudi,
        nama_driver,
        id_msm,
        kondisi_kendaraan,
        action,
        empty_load,
        keterangan,
        memo,
        customer,
        posisi,
        longitude,
        latitude,
        tujuan,
        fotoPath,
        id_user
      );

      setTimeout(async () => {
        await saveDataToMySQL(
          id_kendaraan,
          no_polisi,
          id_pengemudi,
          nama_driver,
          id_msm,
          kondisi_kendaraan,
          action,
          empty_load,
          keterangan,
          memo,
          customer,
          posisi,
          longitude,
          latitude,
          tujuan,
          fotoPath,
          id_user
        );
      }, 1 * 60 * 1000);

      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
