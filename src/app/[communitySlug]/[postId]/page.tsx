import React, { Suspense } from "react";
import PostComponent from "@/components/Post";
import TopNavigationBar from "@/components/TopNavigationBar";
import { getLanguage } from "@/lib/i18n";
import { getCommunityConfig } from "@/app/actions/community";
import GenericLoadingPage from "@/components/GenericLoadingPage";

export const revalidate = 3600; // Cache for 1 hour by default
export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string; lang: string };
}) {
  return (
    <Suspense fallback={<GenericLoadingPage />}>
      <Async params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Async({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string; lang: string };
}) {
  const { communitySlug, postId } = params;
  const { account } = searchParams;
  const lang = getLanguage(searchParams.lang);

  if (!communitySlug || !postId) return null;
  if (!account || account === "undefined") return <div>Account required</div>;

  const config = await getCommunityConfig(communitySlug);
  if (!config) return <div>Community not found</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 mb-4">
      <TopNavigationBar
        communitySlug={communitySlug}
        account={account}
        lang={lang}
      />
      <PostComponent
        communitySlug={communitySlug}
        id={parseInt(postId)}
        account={account}
        config={config}
        lang={lang}
      />
    </main>
  );
}
