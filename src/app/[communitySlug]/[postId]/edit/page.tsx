import EditPost from "@/components/EditPost";
import TopNavigationBar from "@/components/TopNavigationBar";
import { getLanguage } from "@/lib/i18n";
import { getPostBySlugAndId } from "@/db/posts";
import { getCommunityConfig } from "@/app/actions/community";
import { Suspense } from "react";
import { getProfileFromAddress } from "@citizenwallet/sdk";
import { CommunityConfig } from "@citizenwallet/sdk";
import GenericLoadingPage from "@/components/GenericLoadingPage";

export default async function Page({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: any;
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
  searchParams: {
    lang: string;
    account: string;
  };
}) {
  const lang = getLanguage(searchParams.lang);
  const account = searchParams.account;
  const post = await getPostBySlugAndId(
    params.communitySlug,
    parseInt(params.postId)
  );

  if (!post) return <div>Post not found</div>;

  const config = await getCommunityConfig(params.communitySlug);

  if (!config) return <div>Community not found</div>;

  const ipfsDomain = process.env.IPFS_DOMAIN;
  if (!ipfsDomain) return <div>IPFS domain not set</div>;

  const profile = await getProfileFromAddress(
    ipfsDomain,
    new CommunityConfig(config),
    account
  );
  if (!profile) return <div>Profile not found</div>;

  return (
    <main className="flex min-h-screen flex-col p-4 mb-4">
      <TopNavigationBar
        communitySlug={params.communitySlug}
        account={searchParams.account}
        lang={lang}
      />
      <div className="items-center">
        <EditPost
          id={parseInt(params.postId)}
          data={post}
          communitySlug={params.communitySlug}
          config={config}
          profile={profile}
          lang={lang}
        />
      </div>
    </main>
  );
}
