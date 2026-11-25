/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 * @typedef {import('typeorm').QueryRunner} QueryRunner
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export class CreateProject1795000279161 {
    name = 'CreateProject1795000279161'

    /**
     * @param {QueryRunner} queryRunner
     */
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "slug" character varying(180) NOT NULL, "description" text NOT NULL, "imageUrl" character varying(500), "techStack" text array NOT NULL DEFAULT '{}', "githubUrl" character varying(500), "liveUrl" character varying(500), "featured" boolean NOT NULL DEFAULT false, "displayOrder" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_96e045ab8b0271e5f5a91eae1e" ON "projects"  ("slug") `);
    }

    /**
     * @param {QueryRunner} queryRunner
     */
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_96e045ab8b0271e5f5a91eae1e"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }
}
