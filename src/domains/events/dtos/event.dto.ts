import CustomRequest from "../../../types/CustomRequest";
import { FileType } from "../../../types/FileType";

export interface IEvent {
  name: string;
  description?: string;
  date?: Date;
}
export interface ICreateEvent {
  ownerId: number;
  body: IEvent;
  categoryId: number;
  image: Express.Multer.File;
  type: FileType;
}
export interface IModifyEvent {
  body: IEvent;
  id: number;
}
export interface ISearchEvent {
  categories: number[];
  query: string;
}

export interface IGetEvnts {
  page?: number;
  limit?: number;
  category?: number;
}

export class GetSingleEventDto {
  params: any;
  constructor(req: CustomRequest) {
    this.params = req.params;
  }
}
