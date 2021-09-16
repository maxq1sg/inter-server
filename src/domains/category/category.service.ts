import { getConnection, ILike } from "typeorm";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ECategory } from "./types/index";
import Category from "./category.model";
import CategoryRepository from "./category.repository";
import EventRepository from "../events/event.repository";
import Event from "../events/event.model";
import CustomError from "../../errors/errorTypes/CustomError";
import { HttpStatusCode } from "../../errors/httpStatusCodes";

@Service()
class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepository: CategoryRepository,
    @InjectRepository(Event) private eventRepository: EventRepository
  ) {}

  async getCategoryIdByname(name: string) {
    const category = await this.categoryRepository.findOne({ where: { name:ILike(`%${name}%`) } });
    if (!category) {
      throw new CustomError(
        HttpStatusCode.NOT_FOUND,
        "Such category doesn't exist"
      );
    }
    return category
  }

  addNewCategory(name: string) {
    const newCategory = this.categoryRepository.create({ name });
    return newCategory.save();
  }

  getAllCategories() {
    return this.categoryRepository.find();
  }

  static seedCategories() {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Category)
      .values(Object.keys(ECategory).map((category) => ({ name: category })))
      .returning("id")
      .execute();
  }

  static clearAllCategories() {
    return getConnection()
      .createQueryBuilder()
      .delete()
      .from(Category)
      .execute();
  }
}
export default CategoryService;
