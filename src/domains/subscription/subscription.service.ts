import { HttpStatusCode } from "./../../errors/HttpStatusCodes";
import { SubscriptionDto } from "./dtos/subscription.dto";
import User from "../users/user.model";
import Event from "../events/event.model";
import CustomError from "./../../errors/errorTypes/CustomError";
import { InjectRepository } from "typeorm-typedi-extensions";
import UserRepository from "../users/user.repository";
import EventRepository from "../events/event.repository";
import { Service } from "typedi";

@Service()
class SubscriptionService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    @InjectRepository(Event) private eventRepository: EventRepository
  ) {}

  async createSubscription(body: SubscriptionDto) {
    const { userId, eventId } = body;
    const user = await this.userRepository.findOne(userId, {
      relations: ["events"],
    });
    const event = await this.eventRepository.findOne(eventId);

    if (!user || !event) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Участие в мероприятии не создано!"
      );
    }
    user.events.push(event);
    await user.save();
    return { success: true, event_name: event.name };
  }
  async cancelSubscription(body: SubscriptionDto) {
    const { userId, eventId } = body;
    const user = await this.userRepository.findOne(userId, { relations: ["events"] });
    const event = await this.eventRepository.findOne(eventId);

    if (!user || !event) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Участие в мероприятии не отменено!"
      );
    }
    user.events = user.events.filter((event) => event.id !== eventId);

    await user.save();
    return { success: true, event_name: event.name };
  }
}
export default SubscriptionService;
