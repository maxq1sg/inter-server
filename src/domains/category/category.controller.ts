import { Router } from "express";
import { Service } from "typedi";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import CategoryService from "./category.service";

@Service()
class CategoryController extends BaseController {
  public router: Router;

  constructor(private readonly categoryService: CategoryService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route(["body"])
  async addNewCategory(payload: RequestPayload) {
    const { name } = payload.body;
    const newCategory = await this.categoryService.addNewCategory(name);
    return newCategory;
  }

  

  @Route([])
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Route([])
  async seedCategories() {
    return CategoryService.seedCategories();
  }

  initRoutes = () => {
    this.router.get("/", this.getAllCategories);
    this.router.post("/", this.addNewCategory);
    this.router.post("/seed", this.seedCategories);
  };
}
export default CategoryController;
