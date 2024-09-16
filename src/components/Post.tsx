import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { getUrlFromIPFS } from "@/lib/ipfs";
import Profile from "./Profile";
import Link from "next/link";
import Markdown from "react-markdown";
import gfm from "remark-gfm";

export default function PostComponent({
  communitySlug,
  id,
  account,
  data
}: {
  communitySlug: string;
  id: number;
  account: string;
  data: any;
}) {
  const { t } = useTranslation();

  if (!data) return null;

  const profile = {
    username: data.authorUsername,
    name: data.authorName,
    account: data.authorAccount,
    avatar: data.authorAvatar,
  };

  return (
    <>
      <div className="my-8 p-2 mb-16">
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
              {data.type.toLowerCase()}ed {t('Posted by')} {data.authorName} (@
              {data.authorUsername}) | {moment(data.createdAt).fromNow()} {t('ago')} |{" "}
              {data.price / 10 ** 6} {data.currency}
            </div>
          </div>
        </div>
        <div className="prose dark:prose-dark mt-4 text">
          <Markdown remarkPlugins={[gfm]}>
            {data.text.replace(/\n/g, "  \n")}
          </Markdown>
        </div>
      </div>
      <Profile
        profile={profile}
        postId={data.id}
        communitySlug={communitySlug}
      />
      {data.authorAccount === account && (
        <Link
          className="button mt-6"
          href={`/${communitySlug}/${data.id}/edit?account=${account}`}
        >
          {t('Edit post')}
        </Link>
      )}
    </>
  );
}
