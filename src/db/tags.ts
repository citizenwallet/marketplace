import { prisma } from "@/prisma";

export async function getTags(communitySlug: string) {
  const tags = await prisma.posts.groupBy({
    by: ["tags"],
    where: {
      communitySlug,
      expiryDate: {
        gt: new Date(),
      },
    },
    _count: {
      tags: true,
    },
  });

  // Flatten and count the tags since they're stored as an array
  const tagCounts = new Map<string, number>();
  tags.forEach((group) => {
    group.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + group._count.tags);
    });
  });

  // Convert to array and sort
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .filter((tag) => !!tag.tag)
    .sort(
      (a, b) =>
        b.count - a.count || // Sort by count DESC
        a.tag.localeCompare(b.tag) // Then alphabetically
    );
}
