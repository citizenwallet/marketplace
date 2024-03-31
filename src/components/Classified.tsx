import moment from "moment";

import { Author, Classified } from "@/types";
import { getUrlFromIPFS } from "@/lib/ipfs";
import { QueryResultRow } from "@vercel/postgres";

export default function ClassifiedComponent({
  data,
}: {
  data: QueryResultRow;
}) {
  return (
    <div>
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
            Posted by {data.authorName} (@{data.authorUsername}) |{" "}
            {moment(data.createdAt).fromNow()}
          </div>
        </div>
      </div>
      <div className="prose dark:prose-dark">
        <p>{data.text}</p>
      </div>
    </div>
  );
}
