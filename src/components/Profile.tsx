import PostRow from "./PostRow";
import Contact from "./Contact";
import { getPostsByAuthor } from "@/db/posts";
import {
  CommunityConfig,
  Config,
  getAccountBalance,
  ProfileWithTokenId,
} from "@citizenwallet/sdk";
import { Translator } from "@/lib/i18n";
import Image from "next/image";

export default async function Profile({
  communitySlug,
  config,
  profile,
  postId,
  loggedInAccountAddress,
  lang,
}: {
  communitySlug: string;
  config: Config;
  profile: ProfileWithTokenId;
  postId?: number;
  loggedInAccountAddress?: string;
  lang: string;
}) {
  const t = Translator(lang);

  const posts = await getPostsByAuthor(communitySlug, profile.account ?? "");

  const community = new CommunityConfig(config);

  const balance =
    ((await getAccountBalance(community, profile.account ?? "")) ?? BigInt(0)) /
    BigInt(10 ** community.primaryToken.decimals);

  const post = postId && posts.find((post) => post.id === postId);
  const data = post && {
    contactService: post.contactService,
    contactAddress: post.contactAddress,
    title: post.title,
  };

  const defaultAvatar = `https://api.multiavatar.com/${profile.account}.png`;

  return (
    <div className="flex content-center flex-col justify-center items-center text-center">
      <Image
        alt={`Avatar of ${profile.name}`}
        className="rounded-full object-cover w-24 h-24"
        src={profile.image_medium || defaultAvatar}
        style={{
          aspectRatio: "1",
          objectFit: "cover",
        }}
        width={96}
        height={96}
        priority
      />

      <h3 className="pt-4">{profile.name}</h3>
      <p>@{profile.username}</p>
      <div className="my-2">
        {balance.toString()} {community.primaryToken.symbol}
      </div>
      {data && <Contact data={data} />}

      {posts.length > 1 && (
        <>
          <h3 className="pt-4 pl-4 text-left">{t("Other posts")}</h3>
          <div>
            <div className="text-left">
              <div className="space-y-2">
                {posts.map(
                  (post) =>
                    post.id !== postId && (
                      <PostRow
                        key={post.id}
                        data={post}
                        loggedInAccountAddress={loggedInAccountAddress}
                        lang={lang}
                      />
                    )
                )}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-800" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
