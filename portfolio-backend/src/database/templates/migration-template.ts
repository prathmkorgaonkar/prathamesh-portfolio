import type { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    // Apply database changes
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Revert database changes
  }
}