import moment from "moment";

import { getUrlFromIPFS } from "@/lib/ipfs";
import { QueryResultRow } from "@vercel/postgres";
import Link from "next/link";

export default function ClassifiedRow({
  data,
  account,
}: {
  data: QueryResultRow;
  account: string;
}) {
  return (
    <Link href={`/${data.communitySlug}/${data.id}?account=${account}`}>
      <div className="my-2 p-4 pr-2 flex flex-row hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg">
        <div className="space-y-1 w-full">
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
              {data.authorUsername}) {moment(data.createdAt).fromNow()}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-right ml-3 font-bold">
          &gt;
        </div>
      </div>
    </Link>
  );
}
