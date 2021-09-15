import { Router } from "express";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";
import { EPermission } from "../permisssions/types";



export default function initSubscriptionRouter(router: Router) {
  router.post(
    "/add",
    AuthGuard,
    PermissionGuard(EPermission.EVENT_SUBSCRIPTION),
    this.createSubscription
  );
  router.post(
    "/cancel",
    AuthGuard,
    PermissionGuard(EPermission.EVENT_SUBSCRIPTION),
    this.cancelSubscription
  );
}
