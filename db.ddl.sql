DROP TABLE IF EXISTS classifieds;
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
    "tags" text,
    "price" integer,
    "currency" text,
    "status" text
);
COMMENT ON COLUMN classifieds."authorAccount" IS 'address of the account of the author (smart contract wallet address)';
COMMENT ON COLUMN classifieds.type IS 'REQUEST, OFFER';
COMMENT ON COLUMN classifieds.status IS 'DRAFT, PUBLISHED, EXPIRED, DELETED';
COMMENT ON COLUMN classifieds.price IS 'in the number of decimals of the token used by the community (typically 6, e.g. 18.50 is 18500000';
COMMENT ON COLUMN classifieds.currency IS 'the symbol of the token used by the community';
