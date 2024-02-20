// PLUGIN
const uploader = {};
import path from "path";
import multer from "multer";
// -------------

// PATH UPLOAD STATUS
var uploadStatusPath = "";
// ------------------

// OTHER
const currYear = new Date().getFullYear();
// ------------------

// FUNGSI UPLOAD STATUS
// UPLOAD IMAGE STATUS
const storageUploadStatus = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadStatusPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      currYear +
        "-" +
        "status" +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const uploadStatus = multer({ storage: storageUploadStatus });

/// ============================================ \\\

// UPLOAD IMAGE STATUS
(uploader.createStatus = uploadStatus.single("images")),
  (uploadStatusPath = `../assets/images`),
  // -----------------

  (module.exports = uploader);
