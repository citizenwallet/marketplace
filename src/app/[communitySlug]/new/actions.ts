"use server";

import { insertPost } from "@/db/posts";

import { InsertPostData } from "@/db/posts";
import { revalidatePath } from "next/cache";

export async function insertPostAction(
  communitySlug: string,
  searchParams: URLSearchParams,
  data: InsertPostData
) {
  await insertPost(data);

  revalidatePath(`/${communitySlug}?${searchParams.toString()}`);
}
