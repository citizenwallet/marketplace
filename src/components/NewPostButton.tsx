"use client";
import Link from "next/link";

import { Translator } from "@/lib/i18n.client";
import { Loader2 } from "lucide-react";
import { ProfileWithTokenId } from "@citizenwallet/sdk";

export default function NewPostButton({
  communitySlug,
  account,
  profile,
  lang,
}: {
  communitySlug: string;
  account: string;
  profile: ProfileWithTokenId | null;
  lang: any;
}) {
  const t = Translator(lang);
  if (profile) {
    return (
      <Link
        href={`/${communitySlug}/new?account=${account}`}
        className="button"
      >
        {t("New Post")}
      </Link>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-14">
        {t("Loading your profile...")}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin">
        <Loader2 className="w-4 h-4" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        {t("Creating your profile...")}
      </p>
    </div>
  );
}
