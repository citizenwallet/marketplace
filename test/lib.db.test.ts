import { dbconnect, db, dbreset, dbclose } from "../src/lib/db";

const communitySlug = "gt.celo";

const d = new Date();
const expiryDate = d.setMonth(d.getMonth() + 1);

const classified = {
  communitySlug,
  type: "REQUEST",
  title: "New request",
  text: "testDescription",
  tags: ["tag1", "tag2"],
  authorUsername: "xdamman",
  authorName: "Xavier (test)",
  authorAvatar: "ipfs://QmXfLyiNVZ6ydtGLUVV438KfSGB3SJV5D6xrNmDwPWifMM",
  authorAccount: "0xBDf83fAf601C7D39c86192eFBD34a331212952ac",
  contactService: "whatsapp",
  contactAddress: "+32470 00.00 00",
  status: "PUBLISHED",
  expiryDate: new Date(expiryDate),
};

// classified.contactService = "telegram";
// classified.contactAddress = "@xdamman";
classified.contactService = "phone";
classified.contactAddress = "+32470828282";

let record;

console.log(">>> Using", process.env.POSTGRES_DATABASE);
const numberOfFields = 18; // number of fields in the classifieds table

describe("db.test.js", () => {
  beforeAll(async () => {
    await dbconnect();
    await dbreset();
    record = await db.insert("classifieds", classified);
  });

  afterAll(async () => {
    // Close the database connection.
    await dbclose();
  });

  test("select *", async () => {
    // Arrange

    // Act
    const result = await db.select("classifieds", "*");

    // Assert
    expect(result.rowCount).toEqual(1);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].communitySlug).toEqual(communitySlug);
    expect(result.rows[0].text).toEqual(classified.text);
    expect(result.fields.length).toEqual(numberOfFields);
  });

  test("select * with WHERE", async () => {
    // Arrange

    // Act
    const result = await db.select("classifieds", "*", { communitySlug });

    // Assert
    expect(result.rowCount).toEqual(1);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].communitySlug).toEqual(communitySlug);
    expect(result.rows[0].text).toEqual(classified.text);
    expect(result.rows[0].tags).toEqual(["tag1", "tag2"]);
    expect(result.fields.length).toEqual(numberOfFields);
  });
});
