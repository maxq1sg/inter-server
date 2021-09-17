import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import Category from "../category/category.model";
import File from "../file/file.model";
import User from "../users/user.model";

@Entity("events")
export default class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 300, nullable: true })
  description: string;

  @CreateDateColumn()
  date: Date;

  @ManyToMany(() => User, (user) => user.events, { onDelete: "CASCADE" })
  users: User[];

  @ManyToOne(() => User, (user) => user.ownerOfEvents)
  owner: User;

  @ManyToOne(() => Category, (category) => category.events)
  category: Category;

  @OneToOne(() => File, { onDelete: "CASCADE" })
  @JoinColumn()
  preview: File;
}
