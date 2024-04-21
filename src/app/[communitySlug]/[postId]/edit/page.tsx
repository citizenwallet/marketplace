import EditPost from "@/components/EditPost";
import Link from "next/link";
import TopNavigationBar from "@/components/TopNavigationBar";
import { sql } from "@/lib/db";
import type { Post } from "@/types";

export const dynamic = "force-dynamic";

export default async function ViewPost({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const { rows }: { rows: Post[] } =
    await sql`SELECT * from posts where "communitySlug"=${params.communitySlug} AND id=${params.postId}`;

  return (
    <main className="flex min-h-screen flex-col p-4 mb-4">
      <TopNavigationBar
        communitySlug={params.communitySlug}
        account={searchParams.account}
      />
      <div className="items-center">
        <EditPost
          data={rows[0] as Post}
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
