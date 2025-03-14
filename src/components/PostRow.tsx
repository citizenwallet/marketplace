import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";
import Link from "next/link";
import { Translator } from "@/lib/i18n.client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { posts } from "@prisma/client";
import { cn, getTagColor } from "@/lib/utils";

type Props = {
  data: posts;
  loggedInAccountAddress?: string;
  lang: string;
};

export default function PostRow({ data, loggedInAccountAddress, lang }: Props) {
  const t = Translator(lang);
  moment.locale(lang);
  const defaultAvatar = `https://api.multiavatar.com/${data.authorAccount}.png`;
  return (
    <Link
      href={`/${data.communitySlug}/${data.id}?account=${loggedInAccountAddress}`}
      className="block transition-all hover:scale-[1.01] active:scale-[0.99]"
      prefetch
    >
      <div className="my-2 p-4 flex items-start gap-4 bg-white dark:bg-gray-800 hover:bg-gray-50 hover:dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-700">
        {/* Avatar */}
        <div className="mt-1 rounded-full overflow-hidden w-12 h-12 flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700">
          <Image
            alt={`Avatar of ${data.authorName}`}
            className="object-cover w-12 h-12"
            height="48"
            width="48"
            src={data.authorAvatar || defaultAvatar}
            style={{
              aspectRatio: "1",
              objectFit: "cover",
            }}
            priority
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex-wrap">
              {data.title}
            </h2>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span
              className={cn(
                "lowercase py-1 px-3 text-xs font-medium rounded-full",
                data.type === "OFFER"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              )}
            >
              {data.type === "OFFER" ? t("Offer") : t("Request")}
            </span>
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="tag"
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author info and timestamp */}
          <div className="flex flex-col  gap-0 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex-shrink-0">
              {t("by")}{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {data.authorName}
              </span>
              <span className="text-gray-400 dark:text-gray-500 ml-1">
                (@{data.authorUsername})
              </span>
            </div>
            <div>
              <time className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                {moment(data.createdAt).fromNow()}
              </time>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 self-center">
          <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </Link>
  );
}
