import { Router } from "express";

export default function initPermissionsRouter(router: Router) {
  router.post("/seed", this.seedPermissions);
  router.post("/", this.addNewPermission);
}
