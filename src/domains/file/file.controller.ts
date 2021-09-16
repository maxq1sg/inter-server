import { Router } from "express";
import { Service } from "typedi";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import FileService from "./file.service";
import upload from "./multer.config";

@Service({ id: "file.controller" })
class FileController extends BaseController {
  public router: Router;

  constructor(private readonly fileService: FileService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/", upload.single("file"), this.addNewFileToStorage);
  }

  // fix
  @Route(["body", "file"])
  async addNewFileToStorage(payload: RequestPayload) {
    const { type } = payload.body;
    return this.fileService.addNewFileToStorage(payload.file, type);
  }
}
export default FileController;
