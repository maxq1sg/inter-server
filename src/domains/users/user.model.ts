import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Role from "../roles/roles.model";
import Event from "../events/event.model";
import File from "../file/file.model";

@Entity("users")
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "simple-json", nullable: true })
  addData: { address: string; is_married: boolean };

  @ManyToMany(() => Event, (event) => event.users, { cascade: true })
  @JoinTable({
    name: "users_and_events",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "event_id",
      referencedColumnName: "id",
    },
  })
  events: Event[];

  @ManyToOne(() => Role, (role) => role.users, { onDelete: "SET NULL" })
  role: Role;

  @OneToMany(() => Event, (event) => event.owner)
  ownerOfEvents: Event[];

  @OneToOne(() => File, { onDelete: "CASCADE" })
  @JoinColumn()
  avatar: File;
}
