import { Router } from "express";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";
import { EPermission } from "../permisssions/types";

export default function initUserRoute(router: Router) {
  router.post("/", this.createUser);
  router.post("/seed", this.seedUsers);
  router.get("/:id/events", AuthGuard, this.getEventsOfSingleUser);
  router.delete("/:id", this.deleteUserById);
  router.get("/:id", this.getSingleUser);
  router.get(
    "/",
    AuthGuard,
    PermissionGuard(EPermission.SHOW_USERS_LIST),
    this.getAllUsers,
  );
  router.put("/role", this.changeUsersRole);
}
