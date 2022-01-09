BEGIN;
CREATE OR REPLACE FUNCTION trigger_set_updated() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION courier_code() RETURNS TEXT AS $$
  SELECT array_to_string(array(select substr('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',((random()*(36-1)+1)::integer),1) from generate_series(1,6)),'') AS "Code";
$$ LANGUAGE SQL;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS "session" CASCADE;
DROP TABLE IF EXISTS "thread" CASCADE;

CREATE TABLE IF NOT EXISTS "thread" ( 
	"id" VARCHAR(6) NOT NULL DEFAULT courier_code(),
	"owner_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	"updated_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	PRIMARY KEY ("id")
);

CREATE INDEX ON "thread" (owner_id);
CREATE INDEX ON "thread" (created_at);
CREATE INDEX ON "thread" (updated_at);

COMMENT ON TABLE "thread" IS 'a private conversation';
COMMENT ON COLUMN "thread"."owner_id" IS 'session id that invited that created the thread';
COMMENT ON COLUMN "thread"."created_at" IS 'time thread record was created';
COMMENT ON COLUMN "thread"."updated_at" IS 'last time this thread record was updated';

CREATE TABLE IF NOT EXISTS "session" ( 
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(), 
	"thread_id" VARCHAR(6),
	"public_key" TEXT NOT NULL UNIQUE,
	"created_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	"updated_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	PRIMARY KEY ("id"),
	CONSTRAINT "session_thread_id_fkey"
	FOREIGN KEY ("thread_id") REFERENCES "thread" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX ON "session" (thread_id);
CREATE INDEX ON "session" (created_at);
CREATE INDEX ON "session" (updated_at);

COMMENT ON TABLE "session" IS 'a session is a public key, that belongs to a thread';
COMMENT ON COLUMN "session"."id" IS 'identifies user sessions, id is created on thread start';
COMMENT ON COLUMN "session"."thread_id" IS 'the thread associated with this session';
COMMENT ON COLUMN "session"."public_key" IS 'a public key to send data to this session';
COMMENT ON COLUMN "session"."created_at" IS 'time session record was created';
COMMENT ON COLUMN "session"."updated_at" IS 'last time this session record was updated';

ALTER TABLE "thread"
ADD CONSTRAINT "thread_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "session" ("id");

CREATE TABLE IF NOT EXISTS "message" ( 
	"id" UUID NOT NULL DEFAULT uuid_generate_v4(), 
	"thread_id" VARCHAR(6),
	"body" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	"updated_at" TIMESTAMP NOT NULL DEFAULT 'now()',
	PRIMARY KEY ("id"),
	CONSTRAINT "session_from_id_fkey"
	FOREIGN KEY ("from_id") REFERENCES "session" ("id") ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT "session_thread_id_fkey"
	FOREIGN KEY ("thread_id") REFERENCES "thread" ("id") ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE INDEX ON "message" (thread_id);
CREATE INDEX ON "message" (from_id);
CREATE INDEX ON "message" (created_at);
CREATE INDEX ON "message" (updated_at);

COMMENT ON TABLE "message" IS 'a message is an encrypted payload, unreadable by service';
COMMENT ON COLUMN "message"."id" IS 'identifies messages, id is auto-generated';
COMMENT ON COLUMN "message"."thread_id" IS 'the thread associated with this message';
COMMENT ON COLUMN "message"."body" IS 'the actual message body';
COMMENT ON COLUMN "message"."created_at" IS 'time message record was created';
COMMENT ON COLUMN "message"."updated_at" IS 'last time this message record was updated';

COMMIT;