import React from 'react';
import moment from "moment";
import 'moment/locale/fr'; 
import 'moment/locale/en-gb';
import { getUrlFromIPFS } from "@/lib/ipfs";
import Profile from "./Profile";
import Link from "next/link";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { sql } from "@/lib/db";
import { Translator } from "@/lib/i18n.client";
import Image from "next/image";
import { QueryResultRow } from "@vercel/postgres";

export default async function PostComponent({
  communitySlug,
  id,
  account,
  lang,
}: {
  communitySlug: string;
  id: number;
  account: string;
  lang: string;
}) {
  const { rows } =
    await sql`SELECT * from posts where "communitySlug"=${communitySlug} AND id=${id}`;

  const data = rows[0];
  if (!data) return null;

  const profile = {
    username: data.authorUsername,
    name: data.authorName,
    account: data.authorAccount,
    avatar: data.authorAvatar,
  };

  // Use a client-side component for translation
  return (
    <PostContent 
      data={data} 
      profile={profile} 
      communitySlug={communitySlug} 
      account={account}
      lang={lang}
    />
  );
}

type PostData = QueryResultRow | {
  title: string;
  authorAvatar: string;
  authorName: string;
  authorUsername: string;
  createdAt: string;
  price: number;
  currency: string;
  text: string;
  id: number;
  authorAccount: string;
};

type ProfileData = {
  username: string;
  name: string;
  account: string;
  avatar: string;
};

const PostContent = ({ data, profile, communitySlug, account, lang }: {
  data: PostData;
  profile: ProfileData;
  communitySlug: string;
  account: string;
  lang: string;
}) => {
  const t = Translator(lang);
  moment.locale(lang);
  const defaultAvatar = `https://api.multiavatar.com/${account}.png`;
  return (
    <>
      <div className="my-8 p-2 mb-16">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-8 h-8">
              <Image
                alt="Avatar"
                className="object-cover w-full h-full"
                height="32"
                src={getUrlFromIPFS(data.authorAvatar) || defaultAvatar}
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('Posted by')} {data.authorName} (@
              {data.authorUsername}) | {moment(data.createdAt).fromNow()} |{" "}
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
        lang={lang}
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
};
