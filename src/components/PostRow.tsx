import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";
import { getUrlFromIPFS } from "@/lib/ipfs";
import Link from "next/link";
import { Translator } from "@/lib/i18n.client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { posts } from "@prisma/client";
import { cn } from "@/lib/utils";

type Props = {
  data: posts;
  account: string;
  lang: string;
};

export default function PostRow({ data, account, lang }: Props) {
  const t = Translator(lang);
  moment.locale(lang);
  const defaultAvatar = `https://api.multiavatar.com/${account}.png`;
  return (
    <Link
      href={`/${data.communitySlug}/${data.id}?account=${account}`}
      className="PostRow"
      prefetch
    >
      <div className="my-2 p-4 pr-2 flex flex-row active:bg-gray-700 dark:bg-gray-800  dark:active:bg-gray-600 rounded-lg">
        <div className="space-y-1 w-full">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-8 h-8">
              <Image
                alt="Avatar"
                className="object-cover w-8 h-8"
                height="32"
                src={
                  data.authorAvatar
                    ? getUrlFromIPFS(data.authorAvatar) ?? defaultAvatar
                    : defaultAvatar
                }
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {data.type === "OFFER" ? t(`offered by`) : t(`requested by`)}{" "}
              {data.authorName} (@
              {data.authorUsername}) {moment(data.createdAt).fromNow()}
            </div>
          </div>
          <div className="flex justify-end items-center space-x-2">
            <div
              className={cn(
                "py-1 px-2 text-sm rounded-full",
                data.type === "OFFER"
                  ? "bg-gray-500 text-white"
                  : "bg-white text-gray-500"
              )}
            >
              {data.type === "OFFER" ? t("Offer") : t("Request")}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center text-right ml-3 font-bold">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </Link>
  );
}
