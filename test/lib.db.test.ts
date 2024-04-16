import { dbconnect, db, dbreset, dbclose } from "../src/lib/db";

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

// post.contactService = "telegram";
// post.contactAddress = "@xdamman";
post.contactService = "phone";
post.contactAddress = "+32470828282";

let record;

console.log(">>> Using", process.env.POSTGRES_DATABASE);
const numberOfFields = 18; // number of fields in the posts table

describe("db.test.js", () => {
  beforeAll(async () => {
    await dbconnect();
    await dbreset();
    record = await db.insert("posts", post);
  });

  afterAll(async () => {
    // Close the database connection.
    await dbclose();
  });

  test("select *", async () => {
    // Arrange

    // Act
    const result = await db.select("posts", "*");

    // Assert
    expect(result.rowCount).toEqual(1);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].communitySlug).toEqual(communitySlug);
    expect(result.rows[0].text).toEqual(post.text);
    expect(result.fields.length).toEqual(numberOfFields);
  });

  test("select * with WHERE", async () => {
    // Arrange

    // Act
    const result = await db.select("posts", "*", { communitySlug });

    // Assert
    expect(result.rowCount).toEqual(1);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].communitySlug).toEqual(communitySlug);
    expect(result.rows[0].text).toEqual(post.text);
    expect(result.rows[0].tags).toEqual(["tag1", "tag2"]);
    expect(result.fields.length).toEqual(numberOfFields);
  });
});
