import { Router } from "express";
import Container, { Service } from "typedi";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import CategoryService from "./category.service";

@Service({ id: "category.controller" })
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

  @Route([])
  async test() {
    @Service()
    class Repository {
      constructor(){}

      getData(){
        return [1,2,3,4]
      }
    }
    @Service()
    class ServiceModule {
      constructor(private readonly myRepository:Repository){}
      getDataService(){
        return this.myRepository.getData()
      }
    }

    @Service()
    class Controllerr {
      constructor(private readonly myService:ServiceModule){}
      getDataController(){
        return this.myService.getDataService()
      }
    }
    const controllerInstance:Controllerr = Container.get(Controllerr)

    return controllerInstance.getDataController()
  }
  initRoutes = () => {
    this.router.get("/", this.getAllCategories);
    this.router.get("/test", this.test);
    this.router.post("/", this.addNewCategory);
    this.router.post("/seed", this.seedCategories);
  };
}
export default CategoryController;
