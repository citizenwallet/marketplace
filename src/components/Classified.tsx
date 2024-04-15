import moment from "moment";

import Link from "next/link";
import { getUrlFromIPFS } from "@/lib/ipfs";
import { sql } from "@/lib/db";
import Profile from "./Profile";
import Contact from "./Contact";
export default async function ClassifiedComponent({
  communitySlug,
  id,
  account,
}: {
  communitySlug: string;
  id: number;
  account: string;
}) {
  const { rows } =
    await sql`SELECT * from classifieds where "communitySlug"=${communitySlug} AND id=${id}`;

  const data = rows[0];

  if (!data) return null;

  const profile = {
    username: data.authorUsername,
    name: data.authorName,
    account: data.authorAccount,
    avatar: data.authorAvatar,
  };

  return (
    <>
      <div className="my-8 p-4 mb-16">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-8 h-8">
              <img
                alt="Avatar"
                className="object-cover w-full h-full"
                height="32"
                src={getUrlFromIPFS(data.authorAvatar)}
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {data.type.toLowerCase()}ed by {data.authorName} (@
              {data.authorUsername}) | {moment(data.createdAt).fromNow()} |{" "}
              {data.price / 10 ** 6} {data.currency}
            </div>
          </div>
        </div>
        <div className="prose dark:prose-dark mt-4">
          <p>{data.text}</p>
          <Contact data={data} />
        </div>
      </div>
      <Profile
        profile={profile}
        excludeId={data.id}
        communitySlug={communitySlug}
      />
    </>
  );
}
