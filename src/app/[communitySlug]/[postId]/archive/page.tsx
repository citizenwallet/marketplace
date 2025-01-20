import ArchiveConfirmation from "@/components/ArchiveConfirmation";
import { getPost } from "@/db/posts";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default function Page({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string };
}) {
  return (
    <Suspense
      fallback={<div className="h-screen w-screen text-center">Loading...</div>}
    >
      <AsyncPage params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function AsyncPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string };
}) {
  const post = await getPost(parseInt(params.postId));

  if (!post || post.status === "DELETED") {
    redirect(`/${params.communitySlug}?account=${searchParams.account}`);
  }

  return (
    <div className="container max-w-2xl mx-auto pt-10">
      <ArchiveConfirmation
        communitySlug={params.communitySlug}
        postId={params.postId}
        account={searchParams.account}
      />
    </div>
  );
}
