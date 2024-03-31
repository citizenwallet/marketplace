import { dbconnect, db, dbreset, dbclose } from "../src/lib/db";

const communitySlug = "testCommunity";
const text = "testDescription";

let record;

describe("db.test.js", () => {
  beforeAll(async () => {
    await dbconnect();
    await dbreset();
    record = await db.insert("classifieds", {
      communitySlug,
      text,
    });
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
    expect(result.rows[0].text).toEqual(text);
    expect(result.fields.length).toEqual(16);
  });
  test("select * with WHERE", async () => {
    // Arrange

    // Act
    const result = await db.select("classifieds", "*", { communitySlug });

    // Assert
    expect(result.rowCount).toEqual(1);
    expect(result.rows.length).toEqual(1);
    expect(result.rows[0].communitySlug).toEqual(communitySlug);
    expect(result.rows[0].text).toEqual(text);
    expect(result.fields.length).toEqual(16);
  });
});
