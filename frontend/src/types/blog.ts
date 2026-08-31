import type { UserPublic } from "./user";

export type Post = {
  id: number;
  title: string;
  content: string;
  user_id: number;
  date_posted: string;
  author: UserPublic;
};

export type PostCreateData = {
  title: string;
  content: string;
};

export type PostUpdateData = {
  title?: string;
  content?: string;
};

export type PaginatedPosts = {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
};

export type PostsQueryParams = {
  skip?: number;
  limit?: number;
};
