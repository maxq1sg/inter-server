import { Router } from "express";
import { Service } from "typedi";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import { SubscriptionDto } from "./dtos/subscription.dto";
import SubscriptionService from "./subscription.service";

@Service({ id: "subscription.controller" })
class SubscriptionController extends BaseController {
  public router: Router;

  constructor(private readonly subService: SubscriptionService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route(["body"])
  async createSubscription(payload: RequestPayload) {
    const { userId, eventId }: SubscriptionDto = payload.body;
    const data = await this.subService.createSubscription({
      eventId,
      userId,
    });
    return data;
  }

  @Route(["body"])
  async cancelSubscription(payload: RequestPayload) {
    const { userId, eventId }: SubscriptionDto = payload.body;
    const data = await this.subService.cancelSubscription({
      eventId,
      userId,
    });
    return data;
  }

  initRoutes = () => {
    this.router.post(
      "/add",
      // AuthGuard,
      // PermissionGuard(EPermission.EVENT_SUBSCRIPTION),
      this.createSubscription
    );
    this.router.post(
      "/cancel",
      // AuthGuard,
      // PermissionGuard(EPermission.EVENT_SUBSCRIPTION),
      this.cancelSubscription
    );
  };
}
export default SubscriptionController;
