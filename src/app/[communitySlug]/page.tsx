import { Posts } from "@/components/posts";
export const dynamic = "force-dynamic";
import AccountRequiredError from "@/components/AccountRequiredError";
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
      <div>
        <Posts
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
