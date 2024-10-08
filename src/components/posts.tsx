/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/WVlAuvT0ryO
 */
import { sql } from "@/lib/db";
import PostRow from "./PostRow";
export const dynamic = "force-dynamic";

export default async function Posts({
  communitySlug,
  account,
  selectedTag,
  lang,
}: {
  communitySlug: string;
  account: string;
  selectedTag: string;
  lang: string;
}) {
  const { rows } = selectedTag
    ? await sql`SELECT * from posts where "communitySlug"=${communitySlug} AND LOWER(${selectedTag})=ANY(ARRAY(SELECT LOWER(unnest(tags)))) AND status='PUBLISHED' ORDER BY id DESC`
    : await sql`SELECT * from posts where "communitySlug"=${communitySlug} AND status='PUBLISHED' ORDER BY id DESC`;

  return (
    <div>
      <div className="space-y-2">
        {rows.map((post) => (
          <PostRow key={post.id} data={post} account={account} lang={lang} />
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800" />
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
