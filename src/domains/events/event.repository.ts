import { EntityRepository, Repository } from "typeorm";
import Event from "./event.model";

@EntityRepository(Event)
export default class EventRepository extends Repository<Event> {}
