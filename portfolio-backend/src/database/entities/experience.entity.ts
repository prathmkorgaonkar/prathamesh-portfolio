
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("experiences")
export class Experience {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 150 })
  companyName!: string;

  @Column({ type: "varchar", length: 150 })
  designation!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date", nullable: true })
  endDate!: Date | null;

  @Column({ type: "boolean", default: false })
  isCurrent!: boolean;

  @Column({
    type: "text",
    array: true,
    default: () => "'{}'",
  })
  technologies!: string[];

  @Column({ type: "integer", default: 0 })
  displayOrder!: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}
