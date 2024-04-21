import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const data = await request.json();
  data.tags = data.tags || "{}";
  const res = await db.insert("posts", data);
  await revalidatePath(`/${data.communitySlug}`);
  return Response.json(res);
}

export async function PATCH(request: Request) {
  const data = await request.json();
  const res = await db.update("posts", data);
  await revalidatePath(`/${data.communitySlug}/${data.id}`);
  return Response.json(res);
}
