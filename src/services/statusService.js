// kafkaService.js
import { producer } from "../config/kafkaConfig.js";

export async function sendToKafka(
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
) {
  try {
    await producer.connect();

    const key = String(Math.floor(Math.random() * 10) + 1);

    await producer.send({
      topic: "Race",
      messages: [
        {
          key,
          value: JSON.stringify({
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
            id_user,
            key,
          }),
        },
      ],
    });
  } finally {
    await producer.disconnect();
  }
}
