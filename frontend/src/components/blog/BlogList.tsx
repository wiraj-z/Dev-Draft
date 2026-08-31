import type { Post } from "@/types/blog";
import { BlogCard } from "./BlogCard";

type BlogListProps = {
  posts: Post[];
};

export function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
