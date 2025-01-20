import PostRow from "./PostRow";
export const dynamic = "force-dynamic";
import CitizenWalletCommunity from "@/lib/citizenwallet";
import { getUrlFromIPFS } from "@/lib/ipfs";
import Contact from "./Contact";
import { getPostsByAuthor } from "@/db/posts";

interface Profile {
  username: string | null;
  name: string | null;
  account: string | null;
  avatar: string | null;
}

export default async function Profile({
  communitySlug,
  profile,
  postId,
  lang,
}: {
  communitySlug: string;
  profile: Profile;
  postId?: number;
  lang: string;
}) {
  const posts = await getPostsByAuthor(communitySlug, profile.account ?? "");

  const cw = new CitizenWalletCommunity(communitySlug);
  const balance = await cw.getBalance(profile.account ?? "");
  const transactions = await cw.getTransactions(profile.account ?? "");

  const post = postId && posts.find((post) => post.id === postId);
  const data = post && {
    contactService: post.contactService,
    contactAddress: post.contactAddress,
    title: post.title,
  };

  return (
    <div className="flex content-center flex-col justify-center text-center">
      <img
        src={getUrlFromIPFS(profile.avatar ?? "")}
        className="rounded-full w-24 h-24 mx-auto"
      />
      <h3 className="pt-4">{profile.name}</h3>
      <p>@{profile.username}</p>
      <div className="my-2">
        {balance} {cw.symbol} | {transactions.length} transactions
      </div>
      {data && <Contact data={data} />}

      {posts.length > 0 && (
        <>
          <h3 className="pt-4 pl-4 text-left">Latest posts</h3>
          <div>
            <div className="text-left">
              <div className="space-y-2">
                {posts.map(
                  (post) =>
                    post.id !== postId && (
                      <PostRow
                        key={post.id}
                        data={post}
                        account={profile.account ?? ""}
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
