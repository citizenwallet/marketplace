import React, { Suspense } from "react";
import PostComponent from "@/components/Post";
import TopNavigationBar from "@/components/TopNavigationBar";
import { getLanguage } from "@/lib/i18n";
import GenericLoadingPage from "@/components/GenericLoadingPage";

export default function PostPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string; lang: string };
}) {
  const { communitySlug, postId } = params;
  const { account } = searchParams;
  const lang = getLanguage(searchParams.lang);

  if (!communitySlug || !postId) return null;
  if (!account || account === "undefined") return <div>Account required</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-2 w-full">
      <div className="mx-auto w-full max-w-5xl p-1 lg:px-6 space-y-6 mb-8">
        <TopNavigationBar
          communitySlug={communitySlug}
          account={account}
          lang={lang}
        />
        <Suspense fallback={<GenericLoadingPage />}>
          <PostComponent
            communitySlug={communitySlug}
            id={parseInt(postId)}
            account={account}
            lang={lang}
          />
        </Suspense>
      </div>
    </main>
  );
}
