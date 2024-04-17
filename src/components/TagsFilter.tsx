import Link from "next/link";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TagsFilter({
  communitySlug,
  account,
  selectedTag,
}: {
  communitySlug: string;
  account: string;
  selectedTag: string;
}) {
  const { rows } = await sql`SELECT
  t.tag,
  c.count
FROM
  (
    SELECT
      unnest(tags) AS tag
    FROM
      posts
    WHERE
      "communitySlug"=${communitySlug} AND status='PUBLISHED'
  ) t
LEFT JOIN
  (
    SELECT
      unnest(tags) AS tag,
      COUNT(*) AS count
    FROM
      posts
    WHERE
      "communitySlug"=${communitySlug} AND status='PUBLISHED'
    GROUP BY
      unnest(tags)
  ) c
ON
  t.tag = c.tag
ORDER BY
  c.count DESC;`;

  console.log(">>> rows", rows);
  return (
    <div>
      <div className="flex flex-wrap gap-2 m-4">
        {rows.map((tag) => (
          <Link
            href={`/${communitySlug}?account=${account}&tag=${
              selectedTag === tag.tag ? "" : tag.tag
            }`}
            className={selectedTag === tag.tag ? "tag selected" : "tag"}
            key={tag.tag}
          >
            {tag.tag} ({tag.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
