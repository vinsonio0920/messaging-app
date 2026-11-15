-- AlterTable
CREATE SEQUENCE takenusernames_id_seq;
ALTER TABLE "TakenUsernames" ALTER COLUMN "id" SET DEFAULT nextval('takenusernames_id_seq');
ALTER SEQUENCE takenusernames_id_seq OWNED BY "TakenUsernames"."id";
