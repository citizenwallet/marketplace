"use client";
import Link from "next/link";
import { useCommunity, useProfile } from "../hooks/citizenwallet";

export default function NewPostButton({
  communitySlug,
  account,
}: {
  communitySlug: string;
  account: string;
}) {
  const [profile] = useProfile(communitySlug, account);

  if (profile) {
    return (
      <Link
        href={`/${communitySlug}/new?account=${account}`}
        className="button"
      >
        New Post
      </Link>
    );
  }

  if (profile === undefined) {
    return (
      <div className="flex items-center justify-center h-14">
        loading your profile...
      </div>
    );
  }

  return (
    <div>
      <Link href={"#"} className="button">
        Create a Profile
      </Link>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        Create a free profile to start posting
      </p>
    </div>
  );
}
