import { Classifieds } from "@/components/classifieds";
export const dynamic = "force-dynamic";

export default async function Home({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div>
        <Classifieds
          communitySlug={params.communitySlug}
          account={searchParams.account}
        />
      </div>
    </main>
  );
}
