// statusController.js
import { sendToKafka } from "../services/statusService.js";
import { saveDataToMySQL, updateDataInMySQL } from "../models/StatusModel.js";
import multer from "multer";
import path from "path";

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
        customer,
        posisi,
        tujuan,
        id_user,
      } = req.body;
      const foto = req.file.filename;

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
        customer,
        posisi,
        tujuan,
        foto,
        id_user
      );
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
        customer,
        posisi,
        tujuan,
        foto,
        id_user
      );

      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateStatus(req, res) {
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
        tujuan,
        id_user,
        longitude,
        latitude,
      } = req.body;
      const foto = req.file.filename;

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
        tujuan,
        foto,
        id_user,
        longitude,
        latitude
      );

      setTimeout(async () => {
        await updateDataInMySQL(
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
          tujuan,
          foto,
          id_user,
          longitude,
          latitude
        );
      }, 1 * 60 * 1000);

      res.status(200).json({ message: "Message sent successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
