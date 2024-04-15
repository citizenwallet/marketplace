import { sql } from "@/lib/db";
import ClassifiedRow from "./ClassifiedRow";
import Link from "next/link";
export const dynamic = "force-dynamic";
import CitizenWalletCommunity from "@/lib/citizenwallet";
import { getUrlFromIPFS } from "@/lib/ipfs";

interface Profile {
  username: string;
  name: string;
  account: string;
  avatar: string;
}

export default async function Profile({
  communitySlug,
  profile,
  excludeId,
}: {
  communitySlug: string;
  profile: Profile;
  excludeId?: number;
}) {
  const { rows } =
    await sql`SELECT * from classifieds where "communitySlug"=${communitySlug} AND "authorAccount"=${profile.account} AND id!=${excludeId} ORDER BY id DESC`;
  console.log(">>> fetching classifieds account", profile.account, rows);

  const cw = new CitizenWalletCommunity(communitySlug);
  const balance = await cw.getBalance(profile.account);
  const transactions = await cw.getTransactions(profile.account);

  return (
    <div className="flex content-center flex-col justify-center text-center">
      <img
        src={getUrlFromIPFS(profile.avatar)}
        className="rounded-full w-24 h-24 mx-auto"
      />
      <h3 className="pt-4">{profile.name}</h3>
      <p>@{profile.username}</p>
      <div className="my-2">
        {balance} {cw.symbol} | {transactions.length} transactions
      </div>
      {rows.length > 0 && (
        <>
          <h3 className="pt-4 pl-4 text-left">Latest posts</h3>
          <div>
            <div className="text-left">
              <div className="space-y-2">
                {rows.map((classified) => (
                  <ClassifiedRow
                    key={classified.id}
                    data={classified}
                    account={profile.account}
                  />
                ))}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
