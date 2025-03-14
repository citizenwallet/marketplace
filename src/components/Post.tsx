import React from "react";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/en-gb";
import Profile from "./Profile";
import Link from "next/link";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { Translator } from "@/lib/i18n.client";
import Image from "next/image";
import { getPostBySlugAndId } from "@/db/posts";
import {
  CommunityConfig,
  Config,
  ProfileWithTokenId,
} from "@citizenwallet/sdk";
import { posts } from "@prisma/client";
import { getCommunityConfig } from "@/app/actions/community";

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
  const config = await getCommunityConfig(communitySlug);
  if (!config) return <div>Community not found</div>;

  const post = await getPostBySlugAndId(communitySlug, id);

  if (!post) return null;

  const defaultAvatar = `https://api.multiavatar.com/${account}.png`;

  const profile: ProfileWithTokenId = {
    username: post.authorUsername ?? "",
    name: post.authorName ?? "",
    account: post.authorAccount ?? "",
    image: post.authorAvatar ?? defaultAvatar,
    image_medium: post.authorAvatar ?? defaultAvatar,
    image_small: post.authorAvatar ?? defaultAvatar,
    description: "",
    token_id: "0",
  };

  // Use a client-side component for translation
  return (
    <PostContent
      data={post}
      profile={profile}
      communitySlug={communitySlug}
      config={config}
      account={account}
      lang={lang}
    />
  );
}

const PostContent = ({
  data,
  profile,
  communitySlug,
  config,
  account,
  lang,
}: {
  data: posts;
  profile: ProfileWithTokenId;
  communitySlug: string;
  config: Config;
  account: string;
  lang: string;
}) => {
  const t = Translator(lang);
  moment.locale(lang);

  const community = new CommunityConfig(config);
  const decimals = community.primaryToken.decimals;

  const price =
    data.price && !isNaN(Number(data.price))
      ? parseFloat(data.price) / 10 ** decimals
      : 0;

  const defaultAvatar = `https://api.multiavatar.com/${account}.png`;

  return (
    <>
      <div className="my-4 p-2 mb-16">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{data.title}</h2>
          <div className="flex items-center space-x-2">
            <div className="rounded-full overflow-hidden w-8 h-8 flex-shrink-0">
              <Image
                alt="Avatar"
                className="object-cover w-full h-full"
                height="32"
                src={data.authorAvatar || defaultAvatar}
                style={{
                  aspectRatio: "32/32",
                  objectFit: "cover",
                }}
                width="32"
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("Posted by")} {data.authorName} (@
              {data.authorUsername}) | {moment(data.createdAt).fromNow()}
              {price > 0 ? ` | ${price.toFixed(2)} ${data.currency}` : ""}
            </div>
          </div>
        </div>
        <div className="prose dark:prose-dark mt-4 text">
          <Markdown remarkPlugins={[gfm]}>
            {data.text ? data.text.replace(/\n/g, "  \n") : ""}
          </Markdown>
        </div>
      </div>
      <Profile
        profile={profile}
        postId={data.id}
        communitySlug={communitySlug}
        config={config}
        lang={lang}
      />
      {data.authorAccount === account && (
        <Link
          className="button mt-6"
          href={`/${communitySlug}/${data.id}/edit?account=${account}`}
        >
          {t("Edit post")}
        </Link>
      )}
      {data.authorAccount === account && (
        <Link
          className="button mt-6"
          href={`/${communitySlug}/${data.id}/archive?account=${account}`}
        >
          {t("Archive post")}
        </Link>
      )}
    </>
  );
};
