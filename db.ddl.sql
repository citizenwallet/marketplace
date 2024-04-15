
DROP TABLE IF EXISTS classifieds CASCADE;
CREATE TABLE IF NOT EXISTS classifieds (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "communitySlug" text,
    "type" text,
    "authorAccount" text,
    "authorName" text,
    "authorUsername" text,
    "authorAvatar" text,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "title" text,
    "text" text,
    "tags" text[],
    "price" integer,
    "currency" text,
    "contactService" text,
    "contactAddress" text,
    "status" text
);
COMMENT ON COLUMN classifieds."authorAccount" IS 'address of the account of the author (smart contract wallet address)';
COMMENT ON COLUMN classifieds.type IS 'REQUEST, OFFER';
COMMENT ON COLUMN classifieds.status IS 'DRAFT, PUBLISHED, EXPIRED, DELETED';
COMMENT ON COLUMN classifieds."contactService" IS 'EMAIL, TELEGRAM, WHATSAPP, X';
COMMENT ON COLUMN classifieds."contactAddress" IS 'email address, username or phone number';
COMMENT ON COLUMN classifieds.price IS 'in the number of decimals of the token used by the community (typically 6, e.g. 18.50 is 18500000';
COMMENT ON COLUMN classifieds.currency IS 'the symbol of the token used by the community';

CREATE INDEX ON classifieds("communitySlug");
CREATE INDEX ON classifieds("communitySlug", "authorAccount");


DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE IF NOT EXISTS tags (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "communitySlug" text,
    "slug" text,
    "label" text
);

CREATE INDEX ON tags("communitySlug");
CREATE UNIQUE INDEX ON tags("communitySlug", "slug");


DROP TABLE IF EXISTS tags_classifieds CASCADE;
CREATE TABLE IF NOT EXISTS tags_classifieds (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "tag_id" integer REFERENCES tags(id) ON DELETE CASCADE,
    "classified_id" integer REFERENCES classifieds(id) ON DELETE CASCADE
);

CREATE INDEX ON tags_classifieds("classified_id");

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "default";
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA schema_name TO username;
