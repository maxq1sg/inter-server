import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Event from "../events/event.model";

@Entity("files")
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @OneToOne(() => Event, { onDelete: "CASCADE" })
  event: Event;
}
