import { sql } from "@/lib/db";
export const dynamic = "force-dynamic";

interface ExtendedRequest extends Request {
  nextUrl: URL;
}

export async function GET(request: ExtendedRequest) {
  const searchParams = request.nextUrl.searchParams;
  const communitySlug = searchParams.get("communitySlug");
  const { rows } =
    await sql`SELECT id, slug, label from tags where "communitySlug"=${communitySlug} ORDER BY id DESC`;
  return Response.json(rows);
}
