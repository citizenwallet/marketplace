import Link from "next/link";

export default function TopNavigationBar({
  communitySlug,
  account,
}: {
  communitySlug: string;
  account: string;
}) {
  return (
    <Link href={`/${communitySlug}?account=${account}`} className="w-full">
      <div className="flex flex-row text-left w-full mb-4">
        <div className="font-bold w-5">&lt;</div>
        <div className="font-bold">{communitySlug} posts</div>
      </div>
    </Link>
  );
}
