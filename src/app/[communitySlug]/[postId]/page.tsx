import React, { Suspense } from "react";
import PostComponent from "@/components/Post";
import TopNavigationBar from "@/components/TopNavigationBar";
import { getLanguage } from "@/lib/i18n";
import GenericLoadingPage from "@/components/GenericLoadingPage";
import { getCommunityConfig } from "@/app/actions/community";
import { isAddress } from "ethers";
import { CommunityConfig, verifyConnectedUrl } from "@citizenwallet/sdk";
import AccountRequiredError from "@/components/AccountRequiredError";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: {
    account?: string;
    lang: string;
    sigAuthAccount?: string;
    sigAuthExpiry?: string;
    sigAuthSignature?: string;
    sigAuthRedirect?: string;
  };
}) {
  const { communitySlug, postId } = params;
  const lang = getLanguage(searchParams.lang);

  if (!communitySlug || !postId) return null;

  const config = await getCommunityConfig(communitySlug);
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

  return (
    <main className="flex min-h-screen flex-col items-center p-2 w-full">
      <div className="mx-auto w-full max-w-5xl p-1 lg:px-6 space-y-6 mb-8">
        <TopNavigationBar lang={lang} />
        <Suspense fallback={<GenericLoadingPage />}>
          <PostComponent
            communitySlug={communitySlug}
            id={parseInt(postId)}
            account={account}
            lang={lang}
            searchParams={new URLSearchParams(searchParams)}
          />
        </Suspense>
      </div>
    </main>
  );
}
