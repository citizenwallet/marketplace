import NewPost from "@/components/NewPost";
import AccountRequiredError from "@/components/AccountRequiredError";
import TopNavigationBar from "@/components/TopNavigationBar";
import { getLanguage } from "@/lib/i18n";
import { Suspense } from "react";
import { getCommunityConfig } from "@/app/actions/community";
import {
  CommunityConfig,
  getProfileFromAddress,
  verifyConnectedUrl,
} from "@citizenwallet/sdk";
import GenericLoadingPage from "@/components/GenericLoadingPage";
import { isAddress } from "ethers";

export default function Page({
  params,
  searchParams,
}: {
  params: any;
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
  params: { communitySlug: string };
  searchParams: any;
}) {
  const communitySlug = params.communitySlug;
  const lang = getLanguage(searchParams.lang);

  if (!communitySlug) return null;

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

  if (!account || account === "undefined") return <AccountRequiredError />;

  const ipfsDomain = process.env.IPFS_DOMAIN;
  if (!ipfsDomain) return <div>IPFS domain not set</div>;

  const profile = await getProfileFromAddress(
    ipfsDomain,
    new CommunityConfig(config),
    account
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-4 mb-4">
      <TopNavigationBar
        communitySlug={communitySlug}
        account={account}
        lang={lang}
      />
      {!profile && (
        <div className="flex flex-col justify-center h-full">
          <div className="text-2xl font-bold">Profile missing</div>
          <div className="text-sm text-gray-500">
            You need a profile to create a post. You can do this by going back
            to the main screen of the Citizen Wallet app and tap on your avatar.
          </div>
        </div>
      )}
      {profile && (
        <NewPost
          communitySlug={communitySlug}
          config={config}
          profile={profile}
          lang={lang}
        />
      )}
    </main>
  );
}
