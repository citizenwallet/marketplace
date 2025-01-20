-- CreateTable
CREATE TABLE "posts"(
    "id" serial PRIMARY KEY,
    "communitySlug" text,
    "type" text,
    "authorAccount" text,
    "authorName" text,
    "authorUsername" text,
    "authorAvatar" text,
    "createdAt" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" timestamptz(6) DEFAULT CURRENT_TIMESTAMP,
    "title" text,
    "text" text,
    "tags" text[],
    "price" integer,
    "currency" text,
    "contactService" text,
    "contactAddress" text,
    "status" text
);

-- CreateTable
CREATE TABLE "tags"(
    "id" serial PRIMARY KEY,
    "communitySlug" text,
    "slug" text,
    "label" text
);

-- CreateTable
CREATE TABLE "tags_posts"(
    "id" serial PRIMARY KEY,
    "tag_id" integer,
    "post_id" integer,
    CONSTRAINT "tags_posts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    CONSTRAINT "tags_posts_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE INDEX "posts_communitySlug_authorAccount_idx" ON "posts"("communitySlug", "authorAccount");

-- CreateIndex
CREATE INDEX "posts_communitySlug_idx" ON "posts"("communitySlug");

-- CreateIndex
CREATE INDEX "tags_communitySlug_idx" ON "tags"("communitySlug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_communitySlug_slug_idx" ON "tags"("communitySlug", "slug");

-- CreateIndex
CREATE INDEX "tags_posts_post_id_idx" ON "tags_posts"("post_id");

