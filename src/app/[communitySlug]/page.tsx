import { Translator, getLanguage } from "@/lib/i18n";
import AccountRequiredError from "@/components/AccountRequiredError";
import NewPostButton from "@/components/NewPostButton";
import TagsFilter from "@/components/TagsFilter";
import Posts from "@/components/posts";
import { getTags } from "@/db/tags";

export default async function Home({
  params,
  searchParams,
}: {
  params: { communitySlug: string };
  searchParams: { lang: string; account: string; tag: string };
}) {
  const lang = getLanguage(searchParams.lang);
  const t = Translator(lang);
  const account = searchParams.account;
  const selectedTag = searchParams.tag;

  if (!account || account === "undefined") return <AccountRequiredError />;

  // Fetch tags and posts server-side
  const tags = await getTags(params.communitySlug);
  console.log(">>> tags", tags);
  // const posts = await getPosts(params.communitySlug, account, selectedTag);

  return (
    <main className="flex min-h-screen flex-col items-center p-2">
      <div className="mt-4">
        <div className="mx-auto w-full max-w-5xl px-4 lg:px-6 space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{t("Marketplace")}</h1>
            <p className="text-gray-500 dark:text-gray-400 w-9/12">
              {t("MarketplaceDescription")}
            </p>
          </div>
          <div className="space-y-6 mb-8">
            <NewPostButton
              account={account}
              communitySlug={params.communitySlug}
              lang={lang}
            />
          </div>
        </div>
        <TagsFilter
          communitySlug={params.communitySlug}
          account={account}
          selectedTag={selectedTag}
          tags={tags}
        />
        <Posts
          communitySlug={params.communitySlug}
          account={account}
          selectedTag={selectedTag}
          lang={lang}
        />
      </div>
    </main>
  );
}
