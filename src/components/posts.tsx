import PostRow from "./PostRow";
import { getPublishedPosts, getPublishedPostsByTag } from "@/db/posts";

export default async function Posts({
  communitySlug,
  selectedTag,
  searchParams,
  lang,
  type,
}: {
  communitySlug: string;
  selectedTag?: string;
  searchParams: URLSearchParams;
  lang: string;
  type?: "REQUEST" | "OFFER";
}) {
  const posts = selectedTag
    ? await getPublishedPostsByTag(communitySlug, selectedTag, type)
    : await getPublishedPosts(communitySlug, type);

  return (
    <div>
      <div className="space-y-2">
        {posts.map((post) => (
          <PostRow
            key={post.id}
            data={post}
            searchParams={searchParams}
            lang={lang}
          />
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800" />
    </div>
  );
}
