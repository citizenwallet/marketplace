import { Classifieds } from "@/components/classifieds";
import Image from "next/image";

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
