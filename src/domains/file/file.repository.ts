import { EntityRepository, Repository } from "typeorm";
import File from "./file.model";

@EntityRepository(File)
export default class FileRepository extends Repository<File> {}
