import { getConnection } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import { HttpStatusCode } from "../../errors/HttpStatusCodes";
import User from "../users/user.model";
import { ICreateEvent, IEvent, ISearchEvent } from "./dtos/event.dto";
import Event from "./event.model";
import CustomError from "../../errors/errorTypes/CustomError";
import EventRepository from "./event.repository";
import UserRepository from "../users/user.repository";
import CategoryRepository from "../category/category.repository";
import Category from "../category/category.model";
import FileService from "../file/file.service";

@Service()
class EventService {
  constructor(
    @InjectRepository(Event) private eventRepository: EventRepository,
    @InjectRepository(User) private userRepository: UserRepository,
    @InjectRepository(Category) private categoryRepository: CategoryRepository,
    private readonly fileService: FileService
  ) {}

  // async getEventsByCategoryName(name: string, limit: number, page: number) {
  //   const category = await this.categoryRepository.findOne({ where: { name } });
  //   const skip = limit * (page - 1);
  //   return this.eventRepository.find({
  //     where: { category },
  //     skip,
  //     take: limit,
  //   });
  // }

  getEventsSubsCount(id: number) {
    return this.eventRepository
      .createQueryBuilder("event")
      .leftJoin("event.users", "users")
      .where("event.id = :id", { id })
      .select("COUNT(users.id) as count")
      .getRawOne();
  }

  // fix
  async getEventsPerCategory(categoryId: number, page: number) {
    const LIMIT = 3;
    const SKIP = LIMIT * (page - 1);

    // const category = await this.categoryRepository
    //   .createQueryBuilder("category")
    //   .where("category.id = :id", { id: categoryId })
    //   .getOne();
    return this.eventRepository
      .createQueryBuilder("event")
      .where("event.categoryId=:id", { id: categoryId })
      .skip(SKIP)
      .take(LIMIT)
      .getMany();
  }
  // todo - hide passwords

  getEvents(page: number, limit: number, category: number) {
    const skip = limit * (page - 1);
    if (category) {
      return this.eventRepository
        .createQueryBuilder("event")
        .where("event.categoryId=:id", { id: category })
        .skip(skip)
        .take(limit)
        .getMany();
    }

    return this.eventRepository.find({
      take: limit,
      skip,
      relations: ["users", "category", "preview"],
      order: {
        id: "DESC",
      },
    });
  }

  deleteEvent(id: number) {
    return this.eventRepository.delete(id);
  }

  async createEvent(createEventBody: ICreateEvent) {
    const { ownerId, body, categoryId, image, type } = createEventBody;
    console.log(ownerId, body, categoryId, image, type);
    const owner = await this.userRepository.findOne(ownerId);
    if (!owner) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "No such user");
    }

    const category = await this.categoryRepository.findOne(categoryId);
    if (!category) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "No such category");
    }

    const preview = await this.fileService.addNewFileToStorage(image, type);
    const newEvent = this.eventRepository.create({
      ...body,
      category,
      owner,
      preview,
    });
    return newEvent.save();
  }

  async modifyEvent(id: number, body: IEvent, userFromToken: number) {
    const newEvent = await this.eventRepository.findOne(id, {
      relations: ["owner"],
    });
    if (!newEvent) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "Событие не найдено!");
    }
    const owner_id = newEvent.owner?.id;
    if (owner_id !== userFromToken) {
      throw new CustomError(
        HttpStatusCode.FORBIDDEN,
        "Нет прав на изменение этого события!"
      );
    }
    newEvent.description = body.description || newEvent.description;
    newEvent.name = body.name || newEvent.name;
    newEvent.date = body.date || newEvent.date;
    return newEvent.save();
  }

  // todo
  async getEventSubscribers(id: number, page: number, limit: number) {
    const LIMIT = limit;
    const SKIP = LIMIT * (page - 1);

    const event = await this.eventRepository.findOne(id, {
      relations: ["users"],
      select: ["id"],
    });
    if (!event) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "Event not found!");
    }
    const q1 = await this.userRepository
      .createQueryBuilder("user")
      .where("event.categoryId=:id", { id })
      .skip(SKIP)
      .take(LIMIT)
      .getMany();
    return event;
  }

  getSingleEvent(id: number) {
    return this.eventRepository.findOne(id, { relations: ["users", "owner"] });
  }

  searchEvents(searchDto: ISearchEvent) {
    const { categories, query } = searchDto;
    return this.eventRepository
      .createQueryBuilder("event")
      .leftJoinAndSelect("event.preview","preview")
      .leftJoinAndSelect("event.category","category")
      .where("event.name ilike :query", { query: `%${query}%` })
      .andWhere("event.categoryId IN (:...categories)", { categories })
      .getMany();
  }

  static clearEvents() {
    return getConnection().createQueryBuilder().delete().from(Event).execute();
  }

  static async seedEvents(creatorIds: number[]) {
    const firstOwner = await User.findOne(creatorIds[0]);
    const secondOwner = await User.findOne(creatorIds[1]);
    const { identifiers } = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Event)
      .values([
        { name: "first", description: "first event ever", owner: firstOwner },
        {
          name: "second",
          description: "second event ever",
          owner: secondOwner,
        },
        { name: "third", description: "third event ever", owner: secondOwner },
        { name: "fourth", description: "fourth event ever", owner: firstOwner },
        {
          name: "FourthWithUppercase",
          description: "fourth event ever",
          owner: firstOwner,
        },
      ])
      .returning("id")
      .execute();
    return identifiers.map((idItem) => idItem.id);
  }
}
export default EventService;
