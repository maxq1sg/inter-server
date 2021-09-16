import { Router } from "express";

export default function initRoleRouter(router: Router) {
  router.post("/new", this.addNewRole);
  router.post("/new_with_perm", this.createNewRoleWithPermissions);

  // fix - to perm.route
  router.post("/add_perm", this.addPermissionsToRole);
  router.get("/", this.getAllRolesWithPermissions);
  router.post("/seed", this.seedRoles);
  router.delete("/", this.clearAllRoles);
  router.put("/", this.changeAllRoles);
  router.get("/:id/list", this.getPermissionsListToRole);
}
