import Link from "next/link";
import { Posts } from "@/components/posts";
import AccountRequiredError from "@/components/AccountRequiredError";
import NewPostButton from "@/components/NewPostButton";

export default async function Home({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const account = searchParams.account;
  if (!account || account === "undefined") return <AccountRequiredError />;

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="mt-4">
        <div className="mx-auto w-full max-w-5xl px-4 lg:px-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-gray-500 dark:text-gray-400 w-9/12">
              Share what you are looking for or what you have to offer.
            </p>
          </div>
          <div className="space-y-6 mb-12">
            <NewPostButton
              account={account}
              communitySlug={params.communitySlug}
            />
          </div>
        </div>

        <Posts
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
