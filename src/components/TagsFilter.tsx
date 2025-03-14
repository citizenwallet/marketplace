import { Translator } from "@/lib/i18n";
import { cn, getTagColor } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TagsFilter({
  communitySlug,
  account,
  selectedTag,
  tags,
  type,
  lang,
}: {
  communitySlug: string;
  account: string;
  selectedTag: string;
  tags: { tag: string; count: number }[];
  type: "REQUEST" | "OFFER" | undefined;
  lang: string;
}) {
  let basePath = `/${communitySlug}?account=${account}`;
  if (selectedTag) {
    basePath += `&tag=${selectedTag}`;
  }

  const t = Translator(lang);

  return (
    <div className="flex flex-wrap gap-1">
      <Link
        href={type !== "OFFER" ? `${basePath}&type=OFFER` : basePath}
        className={type === "OFFER" ? "tag selected" : "tag"}
        style={{ backgroundColor: getTagColor("OFFER") }}
      >
        {t("Offers")}
      </Link>
      <Link
        href={type !== "REQUEST" ? `${basePath}&type=REQUEST` : basePath}
        className={type === "REQUEST" ? "tag selected" : "tag"}
        style={{ backgroundColor: getTagColor("REQUEST") }}
      >
        {t("Requests")}
      </Link>
      {tags.map((tag) => (
        <Link
          href={`/${communitySlug}?account=${account}&tag=${
            selectedTag === tag.tag ? "" : tag.tag
          }`}
          className={selectedTag === tag.tag ? "tag selected" : "tag"}
          style={{ backgroundColor: getTagColor(tag.tag) }}
          key={tag.tag}
        >
          {tag.tag} ({tag.count})
        </Link>
      ))}
    </div>
  );
}
