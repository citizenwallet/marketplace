import Post from "@/components/Post";
import Link from "next/link";
import TopNavigationBar from "@/components/TopNavigationBar";

export const dynamic = "force-dynamic";

export default async function ViewPost({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  return (
    <main className="flex min-h-screen flex-col p-2 mt-6">
      <TopNavigationBar
        communitySlug={params.communitySlug}
        account={searchParams.account}
      />
      <div className="items-center">
        <Post
          id={params.postId}
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
