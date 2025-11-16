import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Entry } from '../entries/entry.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  displayName?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Entry, (entry) => entry.user, { cascade: true })
  entries: Entry[];
}