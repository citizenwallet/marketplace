import NewPost from "@/components/NewPost";
import AccountRequiredError from "@/components/AccountRequiredError";
import TopNavigationBar from "@/components/TopNavigationBar";
import { headers } from 'next/headers';

export default function Home({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const communitySlug = params.communitySlug;
  const account = searchParams.account;
  const lang = searchParams.lang || getLanguage();
  
  if (!communitySlug) return null;
  if (!account || account === "undefined") return <AccountRequiredError />;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 mb-4">
      <TopNavigationBar communitySlug={communitySlug} account={account} />
      <NewPost account={account} communitySlug={communitySlug} lang={lang} />
    </main>
  );
}

function getLanguage() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    const [browserLang] = acceptLanguage.split(',');
    const [langCode] = browserLang.split('-');
    return ['en', 'fr'].includes(langCode) ? langCode : 'en';
  }
  return 'en';
}
