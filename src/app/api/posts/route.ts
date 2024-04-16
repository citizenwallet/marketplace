import { db } from "@/lib/db";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(">>> server insert", data);
  const res = await db.insert("posts", data);
  return Response.json(res);
}

export async function PATCH(request: Request) {
  const data = await request.json();
  console.log(">>> server update", data);
  const res = await db.update("posts", data);
  return Response.json(res);
}
