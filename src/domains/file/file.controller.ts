import { Router } from "express";
import { Service } from "typedi";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import FileService from "./file.service";
import upload from "./multer.config";

@Service()
class FileController extends BaseController {
  public router: Router;

  constructor(private readonly fileService: FileService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes = () => {
    this.router.post("/", upload.single("file"), this.addNewFileToStorage);
  };

  @Route(["body", "file"])
  async addNewFileToStorage(payload: RequestPayload) {
    const { type } = payload.body;
    const data = await this.fileService.addNewFileToStorage(payload.file, type);
    return data;
  }
}
export default FileController;
