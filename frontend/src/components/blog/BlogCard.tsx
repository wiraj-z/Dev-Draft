import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, truncateText } from "@/lib/utils/dates";
import type { Post } from "@/types/blog";

type BlogCardProps = {
  post: Post;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border bg-surface/30 p-6 transition-all duration-300 hover:border-brand-500/30 hover:bg-surface/50">
      <div className="flex items-center gap-3">
        <Avatar
          imagePath={post.author.image_path}
          username={post.author.username}
          size="sm"
        />
        <div>
          <Link
            href={`/users/${post.author.id}/posts`}
            className="text-sm font-medium text-foreground transition-colors hover:text-brand-400"
          >
            {post.author.username}
          </Link>
          <p className="text-xs text-muted mt-0.5">{formatDate(post.date_posted)}</p>
        </div>
      </div>

      <h3 className="mt-5 text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-400">
        <Link href={`/blog/${post.id}`} className="focus:outline-none">
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {truncateText(post.content, 160)}
      </p>

      <div className="mt-6 flex items-center">
        <Link
          href={`/blog/${post.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-500 transition-colors hover:text-brand-400"
        >
          Read article 
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
