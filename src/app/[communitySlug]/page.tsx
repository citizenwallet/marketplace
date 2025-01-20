import { Translator, getLanguage } from "@/lib/i18n";
import AccountRequiredError from "@/components/AccountRequiredError";
import NewPostButton from "@/components/NewPostButton";
import TagsFilter from "@/components/TagsFilter";
import Posts from "@/components/posts";
import { getTags } from "@/db/tags";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home({
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

  if (!account || account === "undefined") return <AccountRequiredError />;

  // Fetch tags and posts server-side
  const tags = await getTags(params.communitySlug);
  console.log(">>> tags", tags);
  // const posts = await getPosts(params.communitySlug, account, selectedTag);

  let basePath = `/${params.communitySlug}?account=${account}`;
  if (searchParams.tag) {
    basePath += `&tag=${searchParams.tag}`;
  }
  if (lang) {
    basePath += `&lang=${lang}`;
  }

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
        <div className="flex items-center justify-center space-x-2">
          <Link
            href={type === "REQUEST" ? basePath : `${basePath}&type=REQUEST`}
          >
            <Button
              className="w-18 text-white"
              variant={type === "REQUEST" ? "default" : "outline"}
            >
              {t("Request")}
            </Button>
          </Link>
          <Link href={type === "OFFER" ? basePath : `${basePath}&type=OFFER`}>
            <Button
              className="w-18 text-white"
              variant={type === "OFFER" ? "default" : "outline"}
            >
              {t("Offer")}
            </Button>
          </Link>
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
          type={searchParams.type}
        />
      </div>
    </main>
  );
}
