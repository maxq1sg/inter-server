import { Router } from "express";
import upload from "../file/multer.config";

export default function initEventRouter(router: Router) {
  router.post(
    "/",
    // AuthGuard,
    // PermissionGuard(EPermission.CREATE_EVENT),
    // checkSchema(createEventSchema),
    upload.single("file"),
    this.createEvent,
  );
  router.post("/search", this.searchEvents);
  router.put(
    "/",
    // AuthGuard,
    // PermissionGuard(EPermission.MODIFY_EVENT_DETAILS),
    // checkSchema(modifyEventSchema),
    this.modifyEvent,
  );
  router.get("/:id", this.getSinglEvent);
  router.get("/:id/subs", this.getEventSubs);
  router.get("/", this.getAllEvents);
  router.delete("/:id", this.deleteEvent);
}
