import { getCommunityConfig } from "@/app/actions/community";
import AccountRequiredError from "@/components/AccountRequiredError";
import ArchiveConfirmation from "@/components/ArchiveConfirmation";
import GenericLoadingPage from "@/components/GenericLoadingPage";
import { getPost } from "@/db/posts";
import { CommunityConfig, verifyConnectedUrl } from "@citizenwallet/sdk";
import { isAddress } from "ethers";
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
    <Suspense fallback={<GenericLoadingPage />}>
      <AsyncPage params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function AsyncPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account?: string };
}) {
  const post = await getPost(parseInt(params.postId));

  const config = await getCommunityConfig(params.communitySlug);
  if (!config) return <div>Community not found</div>;

  let account = searchParams.account;

  if (!account || account === "undefined" || !isAddress(account)) {
    try {
      const community = new CommunityConfig(config);

      account =
        (await verifyConnectedUrl(community, {
          params: new URLSearchParams(searchParams),
        })) ?? undefined;
    } catch (error) {
      console.error("Account verification error:", error);
      return <AccountRequiredError />;
    }
  }

  if (!account || account === "undefined" || !isAddress(account))
    return <AccountRequiredError />;

  if (!post || post.status === "DELETED") {
    redirect(`/${params.communitySlug}?account=${searchParams.account}`);
  }

  return (
    <div className="container max-w-2xl mx-auto pt-10">
      <ArchiveConfirmation
        communitySlug={params.communitySlug}
        postId={params.postId}
        account={account}
      />
    </div>
  );
}
