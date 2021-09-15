import { Router } from "express";

export default function initCategoryRouter(router: Router) {
  router.get("/", this.getAllCategories);
  router.post("/", this.addNewCategory);
  router.post("/seed", this.seedCategories);
  router.get("/:id", this.getEventsPerCategory);
}
