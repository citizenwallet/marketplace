import { dbconnect, client } from "./db";

export async function getTags(communitySlug: string) {
  await dbconnect();
  const query = `
    SELECT unnest(tags) as tag, COUNT(*) as count
    FROM posts
    WHERE "communitySlug" = $1
    GROUP BY unnest(tags)
    ORDER BY count DESC, tag
  `;
  const result = await client.query(query, [communitySlug]);
  return result.rows.map((row) => ({
    tag: row.tag,
    count: parseInt(row.count),
  }));
}

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
