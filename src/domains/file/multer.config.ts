import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import CustomRequest from "../../types/CustomRequest";

const storage = multer.diskStorage({
  // fix
  destination(req: CustomRequest, file: Express.Multer.File, cb) {
    const { type } = req.body;
    console.log(type)
    const directory = path.join(__dirname, "..", "..", "..", "static", type);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename(req, file, cb) {
    const { type } = req.body;

    cb(null, `${type}-${uuidv4()}${path.extname(file.originalname)}`);
  },
});

function checkFiles(file: Express.Multer.File, cb: FileFilterCallback) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error while adding files"));
}
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFiles(file, cb),
});

export default upload;
