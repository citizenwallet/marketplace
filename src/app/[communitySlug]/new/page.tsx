import NewPost from "@/components/NewPost";
import AccountRequiredError from "@/components/AccountRequiredError";
import TopNavigationBar from "@/components/TopNavigationBar";

export default function Home({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const communitySlug = params.communitySlug;
  const account = searchParams.account;

  if (!communitySlug) return null;
  if (!account || account === "undefined") return <AccountRequiredError />;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 mb-4">
      <TopNavigationBar communitySlug={communitySlug} account={account} />
      <NewPost account={account} communitySlug={communitySlug} />
    </main>
  );
}
