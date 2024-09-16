import React from 'react';
import PostComponent from '@/components/Post';
import TopNavigationBar from '@/components/TopNavigationBar';
import { getLanguage } from '@/lib/i18n';

export default function PostPage({
  params,
  searchParams,
}: {
  params: { communitySlug: string; postId: string };
  searchParams: { account: string, lang: string };
}) {
  const { communitySlug, postId } = params;
  const { account } = searchParams;
  const lang = getLanguage(searchParams.lang);

  if (!communitySlug || !postId) return null;
  if (!account || account === "undefined") return <div>Account required</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 pt-32 mb-4">
      <TopNavigationBar communitySlug={communitySlug} account={account} />
      <PostComponent 
        communitySlug={communitySlug} 
        id={parseInt(postId)} 
        account={account} 
        lang={lang}
      />
    </main>
  );
}
