// multerMiddleware.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const formattedFileName = `foto-${uniqueSuffix}${path.extname(
      file.originalname
    )}`;
    cb(null, formattedFileName);
  },
});

const upload = multer({ storage: storage });

export { upload };
