import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const directory = path.join(__dirname, "..", "..", "..", "static");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${uuidv4()}${path.extname(file.originalname)}`
    );
  },
});

function checkFiles(file: Express.Multer.File, cb: FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error while adding files"));
  }
}
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFiles(file, cb),
});


export default upload;
