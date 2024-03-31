import NewClassified from "@/components/NewClassified";
import Error from "@/components/Error";

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
  if (!account || account === "undefined")
    return (
      <Error msg="Make sure you are running opening this page from the Citizen Wallet app (available on the App Store and Google Play Store)" />
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <NewClassified account={account} communitySlug={communitySlug} />
    </main>
  );
}
