"use server";

import { insertPost } from "@/db/posts";

import { InsertPostData } from "@/db/posts";

export async function insertPostAction(data: InsertPostData) {
  await insertPost(data);
}
