import { Router } from "express";
import { checkSchema } from "express-validator";
import { Service } from "typedi";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import upload from "../file/multer.config";
import { EPermission } from "../permisssions/types";
import { ICreateEvent, IModifyEvent, ISearchEvent } from "./dtos/create.event";
import EventService from "./event.service";
import { createEventSchema } from "./validation/createEventSchema";
import { modifyEventSchema } from "./validation/modifyEventSchema";
import { searchEventSchema } from "./validation/searchEventSchema";

@Service()
class EventController extends BaseController {
  public router: Router;
  constructor(private readonly eventService: EventService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route(["params"])
  async getEventSubsCount(payload: RequestPayload) {
    const { id } = payload.params;
    return this.eventService.getEventsSubsCount(+id);
  }

  @Route(["query"])
  getAllEvents(payload: RequestPayload) {
    const { page, limit } = payload.query;
    return this.eventService.getAllEvents(page || 1, limit || 5);
  }

  //todo
  @Route(["params"])
  async deleteEvent(payload: RequestPayload) {
    const { id } = payload.params;
    const data = await this.eventService.deleteEvent(+id);
    return { message: `Deleted events: ${data.affected}` };
  }

  @Route(["body", "file"])
  async createEvent(payload: RequestPayload) {
    const { ownerId, body, categoryId }: ICreateEvent = payload.body;
    const newEvent = await this.eventService.createEvent({
      ownerId,
      body,
      categoryId,
      image: payload.file,
    });
    return newEvent;
  }

  @Route(["body", "user"])
  async modifyEvent(payload: RequestPayload) {
    const { id, body }: IModifyEvent = payload.body;
    const { id: userIdFromToken } = payload.user;
    const modifiedEvent = await this.eventService.modifyEvent(
      id,
      body,
      userIdFromToken
    );
    return modifiedEvent;
  }

  @Route(["params", "query"])
  async getEventSubs(payload: RequestPayload) {
    const { id } = payload.params;
    const { limit, page } = payload.query;
    const eventSubs = await this.eventService.getEventSubscribers(
      +id,
      page,
      limit
    );
    return eventSubs;
  }

  @Route(["params"])
  async getSinglEvent(payload: RequestPayload) {
    const { id } = payload.params;
    const event = await this.eventService.getSingleEvent(+id);
    return event;
  }

  @Route(["body"])
  async searchEvents(payload: RequestPayload) {
    const { query, categories }: ISearchEvent = payload.body;
    console.log(payload.body);
    const results = await this.eventService.searchEvents({ query, categories });
    return results;
  }

  @Route(["params", "query"])
  async getEventsPerCategory(payload: RequestPayload) {
    const { id } = payload.params;
    const { page } = payload.query;
    return this.eventService.getEventsPerCategory(+id, page);
  }

  initRoutes = () => {
    this.router.post(
      "/",
      // AuthGuard,
      // PermissionGuard(EPermission.CREATE_EVENT),
      // checkSchema(createEventSchema),
      upload.single("file"),
      this.createEvent
    );
    this.router.post(
      "/search",
      checkSchema(searchEventSchema),
      this.searchEvents
    );
    this.router.put(
      "/",
      // AuthGuard,
      // PermissionGuard(EPermission.MODIFY_EVENT_DETAILS),
      // checkSchema(modifyEventSchema),
      this.modifyEvent
    );

    this.router.get("/category/:id", this.getEventsPerCategory);
    this.router.get("/:id", this.getSinglEvent);
    this.router.get("/:id/subs", this.getEventSubs);
    this.router.get("/:id/subs/count", this.getEventSubsCount);
    this.router.get("/", this.getAllEvents);
    this.router.delete("/:id", this.deleteEvent);
  };
}
export default EventController;
