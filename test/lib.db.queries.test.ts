import { dbconnect, db, dbreset, dbclose } from "../src/lib/db";
import { getPosts, getTags } from "../src/lib/db.queries";

const communitySlug = "moos";

const d = new Date();
const expiryDate = d.setMonth(d.getMonth() + 1);

const post = {
  communitySlug,
  type: "REQUEST",
  title: "New request",
  text: "testDescription",
  tags: ["tag1", "tag2"],
  price: 10000000,
  authorUsername: "xdamman",
  authorName: "Xavier (test)",
  authorAvatar: "ipfs://QmXfLyiNVZ6ydtGLUVV438KfSGB3SJV5D6xrNmDwPWifMM",
  authorAccount: "0x2Ad65826a6fe729Dc93f5A9d2D86105952119d63",
  contactService: "whatsapp",
  contactAddress: "+32470 00.00 00",
  status: "PUBLISHED",
  expiryDate: new Date(expiryDate),
};
const post2 = {
  communitySlug,
  type: "OFFER",
  title: "New offer",
  text: "Offer description",
  tags: ["tag1", "tag3"],
  price: 2000000,
  authorUsername: "xdamman",
  authorName: "Xavier (test)",
  authorAvatar: "ipfs://QmXfLyiNVZ6ydtGLUVV438KfSGB3SJV5D6xrNmDwPWifMM",
  authorAccount: "0x2Ad65826a6fe729Dc93f5A9d2D86105952119d63",
  contactService: "telegram",
  contactAddress: "@xdamman",
  status: "PUBLISHED",
  expiryDate: new Date(expiryDate),
};

let record;

console.log(">>> Using", process.env.POSTGRES_DATABASE);
const numberOfFields = 18; // number of fields in the posts table

describe("db.test.js", () => {
  beforeAll(async () => {
    await dbconnect();
    await dbreset();
    record = await db.insert("posts", post);
    record = await db.insert("posts", post2);
  });

  afterAll(async () => {
    // Close the database connection.
    await dbclose();
  });

  test("getPosts for a tag", async () => {
    const posts = await getPosts(communitySlug, null, "tag2");
    expect(posts.length).toEqual(1);
    expect(posts[0].communitySlug).toEqual(communitySlug);
    expect(posts[0].text).toEqual(post.text);
  });
  test("getPosts for an author account", async () => {
    const posts = await getPosts(communitySlug, post.authorAccount);
    expect(posts.length).toEqual(2);
    expect(posts[0].communitySlug).toEqual(communitySlug);
    expect(posts[0].text).toEqual(post2.text);
  });

  test("getTags", async () => {
    const tags = await getTags(communitySlug);
    console.log(tags);
    expect(tags.length).toEqual(3);
    expect(tags[0]).toEqual({ tag: "tag1", count: 2 });
  });
});
