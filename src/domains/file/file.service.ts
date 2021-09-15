import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import File from "./file.model";
import FileRepository from "./file.repository";

@Service()
class FileService {
  constructor(@InjectRepository(File) private fileRepository: FileRepository) {}

  async addNewFileToStorage(file: Express.Multer.File) {
    if (!file) {
      return null;
    }
    const newFile = this.fileRepository.create({ path: file.filename });
    await newFile.save();
    return newFile;
  }
}
export default FileService;
