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
}
export interface IModifyEvent {
  body: IEvent;
  id: number;
}
export interface ISearchEvent {
  categories: number[];
  query: string;
}
