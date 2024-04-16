import EditPost from "@/components/EditPost";
import Link from "next/link";
import TopNavigationBar from "@/components/TopNavigationBar";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ViewPost({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const { rows } =
    await sql`SELECT * from posts where "communitySlug"=${params.communitySlug} AND id=${params.postId}`;

  console.log(">>> rows", rows);
  return (
    <main className="flex min-h-screen flex-col p-4">
      <TopNavigationBar
        communitySlug={params.communitySlug}
        account={searchParams.account}
      />
      <div className="items-center">
        <EditPost
          data={rows[0]}
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
