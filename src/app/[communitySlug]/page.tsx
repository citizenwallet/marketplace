import { Translator, getLanguage } from "@/lib/i18n";
import AccountRequiredError from "@/components/AccountRequiredError";
import { isAddress } from "ethers";
import TagsFilter from "@/components/TagsFilter";
import Posts from "@/components/posts";
import { getTags } from "@/db/tags";
import { Suspense } from "react";
import { getCommunityConfig } from "../actions/community";
import GenericLoadingPage from "@/components/GenericLoadingPage";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function AsyncPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string };
  searchParams: {
    lang: string;
    account: string;
    tag: string;
    type?: "REQUEST" | "OFFER";
  };
}) {
  const lang = getLanguage(searchParams.lang);
  const t = Translator(lang);
  const account = searchParams.account;
  const selectedTag = searchParams.tag;
  const type = searchParams.type;

  if (!account || account === "undefined" || !isAddress(account))
    return <AccountRequiredError />;

  // Fetch tags and posts server-side
  const tags = await getTags(params.communitySlug);

  const config = await getCommunityConfig(params.communitySlug);
  if (!config) return <div>Community not found</div>;

  const ipfsDomain = process.env.IPFS_DOMAIN;
  if (!ipfsDomain) return <div>IPFS domain not set</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-2 w-full overflow-x-hidden max-w-5xl mx-auto">
      <div className="mt-4 w-full">
        <div className="mx-auto w-full px-4 lg:px-6 space-y-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 justify-between">
              <h1 className="text-3xl font-bold">{t("Marketplace")}</h1>
              <Link
                href={`/${params.communitySlug}/new?account=${account}`}
                className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-gray-500 dark:text-gray-400 w-9/12">
              {t("MarketplaceDescription")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mx-4 text-xs">
          <TagsFilter
            communitySlug={params.communitySlug}
            account={account}
            type={type}
            lang={lang}
            selectedTag={selectedTag}
            tags={tags}
          />
        </div>
        <Suspense fallback={<GenericLoadingPage />}>
          <Posts
            communitySlug={params.communitySlug}
            account={account}
            selectedTag={selectedTag}
            lang={lang}
            type={searchParams.type}
          />
        </Suspense>
      </div>
    </main>
  );
}
