export interface Author {
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: number;
  title: string;
  text: string;
  createdAt: Date;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  tags?: string[];
  price?: number;
  currency?: string;
}
