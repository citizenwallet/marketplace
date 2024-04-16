export interface Author {
  name: string;
  username: string;
  avatar: string;
}

export interface Post {
  id: number;
  type: string;
  title: string;
  text: string;
  createdAt: Date;
  expiryDate: Date;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  tags?: string[];
  price?: number;
  displayPrice?: number;
  contactService: string;
  contactAddress: string;
  currency?: string;
}
