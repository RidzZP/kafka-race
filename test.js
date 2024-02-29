const axios = require("axios");

async function kirimDataRace(id_msm, index) {
  const data = {
    id_kendaraan: 123,
    no_polisi: "NEW321",
    id_pengemudi: 123,
    nama_driver: "test2",
    id_msm: id_msm,
    kondisi_kendaraan: "No Ready",
    action: 1,
    empty_load: "on Process",
    keterangan: "asd",
    memo: "asd",
    customer: "nokete",
    posisi: "sudah tiba",
    longitude: 123,
    latitude: 321,
    tujuan: "subang",
    id_user: 1,
  };

  try {
    const response = await axios.post(
      "http://192.168.0.187:3000/sendRaceData",
      data
    );
    console.log("data berhasil dikirim", index);
  } catch (error) {
    console.error("Error:", error);
  }
}

function loopingData() {
  let id_msm = 100;
  for (let index = 0; index < 100; index++) {
    const element = kirimDataRace(id_msm++, index);
    console.log(element);
  }
  // console.log(data berhasil dikirim, index)
}

loopingData();
