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
      <Error>
        Make sure you are running opening this page from the Citizen Wallet app
        (available on the{" "}
        <a href="https://apps.apple.com/app/citizen-wallet/id6460822891">
          App Store
        </a>{" "}
        and{" "}
        <a href="https://play.google.com/store/apps/details?id=xyz.citizenwallet.wallet">
          Google Play Store
        </a>
        )
      </Error>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <NewClassified account={account} communitySlug={communitySlug} />
    </main>
  );
}
