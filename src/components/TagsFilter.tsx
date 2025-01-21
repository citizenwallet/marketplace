import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TagsFilter({
  communitySlug,
  account,
  selectedTag,
  tags,
}: {
  communitySlug: string;
  account: string;
  selectedTag: string;
  tags: { tag: string; count: number }[];
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 m-4">
        {tags.map((tag) => (
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
