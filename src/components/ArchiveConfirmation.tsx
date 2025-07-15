"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { archivePostAction } from "@/app/[communitySlug]/[postId]/archive/actions";

export default function ArchiveConfirmation({
  communitySlug,
  postId,
  account,
}: {
  communitySlug: string;
  postId: string;
  account: string;
}) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const handleConfirm = async () => {
    try {
      await archivePostAction(communitySlug, account, parseInt(postId));

      router.push(`/${communitySlug}?${searchParams.toString()}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will archive your post. Archived posts will no longer be
            visible to other users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
