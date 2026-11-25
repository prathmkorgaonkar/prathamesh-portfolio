
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  title!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 180 })
  slug!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({
    type: "text",
    array: true,
    default: () => "'{}'",
  })
  techStack!: string[];

  @Column({ type: "varchar", length: 500, nullable: true })
  githubUrl!: string | null;

  @Column({ type: "varchar", length: 500, nullable: true })
  liveUrl!: string | null;

  @Column({ type: "boolean", default: false })
  featured!: boolean;

  @Column({ type: "integer", default: 0 })
  displayOrder!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
