import { dbconnect, client } from "./db";

export async function getPosts(
  communitySlug: string,
  account?: string,
  selectedTag?: string
) {
  await dbconnect();
  const variables = [communitySlug];
  if (account) variables.push(account);
  if (selectedTag) variables.push(selectedTag);

  const query = `
    SELECT *
    FROM posts
    WHERE "communitySlug" = $1 ${account ? `AND "authorAccount" = $2` : ""} ${
    selectedTag ? `AND tags @> ARRAY[$${variables.length}]` : ""
  }
    ORDER BY "createdAt" DESC
  `;
  console.log(query, variables);
  const result = await client.query(query, variables);
  return result.rows;
}
