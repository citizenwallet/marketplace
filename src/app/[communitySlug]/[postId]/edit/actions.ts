"use server";

import { updatePost } from "@/db/posts";

import { InsertPostData } from "@/db/posts";
import { revalidatePath } from "next/cache";

export async function updatePostAction(
  communitySlug: string,
  id: number,
  data: InsertPostData
) {
  await updatePost(id, data);

  revalidatePath(`/${communitySlug}?account=${data.authorAccount}`);
  revalidatePath(`/${communitySlug}/${id}?account=${data.authorAccount}`);
}
