import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { FileType } from "../../types/FileType";
import File from "./file.model";
import FileRepository from "./file.repository";

@Service()
class FileService {
  constructor(@InjectRepository(File) private fileRepository: FileRepository) {}

  async addNewFileToStorage(file: Express.Multer.File, type: FileType) {
    if (!file) {
      return null;
    }
    const newFile = this.fileRepository.create({
      path: `/${type}/${file.filename}`,
    });
    await newFile.save();
    return newFile;
  }
}
export default FileService;
