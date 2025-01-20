"use server";

import { updatePost } from "@/db/posts";

import { InsertPostData } from "@/db/posts";

export async function updatePostAction(id: number, data: InsertPostData) {
  await updatePost(id, data);
}
