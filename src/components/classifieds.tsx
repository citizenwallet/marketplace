/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/WVlAuvT0ryO
 */
import { sql } from "@/lib/db";
import ClassifiedRow from "./ClassifiedRow";
import Link from "next/link";
export const dynamic = "force-dynamic";

export async function Classifieds({
  communitySlug,
  account,
}: {
  communitySlug: string;
  account: string;
}) {
  const { rows } =
    await sql`SELECT * from classifieds where "communitySlug"=${communitySlug} ORDER BY id DESC`;

  console.log(">>> rows", communitySlug, rows);

  return (
    <div>
      <div className="mx-auto w-full max-w-5xl px-4 lg:px-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Classifieds</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Share what you are looking for or what you have to offer.
          </p>
        </div>
        <div className="space-y-6 mb-12">
          <Link
            href={`/${communitySlug}/new?account=${account}`}
            className="button"
          >
            New Classified
          </Link>
        </div>
      </div>
      <div>
        <div className="pt-8">
          <div className="space-y-2">
            {rows.map((classified) => (
              <ClassifiedRow
                key={classified.id}
                data={classified}
                account={account}
              />
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800" />
        </div>
      </div>
    </div>
  );
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}