"use client";
import Link from "next/link";
import { useCommunity, useProfile } from "../hooks/citizenwallet";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function NewPostButton({
  communitySlug,
  account,
}: {
  communitySlug: string;
  account: string;
}) {
  const [profile] = useProfile(communitySlug, account);
  const { t } = useTranslation();

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

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center h-14">
        {t("Loading your profile...")}
      </div>
    );
  }

  return (
    <div>
      <Link href={"#"} className="button">
        {t("Create a Profile")}
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        {t("Create a free profile to start posting")}
      </p>
    </div>
  );
}
