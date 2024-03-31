import { insert } from "@/lib/db";

export async function POST(request: Request) {
  const data = await request.json();
  console.log(">>> server insert", data);
  const res = await insert("classifieds", data);
  return Response.json(res);
}
