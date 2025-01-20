import "server-only";

import { prisma } from "@/prisma";
import { posts } from "@prisma/client";

export async function getPosts(
  communitySlug: string,
  account?: string,
  selectedTag?: string
) {
  const posts = await prisma.posts.findMany({
    where: {
      communitySlug,
      ...(account && { authorAccount: account }),
      ...(selectedTag && { tags: { has: selectedTag } }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}

export async function getPublishedPosts(communitySlug: string) {
  const posts = await prisma.posts.findMany({
    where: {
      communitySlug,
      status: "PUBLISHED",
    },
    orderBy: {
      id: "desc",
    },
  });

  return posts;
}

export async function getPublishedPostsByTag(
  communitySlug: string,
  selectedTag: string
) {
  const posts = await prisma.posts.findMany({
    where: {
      communitySlug,
      status: "PUBLISHED",
      tags: {
        hasSome: [selectedTag.toLowerCase()],
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return posts;
}

export async function getPostBySlugAndId(communitySlug: string, id: number) {
  const post = await prisma.posts.findFirst({
    where: {
      communitySlug,
      id,
    },
  });

  return post;
}

export async function getPostsByAuthor(
  communitySlug: string,
  authorAccount: string
) {
  const posts = await prisma.posts.findMany({
    where: {
      communitySlug,
      authorAccount,
    },
    orderBy: {
      id: "desc",
    },
  });

  return posts;
}

export type InsertPostData = Omit<posts, "id" | "createdAt" | "updatedAt"> & {
  tags: string[];
};

export async function insertPost(data: InsertPostData) {
  const post = await prisma.posts.create({
    data: {
      communitySlug: data.communitySlug,
      authorAccount: data.authorAccount,
      title: data.title,
      text: data.text,
      tags: data.tags.filter((tag) => !!tag),
      status: data.status,
      type: data.type,
      authorName: data.authorName,
      authorUsername: data.authorUsername,
      authorAvatar: data.authorAvatar,
      expiryDate: data.expiryDate,
      price: data.price,
      currency: data.currency,
      contactService: data.contactService,
      contactAddress: data.contactAddress,
    },
  });

  return post;
}
