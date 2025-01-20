"use server";

import { archivePost } from "@/db/posts";
import { revalidatePath } from "next/cache";

export async function archivePostAction(
  communitySlug: string,
  account: string,
  postId: number
) {
  await archivePost(postId);

  revalidatePath(`/${communitySlug}?account=${account}`);
}
