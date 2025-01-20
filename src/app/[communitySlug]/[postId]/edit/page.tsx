import EditPost from "@/components/EditPost";
import Link from "next/link";
import TopNavigationBar from "@/components/TopNavigationBar";
import { sql } from "@/lib/db";
import type { Post } from "@/types";
import { getLanguage } from "@/lib/i18n";
import { getPostBySlugAndId } from "@/db/posts";
export const dynamic = "force-dynamic";

export default async function ViewPost({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: any;
}) {
  const lang = getLanguage(searchParams.lang);

  const post = await getPostBySlugAndId(
    params.communitySlug,
    parseInt(params.postId)
  );

  if (!post) return <div>Post not found</div>;

  return (
    <main className="flex min-h-screen flex-col p-4 mb-4">
      <TopNavigationBar
        communitySlug={params.communitySlug}
        account={searchParams.account}
      />
      <div className="items-center">
        <EditPost
          id={parseInt(params.postId)}
          data={post}
          communitySlug={params.communitySlug}
          account={searchParams.account}
          lang={lang}
        />
      </div>
    </main>
  );
}
